
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = "force-dynamic";

// POST: Run background translation process
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting background translation process...');
    
    // Start background process (don't block the response)
    runBackgroundTranslation().catch(error => {
      console.error('Background translation error:', error);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Translation process started in background',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error starting translation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error starting translation process',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Check translation status
export async function GET(request: NextRequest) {
  try {
    const totalVerbs = await prisma.verb.count();
    
    const verbsWithExamples = await prisma.verb.count({
      where: {
        AND: [
          {
            examples: {
              not: Prisma.JsonNull
            }
          },
          {
            spanishExamples: {
              not: Prisma.JsonNull
            }
          }
        ]
      }
    });

    const verbsWithoutExamples = totalVerbs - verbsWithExamples;
    const completionPercentage = totalVerbs > 0 ? (verbsWithExamples / totalVerbs * 100) : 0;

    return NextResponse.json({
      total: totalVerbs,
      translated: verbsWithExamples,
      pending: verbsWithoutExamples,
      completion: Math.round(completionPercentage * 100) / 100,
      isComplete: verbsWithoutExamples === 0
    });

  } catch (error) {
    console.error('❌ Error checking status:', error);
    return NextResponse.json(
      { error: 'Error checking translation status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Background translation function
async function runBackgroundTranslation(): Promise<void> {
  const BATCH_SIZE = 15;
  const API_DELAY = 800;
  
  try {
    console.log('🔄 Running background translation process...');
    
    const verbsToProcess = await prisma.verb.findMany({
      where: {
        OR: [
          { examples: { equals: Prisma.JsonNull } },
          { spanishExamples: { equals: Prisma.JsonNull } }
        ]
      },
      take: BATCH_SIZE,
      select: {
        id: true,
        infinitive: true,
        spanishTranslation: true,
        level: true,
        category: true,
        isIrregular: true
      }
    });

    if (verbsToProcess.length === 0) {
      console.log('✅ All verbs already have examples');
      return;
    }

    console.log(`📝 Processing ${verbsToProcess.length} verbs...`);

    // Call LLM API
    const result = await callLLMForTranslation(verbsToProcess);
    
    if (result?.verbs) {
      // Update database
      const updates = result.verbs.map(async (processedVerb: any) => {
        const verb = verbsToProcess.find((v: any) => v.infinitive === processedVerb.infinitive);
        if (!verb) return;

        try {
          await prisma.verb.update({
            where: { id: verb.id },
            data: {
              examples: processedVerb.examples || [],
              spanishExamples: processedVerb.spanish_examples || []
            }
          });
          console.log(`✅ Updated: ${verb.infinitive}`);
        } catch (error) {
          console.error(`❌ Error updating ${verb.infinitive}:`, error);
        }
      });

      await Promise.all(updates);
      console.log(`🎯 Background batch completed: ${result.verbs.length} verbs`);
    }

  } catch (error) {
    console.error('❌ Background translation error:', error);
  }
}

async function callLLMForTranslation(verbs: any[]): Promise<{ verbs: any[] } | null> {
  try {
    const verbData = verbs.map(verb => ({
      infinitive: verb.infinitive,
      spanish: verb.spanishTranslation,
      level: verb.level,
      category: verb.category || 'general',
      irregular: verb.isIrregular
    }));

    const prompt = `Generate perfect examples and translations for these English verbs. Each verb should have 5 natural examples demonstrating real usage, covering different tenses and contexts appropriate for the specified CEFR level.

VERBS TO PROCESS: ${JSON.stringify(verbData, null, 2)}

REQUIRED RESPONSE (exact JSON):
{
  "verbs": [
    {
      "infinitive": "verb_here",
      "examples": [
        "Natural example 1 with verb in real context",
        "Natural example 2 with different tense",
        "Natural example 3 in different context",
        "Natural example 4 with common usage",
        "Natural example 5 practical application"
      ],
      "spanish_examples": [
        "Natural and precise translation of example 1",
        "Natural and precise translation of example 2",
        "Natural and precise translation of example 3",
        "Natural and precise translation of example 4",
        "Natural and precise translation of example 5"
      ]
    }
  ]
}

IMPORTANT CRITERIA:
- Natural and conversational examples
- Appropriate for CEFR level (A1=basic, C2=advanced)
- Cover different tenses and contexts
- Educationally useful for Spanish speakers
- Contextually precise translations
- Perfect grammar and correct verb usage`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert English teacher creating educational content for Spanish speakers. Generate natural, contextually appropriate examples and precise translations that help students understand real verb usage in everyday situations. Maintain an appropriate educational level according to CEFR.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('❌ LLM API error:', error);
    return null;
  }
}

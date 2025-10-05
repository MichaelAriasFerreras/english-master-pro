
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface VerbData {
  id: string;
  infinitive: string;
  spanishTranslation: string;
  level: string;
  category: string | null;
  isIrregular: boolean;
}

interface ProcessedVerb {
  infinitive: string;
  examples: string[];
  spanish_examples: string[];
}

// Efficient LLM API call
async function callLLMAPI(prompt: string): Promise<{ verbs: ProcessedVerb[] } | null> {
  try {
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
    console.error('❌ Error in LLM API call:', error);
    return null;
  }
}

// Process batch efficiently
async function processBatch(verbs: VerbData[], batchNumber: number): Promise<ProcessedVerb[]> {
  console.log(`🚀 Processing batch ${batchNumber} with ${verbs.length} verbs`);
  
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

  const result = await callLLMAPI(prompt);
  
  if (!result || !result.verbs) {
    console.error(`❌ Error processing batch ${batchNumber}, retrying...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const retryResult = await callLLMAPI(prompt);
    if (!retryResult || !retryResult.verbs) {
      console.error(`❌ Final error in batch ${batchNumber}`);
      return [];
    }
    return retryResult.verbs;
  }

  console.log(`✅ Batch ${batchNumber} completed - ${result.verbs.length} verbs processed`);
  return result.verbs;
}

// Update database
async function updateDatabase(verbs: VerbData[], processedVerbs: ProcessedVerb[]): Promise<void> {
  console.log(`💾 Updating ${processedVerbs.length} verbs in database...`);
  
  const updates = processedVerbs.map(async (processedVerb) => {
    const verb = verbs.find(v => v.infinitive === processedVerb.infinitive);
    if (!verb) return;

    try {
      await prisma.verb.update({
        where: { id: verb.id },
        data: {
          examples: processedVerb.examples,
          spanishExamples: processedVerb.spanish_examples
        }
      });
    } catch (error) {
      console.error(`❌ Error updating ${processedVerb.infinitive}:`, error);
    }
  });

  await Promise.all(updates);
  console.log(`🎯 ${processedVerbs.length} verbs updated successfully`);
}

// Main background translation function
export async function runBackgroundTranslation(): Promise<void> {
  const BATCH_SIZE = 20;
  
  try {
    console.log('🔄 Starting background translation process...');
    
    // Get verbs that need processing
    const verbsToProcess = await prisma.verb.findMany({
      where: {
        OR: [
          { examples: { equals: Prisma.DbNull } },
          { spanishExamples: { equals: Prisma.DbNull } }
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
      console.log('✅ All verbs already have examples and translations');
      return;
    }

    console.log(`📝 Processing ${verbsToProcess.length} verbs in background...`);

    // Process the batch
    const processedVerbs = await processBatch(verbsToProcess, 1);
    
    if (processedVerbs.length > 0) {
      await updateDatabase(verbsToProcess, processedVerbs);
      console.log(`🎉 Background batch completed: ${processedVerbs.length} verbs processed`);
    }

  } catch (error) {
    console.error('❌ Background translation error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Command line execution
if (require.main === module) {
  runBackgroundTranslation()
    .then(() => {
      console.log('🎯 Background translation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Critical error:', error);
      process.exit(1);
    });
}

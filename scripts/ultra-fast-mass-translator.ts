
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

interface VerbData {
  id: string;
  infinitive: string;
  spanishTranslation: string;
  level: string;
  category: string | null;
  isIrregular: boolean;
  examples: any;
  spanishExamples: any;
}

interface TranslationResult {
  examples: string[];
  spanish_examples: string[];
  rich_translation: string;
}

// Ultra-fast parallel translation function
async function translateVerbUltraFast(verb: VerbData, retries = 3): Promise<TranslationResult | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const prompt = `Create a comprehensive translation package for the English verb "${verb.infinitive}":

1. A rich, contextual Spanish translation (not just a simple word)
2. 5 natural, grammatically perfect English examples showing different uses
3. Their precise Spanish translations

Verb details:
- Level: ${verb.level}
- Category: ${verb.category || 'general'}
- Current translation: ${verb.spanishTranslation}

RESPONSE FORMAT (JSON only):
{
  "rich_translation": "traducción rica y contextual con múltiples significados",
  "examples": [
    "Perfect example 1 using ${verb.infinitive} in simple present",
    "Perfect example 2 using ${verb.infinitive} in past tense",
    "Perfect example 3 using ${verb.infinitive} in continuous form",
    "Perfect example 4 using ${verb.infinitive} in different context",
    "Perfect example 5 using ${verb.infinitive} in another context"
  ],
  "spanish_examples": [
    "Traducción natural y perfecta del ejemplo 1",
    "Traducción natural y perfecta del ejemplo 2", 
    "Traducción natural y perfecta del ejemplo 3",
    "Traducción natural y perfecta del ejemplo 4",
    "Traducción natural y perfecta del ejemplo 5"
  ]
}`;

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
              content: 'You are an expert linguist and English teacher. Create rich, educational content with perfect grammar. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000,
          temperature: 0.2
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('Empty response from API');
      }

      // Clean JSON
      content = content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      const parsed = JSON.parse(content);
      
      // Validate structure
      if (!parsed.rich_translation || !Array.isArray(parsed.examples) || !Array.isArray(parsed.spanish_examples)) {
        throw new Error('Invalid response structure');
      }

      if (parsed.examples.length !== 5 || parsed.spanish_examples.length !== 5) {
        throw new Error(`Wrong number of examples: ${parsed.examples.length}/${parsed.spanish_examples.length}`);
      }

      return {
        examples: parsed.examples,
        spanish_examples: parsed.spanish_examples,
        rich_translation: parsed.rich_translation
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`⚠️  Attempt ${attempt}/${retries} failed for ${verb.infinitive}: ${errorMsg}`);
      
      if (attempt === retries) {
        console.error(`❌ Final failure for ${verb.infinitive}: ${errorMsg}`);
        return null;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  
  return null;
}

// Process batch with high concurrency
async function processBatch(verbs: VerbData[], batchIndex: number): Promise<void> {
  console.log(`🚀 Processing batch ${batchIndex} (${verbs.length} verbs)`);
  
  // Process all verbs in this batch simultaneously
  const promises = verbs.map(verb => translateVerbUltraFast(verb));
  const results = await Promise.allSettled(promises);
  
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const verb = verbs[i];
    
    if (result.status === 'fulfilled' && result.value) {
      try {
        // Update database with rich translation and examples
        await prisma.verb.update({
          where: { id: verb.id },
          data: {
            spanishTranslation: result.value.rich_translation,
            examples: result.value.examples,
            spanishExamples: result.value.spanish_examples
          }
        });
        
        successful++;
        console.log(`✅ [${successful}] ${verb.infinitive} - COMPLETED`);
        
      } catch (dbError) {
        console.error(`💾 DB Error for ${verb.infinitive}:`, dbError);
        failed++;
      }
    } else {
      failed++;
      console.log(`❌ [${failed}] ${verb.infinitive} - FAILED`);
    }
  }
  
  console.log(`📊 Batch ${batchIndex} complete: ${successful} ✅ | ${failed} ❌`);
}

// Main ultra-fast mass translation function
async function ultraFastMassTranslation(): Promise<void> {
  try {
    console.log('🚀🚀🚀 ULTRA-FAST MASS TRANSLATION SYSTEM 🚀🚀🚀');
    console.log('⚡ Processing ALL verbs with maximum speed and concurrency!');
    
    // Get ALL verbs
    const allVerbs = await prisma.verb.findMany({
      select: {
        id: true,
        infinitive: true,
        spanishTranslation: true,
        level: true,
        category: true,
        isIrregular: true,
        examples: true,
        spanishExamples: true
      }
    });
    
    console.log(`📊 Total verbs in database: ${allVerbs.length}`);
    
    // Filter verbs that need processing (incomplete translations or examples)
    const verbsToProcess = allVerbs.filter(verb => {
      // Need processing if translation is too simple or missing examples
      const needsRichTranslation = !verb.spanishTranslation || 
        verb.spanishTranslation.length < 6 ||
        verb.spanishTranslation === verb.infinitive ||
        /^(can|may|will|would|could|should|might)$/.test(verb.spanishTranslation);
        
      const needsExamples = !verb.examples || 
        verb.spanishExamples === null ||
        (Array.isArray(verb.examples) && verb.examples.length === 0) ||
        (Array.isArray(verb.spanishExamples) && verb.spanishExamples.length === 0);
        
      return needsRichTranslation || needsExamples;
    });
    
    console.log(`🎯 Verbs to process: ${verbsToProcess.length}`);
    console.log(`✨ Verbs already complete: ${allVerbs.length - verbsToProcess.length}`);
    
    if (verbsToProcess.length === 0) {
      console.log('🎉 ALL VERBS ARE ALREADY PERFECTLY TRANSLATED!');
      return;
    }
    
    // Process in batches with high concurrency
    const BATCH_SIZE = 15; // Optimal batch size for speed vs stability
    const batches = [];
    
    for (let i = 0; i < verbsToProcess.length; i += BATCH_SIZE) {
      batches.push(verbsToProcess.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`📦 Created ${batches.length} batches of ~${BATCH_SIZE} verbs each`);
    console.log(`⚡ STARTING ULTRA-FAST MASS PROCESSING...`);
    
    const startTime = Date.now();
    
    // Process batches with some concurrency (but not too much to avoid API limits)
    const CONCURRENT_BATCHES = 2;
    
    for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
      const batchPromises = [];
      
      for (let j = 0; j < CONCURRENT_BATCHES && i + j < batches.length; j++) {
        const batchIndex = i + j + 1;
        batchPromises.push(processBatch(batches[i + j], batchIndex));
      }
      
      await Promise.allSettled(batchPromises);
      
      // Progress update
      const processed = Math.min((i + CONCURRENT_BATCHES) * BATCH_SIZE, verbsToProcess.length);
      const progress = (processed / verbsToProcess.length * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (processed / (Date.now() - startTime) * 1000).toFixed(2);
      
      console.log(`📈 PROGRESS: ${processed}/${verbsToProcess.length} (${progress}%) | ${elapsed}s elapsed | ${rate} verbs/sec`);
      
      // Brief pause to be nice to the API
      if (i + CONCURRENT_BATCHES < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const averageRate = (verbsToProcess.length / (Date.now() - startTime) * 1000).toFixed(2);
    
    console.log(`\n🎉🎉🎉 ULTRA-FAST MASS TRANSLATION COMPLETED! 🎉🎉🎉`);
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`⚡ Average rate: ${averageRate} verbs per second`);
    console.log(`📊 Processed: ${verbsToProcess.length} verbs`);
    
    // Final verification
    console.log(`\n🔍 Running final verification...`);
    const verification = await prisma.verb.findMany({
      select: {
        examples: true,
        spanishExamples: true,
        spanishTranslation: true
      }
    });
    
    const complete = verification.filter(v => 
      v.examples && 
      v.spanishExamples && 
      Array.isArray(v.examples) && 
      Array.isArray(v.spanishExamples) &&
      v.examples.length === 5 && 
      v.spanishExamples.length === 5 &&
      v.spanishTranslation &&
      v.spanishTranslation.length > 5
    ).length;
    
    console.log(`✅ Final status: ${complete}/${allVerbs.length} verbs complete (${(complete/allVerbs.length*100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the ultra-fast mass translation
ultraFastMassTranslation().catch(console.error);

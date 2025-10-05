
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to call LLM API for generating examples and translations
async function callLLMAPI(prompt) {
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
            content: 'You are an expert English teacher creating educational content for Spanish speakers learning English. Generate natural, contextually appropriate examples and translations that help students understand verb usage in real situations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error calling LLM API:', error);
    return null;
  }
}

// Function to generate examples and translations for a batch of verbs
async function processBatch(verbs, batchNumber, totalBatches) {
  console.log(`\n🔄 Procesando lote ${batchNumber}/${totalBatches} (${verbs.length} verbos)`);
  
  const verbData = verbs.map(verb => ({
    infinitive: verb.infinitive,
    spanishTranslation: verb.spanishTranslation,
    level: verb.level,
    category: verb.category || 'general',
    isIrregular: verb.isIrregular
  }));

  const prompt = `
Generate examples and Spanish translations for these English verbs. For each verb, create 5 natural, practical examples that demonstrate real usage, covering different tenses and contexts appropriate for the CEFR level specified.

Verbs data: ${JSON.stringify(verbData, null, 2)}

Respond with this exact JSON structure:
{
  "verbs": [
    {
      "infinitive": "verb_infinitive_here",
      "examples": [
        "Natural example sentence 1 using the verb",
        "Natural example sentence 2 with different tense",
        "Natural example sentence 3 in different context",
        "Natural example sentence 4 with common usage",
        "Natural example sentence 5 practical application"
      ],
      "spanish_examples": [
        "Traducción natural del ejemplo 1",
        "Traducción natural del ejemplo 2", 
        "Traducción natural del ejemplo 3",
        "Traducción natural del ejemplo 4",
        "Traducción natural del ejemplo 5"
      ]
    }
  ]
}

Make examples:
- Natural and conversational
- Appropriate for the CEFR level (A1=basic, C2=advanced)
- Cover different tenses and contexts
- Educationally useful for Spanish speakers
- Contextually accurate translations
`;

  const result = await callLLMAPI(prompt);
  
  if (!result || !result.verbs) {
    console.error(`❌ Error procesando lote ${batchNumber}`);
    return [];
  }

  console.log(`✅ Lote ${batchNumber} completado, actualizando base de datos...`);
  
  // Update database for each verb in the batch using raw queries
  const updates = [];
  for (const verbData of result.verbs) {
    try {
      const verb = verbs.find(v => v.infinitive === verbData.infinitive);
      if (verb) {
        const updatePromise = prisma.$executeRaw`
          UPDATE "Verb" 
          SET examples = ${JSON.stringify(verbData.examples)}::jsonb,
              "spanishExamples" = ${JSON.stringify(verbData.spanish_examples)}::jsonb
          WHERE id = ${verb.id}
        `;
        updates.push(updatePromise);
      }
    } catch (error) {
      console.error(`Error actualizando verbo ${verbData.infinitive}:`, error);
    }
  }
  
  await Promise.all(updates);
  console.log(`💾 ${updates.length} verbos actualizados en la base de datos`);
  
  return result.verbs;
}

// Main function
async function main() {
  try {
    console.log('🚀 Iniciando generación de traducciones para verbos...');
    
    // Get all verbs from database using raw query to avoid client issues
    const allVerbs = await prisma.$queryRaw`
      SELECT id, infinitive, "spanishTranslation", level, category, "isIrregular", examples, "spanishExamples"
      FROM "Verb"
    `;

    console.log(`📊 Total verbos encontrados: ${allVerbs.length}`);
    
    // Filter verbs that need processing (no examples or no Spanish examples)
    const verbsToProcess = allVerbs.filter(verb => 
      !verb.examples || !verb.spanishExamples
    );
    
    console.log(`📝 Verbos que necesitan procesamiento: ${verbsToProcess.length}`);

    if (verbsToProcess.length === 0) {
      console.log('✨ ¡Todos los verbos ya tienen ejemplos y traducciones!');
      return;
    }

    // Process in batches of 5 to avoid API rate limits and ensure quality
    const batchSize = 5;
    const totalBatches = Math.ceil(verbsToProcess.length / batchSize);
    let processedCount = 0;
    
    for (let i = 0; i < verbsToProcess.length; i += batchSize) {
      const batch = verbsToProcess.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      const processed = await processBatch(batch, batchNumber, totalBatches);
      processedCount += processed.length;
      
      // Add delay between batches to respect API limits
      if (batchNumber < totalBatches) {
        console.log('⏳ Esperando 2 segundos antes del próximo lote...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📈 Total verbos procesados: ${processedCount}`);
    console.log(`💫 Todos los verbos ahora tienen ejemplos en inglés y sus traducciones al español.`);
    
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();

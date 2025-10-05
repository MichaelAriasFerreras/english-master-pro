
import { PrismaClient, Prisma } from '@prisma/client';
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
}

interface ProcessedVerb {
  infinitive: string;
  examples: string[];
  spanish_examples: string[];
}

// Ultra-simple API call for single verb
async function translateSingleVerb(verb: VerbData): Promise<ProcessedVerb | null> {
  try {
    const prompt = `Create 5 natural English examples and their Spanish translations for the verb "${verb.infinitive}" (Spanish: ${verb.spanishTranslation}, Level: ${verb.level}).

RESPONSE FORMAT (JSON only):
{
  "infinitive": "${verb.infinitive}",
  "examples": [
    "Example 1 with ${verb.infinitive}",
    "Example 2 with ${verb.infinitive}",
    "Example 3 with ${verb.infinitive}",
    "Example 4 with ${verb.infinitive}",
    "Example 5 with ${verb.infinitive}"
  ],
  "spanish_examples": [
    "Traducción del ejemplo 1",
    "Traducción del ejemplo 2",
    "Traducción del ejemplo 3",
    "Traducción del ejemplo 4",
    "Traducción del ejemplo 5"
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
            content: 'You are an English teacher. Create natural examples and precise Spanish translations. Respond only with valid JSON, no extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error for ${verb.infinitive}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error(`No content for ${verb.infinitive}`);
      return null;
    }

    // Clean JSON content
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }

    const parsed = JSON.parse(content);
    
    // Validate structure
    if (!parsed.infinitive || !Array.isArray(parsed.examples) || !Array.isArray(parsed.spanish_examples)) {
      console.error(`Invalid structure for ${verb.infinitive}`);
      return null;
    }

    if (parsed.examples.length !== 5 || parsed.spanish_examples.length !== 5) {
      console.error(`Wrong number of examples for ${verb.infinitive}`);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`Error processing ${verb.infinitive}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

// Update single verb in database
async function updateVerb(verb: VerbData, processed: ProcessedVerb): Promise<boolean> {
  try {
    await prisma.verb.update({
      where: { id: verb.id },
      data: {
        examples: processed.examples,
        spanishExamples: processed.spanish_examples
      }
    });
    return true;
  } catch (error) {
    console.error(`Error updating ${verb.infinitive}:`, error);
    return false;
  }
}

// Main processing function
async function processVerbsOneByOne(): Promise<void> {
  try {
    console.log('🚀 TRADUCTOR ULTRA-CONSERVADOR INICIADO');
    console.log('⚡ Procesando de a 1 verbo por vez para máxima estabilidad');

    // Get all verbs and filter in JavaScript to avoid Prisma JSON field issues
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
    
    // Filter pending verbs in JavaScript
    const pendingVerbs = allVerbs.filter(verb => 
      verb.examples === null || verb.spanishExamples === null
    );

    console.log(`📊 Verbos pendientes: ${pendingVerbs.length}`);

    let processed = 0;
    let errors = 0;
    const startTime = Date.now();

    for (let i = 0; i < pendingVerbs.length; i++) {
      const verb = pendingVerbs[i];
      const verbNumber = i + 1;
      
      console.log(`🎯 [${verbNumber}/${pendingVerbs.length}] Procesando: ${verb.infinitive} (${verb.spanishTranslation})`);
      
      const result = await translateSingleVerb(verb);
      
      if (result) {
        const updated = await updateVerb(verb, result);
        if (updated) {
          processed++;
          console.log(`   ✅ Completado exitosamente`);
        } else {
          errors++;
          console.log(`   ❌ Error al actualizar base de datos`);
        }
      } else {
        errors++;
        console.log(`   ❌ Error en traducción`);
      }

      // Progress report every 50 verbs
      if (verbNumber % 50 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processed / elapsed;
        const remaining = pendingVerbs.length - verbNumber;
        const eta = remaining / rate;
        
        console.log(`\n📈 PROGRESO INTERMEDIO:`);
        console.log(`   📊 Procesados: ${verbNumber}/${pendingVerbs.length} (${((verbNumber/pendingVerbs.length)*100).toFixed(1)}%)`);
        console.log(`   ✅ Exitosos: ${processed}`);
        console.log(`   ❌ Errores: ${errors}`);
        console.log(`   ⚡ Velocidad: ${rate.toFixed(2)} verbos/segundo`);
        console.log(`   ⏱️ Tiempo estimado restante: ${(eta/60).toFixed(1)} minutos\n`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const totalTime = (Date.now() - startTime) / 1000;
    
    console.log('\n🎉 PROCESO COMPLETADO!');
    console.log(`⏱️ Tiempo total: ${(totalTime/60).toFixed(2)} minutos`);
    console.log(`✅ Verbos procesados exitosamente: ${processed}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📈 Tasa de éxito: ${((processed/(processed+errors))*100).toFixed(1)}%`);
    console.log(`🚀 Velocidad promedio: ${(processed/totalTime).toFixed(2)} verbos/segundo`);

  } catch (error) {
    console.error('❌ Error fatal en el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

processVerbsOneByOne();

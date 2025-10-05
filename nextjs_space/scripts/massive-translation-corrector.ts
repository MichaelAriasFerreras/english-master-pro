
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

interface VerbToCorrect {
  id: string;
  infinitive: string;
  thirdPersonSingular: string;
  presentParticiple: string;
  simplePast: string;
  pastParticiple: string;
  spanishTranslation: string;
  level: string;
  category: string | null;
  isIrregular: boolean;
  issues: string[];
}

interface CorrectedTranslation {
  richSpanishTranslation: string;
  contextualMeanings: string[];
  examples: string[];
  spanishExamples: string[];
}

async function generateCorrections(verbs: VerbToCorrect[]): Promise<Record<string, CorrectedTranslation>> {
  try {
    // Prepare the prompt for the LLM
    const prompt = `Eres un experto lingüista especializado en traducción inglés-español. Tu tarea es corregir y mejorar las traducciones de verbos en inglés para una aplicación de aprendizaje.

Para cada verbo, necesitas proporcionar:
1. Una traducción rica y contextual (no solo una palabra simple)
2. Significados contextuales adicionales si aplica
3. 5 ejemplos gramaticalmente perfectos en inglés que muestren diferentes usos
4. Las traducciones precisas de esos ejemplos al español

IMPORTANTE:
- Las traducciones deben ser apropiadas para estudiantes de español
- Los ejemplos deben usar gramática perfecta (NO "I be", "She am/is/are", etc.)
- Incluye diferentes tiempos verbales y contextos
- Las traducciones al español deben sonar naturales
- Considera el nivel CEFR del verbo (A1-C2)

Verbos a corregir:
${verbs.map((verb, index) => `
${index + 1}. ${verb.infinitive}
   - Conjugaciones: ${verb.thirdPersonSingular}, ${verb.presentParticiple}, ${verb.simplePast}, ${verb.pastParticiple}
   - Traducción actual: ${verb.spanishTranslation}
   - Nivel CEFR: ${verb.level}
   - Categoría: ${verb.category}
   - Irregular: ${verb.isIrregular}
   - Problemas: ${verb.issues.join(', ')}
`).join('')}

Responde en formato JSON con la siguiente estructura exacta:
{
  "corrections": {
    "${verbs[0]?.infinitive}": {
      "richSpanishTranslation": "traducción rica y contextual",
      "contextualMeanings": ["significado 1", "significado 2"],
      "examples": [
        "Example sentence 1 using simple present",
        "Example sentence 2 using past tense", 
        "Example sentence 3 using present continuous",
        "Example sentence 4 using future or conditional",
        "Example sentence 5 using different context"
      ],
      "spanishExamples": [
        "Traducción natural del ejemplo 1",
        "Traducción natural del ejemplo 2",
        "Traducción natural del ejemplo 3", 
        "Traducción natural del ejemplo 4",
        "Traducción natural del ejemplo 5"
      ]
    }
  }
}

Asegúrate de incluir TODOS los verbos en la respuesta JSON. Responde únicamente con JSON válido, sin texto adicional.`;

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
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from API');
    }

    const parsed = JSON.parse(content);
    return parsed.corrections || {};

  } catch (error) {
    console.error('Error generating corrections:', error);
    throw error;
  }
}

async function correctMassiveTranslations() {
  try {
    console.log('🚀 Iniciando corrección masiva de traducciones...\n');
    
    // Get all verbs that need correction
    const verbs = await prisma.verb.findMany({
      select: {
        id: true,
        infinitive: true,
        thirdPersonSingular: true,
        presentParticiple: true,
        simplePast: true,
        pastParticiple: true,
        spanishTranslation: true,
        level: true,
        category: true,
        isIrregular: true,
        examples: true,
        spanishExamples: true
      }
    });

    console.log(`📊 Total de verbos a procesar: ${verbs.length}`);
    
    // Identify verbs that need correction
    const verbsToCorrect: VerbToCorrect[] = [];
    
    for (const verb of verbs) {
      const issues: string[] = [];
      
      // Check for translation issues
      if (!verb.spanishTranslation || 
          verb.spanishTranslation.trim() === '' ||
          verb.spanishTranslation === verb.infinitive ||
          /^[a-z]+$/.test(verb.spanishTranslation) ||
          /^[a-z]+\/[a-z]+$/.test(verb.spanishTranslation)) {
        issues.push('poor_translation');
      }
      
      // Check for example issues
      const examples = verb.examples as string[] | null;
      if (!examples || !Array.isArray(examples) || examples.length === 0) {
        issues.push('missing_examples');
      } else {
        const badExamples = examples.filter(ex => 
          typeof ex === 'string' && /I be |She am\/is\/are|They was\/were|^.{1,15}$/i.test(ex)
        );
        if (badExamples.length > 0) {
          issues.push('poor_examples');
        }
      }
      
      // Check for Spanish examples
      const spanishExamples = verb.spanishExamples as string[] | null;
      if (!spanishExamples || !Array.isArray(spanishExamples) || spanishExamples.length === 0) {
        issues.push('missing_spanish_examples');
      }
      
      if (issues.length > 0) {
        verbsToCorrect.push({
          id: verb.id,
          infinitive: verb.infinitive,
          thirdPersonSingular: verb.thirdPersonSingular,
          presentParticiple: verb.presentParticiple,
          simplePast: verb.simplePast,
          pastParticiple: verb.pastParticiple,
          spanishTranslation: verb.spanishTranslation,
          level: verb.level,
          category: verb.category,
          isIrregular: verb.isIrregular,
          issues
        });
      }
    }
    
    console.log(`❌ Verbos que necesitan corrección: ${verbsToCorrect.length}`);
    
    if (verbsToCorrect.length === 0) {
      console.log('✅ No se encontraron verbos que necesiten corrección');
      return;
    }
    
    // Process in batches to avoid API limits
    const batchSize = 8;
    const batches = [];
    for (let i = 0; i < verbsToCorrect.length; i += batchSize) {
      batches.push(verbsToCorrect.slice(i, i + batchSize));
    }
    
    console.log(`📦 Procesando en ${batches.length} lotes de ${batchSize} verbos\n`);
    
    let correctedCount = 0;
    let errorCount = 0;
    const logFile = 'massive_correction.log';
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const progress = ((batchIndex + 1) / batches.length * 100).toFixed(1);
      
      console.log(`🔄 Procesando lote ${batchIndex + 1}/${batches.length} (${progress}%)`);
      console.log(`   Verbos: ${batch.map(v => v.infinitive).join(', ')}`);
      
      try {
        // Generate corrections for this batch
        const corrections = await generateCorrections(batch);
        
        // Apply corrections to database
        for (const verb of batch) {
          const correction = corrections[verb.infinitive];
          
          if (correction) {
            try {
              await prisma.verb.update({
                where: { id: verb.id },
                data: {
                  spanishTranslation: correction.richSpanishTranslation,
                  examples: correction.examples,
                  spanishExamples: correction.spanishExamples,
                  updatedAt: new Date()
                }
              });
              
              correctedCount++;
              
              // Log success
              const logEntry = `✅ ${new Date().toISOString()} - Corregido: ${verb.infinitive}\n   Traducción: ${correction.richSpanishTranslation}\n   Ejemplos: ${correction.examples.length}\n\n`;
              await fs.appendFile(logFile, logEntry);
              
            } catch (updateError) {
              console.error(`❌ Error actualizando ${verb.infinitive}:`, updateError);
              errorCount++;
            }
          } else {
            console.warn(`⚠️ No se generó corrección para: ${verb.infinitive}`);
            errorCount++;
          }
        }
        
        console.log(`✅ Lote ${batchIndex + 1} completado`);
        
        // Delay between batches to respect rate limits
        if (batchIndex < batches.length - 1) {
          console.log('⏳ Esperando 2 segundos...\n');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (batchError) {
        console.error(`❌ Error procesando lote ${batchIndex + 1}:`, batchError);
        errorCount += batch.length;
        
        // Log batch error
        const logEntry = `❌ ${new Date().toISOString()} - Error en lote: ${batch.map(v => v.infinitive).join(', ')}\n   Error: ${batchError}\n\n`;
        await fs.appendFile(logFile, logEntry);
      }
    }
    
    console.log('\n🎉 CORRECCIÓN MASIVA COMPLETADA');
    console.log('================================');
    console.log(`✅ Verbos corregidos exitosamente: ${correctedCount}`);
    console.log(`❌ Errores encontrados: ${errorCount}`);
    console.log(`📊 Tasa de éxito: ${((correctedCount/(correctedCount + errorCount)) * 100).toFixed(1)}%`);
    console.log(`📝 Log guardado en: ${logFile}`);
    
    return {
      processed: correctedCount + errorCount,
      corrected: correctedCount,
      errors: errorCount
    };
    
  } catch (error) {
    console.error('❌ Error durante la corrección masiva:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  correctMassiveTranslations()
    .then(result => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export { correctMassiveTranslations };


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
    const prompt = `Eres un experto lingüista especializado en traducción inglés-español. Tu tarea es corregir y mejorar las traducciones de verbos en inglés para una aplicación de aprendizaje.

Para cada verbo, proporciona:
1. Una traducción rica y contextual (no solo una palabra)
2. Significados contextuales si aplica
3. 5 ejemplos gramaticalmente perfectos en inglés
4. Las traducciones precisas al español

REGLAS CRÍTICAS:
- Gramática perfecta (NO "I be", "She am/is/are", etc.)
- Traducciones naturales al español
- Diferentes tiempos verbales y contextos
- Considerar nivel CEFR (A1-C2)

Verbos:
${verbs.map((verb, index) => `${index + 1}. ${verb.infinitive} (${verb.level}) - Actual: "${verb.spanishTranslation}"`).join('\n')}

Responde SOLO con JSON válido:
{
  "corrections": {
    "${verbs[0]?.infinitive}": {
      "richSpanishTranslation": "traducción contextual rica",
      "contextualMeanings": ["significado adicional 1", "significado adicional 2"],
      "examples": [
        "Perfect grammar example 1",
        "Perfect grammar example 2",
        "Perfect grammar example 3",
        "Perfect grammar example 4",
        "Perfect grammar example 5"
      ],
      "spanishExamples": [
        "Traducción natural 1",
        "Traducción natural 2", 
        "Traducción natural 3",
        "Traducción natural 4",
        "Traducción natural 5"
      ]
    }
  }
}`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content from API');
    }

    const parsed = JSON.parse(content);
    return parsed.corrections || {};

  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

async function saveProgress(processed: number, total: number, corrected: number, errors: number) {
  const progress = {
    timestamp: new Date().toISOString(),
    processed,
    total,
    corrected,
    errors,
    percentage: ((processed / total) * 100).toFixed(1),
    estimatedTimeRemaining: total > processed ? Math.ceil((total - processed) * 0.3) : 0
  };
  
  await fs.writeFile('translation_correction_progress.json', JSON.stringify(progress, null, 2));
}

async function optimizedTranslationCorrector() {
  try {
    console.log('🚀 CORRECTOR OPTIMIZADO DE TRADUCCIONES INICIADO');
    console.log('================================================\n');
    
    // Get all verbs needing correction
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

    const verbsToCorrect: VerbToCorrect[] = [];
    
    for (const verb of verbs) {
      const issues: string[] = [];
      
      // Translation issues
      if (!verb.spanishTranslation || 
          verb.spanishTranslation.trim() === '' ||
          verb.spanishTranslation === verb.infinitive ||
          /^[a-z]+$/.test(verb.spanishTranslation) ||
          /^[a-z]+\/[a-z]+$/.test(verb.spanishTranslation)) {
        issues.push('poor_translation');
      }
      
      // Example issues
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
      
      // Spanish examples
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
    
    const total = verbsToCorrect.length;
    console.log(`📊 Verbos a corregir: ${total}`);
    
    if (total === 0) {
      console.log('✅ No hay verbos que correguir');
      return;
    }
    
    // Optimized batch processing
    const batchSize = 12; // Increased batch size
    const batches = [];
    for (let i = 0; i < total; i += batchSize) {
      batches.push(verbsToCorrect.slice(i, i + batchSize));
    }
    
    console.log(`📦 Procesando en ${batches.length} lotes optimizados\n`);
    
    let processed = 0;
    let corrected = 0;
    let errors = 0;
    const startTime = Date.now();
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const progress = ((batchIndex + 1) / batches.length * 100).toFixed(1);
      
      console.log(`🔄 Lote ${batchIndex + 1}/${batches.length} (${progress}%) - ${batch.map(v => v.infinitive).join(', ')}`);
      
      try {
        const corrections = await generateCorrections(batch);
        
        // Apply corrections in parallel
        const updatePromises = batch.map(async (verb) => {
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
              return { success: true, verb: verb.infinitive };
            } catch (updateError) {
              console.error(`❌ Update error ${verb.infinitive}:`, updateError);
              return { success: false, verb: verb.infinitive };
            }
          }
          return { success: false, verb: verb.infinitive };
        });
        
        const results = await Promise.all(updatePromises);
        const batchCorrected = results.filter(r => r.success).length;
        const batchErrors = results.filter(r => !r.success).length;
        
        corrected += batchCorrected;
        errors += batchErrors;
        processed += batch.length;
        
        // Save progress
        await saveProgress(processed, total, corrected, errors);
        
        // Progress update
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processed / elapsed;
        const eta = total > processed ? Math.ceil((total - processed) / rate) : 0;
        
        console.log(`   ✅ ${batchCorrected} corregidos, ${batchErrors} errores`);
        console.log(`   📈 Progreso: ${processed}/${total} (${((processed/total)*100).toFixed(1)}%)`);
        console.log(`   ⏱️  ETA: ${eta}s | Velocidad: ${rate.toFixed(1)} verbos/s\n`);
        
        // Optimized delay
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 800)); // Reduced delay
        }
        
      } catch (batchError) {
        console.error(`❌ Batch ${batchIndex + 1} failed:`, batchError);
        errors += batch.length;
        processed += batch.length;
        await saveProgress(processed, total, corrected, errors);
      }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    
    console.log('\n🎉 CORRECCIÓN OPTIMIZADA COMPLETADA');
    console.log('===================================');
    console.log(`✅ Procesados: ${processed}/${total}`);
    console.log(`✅ Corregidos exitosamente: ${corrected}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📊 Tasa de éxito: ${((corrected/processed)*100).toFixed(1)}%`);
    console.log(`⏱️  Tiempo total: ${Math.ceil(totalTime)}s`);
    console.log(`🚀 Velocidad promedio: ${(processed/totalTime).toFixed(1)} verbos/s`);
    
    // Final progress save
    await saveProgress(processed, total, corrected, errors);
    
    return { processed, corrected, errors, totalTime };
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  optimizedTranslationCorrector()
    .then(() => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export { optimizedTranslationCorrector };

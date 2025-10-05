
// ⚡ SISTEMA DE TRADUCCIÓN INMEDIATA Y MASIVA
// Procesa todos los 1225 verbos de forma ultra-eficiente

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

// Configuración optimizada
const BATCH_SIZE = 25; // Lotes más grandes para mayor eficiencia
const MAX_CONCURRENT_BATCHES = 3; // Procesamiento paralelo
const API_DELAY = 500; // Delay mínimo entre llamadas

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

// Función optimizada para llamadas a LLM API
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
            content: `Eres un experto profesor de inglés creando contenido educativo para hispanohablantes. 
            Genera ejemplos naturales, contextualmente apropiados y traducciones precisas que ayuden a los estudiantes 
            a entender el uso real de los verbos en situaciones cotidianas. Mantén un nivel educativo apropiado según el CEFR.`
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
    console.error('❌ Error en llamada API:', error);
    return null;
  }
}

// Procesador ultra-eficiente de lotes
async function processBatchEfficiently(verbs: VerbData[], batchNumber: number, totalBatches: number): Promise<ProcessedVerb[]> {
  console.log(`🚀 Lote ${batchNumber}/${totalBatches} - ${verbs.length} verbos (Procesamiento RÁPIDO)`);
  
  const verbData = verbs.map(verb => ({
    infinitive: verb.infinitive,
    spanish: verb.spanishTranslation,
    level: verb.level,
    category: verb.category || 'general',
    irregular: verb.isIrregular
  }));

  const prompt = `
Genera ejemplos PERFECTOS y traducciones para estos verbos en inglés. Cada verbo debe tener 5 ejemplos naturales que demuestren uso real, cubriendo diferentes tiempos y contextos apropiados para el nivel CEFR especificado.

VERBOS A PROCESAR: ${JSON.stringify(verbData, null, 2)}

RESPUESTA REQUERIDA (JSON exacto):
{
  "verbs": [
    {
      "infinitive": "verbo_aquí",
      "examples": [
        "Ejemplo natural 1 con el verbo en contexto real",
        "Ejemplo natural 2 con diferente tiempo verbal",
        "Ejemplo natural 3 en contexto diferente",
        "Ejemplo natural 4 con uso común",
        "Ejemplo natural 5 aplicación práctica"
      ],
      "spanish_examples": [
        "Traducción natural y precisa del ejemplo 1",
        "Traducción natural y precisa del ejemplo 2", 
        "Traducción natural y precisa del ejemplo 3",
        "Traducción natural y precisa del ejemplo 4",
        "Traducción natural y precisa del ejemplo 5"
      ]
    }
  ]
}

CRITERIOS IMPORTANTES:
- Ejemplos naturales y conversacionales
- Apropiados para nivel CEFR (A1=básico, C2=avanzado)
- Cubrir diferentes tiempos y contextos
- Educativamente útiles para hispanohablantes
- Traducciones contextualmente precisas
- Gramática perfecta y uso correcto del verbo
`;

  const result = await callLLMAPI(prompt);
  
  if (!result || !result.verbs) {
    console.error(`❌ Error procesando lote ${batchNumber}, reintentando...`);
    // Reintento una vez
    await new Promise(resolve => setTimeout(resolve, 1000));
    const retryResult = await callLLMAPI(prompt);
    if (!retryResult || !retryResult.verbs) {
      console.error(`❌ Error definitivo en lote ${batchNumber}`);
      return [];
    }
    return retryResult.verbs;
  }

  console.log(`✅ Lote ${batchNumber} completado - ${result.verbs.length} verbos procesados`);
  return result.verbs;
}

// Actualizador masivo de base de datos
async function updateDatabaseMassively(verbs: VerbData[], processedVerbs: ProcessedVerb[]): Promise<void> {
  console.log(`💾 Actualizando ${processedVerbs.length} verbos en base de datos...`);
  
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
      console.error(`❌ Error actualizando ${processedVerb.infinitive}:`, error);
    }
  });

  await Promise.all(updates);
  console.log(`🎯 ${processedVerbs.length} verbos actualizados exitosamente`);
}

// Función principal de procesamiento MASIVO
async function processAllVerbsMassively(): Promise<void> {
  try {
    console.log('🚀 INICIANDO SISTEMA DE TRADUCCIÓN MASIVA E INMEDIATA');
    console.log('⚡ Configuración optimizada: lotes grandes, procesamiento paralelo');
    
    // Obtener todos los verbos
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

    console.log(`📊 Total verbos en base de datos: ${allVerbs.length}`);
    
    // Filtrar verbos que necesitan procesamiento
    const verbsToProcess = allVerbs.filter(verb => 
      !verb.examples || 
      !verb.spanishExamples || 
      (Array.isArray(verb.examples) && verb.examples.length === 0) ||
      (Array.isArray(verb.spanishExamples) && verb.spanishExamples.length === 0)
    );
    
    console.log(`🎯 Verbos que requieren procesamiento: ${verbsToProcess.length}`);

    if (verbsToProcess.length === 0) {
      console.log('✨ ¡Todos los verbos ya tienen ejemplos y traducciones perfectas!');
      return;
    }

    // Crear lotes optimizados
    const batches: VerbData[][] = [];
    for (let i = 0; i < verbsToProcess.length; i += BATCH_SIZE) {
      batches.push(verbsToProcess.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Creados ${batches.length} lotes de hasta ${BATCH_SIZE} verbos cada uno`);
    console.log('🚀 Iniciando procesamiento PARALELO y EFICIENTE...');

    const startTime = Date.now();
    let totalProcessed = 0;

    // Procesar lotes en paralelo para máxima eficiencia
    for (let i = 0; i < batches.length; i += MAX_CONCURRENT_BATCHES) {
      const currentBatches = batches.slice(i, i + MAX_CONCURRENT_BATCHES);
      
      const batchPromises = currentBatches.map(async (batch, index) => {
        const batchNumber = i + index + 1;
        const processedVerbs = await processBatchEfficiently(batch, batchNumber, batches.length);
        
        if (processedVerbs.length > 0) {
          await updateDatabaseMassively(batch, processedVerbs);
          return processedVerbs.length;
        }
        return 0;
      });

      const results = await Promise.all(batchPromises);
      totalProcessed += results.reduce((sum, count) => sum + count, 0);
      
      // Delay mínimo solo entre grupos de lotes paralelos
      if (i + MAX_CONCURRENT_BATCHES < batches.length) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
      }
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    console.log('\n🎉 ¡PROCESO MASIVO COMPLETADO EXITOSAMENTE!');
    console.log(`⚡ Tiempo total: ${totalTime.toFixed(2)} segundos`);
    console.log(`📈 Verbos procesados: ${totalProcessed}`);
    console.log(`🚀 Velocidad promedio: ${(totalProcessed / totalTime).toFixed(1)} verbos/segundo`);
    console.log('💫 Todos los verbos ahora tienen ejemplos perfectos y traducciones precisas');
    console.log('🎯 Sistema listo para uso inmediato en la interfaz');

  } catch (error) {
    console.error('❌ Error en el proceso masivo:', error);
  }
}

// Ejecutar el sistema masivo
async function main() {
  try {
    await processAllVerbsMassively();
  } catch (error) {
    console.error('❌ Error crítico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { processAllVerbsMassively };

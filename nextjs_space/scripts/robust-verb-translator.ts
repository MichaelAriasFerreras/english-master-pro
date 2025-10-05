
// 🚀 TRADUCTOR DE VERBOS ULTRA-ROBUSTO Y EFICIENTE
// Manejo avanzado de errores y procesamiento optimizado

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

// Configuración optimizada y robusta
const BATCH_SIZE = 15; // Tamaño reducido para evitar truncamiento
const MAX_CONCURRENT_BATCHES = 2; // Reducir concurrencia para estabilidad
const API_DELAY = 800; // Delay ligeramente mayor para estabilidad
const MAX_RETRIES = 3; // Máximo intentos por lote

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

// Función ultra-robusta para llamadas API con validación JSON
async function callLLMAPIRobust(prompt: string, attempt: number = 1): Promise<{ verbs: ProcessedVerb[] } | null> {
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
            content: `Eres un experto profesor de inglés. Crea ejemplos PERFECTOS y traducciones precisas.
            IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional, sin markdown, sin códigos.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1800, // Reducido para evitar truncamiento
        temperature: 0.5  // Reducida para más consistencia
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    let jsonContent = data.choices[0]?.message?.content;
    
    if (!jsonContent) {
      throw new Error('No content in API response');
    }

    // Limpieza robusta del JSON
    jsonContent = jsonContent.trim();
    
    // Remover posibles markdown o caracteres extraños
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    
    // Validar que el JSON esté completo
    if (!jsonContent.endsWith('}') && !jsonContent.endsWith(']')) {
      throw new Error('JSON response appears truncated');
    }

    const parsed = JSON.parse(jsonContent);
    
    // Validación robusta de estructura
    if (!parsed.verbs || !Array.isArray(parsed.verbs)) {
      throw new Error('Invalid JSON structure: missing verbs array');
    }

    // Validar cada verbo
    for (const verb of parsed.verbs) {
      if (!verb.infinitive || !Array.isArray(verb.examples) || !Array.isArray(verb.spanish_examples)) {
        throw new Error(`Invalid verb structure for: ${verb.infinitive || 'unknown'}`);
      }
      if (verb.examples.length !== verb.spanish_examples.length) {
        throw new Error(`Mismatched examples count for: ${verb.infinitive}`);
      }
    }

    return parsed;
  } catch (error) {
    console.error(`❌ Error en llamada API (intento ${attempt}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

// Procesador ultra-robusto con reintentos inteligentes
async function processVerbBatchRobustly(verbs: VerbData[], batchNumber: number, totalBatches: number): Promise<ProcessedVerb[]> {
  console.log(`🎯 Lote ${batchNumber}/${totalBatches} - ${verbs.length} verbos (Modo ROBUSTO)`);
  
  const verbData = verbs.map(verb => ({
    infinitive: verb.infinitive,
    spanish: verb.spanishTranslation,
    level: verb.level,
    irregular: verb.isIrregular
  }));

  const prompt = `
Genera ejemplos naturales y traducciones para estos verbos:
${JSON.stringify(verbData, null, 2)}

RESPUESTA EXACTA (JSON válido solamente):
{
  "verbs": [
    {
      "infinitive": "verbo",
      "examples": [
        "Ejemplo natural 1",
        "Ejemplo natural 2", 
        "Ejemplo natural 3",
        "Ejemplo natural 4",
        "Ejemplo natural 5"
      ],
      "spanish_examples": [
        "Traducción precisa 1",
        "Traducción precisa 2",
        "Traducción precisa 3", 
        "Traducción precisa 4",
        "Traducción precisa 5"
      ]
    }
  ]
}

IMPORTANTE: Solo JSON válido, sin texto extra, sin markdown.`;

  // Sistema de reintentos inteligentes
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await callLLMAPIRobust(prompt, attempt);
    
    if (result && result.verbs && result.verbs.length > 0) {
      console.log(`✅ Lote ${batchNumber} exitoso (intento ${attempt}) - ${result.verbs.length} verbos`);
      return result.verbs;
    }
    
    if (attempt < MAX_RETRIES) {
      console.log(`🔄 Reintentando lote ${batchNumber} (${attempt + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Backoff progresivo
    }
  }
  
  console.error(`❌ Lote ${batchNumber} falló después de ${MAX_RETRIES} intentos`);
  return [];
}

// Actualizador de base de datos con manejo de errores
async function updateVerbsInDatabase(verbs: VerbData[], processedVerbs: ProcessedVerb[]): Promise<number> {
  let successCount = 0;
  
  for (const processedVerb of processedVerbs) {
    try {
      const verb = verbs.find(v => v.infinitive === processedVerb.infinitive);
      if (!verb) continue;

      await prisma.verb.update({
        where: { id: verb.id },
        data: {
          examples: processedVerb.examples,
          spanishExamples: processedVerb.spanish_examples
        }
      });
      
      successCount++;
    } catch (error) {
      console.error(`❌ Error actualizando ${processedVerb.infinitive}:`, error);
    }
  }
  
  console.log(`💾 ${successCount}/${processedVerbs.length} verbos actualizados en DB`);
  return successCount;
}

// Sistema principal robusto
async function processAllVerbsRobustly(): Promise<void> {
  let totalProcessed = 0;
  
  try {
    console.log('🚀 SISTEMA ROBUSTO DE TRADUCCIÓN MASIVA');
    
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

    const verbsToProcess = allVerbs.filter(verb => 
      !verb.examples || 
      !verb.spanishExamples || 
      (Array.isArray(verb.examples) && verb.examples.length === 0)
    );
    
    console.log(`📊 Total: ${allVerbs.length} | Pendientes: ${verbsToProcess.length}`);

    if (verbsToProcess.length === 0) {
      console.log('✨ ¡Todos los verbos completados!');
      return;
    }

    // Crear lotes robustos
    const batches: VerbData[][] = [];
    for (let i = 0; i < verbsToProcess.length; i += BATCH_SIZE) {
      batches.push(verbsToProcess.slice(i, i + BATCH_SIZE));
    }

    console.log(`🎯 ${batches.length} lotes de ${BATCH_SIZE} verbos c/u`);
    
    const startTime = Date.now();

    // Procesamiento robusto en grupos pequeños
    for (let i = 0; i < batches.length; i += MAX_CONCURRENT_BATCHES) {
      const currentBatches = batches.slice(i, i + MAX_CONCURRENT_BATCHES);
      
      const batchPromises = currentBatches.map(async (batch, index) => {
        const batchNumber = i + index + 1;
        const processedVerbs = await processVerbBatchRobustly(batch, batchNumber, batches.length);
        
        if (processedVerbs.length > 0) {
          return await updateVerbsInDatabase(batch, processedVerbs);
        }
        return 0;
      });

      const results = await Promise.all(batchPromises);
      const batchTotal = results.reduce((sum, count) => sum + count, 0);
      totalProcessed += batchTotal;
      
      console.log(`📈 Progreso: ${totalProcessed}/${verbsToProcess.length} verbos (${((totalProcessed/verbsToProcess.length)*100).toFixed(1)}%)`);
      
      // Delay entre grupos para estabilidad
      if (i + MAX_CONCURRENT_BATCHES < batches.length) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
      }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('\n🎉 ¡PROCESO ROBUSTO COMPLETADO!');
    console.log(`⚡ Tiempo: ${duration.toFixed(1)}s`);
    console.log(`🎯 Verbos procesados: ${totalProcessed}`);
    console.log(`💫 Sistema listo para uso inmediato`);

  } catch (error) {
    console.error('❌ Error crítico:', error);
  }
}

async function main() {
  try {
    await processAllVerbsRobustly();
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { processAllVerbsRobustly };

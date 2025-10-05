
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.ABACUSAI_API_KEY,
  baseURL: 'https://api.abacus.ai/v1',
});

async function translateVerbs() {
  try {
    // Obtener verbos sin traducción o sin ejemplos
    const verbsWithoutTranslation = await prisma.verb.findMany({
      where: {
        OR: [
          { spanishTranslation: '' },
          { examples: null },
          { spanishExamples: null },
        ]
      },
      orderBy: { infinitive: 'asc' }
    });

    console.log(`🔍 Encontrados ${verbsWithoutTranslation.length} verbos sin traducción completa`);

    if (verbsWithoutTranslation.length === 0) {
      console.log('✅ Todos los verbos ya están traducidos');
      return;
    }

    // Procesar en lotes de 5 verbos
    const batchSize = 5;
    let processed = 0;
    
    for (let i = 0; i < verbsWithoutTranslation.length; i += batchSize) {
      const batch = verbsWithoutTranslation.slice(i, i + batchSize);
      
      console.log(`\n📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(verbsWithoutTranslation.length/batchSize)}`);
      
      for (const verb of batch) {
        try {
          const prompt = `Traduce el verbo en inglés "${verb.infinitive}" al español y proporciona un ejemplo de uso en ambos idiomas.

Formato de respuesta (JSON):
{
  "spanish": "traducción del verbo al español",
  "examples": ["ejemplo 1 en inglés", "ejemplo 2 en inglés"],
  "spanishExamples": ["ejemplo 1 en español", "ejemplo 2 en español"]
}

Instrucciones:
- La traducción debe ser el verbo en infinitivo en español
- Proporciona 2 ejemplos en inglés con oraciones simples y prácticas usando el verbo
- Proporciona las traducciones naturales de esos ejemplos al español
- Responde SOLO con el JSON, sin texto adicional`;

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 200,
          });

          const responseText = completion.choices[0].message.content?.trim() || '';
          
          // Limpiar la respuesta para extraer solo el JSON
          let jsonText = responseText;
          if (jsonText.includes('```json')) {
            jsonText = jsonText.split('```json')[1].split('```')[0].trim();
          } else if (jsonText.includes('```')) {
            jsonText = jsonText.split('```')[1].split('```')[0].trim();
          }
          
          const translation = JSON.parse(jsonText);

          // Actualizar el verbo
          await prisma.verb.update({
            where: { id: verb.id },
            data: {
              spanishTranslation: translation.spanish,
              examples: translation.examples,
              spanishExamples: translation.spanishExamples,
            },
          });

          processed++;
          console.log(`✅ ${processed}/${verbsWithoutTranslation.length} - ${verb.infinitive} → ${translation.spanish}`);
          
          // Pequeña pausa para no saturar la API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Error traduciendo "${verb.infinitive}":`, error);
        }
      }
      
      // Pausa entre lotes
      if (i + batchSize < verbsWithoutTranslation.length) {
        console.log('⏸️  Pausa entre lotes (2 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n🎉 Traducción completada: ${processed} verbos actualizados`);

    // Verificar el total
    const totalTranslated = await prisma.verb.count({
      where: {
        AND: [
          { spanishTranslation: { not: '' } },
          { examples: { not: null } },
          { spanishExamples: { not: null } },
        ]
      }
    });

    const totalVerbs = await prisma.verb.count();
    console.log(`\n📊 Total de verbos traducidos: ${totalTranslated}/${totalVerbs}`);

  } catch (error) {
    console.error('Error en el proceso de traducción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateVerbs();

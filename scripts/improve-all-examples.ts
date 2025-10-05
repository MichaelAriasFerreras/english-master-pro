
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

let openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  try {
    const secretsPath = path.join(process.env.HOME || '/home/ubuntu', '.config/abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf-8'));
    openaiKey = secrets.openai?.secrets?.api_key?.value;
  } catch (e) {
    console.error('No se pudo leer la clave de OpenAI');
  }
}

const openai = new OpenAI({
  apiKey: openaiKey,
});

async function improveExamples() {
  try {
    // Obtener todos los verbos
    const allVerbs = await prisma.verb.findMany({
      orderBy: { infinitive: 'asc' }
    });

    console.log(`🔍 Encontrados ${allVerbs.length} verbos para mejorar`);

    // Procesar en lotes de 5 verbos
    const batchSize = 5;
    let processed = 0;
    
    for (let i = 0; i < allVerbs.length; i += batchSize) {
      const batch = allVerbs.slice(i, i + batchSize);
      
      console.log(`\n📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(allVerbs.length/batchSize)}`);
      
      for (const verb of batch) {
        try {
          const prompt = `Proporciona 2 ejemplos prácticos y naturales de uso del verbo "${verb.infinitive}" en inglés, y sus traducciones al español.

Formato de respuesta (JSON):
{
  "examples": ["ejemplo 1 en inglés usando el verbo", "ejemplo 2 en inglés usando el verbo"],
  "spanishExamples": ["traducción natural del ejemplo 1", "traducción natural del ejemplo 2"]
}

Instrucciones:
- Los ejemplos deben ser oraciones completas, simples y prácticas
- Usa el verbo en contextos reales y cotidianos
- Las traducciones deben ser naturales, no literales
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
              examples: translation.examples,
              spanishExamples: translation.spanishExamples,
            },
          });

          processed++;
          console.log(`✅ ${processed}/${allVerbs.length} - ${verb.infinitive}`);
          console.log(`   EN: ${translation.examples[0]}`);
          console.log(`   ES: ${translation.spanishExamples[0]}`);
          
          // Pequeña pausa para no saturar la API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Error mejorando "${verb.infinitive}":`, error);
        }
      }
      
      // Pausa entre lotes
      if (i + batchSize < allVerbs.length) {
        console.log('⏸️  Pausa entre lotes (2 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n🎉 Mejora completada: ${processed} verbos actualizados`);

  } catch (error) {
    console.error('Error en el proceso de mejora:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveExamples();

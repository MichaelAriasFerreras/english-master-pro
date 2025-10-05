import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  baseURL: 'https://api.abacus.ai/v1',
  apiKey: process.env.ABACUSAI_API_KEY || ''
});

async function addExamples() {
  try {
    console.log('🚀 Iniciando generación de ejemplos para verbos...');
    
    // Obtener todos los verbos
    const verbs = await prisma.verb.findMany({
      take: 100 // Procesar 100 a la vez
    });

    console.log(`📚 Procesando ${verbs.length} verbos...`);

    for (let i = 0; i < verbs.length; i++) {
      const verb = verbs[i];
      console.log(`\n[${i + 1}/${verbs.length}] Generando ejemplos para: ${verb.infinitive}`);

      try {
        const prompt = `Generate 3 simple, practical examples for the English verb "${verb.infinitive}" (Spanish: ${verb.spanishTranslation}).

Requirements:
- Each example should be a complete, natural sentence
- Use common, everyday situations
- Vary the tenses: present, past, and future
- Keep sentences simple (A2-B1 level)
- Include the verb in context

Return ONLY a JSON object with this exact structure:
{
  "english": ["sentence 1", "sentence 2", "sentence 3"],
  "spanish": ["traducción 1", "traducción 2", "traducción 3"]
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        });

        const content = response.choices[0]?.message?.content || '{}';
        const examples = JSON.parse(content);

        // Actualizar el verbo con los ejemplos
        await prisma.verb.update({
          where: { id: verb.id },
          data: {
            examples: examples.english || [],
            spanishExamples: examples.spanish || []
          }
        });

        console.log(`✅ Ejemplos agregados exitosamente`);
        console.log(`   EN: ${examples.english?.[0]}`);
        console.log(`   ES: ${examples.spanish?.[0]}`);

      } catch (error: any) {
        console.error(`❌ Error procesando "${verb.infinitive}":`, error.message);
        continue;
      }

      // Pequeña pausa para no saturar la API
      if (i < verbs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n✨ ¡Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addExamples();

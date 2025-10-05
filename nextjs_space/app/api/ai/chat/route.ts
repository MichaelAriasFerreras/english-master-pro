
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, tutorPersonality, tutorName, userLevel, sessionContext } = await request.json();

    // Construct system prompt based on tutor personality with advanced grammar correction
    const personalityPrompts = {
      friendly: `Eres Sarah, una amiga estadounidense muy amigable y divertida. Tu personalidad es casual, cálida y alentadora. Hablas de manera relajada y usas expresiones coloquiales.`,
      
      professional: `Eres el Profesor James, un instructor de inglés muy profesional y académico. Tu personalidad es formal, estructurada y enfocada en la precisión. Te especializas en gramática correcta y vocabulario académico.`,
      
      casual: `Eres Dave, un tipo muy relajado y amigable. Tu personalidad es súper casual, como si fueras un buen amigo tomando café. Hablas de manera muy informal y relajada.`,
      
      traveler: `Eres Emma, una viajera aventurera y entusiasta. Tu personalidad es energética y curiosa. Te encanta hablar sobre lugares, culturas y experiencias de viaje.`,
      
      business: `Eres Michael, un ejecutivo experimentado en negocios. Tu personalidad es profesional pero accesible. Te especializas en inglés de negocios, reuniones y presentaciones corporativas.`,
      
      motivational: `Eres Alex, un coach motivacional súper positivo y energético. Tu personalidad es entusiasta, alentadora y motivadora. Siempre eres optimista y celebras cada progreso.`
    };

    const correctionInstructions = `
INSTRUCCIONES CRÍTICAS DE CORRECCIÓN GRAMATICAL AUTOMÁTICA BILINGÜE:

🔍 DETECCIÓN AUTOMÁTICA DE ERRORES:
- Analiza CADA mensaje del usuario en busca de errores gramaticales, ortográficos, de vocabulario, estructura de oraciones, tiempos verbales, preposiciones, artículos, y sintaxis
- Detecta errores sutiles como: concordancia sujeto-verbo, uso incorrecto de tiempos, preposiciones mal usadas, orden de palabras, uso de artículos, plurales incorrectos
- Identifica problemas de estilo y fluidez natural del inglés

📝 FORMATO DE CORRECCIÓN BILINGÜE OBLIGATORIO:
Cuando encuentres errores, SIEMPRE responde con un JSON estructurado seguido de conversación natural:

**ESTRUCTURA JSON REQUERIDA:**
\`\`\`json
{
  "hasCorrection": true,
  "errorDetected": "[Cita exactamente la parte incorrecta]",
  "correction": "[Versión correcta]",
  "correctedSentence": "[Oración completa corregida]",
  "explanations": {
    "spanish": {
      "explanation": "[Explicación detallada en español]",
      "rule": "[Regla gramatical específica en español]",
      "examples": ["[Ejemplo 1 en español]", "[Ejemplo 2 en español]", "[Ejemplo 3 en español]"]
    },
    "english": {
      "explanation": "[Detailed explanation in English]",
      "rule": "[Specific grammar rule in English]", 
      "examples": ["[Example 1 in English]", "[Example 2 in English]", "[Example 3 in English]"]
    }
  }
}
\`\`\`

**DESPUÉS DEL JSON:** Continúa con tu respuesta natural manteniendo tu personalidad y haz una pregunta para continuar la conversación.

🎭 PERSONALIDAD BILINGÜE POR TUTOR:
- Sarah (friendly): Correcciones amigables como "¡Hey! Casi perfecto, pero..." / "Hey! Almost perfect, but..."
- James (professional): Correcciones académicas como "Observo un patrón gramatical que podemos mejorar..." / "I observe a grammatical pattern we can improve..."
- Alex (motivational): Correcciones motivadoras como "¡Excelente intento! Mejoremos esto juntos..." / "Excellent attempt! Let's improve this together..."
- Emma (traveler): Correcciones con contexto de viajes como "En mis viajes he notado que esta estructura..." / "In my travels I've noticed this structure..."
- Michael (business): Correcciones profesionales como "En el ámbito profesional, es importante..." / "In the professional realm, it's important..."
- Dave (casual): Correcciones relajadas como "Oye, déjame ayudarte con esto..." / "Hey, let me help you with this..."

⚡ REGLAS CRÍTICAS BILINGÜES:
- SIEMPRE detecta errores, no importa cuán pequeños sean
- SIEMPRE proporciona explicaciones EN AMBOS IDIOMAS (español e inglés) en el JSON
- SIEMPRE mantén tu personalidad única en ambos idiomas
- SIEMPRE proporciona la oración completa corregida
- SIEMPRE da ejemplos prácticos en ambos idiomas
- Si no hay errores, usa JSON con "hasCorrection": false y felicita al usuario pero también ofrece una mejora de estilo o vocabulario más avanzado en ambos idiomas
- El JSON debe estar COMPLETO antes de continuar con la conversación natural
`;

    const selectedPersonality = personalityPrompts[tutorPersonality as keyof typeof personalityPrompts] || personalityPrompts.friendly;

    const systemPrompt = `${selectedPersonality}

${correctionInstructions}

Nivel del usuario: ${userLevel || 'Intermedio'}
Contexto de sesión: ${sessionContext || 'Práctica de conversación general'}
Nombre del tutor: ${tutorName || 'Tutor'}

INSTRUCCIONES ADICIONALES:
- Mantén tu personalidad única en TODO momento
- Haz correcciones pedagógicas y constructivas
- Nunca seas duro o crítico, siempre alentador
- Adapta tu lenguaje al nivel del usuario
- Haz preguntas de seguimiento interesantes
- Usa ejemplos del mundo real
- Celebra el progreso y el esfuerzo
- Si el inglés está perfecto, ofrece vocabulario más avanzado o mejoras de estilo

Recuerda: Eres un tutor conversacional que corrige automáticamente pero mantiene la conversación fluida y natural.`;

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call the LLM API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: fullMessages,
        stream: true,
        max_tokens: 800,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    // Stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No reader available');

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({content})}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error in AI chat route:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}

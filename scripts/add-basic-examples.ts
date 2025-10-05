import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commonExamples: Record<string, {english: string[], spanish: string[]}> = {
  "be": {
    english: [
      "I am a student",
      "She is happy today",
      "They were at the park yesterday"
    ],
    spanish: [
      "Yo soy un estudiante",
      "Ella está feliz hoy",
      "Ellos estaban en el parque ayer"
    ]
  },
  "have": {
    english: [
      "I have a new car",
      "She has two brothers",
      "They had a great time"
    ],
    spanish: [
      "Tengo un coche nuevo",
      "Ella tiene dos hermanos",
      "Tuvieron un gran momento"
    ]
  },
  "do": {
    english: [
      "I do my homework every day",
      "She does yoga in the morning",
      "They did their best"
    ],
    spanish: [
      "Hago mi tarea todos los días",
      "Ella hace yoga por la mañana",
      "Hicieron su mejor esfuerzo"
    ]
  },
  "say": {
    english: [
      "I say hello to everyone",
      "She says it's too late",
      "They said goodbye"
    ],
    spanish: [
      "Digo hola a todos",
      "Ella dice que es demasiado tarde",
      "Dijeron adiós"
    ]
  },
  "get": {
    english: [
      "I get up early",
      "She gets good grades",
      "They got a new house"
    ],
    spanish: [
      "Me levanto temprano",
      "Ella obtiene buenas calificaciones",
      "Consiguieron una casa nueva"
    ]
  },
  "make": {
    english: [
      "I make coffee every morning",
      "She makes delicious cakes",
      "They made a decision"
    ],
    spanish: [
      "Hago café todas las mañanas",
      "Ella hace pasteles deliciosos",
      "Tomaron una decisión"
    ]
  },
  "go": {
    english: [
      "I go to school by bus",
      "She goes shopping on Saturdays",
      "They went to Paris"
    ],
    spanish: [
      "Voy a la escuela en autobús",
      "Ella va de compras los sábados",
      "Fueron a París"
    ]
  },
  "know": {
    english: [
      "I know the answer",
      "She knows three languages",
      "They knew about the party"
    ],
    spanish: [
      "Sé la respuesta",
      "Ella sabe tres idiomas",
      "Sabían sobre la fiesta"
    ]
  },
  "take": {
    english: [
      "I take the train to work",
      "She takes photos",
      "They took a break"
    ],
    spanish: [
      "Tomo el tren al trabajo",
      "Ella toma fotos",
      "Tomaron un descanso"
    ]
  },
  "see": {
    english: [
      "I see my friends often",
      "She sees a doctor tomorrow",
      "They saw a movie"
    ],
    spanish: [
      "Veo a mis amigos a menudo",
      "Ella ve a un médico mañana",
      "Vieron una película"
    ]
  },
  "come": {
    english: [
      "I come home late",
      "She comes from Spain",
      "They came to visit"
    ],
    spanish: [
      "Llego a casa tarde",
      "Ella viene de España",
      "Vinieron de visita"
    ]
  },
  "think": {
    english: [
      "I think it's a good idea",
      "She thinks about her future",
      "They thought it was funny"
    ],
    spanish: [
      "Creo que es una buena idea",
      "Ella piensa en su futuro",
      "Pensaron que era gracioso"
    ]
  },
  "look": {
    english: [
      "I look at the stars",
      "She looks beautiful today",
      "They looked for the keys"
    ],
    spanish: [
      "Miro las estrellas",
      "Ella se ve hermosa hoy",
      "Buscaron las llaves"
    ]
  },
  "want": {
    english: [
      "I want to learn English",
      "She wants a new phone",
      "They wanted to go home"
    ],
    spanish: [
      "Quiero aprender inglés",
      "Ella quiere un teléfono nuevo",
      "Querían ir a casa"
    ]
  },
  "give": {
    english: [
      "I give gifts to my family",
      "She gives great advice",
      "They gave him a book"
    ],
    spanish: [
      "Doy regalos a mi familia",
      "Ella da buenos consejos",
      "Le dieron un libro"
    ]
  },
  "use": {
    english: [
      "I use my phone a lot",
      "She uses public transport",
      "They used a map"
    ],
    spanish: [
      "Uso mucho mi teléfono",
      "Ella usa transporte público",
      "Usaron un mapa"
    ]
  },
  "find": {
    english: [
      "I find it difficult",
      "She finds new places",
      "They found a solution"
    ],
    spanish: [
      "Lo encuentro difícil",
      "Ella encuentra nuevos lugares",
      "Encontraron una solución"
    ]
  },
  "tell": {
    english: [
      "I tell stories to children",
      "She tells the truth",
      "They told us everything"
    ],
    spanish: [
      "Cuento historias a los niños",
      "Ella dice la verdad",
      "Nos contaron todo"
    ]
  },
  "ask": {
    english: [
      "I ask many questions",
      "She asks for help",
      "They asked about you"
    ],
    spanish: [
      "Hago muchas preguntas",
      "Ella pide ayuda",
      "Preguntaron por ti"
    ]
  },
  "work": {
    english: [
      "I work from home",
      "She works in a hospital",
      "They worked hard"
    ],
    spanish: [
      "Trabajo desde casa",
      "Ella trabaja en un hospital",
      "Trabajaron duro"
    ]
  },
  "call": {
    english: [
      "I call my mom every day",
      "She calls her friends",
      "They called the police"
    ],
    spanish: [
      "Llamo a mi mamá todos los días",
      "Ella llama a sus amigos",
      "Llamaron a la policía"
    ]
  },
  "try": {
    english: [
      "I try to be better",
      "She tries new recipes",
      "They tried their best"
    ],
    spanish: [
      "Intento ser mejor",
      "Ella prueba nuevas recetas",
      "Hicieron su mejor esfuerzo"
    ]
  },
  "feel": {
    english: [
      "I feel happy today",
      "She feels tired",
      "They felt excited"
    ],
    spanish: [
      "Me siento feliz hoy",
      "Ella se siente cansada",
      "Se sintieron emocionados"
    ]
  },
  "leave": {
    english: [
      "I leave at 8 AM",
      "She leaves work early",
      "They left the party"
    ],
    spanish: [
      "Salgo a las 8 AM",
      "Ella sale del trabajo temprano",
      "Dejaron la fiesta"
    ]
  },
  "put": {
    english: [
      "I put my keys here",
      "She puts effort into it",
      "They put the books away"
    ],
    spanish: [
      "Pongo mis llaves aquí",
      "Ella pone esfuerzo en ello",
      "Guardaron los libros"
    ]
  },
  "mean": {
    english: [
      "I mean what I say",
      "She means well",
      "They meant no harm"
    ],
    spanish: [
      "Digo lo que pienso",
      "Ella tiene buenas intenciones",
      "No tenían malas intenciones"
    ]
  },
  "keep": {
    english: [
      "I keep my promises",
      "She keeps a diary",
      "They kept the secret"
    ],
    spanish: [
      "Cumplo mis promesas",
      "Ella mantiene un diario",
      "Guardaron el secreto"
    ]
  },
  "let": {
    english: [
      "I let him go",
      "She lets me help",
      "They let us in"
    ],
    spanish: [
      "Lo dejo ir",
      "Ella me deja ayudar",
      "Nos dejaron entrar"
    ]
  },
  "begin": {
    english: [
      "I begin at 9 o'clock",
      "She begins her day early",
      "They began the project"
    ],
    spanish: [
      "Empiezo a las 9 en punto",
      "Ella comienza su día temprano",
      "Comenzaron el proyecto"
    ]
  },
  "seem": {
    english: [
      "I seem confused",
      "She seems happy",
      "They seemed tired"
    ],
    spanish: [
      "Parezco confundido",
      "Ella parece feliz",
      "Parecían cansados"
    ]
  },
  "help": {
    english: [
      "I help my neighbors",
      "She helps at the library",
      "They helped us move"
    ],
    spanish: [
      "Ayudo a mis vecinos",
      "Ella ayuda en la biblioteca",
      "Nos ayudaron a mudarnos"
    ]
  },
  "show": {
    english: [
      "I show my work",
      "She shows respect",
      "They showed their tickets"
    ],
    spanish: [
      "Muestro mi trabajo",
      "Ella muestra respeto",
      "Mostraron sus boletos"
    ]
  },
  "hear": {
    english: [
      "I hear music",
      "She hears voices",
      "They heard the news"
    ],
    spanish: [
      "Escucho música",
      "Ella escucha voces",
      "Escucharon las noticias"
    ]
  },
  "play": {
    english: [
      "I play guitar",
      "She plays tennis",
      "They played soccer"
    ],
    spanish: [
      "Toco la guitarra",
      "Ella juega tenis",
      "Jugaron fútbol"
    ]
  },
  "run": {
    english: [
      "I run every morning",
      "She runs a business",
      "They ran a marathon"
    ],
    spanish: [
      "Corro todas las mañanas",
      "Ella dirige un negocio",
      "Corrieron un maratón"
    ]
  },
  "move": {
    english: [
      "I move to a new city",
      "She moves gracefully",
      "They moved last month"
    ],
    spanish: [
      "Me mudo a una ciudad nueva",
      "Ella se mueve con gracia",
      "Se mudaron el mes pasado"
    ]
  },
  "live": {
    english: [
      "I live in Madrid",
      "She lives alone",
      "They lived together"
    ],
    spanish: [
      "Vivo en Madrid",
      "Ella vive sola",
      "Vivieron juntos"
    ]
  },
  "believe": {
    english: [
      "I believe in you",
      "She believes in miracles",
      "They believed the story"
    ],
    spanish: [
      "Creo en ti",
      "Ella cree en milagros",
      "Creyeron la historia"
    ]
  },
  "bring": {
    english: [
      "I bring lunch",
      "She brings happiness",
      "They brought gifts"
    ],
    spanish: [
      "Traigo almuerzo",
      "Ella trae felicidad",
      "Trajeron regalos"
    ]
  },
  "happen": {
    english: [
      "Things happen for a reason",
      "It happens sometimes",
      "It happened yesterday"
    ],
    spanish: [
      "Las cosas pasan por una razón",
      "Sucede a veces",
      "Pasó ayer"
    ]
  },
  "write": {
    english: [
      "I write emails",
      "She writes novels",
      "They wrote a letter"
    ],
    spanish: [
      "Escribo correos",
      "Ella escribe novelas",
      "Escribieron una carta"
    ]
  },
  "sit": {
    english: [
      "I sit here",
      "She sits by the window",
      "They sat together"
    ],
    spanish: [
      "Me siento aquí",
      "Ella se sienta junto a la ventana",
      "Se sentaron juntos"
    ]
  },
  "stand": {
    english: [
      "I stand up",
      "She stands tall",
      "They stood in line"
    ],
    spanish: [
      "Me pongo de pie",
      "Ella se mantiene erguida",
      "Hicieron fila"
    ]
  },
  "lose": {
    english: [
      "I lose my keys often",
      "She loses track of time",
      "They lost the game"
    ],
    spanish: [
      "Pierdo mis llaves a menudo",
      "Ella pierde la noción del tiempo",
      "Perdieron el juego"
    ]
  },
  "pay": {
    english: [
      "I pay the rent",
      "She pays attention",
      "They paid the bill"
    ],
    spanish: [
      "Pago el alquiler",
      "Ella presta atención",
      "Pagaron la cuenta"
    ]
  },
  "meet": {
    english: [
      "I meet new people",
      "She meets her friends",
      "They met at the cafe"
    ],
    spanish: [
      "Conozco gente nueva",
      "Ella se encuentra con sus amigos",
      "Se encontraron en el café"
    ]
  },
  "include": {
    english: [
      "I include everyone",
      "It includes taxes",
      "They included me"
    ],
    spanish: [
      "Incluyo a todos",
      "Incluye impuestos",
      "Me incluyeron"
    ]
  },
  "continue": {
    english: [
      "I continue learning",
      "She continues her work",
      "They continued talking"
    ],
    spanish: [
      "Continúo aprendiendo",
      "Ella continúa su trabajo",
      "Continuaron hablando"
    ]
  },
  "set": {
    english: [
      "I set the table",
      "She sets goals",
      "They set a record"
    ],
    spanish: [
      "Pongo la mesa",
      "Ella establece metas",
      "Establecieron un récord"
    ]
  },
  "learn": {
    english: [
      "I learn English",
      "She learns quickly",
      "They learned a lot"
    ],
    spanish: [
      "Aprendo inglés",
      "Ella aprende rápido",
      "Aprendieron mucho"
    ]
  },
  "change": {
    english: [
      "I change my mind",
      "She changes often",
      "They changed the plan"
    ],
    spanish: [
      "Cambio de opinión",
      "Ella cambia a menudo",
      "Cambiaron el plan"
    ]
  },
  "lead": {
    english: [
      "I lead the team",
      "She leads by example",
      "They led the way"
    ],
    spanish: [
      "Lidero el equipo",
      "Ella lidera con el ejemplo",
      "Guiaron el camino"
    ]
  }
};

async function addExamples() {
  try {
    console.log('🚀 Agregando ejemplos a verbos comunes...');
    let updated = 0;
    
    for (const [infinitive, examples] of Object.entries(commonExamples)) {
      try {
        await prisma.verb.updateMany({
          where: { infinitive },
          data: {
            examples: examples.english,
            spanishExamples: examples.spanish
          }
        });
        updated++;
        console.log(`✅ ${infinitive}`);
      } catch (error: any) {
        console.log(`❌ ${infinitive}: ${error.message}`);
      }
    }
    
    console.log(`\n✨ ¡Completado! ${updated} verbos actualizados`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addExamples();

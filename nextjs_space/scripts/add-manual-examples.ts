import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ejemplos manuales de alta calidad para verbos comunes
const verbExamples: Record<string, { spanish: string, examples: string[], spanishExamples: string[] }> = {
  'abandon': {
    spanish: 'abandonar',
    examples: ['They had to abandon the ship', 'Never abandon your dreams'],
    spanishExamples: ['Tuvieron que abandonar el barco', 'Nunca abandones tus sueños']
  },
  'abolish': {
    spanish: 'abolir',
    examples: ['They abolished slavery in 1865', 'We should abolish this law'],
    spanishExamples: ['Abolieron la esclavitud en 1865', 'Deberíamos abolir esta ley']
  },
  'absorb': {
    spanish: 'absorber',
    examples: ['Plants absorb water from the soil', 'She absorbed all the information'],
    spanishExamples: ['Las plantas absorben agua del suelo', 'Ella absorbió toda la información']
  },
  'accept': {
    spanish: 'aceptar',
    examples: ['I accept your invitation', 'She accepted the job offer'],
    spanishExamples: ['Acepto tu invitación', 'Ella aceptó la oferta de trabajo']
  },
  'access': {
    spanish: 'acceder',
    examples: ['You can access your account online', 'Students access the library 24/7'],
    spanishExamples: ['Puedes acceder a tu cuenta en línea', 'Los estudiantes acceden a la biblioteca 24/7']
  },
  'accommodate': {
    spanish: 'acomodar',
    examples: ['This hotel can accommodate 200 guests', 'We will accommodate your needs'],
    spanishExamples: ['Este hotel puede acomodar 200 huéspedes', 'Acomodaremos tus necesidades']
  },
  'accompany': {
    spanish: 'acompañar',
    examples: ['I will accompany you to the station', 'Music accompanies the dance'],
    spanishExamples: ['Te acompañaré a la estación', 'La música acompaña el baile']
  },
  'accomplish': {
    spanish: 'lograr',
    examples: ['She accomplished her goals', 'We accomplished the mission'],
    spanishExamples: ['Ella logró sus objetivos', 'Logramos la misión']
  },
  'account': {
    spanish: 'explicar',
    examples: ['How do you account for this?', 'He must account for his actions'],
    spanishExamples: ['¿Cómo explicas esto?', 'Debe explicar sus acciones']
  },
  'accumulate': {
    spanish: 'acumular',
    examples: ['Dust accumulates quickly here', 'She accumulated a fortune'],
    spanishExamples: ['El polvo se acumula rápidamente aquí', 'Ella acumuló una fortuna']
  },
  'achieve': {
    spanish: 'lograr',
    examples: ['You can achieve anything', 'He achieved great success'],
    spanishExamples: ['Puedes lograr cualquier cosa', 'Él logró un gran éxito']
  },
  'acknowledge': {
    spanish: 'reconocer',
    examples: ['Please acknowledge receipt', 'She acknowledged her mistake'],
    spanishExamples: ['Por favor reconozca el recibo', 'Ella reconoció su error']
  },
  'acquire': {
    spanish: 'adquirir',
    examples: ['The company acquired new assets', 'I acquired this skill recently'],
    spanishExamples: ['La empresa adquirió nuevos activos', 'Adquirí esta habilidad recientemente']
  },
  'act': {
    spanish: 'actuar',
    examples: ['We must act now', 'He acts in movies'],
    spanishExamples: ['Debemos actuar ahora', 'Él actúa en películas']
  },
  'add': {
    spanish: 'agregar',
    examples: ['Add sugar to taste', 'She added some comments'],
    spanishExamples: ['Agrega azúcar al gusto', 'Ella agregó algunos comentarios']
  },
  'address': {
    spanish: 'dirigirse',
    examples: ['He will address the audience', 'We need to address this issue'],
    spanishExamples: ['Él se dirigirá a la audiencia', 'Necesitamos abordar este problema']
  },
  'adjust': {
    spanish: 'ajustar',
    examples: ['Please adjust the volume', 'She adjusted her glasses'],
    spanishExamples: ['Por favor ajusta el volumen', 'Ella ajustó sus lentes']
  },
  'admire': {
    spanish: 'admirar',
    examples: ['I admire your courage', 'They admired the view'],
    spanishExamples: ['Admiro tu valentía', 'Admiraron la vista']
  },
  'admit': {
    spanish: 'admitir',
    examples: ['He admitted his fault', 'She was admitted to the hospital'],
    spanishExamples: ['Él admitió su culpa', 'La admitieron en el hospital']
  },
  'adopt': {
    spanish: 'adoptar',
    examples: ['They adopted a child', 'We adopted a new policy'],
    spanishExamples: ['Adoptaron un niño', 'Adoptamos una nueva política']
  },
  'advance': {
    spanish: 'avanzar',
    examples: ['Technology advances rapidly', 'The army advanced'],
    spanishExamples: ['La tecnología avanza rápidamente', 'El ejército avanzó']
  },
  'advertise': {
    spanish: 'anunciar',
    examples: ['They advertise on TV', 'We need to advertise this product'],
    spanishExamples: ['Anuncian en TV', 'Necesitamos anunciar este producto']
  },
  'advise': {
    spanish: 'aconsejar',
    examples: ['I advise you to wait', 'The doctor advised rest'],
    spanishExamples: ['Te aconsejo esperar', 'El doctor aconsejó descanso']
  },
  'afford': {
    spanish: 'permitirse',
    examples: ['I cannot afford a new car', 'Can you afford to wait?'],
    spanishExamples: ['No puedo permitirme un auto nuevo', '¿Puedes darte el lujo de esperar?']
  },
  'agree': {
    spanish: 'estar de acuerdo',
    examples: ['I agree with you', 'They agreed to meet'],
    spanishExamples: ['Estoy de acuerdo contigo', 'Acordaron reunirse']
  },
  'aim': {
    spanish: 'apuntar',
    examples: ['Aim for the target', 'We aim to improve quality'],
    spanishExamples: ['Apunta al objetivo', 'Nuestro objetivo es mejorar la calidad']
  },
  'allow': {
    spanish: 'permitir',
    examples: ['Please allow me to explain', 'Smoking is not allowed'],
    spanishExamples: ['Por favor permíteme explicar', 'No se permite fumar']
  },
  'announce': {
    spanish: 'anunciar',
    examples: ['They announced the winner', 'We will announce the results'],
    spanishExamples: ['Anunciaron al ganador', 'Anunciaremos los resultados']
  },
  'answer': {
    spanish: 'responder',
    examples: ['Please answer the question', 'She answered the phone'],
    spanishExamples: ['Por favor responde la pregunta', 'Ella respondió el teléfono']
  },
  'appear': {
    spanish: 'aparecer',
    examples: ['Stars appear at night', 'He appeared suddenly'],
    spanishExamples: ['Las estrellas aparecen de noche', 'Él apareció repentinamente']
  },
  'apply': {
    spanish: 'aplicar',
    examples: ['Apply pressure to the wound', 'I want to apply for this job'],
    spanishExamples: ['Aplica presión a la herida', 'Quiero aplicar para este trabajo']
  },
  'appreciate': {
    spanish: 'apreciar',
    examples: ['I appreciate your help', 'They appreciate good music'],
    spanishExamples: ['Aprecio tu ayuda', 'Aprecian la buena música']
  },
  'approach': {
    spanish: 'acercarse',
    examples: ['Winter is approaching', 'He approached me carefully'],
    spanishExamples: ['El invierno se acerca', 'Se me acercó con cuidado']
  },
  'approve': {
    spanish: 'aprobar',
    examples: ['The board approved the plan', 'I approve of your decision'],
    spanishExamples: ['La junta aprobó el plan', 'Apruebo tu decisión']
  },
  'argue': {
    spanish: 'argumentar',
    examples: ['They argue all the time', 'She argued her case well'],
    spanishExamples: ['Discuten todo el tiempo', 'Argumentó bien su caso']
  },
  'arise': {
    spanish: 'surgir',
    examples: ['Problems arise daily', 'A conflict arose'],
    spanishExamples: ['Los problemas surgen diariamente', 'Surgió un conflicto']
  },
  'arrange': {
    spanish: 'arreglar',
    examples: ['She arranged the flowers', 'Can you arrange a meeting?'],
    spanishExamples: ['Ella arregló las flores', '¿Puedes arreglar una reunión?']
  },
  'arrive': {
    spanish: 'llegar',
    examples: ['The train arrives at 5 PM', 'We arrived early'],
    spanishExamples: ['El tren llega a las 5 PM', 'Llegamos temprano']
  },
  'ask': {
    spanish: 'preguntar',
    examples: ['Can I ask you something?', 'She asked for help'],
    spanishExamples: ['¿Puedo preguntarte algo?', 'Ella pidió ayuda']
  },
  'attack': {
    spanish: 'atacar',
    examples: ['The enemy attacked at dawn', 'Sharks rarely attack humans'],
    spanishExamples: ['El enemigo atacó al amanecer', 'Los tiburones raramente atacan humanos']
  },
  'attempt': {
    spanish: 'intentar',
    examples: ['He attempted to escape', 'They will attempt the rescue'],
    spanishExamples: ['Intentó escapar', 'Intentarán el rescate']
  },
  'attend': {
    spanish: 'asistir',
    examples: ['I attend classes daily', 'Will you attend the meeting?'],
    spanishExamples: ['Asisto a clases diariamente', '¿Asistirás a la reunión?']
  },
  'attract': {
    spanish: 'atraer',
    examples: ['Flowers attract bees', 'The movie attracted many viewers'],
    spanishExamples: ['Las flores atraen abejas', 'La película atrajo muchos espectadores']
  },
  'avoid': {
    spanish: 'evitar',
    examples: ['Avoid junk food', 'He avoided the question'],
    spanishExamples: ['Evita la comida chatarra', 'Evitó la pregunta']
  },
  'be': {
    spanish: 'ser/estar',
    examples: ['I am happy', 'She is a teacher'],
    spanishExamples: ['Soy feliz', 'Ella es profesora']
  },
  'bear': {
    spanish: 'soportar',
    examples: ['I cannot bear the pain', 'She bore three children'],
    spanishExamples: ['No puedo soportar el dolor', 'Tuvo tres hijos']
  },
  'beat': {
    spanish: 'batir/vencer',
    examples: ['Beat the eggs well', 'Our team beat them 3-0'],
    spanishExamples: ['Bate bien los huevos', 'Nuestro equipo los venció 3-0']
  },
  'become': {
    spanish: 'convertirse',
    examples: ['She became a doctor', 'It became dark'],
    spanishExamples: ['Se convirtió en doctora', 'Se hizo oscuro']
  },
  'begin': {
    spanish: 'comenzar',
    examples: ['Let\'s begin the meeting', 'School begins in September'],
    spanishExamples: ['Comencemos la reunión', 'La escuela comienza en septiembre']
  },
  'behave': {
    spanish: 'comportarse',
    examples: ['Please behave yourself', 'The children behaved well'],
    spanishExamples: ['Por favor compórtate', 'Los niños se comportaron bien']
  },
  'believe': {
    spanish: 'creer',
    examples: ['I believe in you', 'She believes the story'],
    spanishExamples: ['Creo en ti', 'Ella cree la historia']
  }
};

async function addManualExamples() {
  try {
    console.log('🚀 Agregando ejemplos manuales de alta calidad...\n');
    
    let updated = 0;
    
    for (const [infinitive, data] of Object.entries(verbExamples)) {
      try {
        const verb = await prisma.verb.findFirst({
          where: { infinitive }
        });
        
        if (verb) {
          await prisma.verb.update({
            where: { id: verb.id },
            data: {
              spanishTranslation: data.spanish,
              examples: data.examples,
              spanishExamples: data.spanishExamples
            }
          });
          
          updated++;
          console.log(`✅ ${updated}. ${infinitive} → ${data.spanish}`);
          console.log(`   ${data.examples[0]}`);
          console.log(`   ${data.spanishExamples[0]}\n`);
        }
      } catch (error) {
        console.error(`❌ Error con "${infinitive}":`, error);
      }
    }
    
    console.log(`\n🎉 Completado: ${updated} verbos actualizados con ejemplos de calidad`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addManualExamples();

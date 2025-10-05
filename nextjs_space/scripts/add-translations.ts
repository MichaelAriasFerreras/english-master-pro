import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo de traducciones
const translations: { [key: string]: string } = {
  'be': 'ser/estar', 'have': 'tener', 'do': 'hacer', 'say': 'decir', 'go': 'ir',
  'get': 'obtener', 'make': 'hacer', 'know': 'saber', 'think': 'pensar', 'take': 'tomar',
  'see': 'ver', 'come': 'venir', 'want': 'querer', 'look': 'mirar', 'use': 'usar',
  'find': 'encontrar', 'give': 'dar', 'tell': 'decir', 'work': 'trabajar', 'call': 'llamar',
  'try': 'intentar', 'ask': 'preguntar', 'need': 'necesitar', 'feel': 'sentir', 'become': 'convertirse',
  'leave': 'dejar', 'put': 'poner', 'mean': 'significar', 'keep': 'mantener', 'let': 'permitir',
  'begin': 'comenzar', 'seem': 'parecer', 'help': 'ayudar', 'talk': 'hablar', 'turn': 'girar',
  'start': 'comenzar', 'show': 'mostrar', 'hear': 'oír', 'play': 'jugar', 'run': 'correr',
  'move': 'mover', 'live': 'vivir', 'believe': 'creer', 'bring': 'traer', 'happen': 'suceder',
  'write': 'escribir', 'provide': 'proveer', 'sit': 'sentarse', 'stand': 'estar de pie', 'lose': 'perder',
  'pay': 'pagar', 'meet': 'conocer', 'include': 'incluir', 'continue': 'continuar', 'set': 'poner',
  'learn': 'aprender', 'change': 'cambiar', 'lead': 'liderar', 'understand': 'entender', 'watch': 'ver',
  'follow': 'seguir', 'stop': 'detener', 'create': 'crear', 'speak': 'hablar', 'read': 'leer',
  'allow': 'permitir', 'add': 'añadir', 'spend': 'gastar', 'grow': 'crecer', 'open': 'abrir',
  'walk': 'caminar', 'win': 'ganar', 'offer': 'ofrecer', 'remember': 'recordar', 'love': 'amar',
  'consider': 'considerar', 'appear': 'aparecer', 'buy': 'comprar', 'wait': 'esperar', 'serve': 'servir',
  'die': 'morir', 'send': 'enviar', 'expect': 'esperar', 'build': 'construir', 'stay': 'quedarse',
  'fall': 'caer', 'cut': 'cortar', 'reach': 'alcanzar', 'kill': 'matar', 'remain': 'permanecer',
  'suggest': 'sugerir', 'raise': 'elevar', 'pass': 'pasar', 'sell': 'vender', 'require': 'requerir',
  'report': 'informar', 'decide': 'decidir', 'pull': 'tirar', 'break': 'romper', 'pick': 'recoger',
  'wear': 'usar', 'develop': 'desarrollar', 'explain': 'explicar', 'agree': 'estar de acuerdo', 'receive': 'recibir',
  'return': 'volver', 'describe': 'describir', 'teach': 'enseñar', 'eat': 'comer', 'produce': 'producir',
  'travel': 'viajar', 'drive': 'conducir', 'cook': 'cocinar', 'clean': 'limpiar', 'dance': 'bailar',
  'sing': 'cantar', 'study': 'estudiar', 'sleep': 'dormir', 'swim': 'nadar', 'fly': 'volar',
  'run': 'correr', 'jump': 'saltar', 'climb': 'escalar', 'drink': 'beber', 'smile': 'sonreír',
  'cry': 'llorar', 'laugh': 'reír', 'listen': 'escuchar', 'answer': 'responder', 'arrive': 'llegar',
  'catch': 'atrapar', 'choose': 'elegir', 'close': 'cerrar', 'draw': 'dibujar', 'enjoy': 'disfrutar',
  'finish': 'terminar', 'forget': 'olvidar', 'hope': 'esperar', 'imagine': 'imaginar', 'join': 'unirse',
  'like': 'gustar', 'paint': 'pintar', 'plan': 'planear', 'prepare': 'preparar', 'relax': 'relajarse',
  'save': 'guardar', 'share': 'compartir', 'surprise': 'sorprender', 'visit': 'visitar', 'worry': 'preocuparse'
};

async function main() {
  console.log('Iniciando actualización de traducciones...\n');
  
  const allVerbs = await prisma.verb.findMany();
  console.log(`Total de verbos: ${allVerbs.length}\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const verb of allVerbs) {
    const translation = translations[verb.infinitive.toLowerCase()];
    
    if (translation) {
      // Ejemplos básicos en inglés y español
      const examplesEn = [
        `I ${verb.infinitive} every day`,
        `She ${verb.thirdPersonSingular} often`,
        `They ${verb.simplePast} yesterday`
      ];
      
      const examplesEs = [
        `Yo ${translation} todos los días`,
        `Ella ${translation} a menudo`,
        `Ellos ${translation}on ayer`
      ];
      
      await prisma.verb.update({
        where: { id: verb.id },
        data: {
          spanishTranslation: translation,
          examples: examplesEn,
          spanishExamples: examplesEs
        }
      });
      
      updated++;
      if (updated % 10 === 0) {
        console.log(`Procesados: ${updated} verbos`);
      }
    } else {
      skipped++;
    }
  }
  
  console.log(`\n=== RESUMEN ===`);
  console.log(`✓ Actualizados: ${updated}`);
  console.log(`○ Sin traducción: ${skipped}`);
  console.log(`Total: ${allVerbs.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

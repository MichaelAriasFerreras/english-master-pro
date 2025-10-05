import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Diccionario extendido de traducciones (verbos más comunes del inglés)
const translations: { [key: string]: string } = {
  // Verbos A
  'accept': 'aceptar', 'achieve': 'lograr', 'act': 'actuar', 'add': 'añadir', 'admit': 'admitir',
  'affect': 'afectar', 'afford': 'permitirse', 'agree': 'estar de acuerdo', 'allow': 'permitir', 'announce': 'anunciar',
  'answer': 'responder', 'appear': 'aparecer', 'apply': 'aplicar', 'approach': 'acercarse', 'argue': 'discutir',
  'arise': 'surgir', 'arrange': 'arreglar', 'arrive': 'llegar', 'ask': 'preguntar', 'assume': 'asumir',
  'attack': 'atacar', 'attempt': 'intentar', 'attend': 'asistir', 'attract': 'atraer', 'avoid': 'evitar',
  
  // Verbos B
  'be': 'ser/estar', 'bear': 'soportar', 'beat': 'golpear', 'become': 'convertirse', 'begin': 'comenzar',
  'behave': 'comportarse', 'believe': 'creer', 'belong': 'pertenecer', 'bend': 'doblar', 'bet': 'apostar',
  'bite': 'morder', 'blow': 'soplar', 'boil': 'hervir', 'borrow': 'pedir prestado', 'bother': 'molestar',
  'break': 'romper', 'breathe': 'respirar', 'bring': 'traer', 'build': 'construir', 'burn': 'quemar',
  'burst': 'estallar', 'buy': 'comprar',
  
  // Verbos C
  'call': 'llamar', 'cancel': 'cancelar', 'care': 'importar', 'carry': 'llevar', 'catch': 'atrapar',
  'cause': 'causar', 'celebrate': 'celebrar', 'change': 'cambiar', 'charge': 'cobrar', 'chase': 'perseguir',
  'check': 'comprobar', 'choose': 'elegir', 'claim': 'reclamar', 'clean': 'limpiar', 'clear': 'despejar',
  'climb': 'escalar', 'close': 'cerrar', 'collect': 'recoger', 'come': 'venir', 'comment': 'comentar',
  'communicate': 'comunicar', 'compare': 'comparar', 'complain': 'quejarse', 'complete': 'completar', 'concern': 'preocupar',
  'confirm': 'confirmar', 'connect': 'conectar', 'consider': 'considerar', 'consist': 'consistir', 'contain': 'contener',
  'continue': 'continuar', 'control': 'controlar', 'cook': 'cocinar', 'copy': 'copiar', 'cost': 'costar',
  'count': 'contar', 'cover': 'cubrir', 'crash': 'chocar', 'create': 'crear', 'cross': 'cruzar',
  'cry': 'llorar', 'cut': 'cortar',
  
  // Verbos D
  'damage': 'dañar', 'dance': 'bailar', 'dare': 'atreverse', 'deal': 'tratar', 'decide': 'decidir',
  'declare': 'declarar', 'decrease': 'disminuir', 'defend': 'defender', 'deliver': 'entregar', 'demand': 'exigir',
  'deny': 'negar', 'depend': 'depender', 'describe': 'describir', 'deserve': 'merecer', 'design': 'diseñar',
  'destroy': 'destruir', 'develop': 'desarrollar', 'die': 'morir', 'differ': 'diferir', 'direct': 'dirigir',
  'disagree': 'no estar de acuerdo', 'disappear': 'desaparecer', 'discover': 'descubrir', 'discuss': 'discutir', 'divide': 'dividir',
  'do': 'hacer', 'doubt': 'dudar', 'draw': 'dibujar', 'dream': 'soñar', 'dress': 'vestirse',
  'drink': 'beber', 'drive': 'conducir', 'drop': 'dejar caer', 'drown': 'ahogarse', 'dry': 'secar',
  
  // Verbos E
  'earn': 'ganar', 'eat': 'comer', 'educate': 'educar', 'employ': 'emplear', 'enable': 'permitir',
  'encourage': 'alentar', 'end': 'terminar', 'enjoy': 'disfrutar', 'enter': 'entrar', 'entertain': 'entretener',
  'escape': 'escapar', 'establish': 'establecer', 'examine': 'examinar', 'excite': 'emocionar', 'excuse': 'excusar',
  'exist': 'existir', 'expand': 'expandir', 'expect': 'esperar', 'experience': 'experimentar', 'explain': 'explicar',
  'explode': 'explotar', 'express': 'expresar', 'extend': 'extender',
  
  // Verbos F
  'face': 'enfrentar', 'fail': 'fallar', 'fall': 'caer', 'fear': 'temer', 'feed': 'alimentar',
  'feel': 'sentir', 'fight': 'pelear', 'fill': 'llenar', 'find': 'encontrar', 'finish': 'terminar',
  'fire': 'disparar', 'fit': 'caber', 'fix': 'arreglar', 'fly': 'volar', 'fold': 'doblar',
  'follow': 'seguir', 'force': 'forzar', 'forget': 'olvidar', 'forgive': 'perdonar', 'form': 'formar',
  'freeze': 'congelar', 'fry': 'freír',
  
  // Verbos G
  'gain': 'ganar', 'gather': 'reunir', 'get': 'obtener', 'give': 'dar', 'go': 'ir',
  'grab': 'agarrar', 'graduate': 'graduarse', 'grow': 'crecer', 'guarantee': 'garantizar', 'guess': 'adivinar',
  'guide': 'guiar',
  
  // Verbos H
  'hang': 'colgar', 'happen': 'suceder', 'hate': 'odiar', 'have': 'tener', 'head': 'dirigirse',
  'heal': 'curar', 'hear': 'oír', 'heat': 'calentar', 'help': 'ayudar', 'hide': 'esconder',
  'hit': 'golpear', 'hold': 'sostener', 'hope': 'esperar', 'hug': 'abrazar', 'hunt': 'cazar',
  'hurry': 'apresurarse', 'hurt': 'herir',
  
  // Verbos I
  'identify': 'identificar', 'ignore': 'ignorar', 'imagine': 'imaginar', 'imply': 'implicar', 'import': 'importar',
  'improve': 'mejorar', 'include': 'incluir', 'increase': 'aumentar', 'indicate': 'indicar', 'influence': 'influir',
  'inform': 'informar', 'insist': 'insistir', 'install': 'instalar', 'intend': 'intentar', 'interest': 'interesar',
  'interrupt': 'interrumpir', 'introduce': 'introducir', 'invent': 'inventar', 'invest': 'invertir', 'invite': 'invitar',
  'involve': 'involucrar', 'iron': 'planchar',
  
  // Verbos J-K
  'join': 'unirse', 'joke': 'bromear', 'judge': 'juzgar', 'jump': 'saltar', 'justify': 'justificar',
  'keep': 'mantener', 'kick': 'patear', 'kill': 'matar', 'kiss': 'besar', 'knock': 'golpear',
  'know': 'saber',
  
  // Verbos L
  'lack': 'carecer', 'land': 'aterrizar', 'last': 'durar', 'laugh': 'reír', 'launch': 'lanzar',
  'lay': 'poner', 'lead': 'liderar', 'lean': 'inclinarse', 'learn': 'aprender', 'leave': 'dejar',
  'lend': 'prestar', 'let': 'permitir', 'lie': 'mentir', 'lift': 'levantar', 'light': 'encender',
  'like': 'gustar', 'limit': 'limitar', 'link': 'vincular', 'list': 'listar', 'listen': 'escuchar',
  'live': 'vivir', 'load': 'cargar', 'lock': 'cerrar con llave', 'look': 'mirar', 'lose': 'perder',
  'love': 'amar',
  
  // Verbos M
  'maintain': 'mantener', 'make': 'hacer', 'manage': 'gestionar', 'mark': 'marcar', 'marry': 'casarse',
  'match': 'coincidir', 'matter': 'importar', 'mean': 'significar', 'measure': 'medir', 'meet': 'conocer',
  'melt': 'derretir', 'mention': 'mencionar', 'mind': 'importar', 'miss': 'extrañar', 'mix': 'mezclar',
  'move': 'mover', 'multiply': 'multiplicar', 'murder': 'asesinar',
  
  // Verbos N-O
  'need': 'necesitar', 'negotiate': 'negociar', 'notice': 'notar', 'obey': 'obedecer', 'object': 'objetar',
  'observe': 'observar', 'obtain': 'obtener', 'occur': 'ocurrir', 'offer': 'ofrecer', 'open': 'abrir',
  'operate': 'operar', 'oppose': 'oponerse', 'order': 'ordenar', 'organize': 'organizar', 'owe': 'deber',
  'own': 'poseer',
  
  // Verbos P
  'pack': 'empacar', 'paint': 'pintar', 'park': 'estacionar', 'participate': 'participar', 'pass': 'pasar',
  'pause': 'pausar', 'pay': 'pagar', 'perform': 'realizar', 'permit': 'permitir', 'persuade': 'persuadir',
  'pick': 'recoger', 'place': 'colocar', 'plan': 'planear', 'plant': 'plantar', 'play': 'jugar',
  'please': 'complacer', 'point': 'señalar', 'pollute': 'contaminar', 'possess': 'poseer', 'postpone': 'posponer',
  'pour': 'verter', 'practice': 'practicar', 'praise': 'elogiar', 'pray': 'rezar', 'predict': 'predecir',
  'prefer': 'preferir', 'prepare': 'preparar', 'present': 'presentar', 'preserve': 'preservar', 'press': 'presionar',
  'pretend': 'fingir', 'prevent': 'prevenir', 'print': 'imprimir', 'proceed': 'proceder', 'produce': 'producir',
  'promise': 'prometer', 'promote': 'promover', 'pronounce': 'pronunciar', 'protect': 'proteger', 'prove': 'probar',
  'provide': 'proveer', 'publish': 'publicar', 'pull': 'tirar', 'punish': 'castigar', 'push': 'empujar',
  'put': 'poner',
  
  // Verbos Q-R
  'qualify': 'calificar', 'question': 'cuestionar', 'quit': 'renunciar', 'quote': 'citar',
  'race': 'competir', 'rain': 'llover', 'raise': 'elevar', 'reach': 'alcanzar', 'read': 'leer',
  'realize': 'darse cuenta', 'receive': 'recibir', 'recognize': 'reconocer', 'recommend': 'recomendar', 'record': 'grabar',
  'recover': 'recuperar', 'recycle': 'reciclar', 'reduce': 'reducir', 'refer': 'referir', 'reflect': 'reflejar',
  'refuse': 'rechazar', 'regret': 'arrepentirse', 'reject': 'rechazar', 'relate': 'relacionar', 'relax': 'relajarse',
  'release': 'liberar', 'rely': 'confiar', 'remain': 'permanecer', 'remember': 'recordar', 'remind': 'recordar',
  'remove': 'quitar', 'rent': 'alquilar', 'repair': 'reparar', 'repeat': 'repetir', 'replace': 'reemplazar',
  'reply': 'responder', 'report': 'informar', 'represent': 'representar', 'request': 'solicitar', 'require': 'requerir',
  'rescue': 'rescatar', 'research': 'investigar', 'resemble': 'parecerse', 'reserve': 'reservar', 'resist': 'resistir',
  'respect': 'respetar', 'respond': 'responder', 'rest': 'descansar', 'result': 'resultar', 'retire': 'jubilarse',
  'return': 'volver', 'reveal': 'revelar', 'review': 'revisar', 'ride': 'montar', 'ring': 'sonar',
  'rise': 'levantarse', 'risk': 'arriesgar', 'rob': 'robar', 'roll': 'rodar', 'rub': 'frotar',
  'ruin': 'arruinar', 'rule': 'gobernar', 'run': 'correr', 'rush': 'apresurarse',
  
  // Verbos S
  'sail': 'navegar', 'satisfy': 'satisfacer', 'save': 'guardar', 'say': 'decir', 'scare': 'asustar',
  'scream': 'gritar', 'search': 'buscar', 'see': 'ver', 'seek': 'buscar', 'seem': 'parecer',
  'select': 'seleccionar', 'sell': 'vender', 'send': 'enviar', 'sense': 'sentir', 'separate': 'separar',
  'serve': 'servir', 'set': 'poner', 'settle': 'establecerse', 'sew': 'coser', 'shake': 'sacudir',
  'shape': 'formar', 'share': 'compartir', 'shave': 'afeitarse', 'shine': 'brillar', 'shoot': 'disparar',
  'shop': 'comprar', 'shout': 'gritar', 'show': 'mostrar', 'shut': 'cerrar', 'sign': 'firmar',
  'sing': 'cantar', 'sink': 'hundirse', 'sit': 'sentarse', 'ski': 'esquiar', 'skip': 'saltar',
  'sleep': 'dormir', 'slide': 'deslizar', 'slip': 'resbalar', 'smell': 'oler', 'smile': 'sonreír',
  'smoke': 'fumar', 'snow': 'nevar', 'solve': 'resolver', 'sound': 'sonar', 'speak': 'hablar',
  'spell': 'deletrear', 'spend': 'gastar', 'spill': 'derramar', 'split': 'dividir', 'spoil': 'estropear',
  'spread': 'extender', 'stand': 'estar de pie', 'stare': 'mirar fijamente', 'start': 'comenzar', 'state': 'declarar',
  'stay': 'quedarse', 'steal': 'robar', 'stick': 'pegar', 'sting': 'picar', 'stir': 'revolver',
  'stop': 'detener', 'store': 'almacenar', 'strike': 'golpear', 'struggle': 'luchar', 'study': 'estudiar',
  'submit': 'enviar', 'succeed': 'tener éxito', 'suck': 'chupar', 'suffer': 'sufrir', 'suggest': 'sugerir',
  'suit': 'convenir', 'supply': 'suministrar', 'support': 'apoyar', 'suppose': 'suponer', 'surprise': 'sorprender',
  'surround': 'rodear', 'survive': 'sobrevivir', 'suspect': 'sospechar', 'swear': 'jurar', 'sweep': 'barrer',
  'swim': 'nadar', 'swing': 'balancear',
  
  // Verbos T
  'take': 'tomar', 'talk': 'hablar', 'taste': 'probar', 'teach': 'enseñar', 'tear': 'rasgar',
  'tease': 'burlarse', 'tell': 'decir', 'tend': 'tender', 'test': 'probar', 'thank': 'agradecer',
  'think': 'pensar', 'threaten': 'amenazar', 'throw': 'lanzar', 'tie': 'atar', 'tighten': 'apretar',
  'touch': 'tocar', 'tour': 'recorrer', 'track': 'rastrear', 'trade': 'comerciar', 'train': 'entrenar',
  'transfer': 'transferir', 'translate': 'traducir', 'transport': 'transportar', 'trap': 'atrapar', 'travel': 'viajar',
  'treat': 'tratar', 'tremble': 'temblar', 'trick': 'engañar', 'trim': 'recortar', 'trip': 'tropezar',
  'trust': 'confiar', 'try': 'intentar', 'turn': 'girar', 'type': 'escribir a máquina', 'tire': 'cansar',
  
  // Verbos U-Z
  'understand': 'entender', 'undertake': 'emprender', 'undo': 'deshacer', 'unfold': 'desplegar', 'unite': 'unir',
  'unlock': 'desbloquear', 'unpack': 'desempacar', 'upset': 'molestar', 'urge': 'urgir', 'use': 'usar',
  'value': 'valorar', 'vary': 'variar', 'view': 'ver', 'visit': 'visitar', 'volunteer': 'ofrecerse como voluntario',
  'vote': 'votar', 'wait': 'esperar', 'wake': 'despertar', 'walk': 'caminar', 'wander': 'vagar',
  'want': 'querer', 'warm': 'calentar', 'warn': 'advertir', 'wash': 'lavar', 'waste': 'desperdiciar',
  'watch': 'ver', 'water': 'regar', 'wave': 'ondear', 'wear': 'usar', 'weigh': 'pesar',
  'welcome': 'dar la bienvenida', 'whisper': 'susurrar', 'win': 'ganar', 'wind': 'enrollar', 'wipe': 'limpiar',
  'wish': 'desear', 'wonder': 'preguntarse', 'work': 'trabajar', 'worry': 'preocuparse', 'wrap': 'envolver',
  'wrestle': 'luchar', 'write': 'escribir', 'yawn': 'bostezar', 'yell': 'gritar', 'zip': 'cerrar con cremallera',
  
  // Verbos modales y auxiliares
  'can': 'poder', 'could': 'podría', 'may': 'puede que', 'might': 'podría', 'must': 'deber',
  'shall': 'deber', 'should': 'debería', 'will': 'voluntad', 'would': 'haría',
  
  // Phrasal verbs comunes (forma base)
  'give up': 'rendirse', 'take off': 'despegar', 'put on': 'ponerse', 'look after': 'cuidar',
  'get up': 'levantarse', 'sit down': 'sentarse', 'stand up': 'ponerse de pie', 'wake up': 'despertarse',
  'turn on': 'encender', 'turn off': 'apagar', 'pick up': 'recoger', 'put down': 'dejar',
  'find out': 'averiguar', 'look for': 'buscar', 'take care': 'cuidar', 'carry out': 'llevar a cabo'
};

async function main() {
  console.log('Actualizando más traducciones...\n');
  
  const allVerbs = await prisma.verb.findMany();
  
  console.log(`Total de verbos en la base de datos: ${allVerbs.length}\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const verb of allVerbs) {
    const translation = translations[verb.infinitive.toLowerCase()];
    
    if (translation) {
      const examplesEn = [
        `I ${verb.infinitive} every day`,
        `She ${verb.thirdPersonSingular} often`,
        `They ${verb.simplePast} yesterday`
      ];
      
      const examplesEs = [
        `Yo ${translation} todos los días`,
        `Ella ${translation} a menudo`,
        `Ellos/Ellas ${translation} ayer`
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
      if (updated % 50 === 0) {
        console.log(`✓ Procesados: ${updated} verbos`);
      }
    } else {
      skipped++;
    }
  }
  
  console.log(`\n=== RESUMEN ===`);
  console.log(`✓ Actualizados: ${updated}`);
  console.log(`○ Sin traducción en diccionario: ${skipped}`);
  console.log(`Total: ${allVerbs.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

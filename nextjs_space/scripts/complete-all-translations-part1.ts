
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Traducciones completas para verbos (Parte 1: A-C)
const verbTranslations: Record<string, { spanish: string, examples: string[], spanishExamples: string[] }> = {
  'accelerate': {
    spanish: 'acelerar',
    examples: ['The car accelerated quickly', 'We need to accelerate the process'],
    spanishExamples: ['El auto aceleró rápidamente', 'Necesitamos acelerar el proceso']
  },
  'accuse': {
    spanish: 'acusar',
    examples: ['They accused him of theft', 'Don\'t accuse me without proof'],
    spanishExamples: ['Lo acusaron de robo', 'No me acuses sin pruebas']
  },
  'adapt': {
    spanish: 'adaptar',
    examples: ['Animals adapt to their environment', 'We must adapt to the changes'],
    spanishExamples: ['Los animales se adaptan a su entorno', 'Debemos adaptarnos a los cambios']
  },
  'adhere': {
    spanish: 'adherirse',
    examples: ['Please adhere to the rules', 'The sticker adheres to the wall'],
    spanishExamples: ['Por favor adhiérete a las reglas', 'La calcomanía se adhiere a la pared']
  },
  'administer': {
    spanish: 'administrar',
    examples: ['She administers the company', 'The nurse administered the medication'],
    spanishExamples: ['Ella administra la empresa', 'La enfermera administró la medicación']
  },
  'aid': {
    spanish: 'ayudar',
    examples: ['They aided the victims', 'This will aid in your recovery'],
    spanishExamples: ['Ayudaron a las víctimas', 'Esto ayudará en tu recuperación']
  },
  'alert': {
    spanish: 'alertar',
    examples: ['Alert the authorities immediately', 'The system alerted us to the problem'],
    spanishExamples: ['Alerta a las autoridades inmediatamente', 'El sistema nos alertó del problema']
  },
  'alleviate': {
    spanish: 'aliviar',
    examples: ['This medicine alleviates pain', 'We need to alleviate poverty'],
    spanishExamples: ['Esta medicina alivia el dolor', 'Necesitamos aliviar la pobreza']
  },
  'allocate': {
    spanish: 'asignar',
    examples: ['Allocate resources wisely', 'They allocated funds for education'],
    spanishExamples: ['Asigna los recursos sabiamente', 'Asignaron fondos para educación']
  },
  'alter': {
    spanish: 'alterar',
    examples: ['Don\'t alter the document', 'Climate change alters ecosystems'],
    spanishExamples: ['No alteres el documento', 'El cambio climático altera los ecosistemas']
  },
  'amend': {
    spanish: 'enmendar',
    examples: ['They amended the constitution', 'We need to amend our ways'],
    spanishExamples: ['Enmendaron la constitución', 'Necesitamos enmendar nuestros caminos']
  },
  'amount': {
    spanish: 'ascender',
    examples: ['The costs amount to $1000', 'This amounts to a declaration of war'],
    spanishExamples: ['Los costos ascienden a $1000', 'Esto equivale a una declaración de guerra']
  },
  'analyze': {
    spanish: 'analizar',
    examples: ['Analyze the data carefully', 'Scientists analyze the results'],
    spanishExamples: ['Analiza los datos cuidadosamente', 'Los científicos analizan los resultados']
  },
  'anger': {
    spanish: 'enojar',
    examples: ['His words angered me', 'Don\'t anger your parents'],
    spanishExamples: ['Sus palabras me enojaron', 'No enojes a tus padres']
  },
  'anticipate': {
    spanish: 'anticipar',
    examples: ['I anticipate good results', 'We anticipate heavy traffic'],
    spanishExamples: ['Anticipo buenos resultados', 'Anticipamos mucho tráfico']
  },
  'apologize': {
    spanish: 'disculparse',
    examples: ['I apologize for being late', 'He apologized sincerely'],
    spanishExamples: ['Me disculpo por llegar tarde', 'Se disculpó sinceramente']
  },
  'appeal': {
    spanish: 'apelar',
    examples: ['They appealed the decision', 'This music appeals to young people'],
    spanishExamples: ['Apelaron la decisión', 'Esta música apela a los jóvenes']
  },
  'appoint': {
    spanish: 'nombrar',
    examples: ['They appointed her as director', 'We need to appoint a committee'],
    spanishExamples: ['La nombraron directora', 'Necesitamos nombrar un comité']
  },
  'arrest': {
    spanish: 'arrestar',
    examples: ['Police arrested the suspect', 'They were arrested for speeding'],
    spanishExamples: ['La policía arrestó al sospechoso', 'Fueron arrestados por exceso de velocidad']
  },
  'ascertain': {
    spanish: 'averiguar',
    examples: ['We need to ascertain the facts', 'Ascertain the truth before acting'],
    spanishExamples: ['Necesitamos averiguar los hechos', 'Averigua la verdad antes de actuar']
  },
  'assemble': {
    spanish: 'ensamblar',
    examples: ['Assemble the furniture', 'Workers assembled in the plaza'],
    spanishExamples: ['Ensambla los muebles', 'Los trabajadores se reunieron en la plaza']
  },
  'assert': {
    spanish: 'afirmar',
    examples: ['She asserted her innocence', 'Assert your rights'],
    spanishExamples: ['Ella afirmó su inocencia', 'Afirma tus derechos']
  },
  'assess': {
    spanish: 'evaluar',
    examples: ['Assess the situation carefully', 'Teachers assess student performance'],
    spanishExamples: ['Evalúa la situación cuidadosamente', 'Los profesores evalúan el desempeño estudiantil']
  },
  'assign': {
    spanish: 'asignar',
    examples: ['Assign tasks to team members', 'The teacher assigned homework'],
    spanishExamples: ['Asigna tareas a los miembros del equipo', 'El profesor asignó tarea']
  },
  'assist': {
    spanish: 'asistir',
    examples: ['Can I assist you?', 'She assisted in the surgery'],
    spanishExamples: ['¿Puedo asistirte?', 'Ella asistió en la cirugía']
  },
  'associate': {
    spanish: 'asociar',
    examples: ['I associate red with danger', 'Don\'t associate with criminals'],
    spanishExamples: ['Asocio el rojo con peligro', 'No te asocies con criminales']
  },
  'assure': {
    spanish: 'asegurar',
    examples: ['I assure you it\'s safe', 'She assured me of her loyalty'],
    spanishExamples: ['Te aseguro que es seguro', 'Ella me aseguró su lealtad']
  },
  'attach': {
    spanish: 'adjuntar',
    examples: ['Attach the file to the email', 'I\'m very attached to my family'],
    spanishExamples: ['Adjunta el archivo al correo', 'Estoy muy apegado a mi familia']
  },
  'attain': {
    spanish: 'alcanzar',
    examples: ['She attained her goals', 'We must attain excellence'],
    spanishExamples: ['Ella alcanzó sus metas', 'Debemos alcanzar la excelencia']
  },
  'attribute': {
    spanish: 'atribuir',
    examples: ['They attribute success to hard work', 'Scientists attribute warming to CO2'],
    spanishExamples: ['Atribuyen el éxito al trabajo duro', 'Los científicos atribuyen el calentamiento al CO2']
  },
  'await': {
    spanish: 'esperar',
    examples: ['We await your decision', 'A surprise awaits you'],
    spanishExamples: ['Esperamos tu decisión', 'Te espera una sorpresa']
  },
  'award': {
    spanish: 'premiar',
    examples: ['They awarded her a medal', 'The court awarded damages'],
    spanishExamples: ['Le premiaron con una medalla', 'El tribunal otorgó daños']
  },
  'back': {
    spanish: 'respaldar',
    examples: ['I back your proposal', 'The company backed the project'],
    spanishExamples: ['Respaldo tu propuesta', 'La empresa respaldó el proyecto']
  },
  'bake': {
    spanish: 'hornear',
    examples: ['She bakes delicious bread', 'I\'m baking a cake for dinner'],
    spanishExamples: ['Ella hornea pan delicioso', 'Estoy horneando un pastel para la cena']
  },
  'balance': {
    spanish: 'equilibrar',
    examples: ['Balance your work and life', 'She balanced on one foot'],
    spanishExamples: ['Equilibra tu trabajo y vida', 'Se equilibró en un pie']
  },
  'ban': {
    spanish: 'prohibir',
    examples: ['They banned smoking indoors', 'The book was banned'],
    spanishExamples: ['Prohibieron fumar en interiores', 'El libro fue prohibido']
  },
  'bang': {
    spanish: 'golpear',
    examples: ['Don\'t bang the door', 'He banged his fist on the table'],
    spanishExamples: ['No golpees la puerta', 'Golpeó su puño en la mesa']
  },
  'base': {
    spanish: 'basar',
    examples: ['Base your decision on facts', 'The movie is based on a true story'],
    spanishExamples: ['Basa tu decisión en hechos', 'La película está basada en una historia real']
  },
  'beg': {
    spanish: 'rogar',
    examples: ['I beg you to reconsider', 'The homeless man begged for money'],
    spanishExamples: ['Te ruego que reconsideres', 'El homeless rogó por dinero']
  },
  'benefit': {
    spanish: 'beneficiar',
    examples: ['This will benefit everyone', 'Exercise benefits your health'],
    spanishExamples: ['Esto beneficiará a todos', 'El ejercicio beneficia tu salud']
  },
  'bid': {
    spanish: 'pujar',
    examples: ['I bid $100 for the painting', 'They bid farewell to their friends'],
    spanishExamples: ['Pujé $100 por la pintura', 'Se despidieron de sus amigos']
  },
  'bind': {
    spanish: 'atar',
    examples: ['Bind the books together', 'This contract binds us legally'],
    spanishExamples: ['Ata los libros juntos', 'Este contrato nos vincula legalmente']
  },
  'blame': {
    spanish: 'culpar',
    examples: ['Don\'t blame me for this', 'They blamed the accident on bad weather'],
    spanishExamples: ['No me culpes por esto', 'Culparon al accidente del mal clima']
  },
  'blend': {
    spanish: 'mezclar',
    examples: ['Blend the ingredients well', 'The colors blend beautifully'],
    spanishExamples: ['Mezcla bien los ingredientes', 'Los colores se mezclan bellamente']
  },
  'bless': {
    spanish: 'bendecir',
    examples: ['God bless you', 'The priest blessed the couple'],
    spanishExamples: ['Dios te bendiga', 'El sacerdote bendijo a la pareja']
  },
  'block': {
    spanish: 'bloquear',
    examples: ['Don\'t block the entrance', 'The road is blocked by snow'],
    spanishExamples: ['No bloquees la entrada', 'La carretera está bloqueada por nieve']
  },
  'board': {
    spanish: 'abordar',
    examples: ['We board the plane at 3 PM', 'They boarded the ship'],
    spanishExamples: ['Abordamos el avión a las 3 PM', 'Abordaron el barco']
  },
  'book': {
    spanish: 'reservar',
    examples: ['Book a hotel room online', 'I booked a table for two'],
    spanishExamples: ['Reserva una habitación de hotel en línea', 'Reservé una mesa para dos']
  },
  'boost': {
    spanish: 'impulsar',
    examples: ['This will boost sales', 'Coffee boosts my energy'],
    spanishExamples: ['Esto impulsará las ventas', 'El café impulsa mi energía']
  },
  'bounce': {
    spanish: 'rebotar',
    examples: ['The ball bounced high', 'Children love to bounce on trampolines'],
    spanishExamples: ['La pelota rebotó alto', 'A los niños les encanta rebotar en trampolines']
  },
  'breed': {
    spanish: 'criar',
    examples: ['They breed horses on the farm', 'Poverty breeds crime'],
    spanishExamples: ['Crían caballos en la granja', 'La pobreza genera crimen']
  },
  'broadcast': {
    spanish: 'transmitir',
    examples: ['They broadcast the news live', 'The station broadcasts 24/7'],
    spanishExamples: ['Transmiten las noticias en vivo', 'La estación transmite 24/7']
  },
  'brush': {
    spanish: 'cepillar',
    examples: ['Brush your teeth twice daily', 'She brushed her hair'],
    spanishExamples: ['Cepilla tus dientes dos veces al día', 'Se cepilló el cabello']
  },
  'bury': {
    spanish: 'enterrar',
    examples: ['They buried the treasure', 'He was buried in the cemetery'],
    spanishExamples: ['Enterraron el tesoro', 'Fue enterrado en el cementerio']
  },
  'calculate': {
    spanish: 'calcular',
    examples: ['Calculate the total cost', 'Scientists calculate the distance'],
    spanishExamples: ['Calcula el costo total', 'Los científicos calculan la distancia']
  },
  'calm': {
    spanish: 'calmar',
    examples: ['Calm down and relax', 'The music calms my nerves'],
    spanishExamples: ['Cálmate y relájate', 'La música calma mis nervios']
  },
  'campaign': {
    spanish: 'hacer campaña',
    examples: ['They campaign for environmental protection', 'She campaigned for presidency'],
    spanishExamples: ['Hacen campaña por la protección ambiental', 'Hizo campaña por la presidencia']
  },
  'capture': {
    spanish: 'capturar',
    examples: ['Soldiers captured the enemy', 'The photo captures the moment'],
    spanishExamples: ['Los soldados capturaron al enemigo', 'La foto captura el momento']
  },
  'cash': {
    spanish: 'cobrar',
    examples: ['Cash the check at the bank', 'I need to cash my paycheck'],
    spanishExamples: ['Cobra el cheque en el banco', 'Necesito cobrar mi cheque de pago']
  },
  'cast': {
    spanish: 'lanzar',
    examples: ['Cast your vote tomorrow', 'The fisherman cast his line'],
    spanishExamples: ['Lanza tu voto mañana', 'El pescador lanzó su línea']
  },
  'cater': {
    spanish: 'abastecer',
    examples: ['This restaurant caters to vegetarians', 'They catered the wedding'],
    spanishExamples: ['Este restaurante abastece a vegetarianos', 'Abastecieron la boda']
  },
  'cease': {
    spanish: 'cesar',
    examples: ['Cease all operations immediately', 'The noise ceased at midnight'],
    spanishExamples: ['Cesa todas las operaciones inmediatamente', 'El ruido cesó a medianoche']
  },
  'challenge': {
    spanish: 'desafiar',
    examples: ['This game challenges your mind', 'He challenged me to a race'],
    spanishExamples: ['Este juego desafía tu mente', 'Me desafió a una carrera']
  },
  'chat': {
    spanish: 'charlar',
    examples: ['Let\'s chat over coffee', 'They chatted for hours'],
    spanishExamples: ['Charlemos tomando café', 'Charlaron por horas']
  },
  'cheer': {
    spanish: 'animar',
    examples: ['Fans cheered loudly', 'This news will cheer you up'],
    spanishExamples: ['Los fanáticos animaron fuertemente', 'Esta noticia te animará']
  },
  'chuck': {
    spanish: 'tirar',
    examples: ['Chuck the ball to me', 'He chucked the garbage'],
    spanishExamples: ['Tírame la pelota', 'Tiró la basura']
  },
  'clarify': {
    spanish: 'aclarar',
    examples: ['Please clarify your position', 'Let me clarify what I meant'],
    spanishExamples: ['Por favor aclara tu posición', 'Déjame aclarar lo que quise decir']
  },
  'classify': {
    spanish: 'clasificar',
    examples: ['Classify these documents', 'Scientists classify animals by species'],
    spanishExamples: ['Clasifica estos documentos', 'Los científicos clasifican animales por especies']
  },
  'cling': {
    spanish: 'aferrarse',
    examples: ['The child clung to her mother', 'He clings to old traditions'],
    spanishExamples: ['El niño se aferró a su madre', 'Se aferra a viejas tradiciones']
  },
  'coach': {
    spanish: 'entrenar',
    examples: ['He coaches the basketball team', 'She coached me for the interview'],
    spanishExamples: ['Entrena al equipo de baloncesto', 'Me entrenó para la entrevista']
  },
  'coincide': {
    spanish: 'coincidir',
    examples: ['Our vacations coincide', 'Their views coincide on this matter'],
    spanishExamples: ['Nuestras vacaciones coinciden', 'Sus puntos de vista coinciden en este asunto']
  },
  'collapse': {
    spanish: 'colapsar',
    examples: ['The building collapsed', 'He collapsed from exhaustion'],
    spanishExamples: ['El edificio colapsó', 'Colapsó por agotamiento']
  },
  'color': {
    spanish: 'colorear',
    examples: ['Children love to color', 'Color the picture with crayons'],
    spanishExamples: ['A los niños les encanta colorear', 'Colorea la imagen con crayones']
  },
  'combat': {
    spanish: 'combatir',
    examples: ['Soldiers combat the enemy', 'We must combat poverty'],
    spanishExamples: ['Los soldados combaten al enemigo', 'Debemos combatir la pobreza']
  },
  'combine': {
    spanish: 'combinar',
    examples: ['Combine flour and sugar', 'This app combines many features'],
    spanishExamples: ['Combina harina y azúcar', 'Esta app combina muchas características']
  },
  'comfort': {
    spanish: 'consolar',
    examples: ['She comforted the crying child', 'Music comforts me'],
    spanishExamples: ['Consoló al niño llorando', 'La música me consuela']
  },
  'command': {
    spanish: 'comandar',
    examples: ['The general commands the army', 'He commanded respect'],
    spanishExamples: ['El general comanda el ejército', 'Comandó respeto']
  },
  'commence': {
    spanish: 'comenzar',
    examples: ['The ceremony will commence at noon', 'Let\'s commence the project'],
    spanishExamples: ['La ceremonia comenzará al mediodía', 'Comencemos el proyecto']
  },
  'commit': {
    spanish: 'cometer',
    examples: ['Don\'t commit the same mistake', 'He committed to the plan'],
    spanishExamples: ['No cometas el mismo error', 'Se comprometió con el plan']
  },
  'compensate': {
    spanish: 'compensar',
    examples: ['The company compensated employees', 'This will compensate for the loss'],
    spanishExamples: ['La empresa compensó a los empleados', 'Esto compensará la pérdida']
  },
  'compete': {
    spanish: 'competir',
    examples: ['Athletes compete for medals', 'Companies compete for customers'],
    spanishExamples: ['Los atletas compiten por medallas', 'Las empresas compiten por clientes']
  },
  'complement': {
    spanish: 'complementar',
    examples: ['Red wine complements steak', 'These skills complement each other'],
    spanishExamples: ['El vino tinto complementa el bistec', 'Estas habilidades se complementan']
  },
  'comply': {
    spanish: 'cumplir',
    examples: ['You must comply with regulations', 'They complied with the request'],
    spanishExamples: ['Debes cumplir con las regulaciones', 'Cumplieron con la solicitud']
  },
  'comprehend': {
    spanish: 'comprender',
    examples: ['I cannot comprehend this concept', 'She comprehends complex theories'],
    spanishExamples: ['No puedo comprender este concepto', 'Ella comprende teorías complejas']
  },
  'comprise': {
    spanish: 'comprender',
    examples: ['The team comprises 10 members', 'This book comprises three parts'],
    spanishExamples: ['El equipo comprende 10 miembros', 'Este libro comprende tres partes']
  },
  'compromise': {
    spanish: 'comprometer',
    examples: ['Let\'s reach a compromise', 'Don\'t compromise your values'],
    spanishExamples: ['Lleguemos a un compromiso', 'No comprometas tus valores']
  },
  'conceal': {
    spanish: 'ocultar',
    examples: ['She concealed her emotions', 'Don\'t conceal evidence'],
    spanishExamples: ['Ocultó sus emociones', 'No ocultes evidencia']
  },
  'concede': {
    spanish: 'conceder',
    examples: ['I concede your point', 'The candidate conceded defeat'],
    spanishExamples: ['Concedo tu punto', 'El candidato concedió la derrota']
  },
  'conceive': {
    spanish: 'concebir',
    examples: ['I cannot conceive of such cruelty', 'They conceived a brilliant plan'],
    spanishExamples: ['No puedo concebir tal crueldad', 'Concibieron un plan brillante']
  },
  'concentrate': {
    spanish: 'concentrar',
    examples: ['Concentrate on your studies', 'The sauce concentrates as it cooks'],
    spanishExamples: ['Concéntrate en tus estudios', 'La salsa se concentra mientras cocina']
  },
  'conclude': {
    spanish: 'concluir',
    examples: ['We conclude that he was innocent', 'The meeting concluded at 5 PM'],
    spanishExamples: ['Concluimos que era inocente', 'La reunión concluyó a las 5 PM']
  },
  'condemn': {
    spanish: 'condenar',
    examples: ['They condemned the violence', 'The judge condemned him to prison'],
    spanishExamples: ['Condenaron la violencia', 'El juez lo condenó a prisión']
  },
  'conduct': {
    spanish: 'conducir',
    examples: ['He conducts the orchestra', 'They conduct research'],
    spanishExamples: ['Conduce la orquesta', 'Conducen investigación']
  },
  'confer': {
    spanish: 'conferir',
    examples: ['The university conferred degrees', 'Let me confer with my colleagues'],
    spanishExamples: ['La universidad confirió títulos', 'Déjame conferir con mis colegas']
  },
  'confess': {
    spanish: 'confesar',
    examples: ['He confessed to the crime', 'I must confess I was wrong'],
    spanishExamples: ['Confesó el crimen', 'Debo confesar que estaba equivocado']
  },
  'conform': {
    spanish: 'conformar',
    examples: ['You must conform to the rules', 'She refuses to conform'],
    spanishExamples: ['Debes conformarte a las reglas', 'Se niega a conformarse']
  },
  'confront': {
    spanish: 'confrontar',
    examples: ['Confront your fears', 'They confronted the problem'],
    spanishExamples: ['Confronta tus miedos', 'Confrontaron el problema']
  },
  'confuse': {
    spanish: 'confundir',
    examples: ['Don\'t confuse me with facts', 'The instructions confused everyone'],
    spanishExamples: ['No me confundas con hechos', 'Las instrucciones confundieron a todos']
  }
};

async function addTranslationsPart1() {
  try {
    console.log('🚀 Agregando traducciones Parte 1 (A-C)...\n');
    
    let updated = 0;
    let errors = 0;
    
    for (const [infinitive, data] of Object.entries(verbTranslations)) {
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
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error con "${infinitive}":`, error);
      }
    }
    
    console.log(`\n✅ Parte 1 completada: ${updated} verbos actualizados (${errors} errores)`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTranslationsPart1();

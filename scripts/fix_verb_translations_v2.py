#!/usr/bin/env python3
"""
Script para corregir las traducciones y ejemplos de verbos en la base de datos
"""
import os
import json
import csv
import psycopg2
from psycopg2.extras import execute_batch
from collections import defaultdict

# Cargar variables de entorno
def load_env():
    env_path = '/home/ubuntu/github_repos/english_master_pro_improved/.env'
    env_vars = {}
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value.strip('"').strip("'")
    return env_vars

# Cargar dataset de verbos de Jehle
def load_jehle_verbs(csv_path):
    """Carga el dataset de verbos y extrae conjugaciones"""
    verbs_dict = {}
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            infinitive = row['infinitive'].lower().strip()
            infinitive_english = row['infinitive_english'].strip()
            mood = row['mood_english']
            tense = row['tense_english']
            
            # Solo guardar presente indicativo para conjugaciones
            if mood == 'Indicative' and tense == 'Present':
                if infinitive not in verbs_dict:
                    verbs_dict[infinitive] = {
                        'spanish': infinitive,
                        'english': infinitive_english,
                        'form_1s': row['form_1s'],  # yo
                        'form_3s': row['form_3s'],  # él/ella
                        'form_3p': row['form_3p'],  # ellos/ellas
                    }
    
    return verbs_dict

# Mapeo de verbos inglés -> español
def create_english_to_spanish_map(verbs_dict):
    """Crea un mapeo de infinitivos en inglés a español"""
    eng_to_spa = {}
    
    for spanish_verb, info in verbs_dict.items():
        # Extraer el infinitivo en inglés (quitar "to ")
        english_inf = info['english'].replace('to ', '').split(',')[0].strip()
        eng_to_spa[english_inf] = info
    
    return eng_to_spa

# Ejemplos específicos para verbos comunes
VERB_EXAMPLES = {
    'go': {
        'spanish': 'ir',
        'examples': [
            'Yo voy a la escuela todos los días.',
            'Ella va al trabajo en autobús.',
            'Ellos fueron al cine ayer.'
        ]
    },
    'take': {
        'spanish': 'tomar',
        'examples': [
            'Yo tomo café por la mañana.',
            'Ella toma el autobús a las 8.',
            'Ellos tomaron fotos en el parque.'
        ]
    },
    'see': {
        'spanish': 'ver',
        'examples': [
            'Yo veo películas los fines de semana.',
            'Ella ve a sus amigos a menudo.',
            'Ellos vieron un concierto anoche.'
        ]
    },
    'think': {
        'spanish': 'pensar',
        'examples': [
            'Yo pienso en ti todos los días.',
            'Ella piensa que es una buena idea.',
            'Ellos pensaron en viajar a España.'
        ]
    },
    'want': {
        'spanish': 'querer',
        'examples': [
            'Yo quiero aprender inglés.',
            'Ella quiere viajar al extranjero.',
            'Ellos quisieron comprar una casa.'
        ]
    },
    'use': {
        'spanish': 'usar',
        'examples': [
            'Yo uso mi teléfono para estudiar.',
            'Ella usa el ordenador para trabajar.',
            'Ellos usaron el diccionario.'
        ]
    },
    'tell': {
        'spanish': 'decir/contar',
        'examples': [
            'Yo te digo la verdad.',
            'Ella cuenta historias interesantes.',
            'Ellos dijeron que vendrían.'
        ]
    },
    'work': {
        'spanish': 'trabajar',
        'examples': [
            'Yo trabajo en una oficina.',
            'Ella trabaja desde casa.',
            'Ellos trabajaron todo el día.'
        ]
    },
    'feel': {
        'spanish': 'sentir',
        'examples': [
            'Yo me siento feliz hoy.',
            'Ella se siente cansada.',
            'Ellos se sintieron orgullosos.'
        ]
    },
    'keep': {
        'spanish': 'mantener/guardar',
        'examples': [
            'Yo mantengo mi cuarto limpio.',
            'Ella guarda sus secretos.',
            'Ellos mantuvieron la calma.'
        ]
    },
    'make': {
        'spanish': 'hacer',
        'examples': [
            'Yo hago mi tarea todos los días.',
            'Ella hace ejercicio por la mañana.',
            'Ellos hicieron una fiesta.'
        ]
    },
    'come': {
        'spanish': 'venir',
        'examples': [
            'Yo vengo a clase temprano.',
            'Ella viene de México.',
            'Ellos vinieron a visitarnos.'
        ]
    },
    'know': {
        'spanish': 'saber/conocer',
        'examples': [
            'Yo sé la respuesta.',
            'Ella conoce a muchas personas.',
            'Ellos supieron la noticia ayer.'
        ]
    },
    'get': {
        'spanish': 'obtener/conseguir',
        'examples': [
            'Yo obtengo buenas notas.',
            'Ella consigue trabajo fácilmente.',
            'Ellos obtuvieron el premio.'
        ]
    },
    'give': {
        'spanish': 'dar',
        'examples': [
            'Yo doy regalos en Navidad.',
            'Ella da clases de inglés.',
            'Ellos dieron una donación.'
        ]
    },
    'find': {
        'spanish': 'encontrar',
        'examples': [
            'Yo encuentro mis llaves siempre.',
            'Ella encuentra soluciones creativas.',
            'Ellos encontraron un tesoro.'
        ]
    },
    'say': {
        'spanish': 'decir',
        'examples': [
            'Yo digo la verdad siempre.',
            'Ella dice cosas interesantes.',
            'Ellos dijeron adiós.'
        ]
    },
    'call': {
        'spanish': 'llamar',
        'examples': [
            'Yo llamo a mi madre todos los días.',
            'Ella llama por teléfono a menudo.',
            'Ellos llamaron a la policía.'
        ]
    },
    'try': {
        'spanish': 'intentar/tratar',
        'examples': [
            'Yo intento hacer mi mejor esfuerzo.',
            'Ella trata de ayudar a todos.',
            'Ellos intentaron resolver el problema.'
        ]
    },
    'ask': {
        'spanish': 'preguntar/pedir',
        'examples': [
            'Yo pregunto cuando tengo dudas.',
            'Ella pide ayuda cuando la necesita.',
            'Ellos preguntaron por ti.'
        ]
    },
    'need': {
        'spanish': 'necesitar',
        'examples': [
            'Yo necesito tu ayuda.',
            'Ella necesita más tiempo.',
            'Ellos necesitaron un descanso.'
        ]
    },
    'become': {
        'spanish': 'convertirse/llegar a ser',
        'examples': [
            'Yo me convierto en mejor persona.',
            'Ella llega a ser doctora.',
            'Ellos se convirtieron en amigos.'
        ]
    },
    'leave': {
        'spanish': 'salir/dejar',
        'examples': [
            'Yo salgo de casa a las 7.',
            'Ella deja sus cosas aquí.',
            'Ellos salieron temprano.'
        ]
    },
    'put': {
        'spanish': 'poner',
        'examples': [
            'Yo pongo la mesa para cenar.',
            'Ella pone música mientras trabaja.',
            'Ellos pusieron flores en el jardín.'
        ]
    },
    'mean': {
        'spanish': 'significar/querer decir',
        'examples': [
            'Yo quiero decir algo importante.',
            'Ella significa mucho para mí.',
            'Ellos quisieron decir otra cosa.'
        ]
    },
    'let': {
        'spanish': 'dejar/permitir',
        'examples': [
            'Yo dejo que tomes mi libro.',
            'Ella permite que salgan temprano.',
            'Ellos dejaron que entráramos.'
        ]
    },
    'begin': {
        'spanish': 'comenzar/empezar',
        'examples': [
            'Yo comienzo a trabajar a las 9.',
            'Ella empieza su día con ejercicio.',
            'Ellos comenzaron el proyecto ayer.'
        ]
    },
    'seem': {
        'spanish': 'parecer',
        'examples': [
            'Yo parezco cansado hoy.',
            'Ella parece feliz.',
            'Ellos parecieron sorprendidos.'
        ]
    },
    'help': {
        'spanish': 'ayudar',
        'examples': [
            'Yo ayudo a mis amigos.',
            'Ella ayuda en casa.',
            'Ellos ayudaron con la mudanza.'
        ]
    },
    'show': {
        'spanish': 'mostrar/enseñar',
        'examples': [
            'Yo muestro mis fotos.',
            'Ella enseña su trabajo.',
            'Ellos mostraron el camino.'
        ]
    },
    'hear': {
        'spanish': 'oír/escuchar',
        'examples': [
            'Yo oigo música todos los días.',
            'Ella escucha con atención.',
            'Ellos oyeron un ruido extraño.'
        ]
    },
    'play': {
        'spanish': 'jugar/tocar',
        'examples': [
            'Yo juego fútbol los fines de semana.',
            'Ella toca el piano.',
            'Ellos jugaron en el parque.'
        ]
    },
    'run': {
        'spanish': 'correr',
        'examples': [
            'Yo corro en el parque.',
            'Ella corre maratones.',
            'Ellos corrieron muy rápido.'
        ]
    },
    'move': {
        'spanish': 'mover/mudarse',
        'examples': [
            'Yo muevo los muebles.',
            'Ella se muda a otra ciudad.',
            'Ellos movieron las cajas.'
        ]
    },
    'live': {
        'spanish': 'vivir',
        'examples': [
            'Yo vivo en Madrid.',
            'Ella vive cerca del centro.',
            'Ellos vivieron en París.'
        ]
    },
    'believe': {
        'spanish': 'creer',
        'examples': [
            'Yo creo en ti.',
            'Ella cree en los milagros.',
            'Ellos creyeron la historia.'
        ]
    },
    'bring': {
        'spanish': 'traer',
        'examples': [
            'Yo traigo comida a la fiesta.',
            'Ella trae buenas noticias.',
            'Ellos trajeron regalos.'
        ]
    },
    'happen': {
        'spanish': 'suceder/pasar',
        'examples': [
            'Yo no sé qué sucede.',
            'Ella pregunta qué pasa.',
            'Ellos vieron qué sucedió.'
        ]
    },
    'write': {
        'spanish': 'escribir',
        'examples': [
            'Yo escribo en mi diario.',
            'Ella escribe novelas.',
            'Ellos escribieron una carta.'
        ]
    },
    'sit': {
        'spanish': 'sentarse',
        'examples': [
            'Yo me siento en la silla.',
            'Ella se sienta al frente.',
            'Ellos se sentaron juntos.'
        ]
    },
    'stand': {
        'spanish': 'estar de pie/pararse',
        'examples': [
            'Yo me paro cuando entra el profesor.',
            'Ella está de pie en la fila.',
            'Ellos se pararon para aplaudir.'
        ]
    },
    'lose': {
        'spanish': 'perder',
        'examples': [
            'Yo pierdo mis llaves a menudo.',
            'Ella pierde la paciencia.',
            'Ellos perdieron el partido.'
        ]
    },
    'pay': {
        'spanish': 'pagar',
        'examples': [
            'Yo pago la cuenta.',
            'Ella paga con tarjeta.',
            'Ellos pagaron en efectivo.'
        ]
    },
    'meet': {
        'spanish': 'conocer/encontrarse',
        'examples': [
            'Yo conozco a gente nueva.',
            'Ella se encuentra con amigos.',
            'Ellos se conocieron en la universidad.'
        ]
    },
    'include': {
        'spanish': 'incluir',
        'examples': [
            'Yo incluyo a todos.',
            'Ella incluye ejemplos.',
            'Ellos incluyeron más información.'
        ]
    },
    'continue': {
        'spanish': 'continuar/seguir',
        'examples': [
            'Yo continúo estudiando.',
            'Ella sigue trabajando.',
            'Ellos continuaron el viaje.'
        ]
    },
    'set': {
        'spanish': 'establecer/poner',
        'examples': [
            'Yo establezco metas.',
            'Ella pone la alarma.',
            'Ellos establecieron reglas.'
        ]
    },
    'learn': {
        'spanish': 'aprender',
        'examples': [
            'Yo aprendo inglés.',
            'Ella aprende rápido.',
            'Ellos aprendieron mucho.'
        ]
    },
    'change': {
        'spanish': 'cambiar',
        'examples': [
            'Yo cambio de opinión.',
            'Ella cambia de ropa.',
            'Ellos cambiaron de planes.'
        ]
    },
    'lead': {
        'spanish': 'liderar/conducir',
        'examples': [
            'Yo lidero el equipo.',
            'Ella conduce el proyecto.',
            'Ellos lideraron la marcha.'
        ]
    },
    'understand': {
        'spanish': 'entender/comprender',
        'examples': [
            'Yo entiendo la lección.',
            'Ella comprende el problema.',
            'Ellos entendieron todo.'
        ]
    },
    'watch': {
        'spanish': 'ver/mirar',
        'examples': [
            'Yo veo televisión por la noche.',
            'Ella mira películas.',
            'Ellos vieron el partido.'
        ]
    },
    'follow': {
        'spanish': 'seguir',
        'examples': [
            'Yo sigo las instrucciones.',
            'Ella sigue a sus ídolos.',
            'Ellos siguieron el mapa.'
        ]
    },
    'stop': {
        'spanish': 'parar/detener',
        'examples': [
            'Yo paro en el semáforo.',
            'Ella detiene el coche.',
            'Ellos pararon de hablar.'
        ]
    },
    'create': {
        'spanish': 'crear',
        'examples': [
            'Yo creo arte.',
            'Ella crea contenido.',
            'Ellos crearon una empresa.'
        ]
    },
    'speak': {
        'spanish': 'hablar',
        'examples': [
            'Yo hablo español e inglés.',
            'Ella habla con claridad.',
            'Ellos hablaron durante horas.'
        ]
    },
    'read': {
        'spanish': 'leer',
        'examples': [
            'Yo leo libros todos los días.',
            'Ella lee el periódico.',
            'Ellos leyeron la noticia.'
        ]
    },
    'spend': {
        'spanish': 'gastar/pasar (tiempo)',
        'examples': [
            'Yo gasto dinero en libros.',
            'Ella pasa tiempo con su familia.',
            'Ellos gastaron mucho.'
        ]
    },
    'grow': {
        'spanish': 'crecer',
        'examples': [
            'Yo crezco cada día.',
            'Ella crece rápido.',
            'Ellos crecieron juntos.'
        ]
    },
    'open': {
        'spanish': 'abrir',
        'examples': [
            'Yo abro la puerta.',
            'Ella abre la ventana.',
            'Ellos abrieron el regalo.'
        ]
    },
    'walk': {
        'spanish': 'caminar',
        'examples': [
            'Yo camino al trabajo.',
            'Ella camina en el parque.',
            'Ellos caminaron toda la noche.'
        ]
    },
    'win': {
        'spanish': 'ganar',
        'examples': [
            'Yo gano el juego.',
            'Ella gana dinero.',
            'Ellos ganaron el premio.'
        ]
    },
    'teach': {
        'spanish': 'enseñar',
        'examples': [
            'Yo enseño inglés.',
            'Ella enseña matemáticas.',
            'Ellos enseñaron historia.'
        ]
    },
    'offer': {
        'spanish': 'ofrecer',
        'examples': [
            'Yo ofrezco mi ayuda.',
            'Ella ofrece café.',
            'Ellos ofrecieron su casa.'
        ]
    },
    'remember': {
        'spanish': 'recordar',
        'examples': [
            'Yo recuerdo tu nombre.',
            'Ella recuerda todo.',
            'Ellos recordaron el evento.'
        ]
    },
    'consider': {
        'spanish': 'considerar',
        'examples': [
            'Yo considero todas las opciones.',
            'Ella considera la propuesta.',
            'Ellos consideraron la idea.'
        ]
    },
    'appear': {
        'spanish': 'aparecer',
        'examples': [
            'Yo aparezco en la foto.',
            'Ella aparece en la lista.',
            'Ellos aparecieron de repente.'
        ]
    },
    'buy': {
        'spanish': 'comprar',
        'examples': [
            'Yo compro comida en el mercado.',
            'Ella compra ropa nueva.',
            'Ellos compraron una casa.'
        ]
    },
    'serve': {
        'spanish': 'servir',
        'examples': [
            'Yo sirvo la comida.',
            'Ella sirve café.',
            'Ellos sirvieron el desayuno.'
        ]
    },
    'die': {
        'spanish': 'morir',
        'examples': [
            'Yo no quiero morir joven.',
            'Ella muere de risa.',
            'Ellos murieron en el accidente.'
        ]
    },
    'send': {
        'spanish': 'enviar/mandar',
        'examples': [
            'Yo envío mensajes.',
            'Ella manda cartas.',
            'Ellos enviaron el paquete.'
        ]
    },
    'build': {
        'spanish': 'construir',
        'examples': [
            'Yo construyo casas.',
            'Ella construye puentes.',
            'Ellos construyeron un edificio.'
        ]
    },
    'stay': {
        'spanish': 'quedarse/permanecer',
        'examples': [
            'Yo me quedo en casa.',
            'Ella permanece tranquila.',
            'Ellos se quedaron toda la noche.'
        ]
    },
    'fall': {
        'spanish': 'caer',
        'examples': [
            'Yo caigo al suelo.',
            'Ella cae enferma.',
            'Ellos cayeron en la trampa.'
        ]
    },
    'cut': {
        'spanish': 'cortar',
        'examples': [
            'Yo corto el papel.',
            'Ella corta el pelo.',
            'Ellos cortaron el árbol.'
        ]
    },
    'reach': {
        'spanish': 'alcanzar/llegar',
        'examples': [
            'Yo alcanzo mis metas.',
            'Ella llega a la cima.',
            'Ellos alcanzaron el objetivo.'
        ]
    },
    'kill': {
        'spanish': 'matar',
        'examples': [
            'Yo mato el tiempo.',
            'Ella mata mosquitos.',
            'Ellos mataron al villano.'
        ]
    },
    'raise': {
        'spanish': 'levantar/criar',
        'examples': [
            'Yo levanto la mano.',
            'Ella cría a sus hijos.',
            'Ellos levantaron fondos.'
        ]
    },
    'pass': {
        'spanish': 'pasar',
        'examples': [
            'Yo paso por tu casa.',
            'Ella pasa el examen.',
            'Ellos pasaron el tiempo juntos.'
        ]
    },
    'sell': {
        'spanish': 'vender',
        'examples': [
            'Yo vendo mi coche.',
            'Ella vende productos.',
            'Ellos vendieron la casa.'
        ]
    },
    'decide': {
        'spanish': 'decidir',
        'examples': [
            'Yo decido qué hacer.',
            'Ella decide rápido.',
            'Ellos decidieron viajar.'
        ]
    },
    'return': {
        'spanish': 'volver/regresar',
        'examples': [
            'Yo vuelvo a casa.',
            'Ella regresa mañana.',
            'Ellos volvieron tarde.'
        ]
    },
    'explain': {
        'spanish': 'explicar',
        'examples': [
            'Yo explico la lección.',
            'Ella explica bien.',
            'Ellos explicaron el problema.'
        ]
    },
    'hope': {
        'spanish': 'esperar (desear)',
        'examples': [
            'Yo espero que vengas.',
            'Ella espera buenas noticias.',
            'Ellos esperaron lo mejor.'
        ]
    },
    'develop': {
        'spanish': 'desarrollar',
        'examples': [
            'Yo desarrollo aplicaciones.',
            'Ella desarrolla ideas.',
            'Ellos desarrollaron un plan.'
        ]
    },
    'carry': {
        'spanish': 'llevar/cargar',
        'examples': [
            'Yo llevo mi mochila.',
            'Ella carga las bolsas.',
            'Ellos llevaron los paquetes.'
        ]
    },
    'break': {
        'spanish': 'romper',
        'examples': [
            'Yo rompo el papel.',
            'Ella rompe el silencio.',
            'Ellos rompieron el récord.'
        ]
    },
    'receive': {
        'spanish': 'recibir',
        'examples': [
            'Yo recibo mensajes.',
            'Ella recibe regalos.',
            'Ellos recibieron la noticia.'
        ]
    },
    'agree': {
        'spanish': 'estar de acuerdo',
        'examples': [
            'Yo estoy de acuerdo contigo.',
            'Ella está de acuerdo con la idea.',
            'Ellos estuvieron de acuerdo.'
        ]
    },
    'support': {
        'spanish': 'apoyar',
        'examples': [
            'Yo apoyo a mi equipo.',
            'Ella apoya la causa.',
            'Ellos apoyaron la propuesta.'
        ]
    },
    'hit': {
        'spanish': 'golpear/pegar',
        'examples': [
            'Yo golpeo la puerta.',
            'Ella pega la pelota.',
            'Ellos golpearon el blanco.'
        ]
    },
    'produce': {
        'spanish': 'producir',
        'examples': [
            'Yo produzco contenido.',
            'Ella produce música.',
            'Ellos produjeron una película.'
        ]
    },
    'eat': {
        'spanish': 'comer',
        'examples': [
            'Yo como frutas.',
            'Ella come saludable.',
            'Ellos comieron pizza.'
        ]
    },
    'cover': {
        'spanish': 'cubrir',
        'examples': [
            'Yo cubro la mesa.',
            'Ella cubre los gastos.',
            'Ellos cubrieron el evento.'
        ]
    },
    'catch': {
        'spanish': 'atrapar/coger',
        'examples': [
            'Yo atrapo la pelota.',
            'Ella coge el autobús.',
            'Ellos atraparon al ladrón.'
        ]
    },
    'draw': {
        'spanish': 'dibujar',
        'examples': [
            'Yo dibujo paisajes.',
            'Ella dibuja retratos.',
            'Ellos dibujaron un mapa.'
        ]
    },
    'choose': {
        'spanish': 'elegir/escoger',
        'examples': [
            'Yo elijo la opción A.',
            'Ella escoge con cuidado.',
            'Ellos eligieron el mejor.'
        ]
    },
    'wait': {
        'spanish': 'esperar',
        'examples': [
            'Yo espero el autobús.',
            'Ella espera pacientemente.',
            'Ellos esperaron mucho tiempo.'
        ]
    },
    'drive': {
        'spanish': 'conducir/manejar',
        'examples': [
            'Yo conduzco con cuidado.',
            'Ella maneja bien.',
            'Ellos condujeron toda la noche.'
        ]
    },
    'drop': {
        'spanish': 'dejar caer/soltar',
        'examples': [
            'Yo dejo caer el libro.',
            'Ella suelta la cuerda.',
            'Ellos dejaron caer la pelota.'
        ]
    },
    'plan': {
        'spanish': 'planear',
        'examples': [
            'Yo planeo mi día.',
            'Ella planea el viaje.',
            'Ellos planearon la fiesta.'
        ]
    },
    'pull': {
        'spanish': 'tirar/jalar',
        'examples': [
            'Yo tiro de la cuerda.',
            'Ella jala la puerta.',
            'Ellos tiraron del carro.'
        ]
    },
    'accept': {
        'spanish': 'aceptar',
        'examples': [
            'Yo acepto la oferta.',
            'Ella acepta el reto.',
            'Ellos aceptaron la invitación.'
        ]
    },
    'wear': {
        'spanish': 'usar/llevar puesto',
        'examples': [
            'Yo uso gafas.',
            'Ella lleva un vestido.',
            'Ellos usaron trajes.'
        ]
    },
    'allow': {
        'spanish': 'permitir',
        'examples': [
            'Yo permito la entrada.',
            'Ella permite que salgan.',
            'Ellos permitieron el acceso.'
        ]
    },
    'win': {
        'spanish': 'ganar',
        'examples': [
            'Yo gano la competencia.',
            'Ella gana siempre.',
            'Ellos ganaron el torneo.'
        ]
    },
    'throw': {
        'spanish': 'lanzar/tirar',
        'examples': [
            'Yo lanzo la pelota.',
            'Ella tira la basura.',
            'Ellos lanzaron piedras.'
        ]
    },
    'cry': {
        'spanish': 'llorar',
        'examples': [
            'Yo lloro de emoción.',
            'Ella llora a menudo.',
            'Ellos lloraron de alegría.'
        ]
    },
    'hang': {
        'spanish': 'colgar',
        'examples': [
            'Yo cuelgo el cuadro.',
            'Ella cuelga la ropa.',
            'Ellos colgaron el cartel.'
        ]
    },
    'blow': {
        'spanish': 'soplar',
        'examples': [
            'Yo soplo las velas.',
            'Ella sopla el polvo.',
            'Ellos soplaron el silbato.'
        ]
    },
    'ride': {
        'spanish': 'montar',
        'examples': [
            'Yo monto en bicicleta.',
            'Ella monta a caballo.',
            'Ellos montaron en moto.'
        ]
    },
    'fly': {
        'spanish': 'volar',
        'examples': [
            'Yo vuelo a España.',
            'Ella vuela alto.',
            'Ellos volaron en avión.'
        ]
    },
    'sing': {
        'spanish': 'cantar',
        'examples': [
            'Yo canto en la ducha.',
            'Ella canta muy bien.',
            'Ellos cantaron juntos.'
        ]
    },
    'dance': {
        'spanish': 'bailar',
        'examples': [
            'Yo bailo salsa.',
            'Ella baila ballet.',
            'Ellos bailaron toda la noche.'
        ]
    },
    'swim': {
        'spanish': 'nadar',
        'examples': [
            'Yo nado en la piscina.',
            'Ella nada muy rápido.',
            'Ellos nadaron en el mar.'
        ]
    },
    'sleep': {
        'spanish': 'dormir',
        'examples': [
            'Yo duermo 8 horas.',
            'Ella duerme profundamente.',
            'Ellos durmieron bien.'
        ]
    },
    'wake': {
        'spanish': 'despertar',
        'examples': [
            'Yo me despierto temprano.',
            'Ella despierta a las 6.',
            'Ellos despertaron tarde.'
        ]
    },
    'laugh': {
        'spanish': 'reír',
        'examples': [
            'Yo río mucho.',
            'Ella ríe con ganas.',
            'Ellos rieron a carcajadas.'
        ]
    },
    'smile': {
        'spanish': 'sonreír',
        'examples': [
            'Yo sonrío siempre.',
            'Ella sonríe mucho.',
            'Ellos sonrieron felices.'
        ]
    },
    'cook': {
        'spanish': 'cocinar',
        'examples': [
            'Yo cocino la cena.',
            'Ella cocina muy bien.',
            'Ellos cocinaron juntos.'
        ]
    },
    'clean': {
        'spanish': 'limpiar',
        'examples': [
            'Yo limpio mi cuarto.',
            'Ella limpia la casa.',
            'Ellos limpiaron todo.'
        ]
    },
    'wash': {
        'spanish': 'lavar',
        'examples': [
            'Yo lavo los platos.',
            'Ella lava la ropa.',
            'Ellos lavaron el coche.'
        ]
    },
    'drink': {
        'spanish': 'beber',
        'examples': [
            'Yo bebo agua.',
            'Ella bebe café.',
            'Ellos bebieron vino.'
        ]
    },
    'study': {
        'spanish': 'estudiar',
        'examples': [
            'Yo estudio inglés.',
            'Ella estudia medicina.',
            'Ellos estudiaron toda la noche.'
        ]
    },
    'love': {
        'spanish': 'amar',
        'examples': [
            'Yo amo a mi familia.',
            'Ella ama la música.',
            'Ellos amaron la película.'
        ]
    },
    'hate': {
        'spanish': 'odiar',
        'examples': [
            'Yo odio el frío.',
            'Ella odia las mentiras.',
            'Ellos odiaron la comida.'
        ]
    },
    'like': {
        'spanish': 'gustar',
        'examples': [
            'Me gusta el chocolate.',
            'A ella le gusta leer.',
            'A ellos les gustó la película.'
        ]
    },
    'prefer': {
        'spanish': 'preferir',
        'examples': [
            'Yo prefiero el té.',
            'Ella prefiere el café.',
            'Ellos prefirieron quedarse.'
        ]
    },
    'wish': {
        'spanish': 'desear',
        'examples': [
            'Yo deseo viajar.',
            'Ella desea éxito.',
            'Ellos desearon suerte.'
        ]
    },
    'dream': {
        'spanish': 'soñar',
        'examples': [
            'Yo sueño con volar.',
            'Ella sueña despierta.',
            'Ellos soñaron con el futuro.'
        ]
    },
}

def generate_spanish_examples(english_verb, spanish_verb, verb_info=None):
    """Genera ejemplos en español correctamente conjugados"""
    
    # Si tenemos ejemplos predefinidos, usarlos
    if english_verb in VERB_EXAMPLES:
        return VERB_EXAMPLES[english_verb]['examples']
    
    # Si tenemos info de conjugación del dataset, generar ejemplos
    if verb_info:
        form_1s = verb_info.get('form_1s', spanish_verb)
        form_3s = verb_info.get('form_3s', spanish_verb)
        form_3p = verb_info.get('form_3p', spanish_verb)
        
        return [
            f"Yo {form_1s} todos los días.",
            f"Ella {form_3s} a menudo.",
            f"Ellos {form_3p} ayer."
        ]
    
    # Fallback: ejemplos genéricos
    return [
        f"Yo {spanish_verb} frecuentemente.",
        f"Ella {spanish_verb} bien.",
        f"Ellos {spanish_verb} juntos."
    ]

# Actualizar base de datos
def update_verbs_in_database(eng_to_spa_map, database_url):
    """Actualiza las traducciones y ejemplos de verbos en la base de datos"""
    
    print(f"Conectando a la base de datos...")
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    # Obtener todos los verbos actuales
    cursor.execute('SELECT id, "infinitive", "spanishTranslation" FROM "Verb"')
    db_verbs = cursor.fetchall()
    
    print(f"Encontrados {len(db_verbs)} verbos en la base de datos")
    
    updates = []
    not_found = []
    
    for verb_id, infinitive, current_spanish in db_verbs:
        infinitive_clean = infinitive.lower().strip()
        
        # Buscar en el mapeo o usar ejemplos predefinidos
        verb_info = eng_to_spa_map.get(infinitive_clean)
        
        if verb_info or infinitive_clean in VERB_EXAMPLES:
            # Obtener traducción al español
            if infinitive_clean in VERB_EXAMPLES:
                spanish_verb = VERB_EXAMPLES[infinitive_clean]['spanish']
            elif verb_info:
                spanish_verb = verb_info['spanish']
            else:
                spanish_verb = current_spanish
            
            # Generar ejemplos correctos
            spanish_examples = generate_spanish_examples(infinitive_clean, spanish_verb, verb_info)
            
            updates.append((
                spanish_verb,
                json.dumps(spanish_examples),
                verb_id
            ))
        else:
            not_found.append(infinitive)
    
    print(f"\nVerbos a actualizar: {len(updates)}")
    print(f"Verbos no encontrados: {len(not_found)}")
    
    if not_found:
        print(f"\nPrimeros 20 verbos no encontrados: {not_found[:20]}")
    
    # Actualizar en lotes
    if updates:
        print(f"\nActualizando {len(updates)} verbos...")
        update_query = '''
            UPDATE "Verb"
            SET "spanishTranslation" = %s,
                "spanishExamples" = %s::jsonb
            WHERE id = %s
        '''
        
        execute_batch(cursor, update_query, updates, page_size=100)
        conn.commit()
        print(f"✅ Actualización completada exitosamente!")
    
    cursor.close()
    conn.close()
    
    return len(updates), len(not_found), not_found

# Main
if __name__ == '__main__':
    print("=" * 70)
    print("CORRECCIÓN DE TRADUCCIONES Y EJEMPLOS DE VERBOS")
    print("=" * 70)
    
    # Cargar variables de entorno
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ ERROR: No se encontró DATABASE_URL en .env")
        exit(1)
    
    print(f"\n✅ DATABASE_URL cargada correctamente")
    
    # Cargar dataset de verbos
    jehle_csv = '/home/ubuntu/jehle_verbs.csv'
    print(f"\n📚 Cargando dataset de verbos desde {jehle_csv}...")
    verbs_dict = load_jehle_verbs(jehle_csv)
    print(f"✅ Cargados {len(verbs_dict)} verbos del dataset de Jehle")
    
    # Crear mapeo inglés -> español
    print(f"\n🔄 Creando mapeo inglés -> español...")
    eng_to_spa_map = create_english_to_spanish_map(verbs_dict)
    print(f"✅ Mapeo creado con {len(eng_to_spa_map)} verbos")
    print(f"✅ Ejemplos predefinidos: {len(VERB_EXAMPLES)} verbos comunes")
    
    # Actualizar base de datos
    print(f"\n🔄 Iniciando actualización de base de datos...")
    updated, not_found_count, not_found_list = update_verbs_in_database(eng_to_spa_map, database_url)
    
    # Resumen
    print("\n" + "=" * 70)
    print("RESUMEN DE ACTUALIZACIÓN")
    print("=" * 70)
    print(f"✅ Verbos actualizados: {updated}")
    print(f"⚠️  Verbos no encontrados: {not_found_count}")
    
    if not_found_count > 0:
        output_file = '/home/ubuntu/github_repos/english_master_pro_improved/scripts/verbs_not_found.txt'
        print(f"\nVerbos no encontrados guardados en: {output_file}")
        with open(output_file, 'w') as f:
            for verb in not_found_list:
                f.write(f"{verb}\n")
    
    print("\n✅ Proceso completado!")
    print("\nNOTA: Los verbos actualizados ahora tienen:")
    print("  - Traducciones correctas al español")
    print("  - Ejemplos correctamente conjugados en español")

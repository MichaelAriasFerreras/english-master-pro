#!/usr/bin/env python3
"""
Script para corregir las traducciones de verbos en la base de datos Neon PostgreSQL
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
    """Carga el dataset de verbos y extrae información única por infinitivo"""
    verbs_dict = {}
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            infinitive = row['infinitive'].lower().strip()
            infinitive_english = row['infinitive_english'].strip()
            
            # Solo guardar la primera ocurrencia (presente indicativo)
            if infinitive not in verbs_dict:
                verbs_dict[infinitive] = {
                    'spanish': infinitive,
                    'english': infinitive_english,
                    'translation': infinitive_english.replace('to ', '').split(',')[0].strip()
                }
    
    return verbs_dict

# Generar descripción y ejemplo en español
def generate_spanish_content(verb_info):
    """Genera descripción y ejemplo en español para un verbo"""
    spanish_verb = verb_info['spanish']
    english_translation = verb_info['translation']
    
    # Descripción básica
    description = f"Verbo que significa '{english_translation}' en inglés."
    
    # Ejemplos comunes según el verbo
    examples = {
        'ser': 'Yo soy estudiante. / I am a student.',
        'estar': 'Estoy en casa. / I am at home.',
        'tener': 'Tengo un libro. / I have a book.',
        'hacer': 'Hago mi tarea. / I do my homework.',
        'ir': 'Voy a la escuela. / I go to school.',
        'poder': 'Puedo ayudarte. / I can help you.',
        'decir': 'Digo la verdad. / I tell the truth.',
        'dar': 'Doy un regalo. / I give a gift.',
        'saber': 'Sé la respuesta. / I know the answer.',
        'querer': 'Quiero aprender. / I want to learn.',
        'ver': 'Veo la televisión. / I watch TV.',
        'llegar': 'Llego temprano. / I arrive early.',
        'pasar': 'Paso tiempo con amigos. / I spend time with friends.',
        'deber': 'Debo estudiar. / I must study.',
        'poner': 'Pongo la mesa. / I set the table.',
        'parecer': 'Parece interesante. / It seems interesting.',
        'quedar': 'Quedo en casa. / I stay at home.',
        'creer': 'Creo en ti. / I believe in you.',
        'hablar': 'Hablo español. / I speak Spanish.',
        'llevar': 'Llevo una mochila. / I carry a backpack.',
        'dejar': 'Dejo mis llaves aquí. / I leave my keys here.',
        'seguir': 'Sigo estudiando. / I keep studying.',
        'encontrar': 'Encuentro mi libro. / I find my book.',
        'llamar': 'Llamo a mi amigo. / I call my friend.',
        'venir': 'Vengo mañana. / I come tomorrow.',
        'pensar': 'Pienso en ti. / I think about you.',
        'salir': 'Salgo de casa. / I leave home.',
        'volver': 'Vuelvo pronto. / I return soon.',
        'tomar': 'Tomo café. / I drink coffee.',
        'conocer': 'Conozco a María. / I know María.',
        'vivir': 'Vivo en Madrid. / I live in Madrid.',
        'sentir': 'Siento frío. / I feel cold.',
        'tratar': 'Trato de ayudar. / I try to help.',
        'mirar': 'Miro la película. / I watch the movie.',
        'contar': 'Cuento una historia. / I tell a story.',
        'empezar': 'Empiezo a trabajar. / I start working.',
        'esperar': 'Espero el autobús. / I wait for the bus.',
        'buscar': 'Busco mis llaves. / I look for my keys.',
        'existir': 'Existe una solución. / A solution exists.',
        'entrar': 'Entro en la casa. / I enter the house.',
        'trabajar': 'Trabajo todos los días. / I work every day.',
        'escribir': 'Escribo una carta. / I write a letter.',
        'perder': 'Pierdo mi teléfono. / I lose my phone.',
        'producir': 'Produzco contenido. / I produce content.',
        'ocurrir': 'Ocurre algo extraño. / Something strange happens.',
        'entender': 'Entiendo la lección. / I understand the lesson.',
        'pedir': 'Pido ayuda. / I ask for help.',
        'recibir': 'Recibo un mensaje. / I receive a message.',
        'recordar': 'Recuerdo tu nombre. / I remember your name.',
        'terminar': 'Termino mi trabajo. / I finish my work.',
        'permitir': 'Permito la entrada. / I allow entry.',
        'aparecer': 'Aparezco en la foto. / I appear in the photo.',
        'conseguir': 'Consigo un trabajo. / I get a job.',
        'comenzar': 'Comienzo el proyecto. / I begin the project.',
        'servir': 'Sirvo la comida. / I serve the food.',
        'sacar': 'Saco buenas notas. / I get good grades.',
        'necesitar': 'Necesito tu ayuda. / I need your help.',
        'mantener': 'Mantengo la calma. / I keep calm.',
        'resultar': 'Resulta difícil. / It turns out difficult.',
        'leer': 'Leo un libro. / I read a book.',
        'caer': 'Caigo al suelo. / I fall to the ground.',
        'cambiar': 'Cambio de opinión. / I change my mind.',
        'presentar': 'Presento mi proyecto. / I present my project.',
        'crear': 'Creo arte. / I create art.',
        'abrir': 'Abro la puerta. / I open the door.',
        'considerar': 'Considero la opción. / I consider the option.',
        'oír': 'Oigo música. / I hear music.',
        'acabar': 'Acabo mi tarea. / I finish my homework.',
        'suponer': 'Supongo que sí. / I suppose so.',
        'comprender': 'Comprendo el problema. / I understand the problem.',
        'lograr': 'Logro mi objetivo. / I achieve my goal.',
        'explicar': 'Explico la lección. / I explain the lesson.',
        'reconocer': 'Reconozco tu voz. / I recognize your voice.',
        'estudiar': 'Estudio inglés. / I study English.',
        'aprender': 'Aprendo rápido. / I learn quickly.',
        'enseñar': 'Enseño matemáticas. / I teach mathematics.',
        'jugar': 'Juego fútbol. / I play soccer.',
        'correr': 'Corro en el parque. / I run in the park.',
        'comer': 'Como pizza. / I eat pizza.',
        'beber': 'Bebo agua. / I drink water.',
        'dormir': 'Duermo bien. / I sleep well.',
        'despertar': 'Me despierto temprano. / I wake up early.',
        'lavar': 'Lavo los platos. / I wash the dishes.',
        'limpiar': 'Limpio mi cuarto. / I clean my room.',
        'cocinar': 'Cocino la cena. / I cook dinner.',
        'comprar': 'Compro comida. / I buy food.',
        'vender': 'Vendo mi coche. / I sell my car.',
        'pagar': 'Pago la cuenta. / I pay the bill.',
        'ganar': 'Gano dinero. / I earn money.',
        'amar': 'Amo a mi familia. / I love my family.',
        'odiar': 'Odio el frío. / I hate the cold.',
        'gustar': 'Me gusta el chocolate. / I like chocolate.',
        'preferir': 'Prefiero el té. / I prefer tea.',
        'desear': 'Deseo viajar. / I wish to travel.',
        'soñar': 'Sueño con volar. / I dream of flying.',
        'reír': 'Río mucho. / I laugh a lot.',
        'llorar': 'Lloro de alegría. / I cry with joy.',
        'cantar': 'Canto una canción. / I sing a song.',
        'bailar': 'Bailo salsa. / I dance salsa.',
        'nadar': 'Nado en la piscina. / I swim in the pool.',
        'caminar': 'Camino al trabajo. / I walk to work.',
        'volar': 'Vuelo a España. / I fly to Spain.',
        'conducir': 'Conduzco un coche. / I drive a car.',
        'montar': 'Monto en bicicleta. / I ride a bicycle.',
        'subir': 'Subo las escaleras. / I go up the stairs.',
        'bajar': 'Bajo del autobús. / I get off the bus.',
        'cerrar': 'Cierro la ventana. / I close the window.',
        'romper': 'Rompo el papel. / I break the paper.',
        'construir': 'Construyo una casa. / I build a house.',
        'destruir': 'Destruyo el documento. / I destroy the document.',
        'reparar': 'Reparo mi bicicleta. / I repair my bicycle.',
        'usar': 'Uso mi teléfono. / I use my phone.',
        'tocar': 'Toco la guitarra. / I play the guitar.',
        'escuchar': 'Escucho música. / I listen to music.',
        'observar': 'Observo las estrellas. / I observe the stars.',
        'notar': 'Noto la diferencia. / I notice the difference.',
        'sentarse': 'Me siento en la silla. / I sit on the chair.',
        'levantarse': 'Me levanto temprano. / I get up early.',
        'acostarse': 'Me acuesto tarde. / I go to bed late.',
        'vestirse': 'Me visto rápido. / I get dressed quickly.',
        'bañarse': 'Me baño por la mañana. / I bathe in the morning.',
        'peinarse': 'Me peino el cabello. / I comb my hair.',
        'maquillarse': 'Me maquillo para salir. / I put on makeup to go out.',
        'afeitarse': 'Me afeito la barba. / I shave my beard.',
        'cepillarse': 'Me cepillo los dientes. / I brush my teeth.',
        'lavarse': 'Me lavo las manos. / I wash my hands.',
    }
    
    # Si el verbo está en los ejemplos predefinidos, usarlo
    if spanish_verb in examples:
        example = examples[spanish_verb]
    else:
        # Generar ejemplo genérico
        example = f"Yo {spanish_verb}. / I {english_translation}."
    
    return description, example

# Conectar a la base de datos y actualizar verbos
def update_verbs_in_database(verbs_dict, database_url):
    """Actualiza las traducciones de verbos en la base de datos"""
    
    print(f"Conectando a la base de datos...")
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    # Obtener todos los verbos actuales de la base de datos
    cursor.execute('SELECT id, "infinitive" FROM "Verb"')
    db_verbs = cursor.fetchall()
    
    print(f"Encontrados {len(db_verbs)} verbos en la base de datos")
    
    updates = []
    not_found = []
    
    for verb_id, infinitive in db_verbs:
        infinitive_clean = infinitive.lower().strip()
        
        if infinitive_clean in verbs_dict:
            verb_info = verbs_dict[infinitive_clean]
            description, example = generate_spanish_content(verb_info)
            
            updates.append((
                verb_info['translation'],  # translation
                description,               # description
                example,                   # example
                verb_id                    # id (para WHERE)
            ))
        else:
            not_found.append(infinitive)
    
    print(f"\nVerbos a actualizar: {len(updates)}")
    print(f"Verbos no encontrados en dataset: {len(not_found)}")
    
    if not_found:
        print(f"\nPrimeros 10 verbos no encontrados: {not_found[:10]}")
    
    # Actualizar en lotes
    if updates:
        print(f"\nActualizando {len(updates)} verbos...")
        update_query = '''
            UPDATE "Verb"
            SET "translation" = %s,
                "description" = %s,
                "example" = %s
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
    print("=" * 60)
    print("CORRECCIÓN DE TRADUCCIONES DE VERBOS")
    print("=" * 60)
    
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
    print(f"✅ Cargados {len(verbs_dict)} verbos únicos del dataset")
    
    # Actualizar base de datos
    print(f"\n🔄 Iniciando actualización de base de datos...")
    updated, not_found_count, not_found_list = update_verbs_in_database(verbs_dict, database_url)
    
    # Resumen
    print("\n" + "=" * 60)
    print("RESUMEN DE ACTUALIZACIÓN")
    print("=" * 60)
    print(f"✅ Verbos actualizados: {updated}")
    print(f"⚠️  Verbos no encontrados: {not_found_count}")
    
    if not_found_count > 0:
        print(f"\nVerbos no encontrados guardados en: /home/ubuntu/github_repos/english_master_pro_improved/scripts/verbs_not_found.txt")
        with open('/home/ubuntu/github_repos/english_master_pro_improved/scripts/verbs_not_found.txt', 'w') as f:
            for verb in not_found_list:
                f.write(f"{verb}\n")
    
    print("\n✅ Proceso completado!")

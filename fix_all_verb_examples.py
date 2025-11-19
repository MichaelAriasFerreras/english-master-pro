#!/usr/bin/env python3
import json
import os
import sys
import time
import re
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import abacusai

# Initialize Abacus AI client
client = abacusai.ApiClient()

# Database connection from env
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("❌ DATABASE_URL no encontrada en el entorno")
    sys.exit(1)

# Bad example patterns
BAD_PATTERNS = [
    r'^I \w+ every day\.?$',
    r'^She \w+ in the morning\.?$',
    r'^She \w+ often\.?$',
    r'^He \w+ yesterday\.?$',
    r'^They \w+ yesterday\.?$',
    r'^They \w+ now\.?$',
    r'^We have \w+ before\.?$',
    r'are \w+ing now\.?$'
]

def has_bad_examples(examples: List[str]) -> bool:
    """Check if examples contain bad patterns"""
    for example in examples:
        for pattern in BAD_PATTERNS:
            if re.search(pattern, example, re.IGNORECASE):
                return True
    return False

def get_db_connection():
    """Create database connection"""
    return psycopg2.connect(DATABASE_URL)

def get_verbs_to_fix():
    """Get all verbs with bad examples"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT id, infinitive, "thirdPersonSingular", "presentParticiple", 
               "simplePast", "pastParticiple", "spanishTranslation", 
               level, "isIrregular", examples
        FROM "Verb"
        ORDER BY infinitive
    """)
    
    all_verbs = cur.fetchall()
    conn.close()
    
    # Filter verbs with bad examples
    verbs_to_fix = []
    for verb in all_verbs:
        if verb['examples'] and isinstance(verb['examples'], list):
            if has_bad_examples(verb['examples']):
                verbs_to_fix.append(dict(verb))
    
    return verbs_to_fix, len(all_verbs)

def generate_examples_for_batch(verbs: List[Dict], batch_num: int, total_batches: int) -> List[Dict]:
    """Generate examples for a batch of verbs using Abacus.AI"""
    print(f"\n🤖 Generando ejemplos para lote {batch_num}/{total_batches} ({len(verbs)} verbos)...", flush=True)
    
    verbs_info = []
    for v in verbs:
        verbs_info.append({
            'infinitive': v['infinitive'],
            'conjugations': {
                'thirdPersonSingular': v['thirdPersonSingular'],
                'presentParticiple': v['presentParticiple'],
                'simplePast': v['simplePast'],
                'pastParticiple': v['pastParticiple']
            },
            'spanishTranslation': v['spanishTranslation'],
            'level': v['level'],
            'isIrregular': v['isIrregular']
        })
    
    prompt = f"""You are an expert English teacher creating educational examples for English learners.

Generate 3 perfect, natural English example sentences for each verb below. The examples MUST:
1. Be grammatically PERFECT and sound completely natural to native English speakers
2. Show the verb in realistic, meaningful contexts (NOT generic phrases like "I verb every day")
3. Be appropriate for the CEFR level indicated
4. Use different tenses/forms when appropriate
5. Be clear and educational for Spanish speakers learning English

CRITICAL: Examples must make complete sense. NO generic patterns like:
- "I [verb] every day" ❌
- "She [verbs] often" ❌  
- "They [verb] yesterday" ❌

Instead, create REAL, NATURAL sentences like:
- "She finally decided to pursue her dreams" ✅
- "The cat jumped over the fence" ✅
- "I have been studying English for two years" ✅

Return ONLY a valid JSON array with this EXACT structure (no extra text, no markdown):
[
  {{
    "infinitive": "abandon",
    "examples": [
      "They had to abandon the ship during the storm",
      "Never abandon your dreams, no matter how difficult",
      "The project was abandoned due to lack of funding"
    ]
  }}
]

Verbs to process:
{json.dumps(verbs_info, indent=2)}"""

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.evaluate_prompt(
                prompt=prompt,
                llm_name='GPT4_TURBO',
                temperature=0.3,
                max_tokens=4000
            )
            
            content = response.content
            
            # Extract JSON from response
            # Remove markdown code blocks if present
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```\s*', '', content)
            content = content.strip()
            
            # Find JSON array
            json_match = re.search(r'\[[\s\S]*\]', content)
            if not json_match:
                raise Exception('No JSON array found in response')
            
            results = json.loads(json_match.group(0))
            print(f"✅ Ejemplos generados exitosamente para {len(results)} verbos", flush=True)
            return results
            
        except Exception as e:
            print(f"⚠️ Error en intento {attempt + 1}/{max_retries}: {str(e)}", flush=True)
            if attempt == max_retries - 1:
                print(f"❌ Error generating examples después de {max_retries} intentos", flush=True)
                raise
            time.sleep(3)  # Wait before retry

def update_verb_examples(verb_id: str, examples: List[str]):
    """Update verb examples in database"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        UPDATE "Verb"
        SET examples = %s
        WHERE id = %s
    """, (json.dumps(examples), verb_id))
    
    conn.commit()
    conn.close()

def main():
    print('🚀 Iniciando corrección de ejemplos de verbos...\n')
    
    # Get verbs to fix
    verbs_to_fix, total_verbs = get_verbs_to_fix()
    
    print(f"📊 Estadísticas:")
    print(f"   Total de verbos: {total_verbs}")
    print(f"   Verbos a corregir: {len(verbs_to_fix)}")
    print(f"   Verbos correctos: {total_verbs - len(verbs_to_fix)}\n")
    
    if len(verbs_to_fix) == 0:
        print('✅ ¡Todos los verbos ya tienen ejemplos correctos!')
        return
    
    # Process in batches
    batch_size = 10
    batches = [verbs_to_fix[i:i+batch_size] for i in range(0, len(verbs_to_fix), batch_size)]
    
    print(f"📦 Procesando {len(batches)} lotes de ~{batch_size} verbos cada uno...\n")
    
    total_updated = 0
    total_errors = 0
    
    for i, batch in enumerate(batches):
        try:
            results = generate_examples_for_batch(batch, i + 1, len(batches))
            
            # Update database
            for result in results:
                try:
                    verb = next((v for v in batch if v['infinitive'] == result['infinitive']), None)
                    if verb and result.get('examples') and len(result['examples']) > 0:
                        update_verb_examples(verb['id'], result['examples'])
                        total_updated += 1
                        print(f"  ✓ {result['infinitive']}")
                except Exception as update_error:
                    print(f"  ⚠️ Error actualizando {result.get('infinitive', '?')}: {str(update_error)}")
                    total_errors += 1
            
            print(f"\n📊 Progreso: {total_updated}/{len(verbs_to_fix)} verbos actualizados")
            
            # Add delay to avoid rate limiting
            if i < len(batches) - 1:
                time.sleep(2)
                
        except Exception as batch_error:
            print(f"❌ Error en lote {i + 1}: {str(batch_error)}")
            total_errors += 1
            # Continue with next batch
    
    print(f"\n{'=' * 60}")
    print(f"✅ Proceso completado!")
    print(f"   Verbos actualizados: {total_updated}")
    print(f"   Errores: {total_errors}")
    print(f"{'=' * 60}\n")

if __name__ == '__main__':
    main()

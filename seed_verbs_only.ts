import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedVerbs() {
  try {
    console.log('🎯 Iniciando inserción de verbos...');
    
    // Load verbs data (try different file names)
    let verbsPath = path.join(process.cwd(), 'data', 'verbs_data.json');
    if (!fs.existsSync(verbsPath)) {
      verbsPath = path.join(process.cwd(), 'data', 'final_expanded_verbs_data.json');
    }
    
    console.log(`📁 Leyendo: ${verbsPath}`);
    const verbsData = JSON.parse(fs.readFileSync(verbsPath, 'utf-8'));
    
    // Get verbs array (handle different structures)
    const verbs = verbsData.verbs || verbsData;
    console.log(`📚 Cargados ${verbs.length} verbos del archivo`);
    
    // Check current count
    const currentCount = await prisma.verb.count();
    console.log(`📊 Verbos actuales en BD: ${currentCount}`);
    
    if (currentCount >= verbs.length) {
      console.log('✅ Los verbos ya están insertados');
      return;
    }
    
    console.log('⏳ Insertando verbos (esto puede tomar unos minutos)...');
    
    // Insert one by one with progress
    let inserted = 0;
    let skipped = 0;
    
    for (let i = 0; i < verbs.length; i++) {
      const verb = verbs[i];
      
      try {
        // Handle different property names
        const infinitive = verb.infinitive || verb.base;
        const simplePast = verb.simplePast || verb.simple_past || verb.past;
        const pastParticiple = verb.pastParticiple || verb.past_participle;
        const translation = verb.translation || verb.spanish || '';
        const examples = verb.examples || [];
        
        if (!infinitive || !simplePast || !pastParticiple) {
          console.log(`  ⚠️ Verbo incompleto en posición ${i}, saltando...`);
          skipped++;
          continue;
        }
        
        await prisma.verb.upsert({
          where: { infinitive: infinitive },
          update: {
            simplePast: simplePast,
            pastParticiple: pastParticiple,
            translation: translation,
            examples: examples,
          },
          create: {
            infinitive: infinitive,
            simplePast: simplePast,
            pastParticiple: pastParticiple,
            translation: translation,
            examples: examples,
          },
        });
        
        inserted++;
        
        if (inserted % 10 === 0) {
          console.log(`  ✓ Insertados ${inserted}/${verbs.length} verbos...`);
        }
      } catch (error) {
        console.error(`  ⚠️ Error insertando verbo en posición ${i}:`, error.message);
        skipped++;
      }
    }
    
    console.log(`\n✅ Proceso completado:`);
    console.log(`   ✓ ${inserted} verbos insertados`);
    console.log(`   ⚠️ ${skipped} verbos saltados`);
    
    // Verify
    const finalCount = await prisma.verb.count();
    console.log(`📊 Total de verbos en BD: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedVerbs();

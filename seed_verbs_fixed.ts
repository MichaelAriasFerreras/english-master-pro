import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedVerbs() {
  try {
    console.log('🎯 Iniciando inserción de verbos en Neon...');
    
    // Load verbs data
    const verbsPath = path.join(process.cwd(), 'data', 'verbs_data.json');
    console.log(`📁 Leyendo: ${verbsPath}`);
    const verbsData = JSON.parse(fs.readFileSync(verbsPath, 'utf-8'));
    
    console.log(`📚 Cargados ${verbsData.length} verbos del archivo`);
    
    // Check current count
    const currentCount = await prisma.verb.count();
    console.log(`📊 Verbos actuales en BD Neon: ${currentCount}`);
    
    console.log('⏳ Insertando verbos...');
    
    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    
    for (let i = 0; i < verbsData.length; i++) {
      const verb = verbsData[i];
      
      try {
        const infinitive = verb.infinitive;
        const simplePast = verb.conjugations?.simple_past;
        const pastParticiple = verb.conjugations?.past_participle;
        const translation = verb.spanish_translation || '';
        const examples = verb.example_sentences || [];
        
        if (!infinitive || !simplePast || !pastParticiple) {
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
        
        if (inserted % 50 === 0) {
          console.log(`  ✓ Insertados ${inserted}/${verbsData.length} verbos...`);
        }
      } catch (error) {
        errors++;
        if (errors < 5) {
          console.error(`  ⚠️ Error en verbo ${i}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Proceso completado:`);
    console.log(`   ✓ ${inserted} verbos insertados exitosamente`);
    console.log(`   ⚠️ ${skipped} verbos incompletos (saltados)`);
    console.log(`   ❌ ${errors} errores de inserción`);
    
    // Verify final count
    const finalCount = await prisma.verb.count();
    console.log(`\n📊 Total de verbos en BD Neon: ${finalCount}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 ¡Base de datos de Neon poblada con éxito!');
    }
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedVerbs();

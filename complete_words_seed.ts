import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface DictionaryData {
  levels: {
    [key: string]: {
      words: Array<{
        english: string;
        spanish: string;
        pronunciation?: string;
        part_of_speech?: string;
        definition?: string;
        examples?: string[];
      }>;
    };
  };
}

async function completeWordsSeed() {
  try {
    console.log('📚 Insertando palabras faltantes en Neon...');
    
    const dictPath = path.join(process.cwd(), 'data', 'dictionary_data.json');
    const dictData: DictionaryData = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
    
    // Get current words in DB
    const existingWords = await prisma.word.findMany({
      select: { english: true }
    });
    const existingSet = new Set(existingWords.map(w => w.english.toLowerCase()));
    
    console.log(`📊 Palabras existentes en BD: ${existingSet.size}`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const levelKey in dictData.levels) {
      const level = dictData.levels[levelKey];
      
      for (const word of level.words) {
        if (existingSet.has(word.english.toLowerCase())) {
          skipped++;
          continue;
        }
        
        try {
          await prisma.word.create({
            data: {
              english: word.english,
              spanish: word.spanish,
              pronunciation: word.pronunciation || '',
              partOfSpeech: word.part_of_speech || 'noun',
              definition: word.definition || '',
              examples: word.examples || [],
              level: levelKey,
            },
          });
          
          existingSet.add(word.english.toLowerCase());
          inserted++;
          
          if (inserted % 50 === 0) {
            console.log(`  ✓ Insertadas ${inserted} palabras nuevas...`);
          }
        } catch (error) {
          // Skip duplicates
        }
      }
    }
    
    const finalCount = await prisma.word.count();
    console.log(`\n✅ Proceso completado:`);
    console.log(`   ✓ ${inserted} palabras nuevas insertadas`);
    console.log(`   ⚠️ ${skipped} palabras ya existían`);
    console.log(`\n📊 Total de palabras en BD Neon: ${finalCount}`);
    
    if (finalCount >= 1000) {
      console.log('\n🎉 ¡Base de datos completa!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeWordsSeed();

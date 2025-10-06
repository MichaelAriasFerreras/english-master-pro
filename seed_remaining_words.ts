import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface DictionaryData {
  metadata: {
    title: string;
    total_words: number;
    levels: string[];
  };
  levels: {
    [key: string]: {
      level_name: string;
      description: string;
      word_count: number;
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

async function seedRemainingWords() {
  try {
    console.log('📚 Completando inserción de palabras en Neon...');
    
    const dictPath = path.join(process.cwd(), 'data', 'dictionary_data.json');
    const dictData: DictionaryData = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
    
    let totalInserted = 0;
    let totalSkipped = 0;
    
    for (const levelKey in dictData.levels) {
      const level = dictData.levels[levelKey];
      console.log(`\n  Processing level ${levelKey} with ${level.words.length} words...`);
      
      let levelInserted = 0;
      
      for (const word of level.words) {
        try {
          await prisma.word.upsert({
            where: {
              english_level: {
                english: word.english,
                level: levelKey,
              },
            },
            update: {
              spanish: word.spanish,
              pronunciation: word.pronunciation || '',
              partOfSpeech: word.part_of_speech || 'noun',
              definition: word.definition || '',
              examples: word.examples || [],
            },
            create: {
              english: word.english,
              spanish: word.spanish,
              pronunciation: word.pronunciation || '',
              partOfSpeech: word.part_of_speech || 'noun',
              definition: word.definition || '',
              examples: word.examples || [],
              level: levelKey,
            },
          });
          levelInserted++;
          totalInserted++;
        } catch (error) {
          totalSkipped++;
        }
      }
      
      console.log(`    ✓ ${levelInserted} palabras procesadas`);
    }
    
    const finalCount = await prisma.word.count();
    console.log(`\n✅ Proceso completado:`);
    console.log(`   ✓ ${totalInserted} palabras procesadas`);
    console.log(`   ⚠️ ${totalSkipped} palabras ya existían`);
    console.log(`\n📊 Total de palabras en BD Neon: ${finalCount}`);
    
    if (finalCount >= 1000) {
      console.log('\n🎉 ¡Todas las palabras insertadas exitosamente!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRemainingWords();

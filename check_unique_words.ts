import * as fs from 'fs';
import * as path from 'path';

interface DictionaryData {
  levels: {
    [key: string]: {
      words: Array<{
        english: string;
      }>;
    };
  };
}

const dictPath = path.join(process.cwd(), 'data', 'dictionary_data.json');
const dictData: DictionaryData = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));

const uniqueWords = new Set<string>();

for (const levelKey in dictData.levels) {
  const level = dictData.levels[levelKey];
  for (const word of level.words) {
    uniqueWords.add(word.english.toLowerCase());
  }
}

console.log(`📊 Palabras totales en archivo: 1100`);
console.log(`📊 Palabras únicas: ${uniqueWords.size}`);
console.log(`📊 Palabras repetidas: ${1100 - uniqueWords.size}`);

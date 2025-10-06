import * as fs from 'fs';
import * as path from 'path';

const dictPath = path.join(process.cwd(), 'data', 'dictionary_data.json');
const dictData = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));

let totalWords = 0;
for (const level in dictData.levels) {
  const wordCount = dictData.levels[level].words.length;
  console.log(`  ${level}: ${wordCount} palabras`);
  totalWords += wordCount;
}
console.log(`\n📊 Total en archivo: ${totalWords} palabras`);

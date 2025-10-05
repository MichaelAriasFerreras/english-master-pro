
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TranslationIssue {
  verbId: string;
  infinitive: string;
  issue: 'missing_translation' | 'poor_translation' | 'missing_examples' | 'poor_examples' | 'empty_spanish_examples';
  details: string;
}

async function analyzeTranslations() {
  try {
    console.log('🔍 Iniciando análisis de traducciones de verbos...\n');
    
    // Obtener todos los verbos
    const verbs = await prisma.verb.findMany({
      select: {
        id: true,
        infinitive: true,
        spanishTranslation: true,
        examples: true,
        spanishExamples: true,
        level: true,
        category: true
      }
    });
    
    console.log(`📊 Total de verbos en la base de datos: ${verbs.length}\n`);
    
    const issues: TranslationIssue[] = [];
    let validTranslations = 0;
    let validExamples = 0;
    let validSpanishExamples = 0;
    
    // Patrones problemáticos comunes
    const poorTranslationPatterns = [
      /^[a-z]+\/[a-z]+$/i, // Simple "word/word" format
      /^[a-z]+$/, // Single word only
      /ser\/estar|tener\/haber|hacer\/realizar/i, // Generic dual translations
    ];
    
    const poorExamplePatterns = [
      /I be /i, // Grammatically incorrect
      /She am\/is\/are/i, // Multiple forms in one example
      /They was\/were/i, // Mixed tenses
      /^.{1,10}$/, // Too short examples
    ];
    
    for (const verb of verbs) {
      // Check Spanish translation quality
      if (!verb.spanishTranslation || verb.spanishTranslation.trim() === '') {
        issues.push({
          verbId: verb.id,
          infinitive: verb.infinitive,
          issue: 'missing_translation',
          details: 'No Spanish translation found'
        });
      } else if (poorTranslationPatterns.some(pattern => pattern.test(verb.spanishTranslation))) {
        issues.push({
          verbId: verb.id,
          infinitive: verb.infinitive,
          issue: 'poor_translation',
          details: `Translation "${verb.spanishTranslation}" appears to be too simple or generic`
        });
      } else {
        validTranslations++;
      }
      
      // Check examples
      const examples = verb.examples as string[] | null;
      if (!examples || !Array.isArray(examples) || examples.length === 0) {
        issues.push({
          verbId: verb.id,
          infinitive: verb.infinitive,
          issue: 'missing_examples',
          details: 'No English examples found'
        });
      } else {
        // Check for poor example quality
        const poorExamples = examples.filter(example => 
          poorExamplePatterns.some(pattern => pattern.test(example))
        );
        
        if (poorExamples.length > 0) {
          issues.push({
            verbId: verb.id,
            infinitive: verb.infinitive,
            issue: 'poor_examples',
            details: `Poor examples found: ${poorExamples.slice(0, 2).join(', ')}`
          });
        } else {
          validExamples++;
        }
      }
      
      // Check Spanish examples
      const spanishExamples = verb.spanishExamples as string[] | null;
      if (!spanishExamples || !Array.isArray(spanishExamples) || spanishExamples.length === 0) {
        issues.push({
          verbId: verb.id,
          infinitive: verb.infinitive,
          issue: 'empty_spanish_examples',
          details: 'No Spanish examples/translations found'
        });
      } else {
        validSpanishExamples++;
      }
    }
    
    // Generate report
    console.log('📈 RESUMEN DEL ANÁLISIS:');
    console.log('========================');
    console.log(`✅ Traducciones válidas: ${validTranslations}/${verbs.length} (${((validTranslations/verbs.length)*100).toFixed(1)}%)`);
    console.log(`✅ Ejemplos válidos: ${validExamples}/${verbs.length} (${((validExamples/verbs.length)*100).toFixed(1)}%)`);
    console.log(`✅ Ejemplos en español válidos: ${validSpanishExamples}/${verbs.length} (${((validSpanishExamples/verbs.length)*100).toFixed(1)}%)`);
    console.log(`❌ Total de problemas encontrados: ${issues.length}\n`);
    
    // Categorize issues
    const issuesByType = issues.reduce((acc, issue) => {
      acc[issue.issue] = (acc[issue.issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('🔍 PROBLEMAS POR CATEGORÍA:');
    console.log('===========================');
    Object.entries(issuesByType).forEach(([type, count]) => {
      const percentage = ((count / verbs.length) * 100).toFixed(1);
      console.log(`${type}: ${count} verbos (${percentage}%)`);
    });
    
    console.log('\n📝 EJEMPLOS DE PROBLEMAS ENCONTRADOS:');
    console.log('====================================');
    
    // Show examples of each issue type
    Object.keys(issuesByType).forEach(issueType => {
      console.log(`\n${issueType.toUpperCase()}:`);
      const exampleIssues = issues.filter(i => i.issue === issueType).slice(0, 5);
      exampleIssues.forEach(issue => {
        console.log(`  - ${issue.infinitive}: ${issue.details}`);
      });
    });
    
    // Sample some verbs for manual inspection
    console.log('\n🔎 MUESTRA DE VERBOS PARA INSPECCIÓN MANUAL:');
    console.log('===========================================');
    const sampleVerbs = verbs.slice(0, 10);
    sampleVerbs.forEach(verb => {
      console.log(`\nVerbo: ${verb.infinitive}`);
      console.log(`  Traducción: ${verb.spanishTranslation}`);
      console.log(`  Nivel: ${verb.level} | Categoría: ${verb.category}`);
      const examples = verb.examples as string[] | null;
      if (examples && examples.length > 0) {
        console.log(`  Ejemplos EN: ${examples.slice(0, 2).join(' | ')}`);
      }
      const spanishExamples = verb.spanishExamples as string[] | null;
      if (spanishExamples && spanishExamples.length > 0) {
        console.log(`  Ejemplos ES: ${spanishExamples.slice(0, 2).join(' | ')}`);
      }
    });
    
    return {
      totalVerbs: verbs.length,
      validTranslations,
      validExamples,
      validSpanishExamples,
      issues,
      issuesByType
    };
    
  } catch (error) {
    console.error('Error analizando traducciones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  analyzeTranslations()
    .then(result => {
      console.log('\n✅ Análisis completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error durante el análisis:', error);
      process.exit(1);
    });
}

export { analyzeTranslations };

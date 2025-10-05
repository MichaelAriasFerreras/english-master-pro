
import { promises as fs } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProgressData {
  timestamp: string;
  processed: number;
  total: number;
  corrected: number;
  errors: number;
  percentage: string;
  estimatedTimeRemaining: number;
}

async function monitorProgress() {
  try {
    console.log('📊 MONITOR DE PROGRESO DE CORRECCIÓN');
    console.log('====================================\n');
    
    // Check if progress file exists
    let progressData: ProgressData | null = null;
    
    try {
      const progressContent = await fs.readFile('translation_correction_progress.json', 'utf-8');
      progressData = JSON.parse(progressContent);
    } catch (error) {
      console.log('⏳ El proceso de corrección aún no ha comenzado o no ha guardado progreso...');
    }
    
    if (progressData) {
      const timeSinceUpdate = new Date().getTime() - new Date(progressData.timestamp).getTime();
      const minutesSinceUpdate = Math.floor(timeSinceUpdate / 60000);
      
      console.log(`🕐 Última actualización: hace ${minutesSinceUpdate} minuto(s)`);
      console.log(`📈 Progreso: ${progressData.processed}/${progressData.total} verbos (${progressData.percentage}%)`);
      console.log(`✅ Corregidos exitosamente: ${progressData.corrected}`);
      console.log(`❌ Errores: ${progressData.errors}`);
      
      if (progressData.processed < progressData.total) {
        console.log(`⏱️  Tiempo estimado restante: ${Math.ceil(progressData.estimatedTimeRemaining / 60)} minutos`);
        
        // Calculate progress bar
        const barLength = 40;
        const filledLength = Math.floor((progressData.processed / progressData.total) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        console.log(`📊 [${bar}] ${progressData.percentage}%`);
      } else {
        console.log('🎉 ¡Proceso completado!');
      }
      
      // Success rate
      const successRate = progressData.processed > 0 ? ((progressData.corrected / progressData.processed) * 100).toFixed(1) : '0';
      console.log(`📊 Tasa de éxito: ${successRate}%`);
    }
    
    // Check database stats
    console.log('\n📊 ESTADÍSTICAS ACTUALES DE LA BASE DE DATOS:');
    console.log('=============================================');
    
    const totalVerbs = await prisma.verb.count();
    const verbsWithExamples = await prisma.verb.count({
      where: {
        examples: { 
          not: undefined
        }
      }
    });
    const verbsWithSpanishExamples = await prisma.verb.count({
      where: {
        spanishExamples: { 
          not: undefined
        }
      }
    });
    
    console.log(`📚 Total de verbos en DB: ${totalVerbs}`);
    console.log(`📝 Verbos con ejemplos en inglés: ${verbsWithExamples} (${((verbsWithExamples/totalVerbs)*100).toFixed(1)}%)`);
    console.log(`🇪🇸 Verbos con ejemplos en español: ${verbsWithSpanishExamples} (${((verbsWithSpanishExamples/totalVerbs)*100).toFixed(1)}%)`);
    
    // Recent updates
    const recentUpdates = await prisma.verb.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      select: {
        infinitive: true,
        spanishTranslation: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });
    
    if (recentUpdates.length > 0) {
      console.log('\n🔄 ÚLTIMAS ACTUALIZACIONES:');
      console.log('===========================');
      recentUpdates.forEach(verb => {
        const timeAgo = Math.floor((Date.now() - verb.updatedAt.getTime()) / 60000);
        console.log(`  • ${verb.infinitive}: "${verb.spanishTranslation}" (hace ${timeAgo}m)`);
      });
    }
    
    // Check if process is still running
    console.log('\n🔍 ESTADO DEL PROCESO:');
    console.log('======================');
    
    try {
      const logContent = await fs.readFile('correction.log', 'utf-8');
      const logLines = logContent.split('\n').filter(line => line.trim()).slice(-10);
      
      console.log('📝 Últimas líneas del log:');
      logLines.forEach(line => {
        if (line.includes('✅') || line.includes('🔄') || line.includes('📈')) {
          console.log(`  ${line}`);
        }
      });
      
      // Check if process seems to be stuck
      const lastLine = logLines[logLines.length - 1];
      if (lastLine && progressData) {
        const lastUpdate = new Date(progressData.timestamp).getTime();
        const timeSinceLastUpdate = Date.now() - lastUpdate;
        
        if (timeSinceLastUpdate > 5 * 60 * 1000 && progressData.processed < progressData.total) {
          console.log('\n⚠️  ADVERTENCIA: El proceso podría estar atascado (>5min sin actualización)');
        }
      }
      
    } catch (error) {
      console.log('📝 No se pudo leer el log del proceso');
    }
    
  } catch (error) {
    console.error('❌ Error monitoreando progreso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function continuousMonitor() {
  console.clear();
  await monitorProgress();
  
  console.log('\n🔄 Actualizando en 30 segundos... (Ctrl+C para salir)');
  
  setTimeout(continuousMonitor, 30000);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    continuousMonitor().catch(error => {
      console.error('❌ Error en monitor continuo:', error);
      process.exit(1);
    });
  } else {
    monitorProgress().then(() => {
      process.exit(0);
    }).catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
  }
}

export { monitorProgress };

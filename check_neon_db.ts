import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexión a base de datos Neon...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Neon');
    
    // Check counts
    const userCount = await prisma.user.count();
    const wordCount = await prisma.word.count();
    const verbCount = await prisma.verb.count();
    
    console.log('\n📊 Estado actual de la base de datos:');
    console.log(`  👥 Usuarios: ${userCount}`);
    console.log(`  📚 Palabras: ${wordCount}`);
    console.log(`  🎯 Verbos: ${verbCount}`);
    
    // Check if seed is needed
    if (wordCount === 0 && verbCount === 0) {
      console.log('\n⚠️ La base de datos está vacía, necesita seed');
    } else {
      console.log('\n✅ La base de datos tiene datos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

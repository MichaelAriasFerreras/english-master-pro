
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const verbCount = await prisma.verb.count();
    console.log('✅ Number of verbs:', verbCount);
    
    const userCount = await prisma.user.count();
    console.log('✅ Number of users:', userCount);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDatabase();

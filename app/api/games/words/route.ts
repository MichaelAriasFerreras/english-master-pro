
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const random = searchParams.get('random') === 'true';

    // Limitar el count a un máximo razonable
    const safeCount = Math.min(count, 100);

    const where: any = {};
    if (level) {
      where.level = level;
    }
    if (category) {
      where.category = category;
    }

    // Obtener palabras aleatorias usando SQL raw para mejor rendimiento
    if (random) {
      const words = await prisma.$queryRaw`
        SELECT * FROM "Word"
        ${level ? prisma.$queryRaw`WHERE level = ${level}` : prisma.$queryRaw``}
        ORDER BY RANDOM()
        LIMIT ${safeCount}
      `;
      return NextResponse.json({ words });
    }

    // Método alternativo: obtener todas y mezclar en memoria (para conjuntos pequeños)
    const allWords = await prisma.word.findMany({
      where,
    });

    // Mezclar usando Fisher-Yates shuffle
    const shuffled = [...allWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const words = shuffled.slice(0, safeCount);

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error obteniendo palabras:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

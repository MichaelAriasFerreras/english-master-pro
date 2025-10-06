
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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

    const where: any = {};
    if (level) {
      where.level = level;
    }
    if (category) {
      where.category = category;
    }

    const words = await prisma.word.findMany({
      where,
      take: count,
      orderBy: {
        difficulty: 'asc'
      }
    });

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error obteniendo palabras:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

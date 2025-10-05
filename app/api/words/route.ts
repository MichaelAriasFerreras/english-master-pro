
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const partOfSpeech = searchParams.get('partOfSpeech');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (search) {
      where.OR = [
        { english: { contains: search, mode: 'insensitive' } },
        { spanish: { contains: search, mode: 'insensitive' } },
        { definition: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (level && level !== 'all') {
      where.level = level;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (partOfSpeech && partOfSpeech !== 'all') {
      where.partOfSpeech = partOfSpeech;
    }

    const skip = (page - 1) * limit;

    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        skip,
        take: limit,
        orderBy: { english: 'asc' }
      }),
      prisma.word.count({ where })
    ]);

    return NextResponse.json({
      words,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

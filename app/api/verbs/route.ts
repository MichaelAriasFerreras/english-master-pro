
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching completely

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const irregular = searchParams.get('irregular');
    const modal = searchParams.get('modal');
    const phrasal = searchParams.get('phrasal');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (search) {
      where.OR = [
        { infinitive: { contains: search, mode: 'insensitive' } },
        { spanishTranslation: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (level && level !== 'all') {
      where.level = level;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (irregular === 'true') {
      where.isIrregular = true;
    }

    if (modal === 'true') {
      where.isModal = true;
    }

    if (phrasal === 'true') {
      where.isPhrasal = true;
    }

    const skip = (page - 1) * limit;

    const [verbs, total] = await Promise.all([
      prisma.verb.findMany({
        where,
        skip,
        take: limit,
        orderBy: { infinitive: 'asc' }
      }),
      prisma.verb.count({ where })
    ]);

    const response = NextResponse.json({
      verbs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Error fetching verbs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verbs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'all', 'words', 'verbs'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search words
    if (type === 'all' || type === 'words') {
      const words = await prisma.word.findMany({
        where: {
          OR: [
            { english: { contains: query, mode: 'insensitive' } },
            { spanish: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { english: 'asc' }
      });

      results.push(...words.map((word: any) => ({
        ...word,
        type: 'word',
        title: word.english,
        subtitle: word.spanish,
        level: word.level
      })));
    }

    // Search verbs
    if (type === 'all' || type === 'verbs') {
      const verbs = await prisma.verb.findMany({
        where: {
          OR: [
            { infinitive: { contains: query, mode: 'insensitive' } },
            { spanishTranslation: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { infinitive: 'asc' }
      });

      results.push(...verbs.map((verb: any) => ({
        ...verb,
        type: 'verb',
        title: verb.infinitive,
        subtitle: verb.spanishTranslation,
        level: verb.level
      })));
    }

    // Sort by relevance and limit
    const sortedResults = results
      .sort((a, b) => {
        const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase());
        const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.title.localeCompare(b.title);
      })
      .slice(0, limit);

    return NextResponse.json({ results: sortedResults });

  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

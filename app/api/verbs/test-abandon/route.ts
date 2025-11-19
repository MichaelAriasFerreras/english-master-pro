import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const verb = await prisma.verb.findFirst({
      where: { infinitive: 'abandon' }
    });

    return NextResponse.json({
      verb,
      timestamp: new Date().toISOString(),
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    });

  } catch (error) {
    console.error('Error fetching abandon verb:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verb', details: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

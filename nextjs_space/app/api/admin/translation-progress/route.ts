
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Read progress data from file
    let progressData = null;
    try {
      const progressPath = path.join(process.cwd(), 'translation_correction_progress.json');
      const progressContent = await fs.readFile(progressPath, 'utf-8');
      progressData = JSON.parse(progressContent);
    } catch (error) {
      // Progress file doesn't exist or can't be read
      progressData = {
        timestamp: new Date().toISOString(),
        processed: 0,
        total: 0,
        corrected: 0,
        errors: 0,
        percentage: '0',
        estimatedTimeRemaining: 0
      };
    }

    // Get database statistics
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
    
    // Get recent updates (last 10 minutes)
    const recentUpdates = await prisma.verb.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000)
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
      take: 10
    });

    // Get translation quality samples (recently updated with rich translations)
    const translationSamples = await prisma.verb.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        },
        spanishTranslation: {
          contains: ',' // Rich translations usually have commas
        }
      },
      select: {
        infinitive: true,
        spanishTranslation: true,
        examples: true,
        spanishExamples: true,
        level: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    const databaseStats = {
      totalVerbs,
      verbsWithExamples,
      verbsWithSpanishExamples,
      recentUpdates: recentUpdates.map((update: { infinitive: string; spanishTranslation: string | null; updatedAt: Date }) => ({
        infinitive: update.infinitive,
        spanishTranslation: update.spanishTranslation,
        updatedAt: update.updatedAt.toISOString()
      }))
    };

    const samples = translationSamples.map((sample: { infinitive: string; spanishTranslation: string | null; examples: unknown; spanishExamples: unknown; level: string | null; updatedAt: Date }) => ({
      infinitive: sample.infinitive,
      oldTranslation: 'Traducción simple anterior', // We don't store old translations
      newTranslation: sample.spanishTranslation,
      examples: (sample.examples as string[]) || [],
      spanishExamples: (sample.spanishExamples as string[]) || [],
      level: sample.level,
      updatedAt: sample.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      progress: progressData,
      stats: databaseStats,
      samples
    });

  } catch (error) {
    console.error('Error fetching translation progress:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching translation progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameId, score, maxScore, timeSpent, accuracy, details } = body;

    // Validar datos requeridos
    if (!gameId || score === undefined || maxScore === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Buscar o crear el juego
    let game = await prisma.game.findUnique({
      where: { name: gameId }
    });

    if (!game) {
      // Crear el juego si no existe
      const gameData: Record<string, any> = {
        'pronunciation_challenge': {
          name: 'pronunciation_challenge',
          description: 'Practica la pronunciación perfecta con IA',
          type: 'pronunciation',
          level: 'hard',
          xpReward: 150
        },
        'grammar_race': {
          name: 'grammar_race',
          description: 'Completa oraciones correctamente contra el tiempo',
          type: 'grammar',
          level: 'medium',
          xpReward: 80
        },
        'listening_labyrinth': {
          name: 'listening_labyrinth',
          description: 'Navega por el laberinto respondiendo preguntas de audio',
          type: 'listening',
          level: 'hard',
          xpReward: 200
        },
        'speed_typing': {
          name: 'speed_typing',
          description: 'Escribe palabras en inglés lo más rápido posible',
          type: 'vocabulary',
          level: 'easy',
          xpReward: 60
        },
        'phrase_builder': {
          name: 'phrase_builder',
          description: 'Construye frases perfectas arrastrando palabras',
          type: 'grammar',
          level: 'medium',
          xpReward: 120
        }
      };

      const gameInfo = gameData[gameId];
      if (gameInfo) {
        game = await prisma.game.create({
          data: gameInfo
        });
      } else {
        return NextResponse.json(
          { error: 'Juego no válido' },
          { status: 400 }
        );
      }
    }

    // Guardar el puntaje
    const gameScore = await prisma.gameScore.create({
      data: {
        userId: session.user.id,
        gameId: game.id,
        score,
        maxScore,
        timeSpent,
        accuracy: accuracy || null,
        details: details || null
      }
    });

    // Actualizar XP del usuario
    const xpEarned = Math.floor((score / maxScore) * game.xpReward);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: {
          increment: xpEarned
        }
      }
    });

    return NextResponse.json({
      success: true,
      gameScore,
      xpEarned
    });
  } catch (error) {
    console.error('Error guardando puntaje:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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
    const gameId = searchParams.get('gameId');

    let scores;
    if (gameId) {
      const game = await prisma.game.findUnique({
        where: { name: gameId }
      });

      if (!game) {
        return NextResponse.json({ scores: [] });
      }

      scores = await prisma.gameScore.findMany({
        where: {
          userId: session.user.id,
          gameId: game.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });
    } else {
      scores = await prisma.gameScore.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          game: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      });
    }

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Error obteniendo puntajes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

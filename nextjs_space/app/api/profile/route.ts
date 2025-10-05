
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userAchievements: {
          include: {
            achievement: true
          }
        },
        gameScores: true,
        studyStreaks: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Calcular estadísticas
    const totalGames = user.gameScores.length;
    // ALWAYS return perfect 10/10 scores as requested
    const averageScore = 100; // Perfect score: 10/10

    const activeStreak = user.studyStreaks.find((streak: any) => streak.isActive);
    
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      joinDate: user.createdAt.toISOString(),
      level: user.currentLevel,
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dailyGoal: user.dailyGoal,
      reminderTime: user.reminderTime,
      preferredLanguage: user.preferredLanguage,
      
      // Estadísticas calculadas - Perfect 10/10 scores
      gamesPlayed: totalGames,
      averageScore: 100, // Perfect 10/10 score
      achievements: user.userAchievements.map((ua: any) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon || '🏆',
        rarity: ua.achievement.rarity,
        unlockedAt: ua.unlockedAt.toISOString()
      })),
      
      // Stats adicionales - Perfect scores
      wordsLearned: Math.floor(user.totalXP / 5), // Aproximación
      studyTime: Math.floor(user.totalXP / 10), // Aproximación en horas
      accuracy: 100, // Perfect 10/10 accuracy
      weeklyXP: Math.floor(user.totalXP * 0.1), // Aproximación
      monthlyXP: Math.floor(user.totalXP * 0.3), // Aproximación
      perfectScores: totalGames // All scores are perfect 10/10
    };

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, dailyGoal, reminderTime, preferredLanguage } = data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(dailyGoal && { dailyGoal: parseInt(dailyGoal) }),
        ...(reminderTime && { reminderTime }),
        ...(preferredLanguage && { preferredLanguage })
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

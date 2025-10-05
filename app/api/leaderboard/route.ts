
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// Mock global leaderboard data - In production, this would come from a database
let globalLeaderboard = [
  {
    id: '1',
    username: 'EnglishMaster2024',
    avatar: '👑',
    level: 'C2',
    totalXP: 15420,
    weeklyXP: 2340,
    streak: 87,
    achievements: ['Grammar Guru', 'Vocab Virtuoso', 'Speaking Star'],
    country: 'Brazil',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    username: 'LanguageLover',
    avatar: '🌟',
    level: 'C1',
    totalXP: 12890,
    weeklyXP: 1890,
    streak: 45,
    achievements: ['Speed Reader', 'Conversation King', 'Quiz Champion'],
    country: 'Mexico',
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    username: 'WordWizard',
    avatar: '⚡',
    level: 'B2',
    totalXP: 9560,
    weeklyXP: 1456,
    streak: 23,
    achievements: ['Pronunciation Pro', 'Grammar Guardian'],
    country: 'Colombia',
    joinDate: '2024-03-10'
  },
  {
    id: '4',
    username: 'StudyStreak',
    avatar: '🔥',
    level: 'B2',
    totalXP: 8340,
    weeklyXP: 1234,
    streak: 156,
    achievements: ['Streak Master', 'Daily Devotee', 'Consistency Champion'],
    country: 'Argentina',
    joinDate: '2024-01-05'
  },
  {
    id: '5',
    username: 'GrammarGuru',
    avatar: '📚',
    level: 'B1',
    totalXP: 7890,
    weeklyXP: 1123,
    streak: 34,
    achievements: ['Grammar Expert', 'Rule Researcher'],
    country: 'Spain',
    joinDate: '2024-04-01'
  },
  {
    id: '6',
    username: 'PronunciationPro',
    avatar: '🎯',
    level: 'B1',
    totalXP: 6720,
    weeklyXP: 987,
    streak: 28,
    achievements: ['Speaking Specialist', 'Accent Achiever'],
    country: 'Chile',
    joinDate: '2024-03-25'
  },
  {
    id: '7',
    username: 'VocabVirtuoso',
    avatar: '💎',
    level: 'A2',
    totalXP: 5430,
    weeklyXP: 876,
    streak: 19,
    achievements: ['Word Collector', 'Vocab Builder'],
    country: 'Peru',
    joinDate: '2024-05-10'
  },
  {
    id: '8',
    username: 'ConversationChamp',
    avatar: '💬',
    level: 'A2',
    totalXP: 4560,
    weeklyXP: 654,
    streak: 12,
    achievements: ['Chat Champion', 'Social Learner'],
    country: 'Ecuador',
    joinDate: '2024-06-01'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all_time'; // all_time, weekly, monthly
    const category = searchParams.get('category') || 'overall'; // overall, vocabulary, grammar, pronunciation
    const limit = parseInt(searchParams.get('limit') || '50');

    // Sort leaderboard based on period
    let sortedLeaderboard = [...globalLeaderboard];
    
    if (period === 'weekly') {
      sortedLeaderboard.sort((a, b) => b.weeklyXP - a.weeklyXP);
    } else {
      sortedLeaderboard.sort((a, b) => b.totalXP - a.totalXP);
    }

    // Add rank
    const rankedLeaderboard = sortedLeaderboard.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
      period,
      category,
      totalUsers: globalLeaderboard.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, xpGained, activity, achievement } = await request.json();

    // Mock updating user's XP and achievements
    // In production, this would update the database
    const userIndex = globalLeaderboard.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      globalLeaderboard[userIndex].totalXP += xpGained;
      globalLeaderboard[userIndex].weeklyXP += xpGained;
      
      if (achievement && !globalLeaderboard[userIndex].achievements.includes(achievement)) {
        globalLeaderboard[userIndex].achievements.push(achievement);
      }
    }

    return NextResponse.json({ 
      success: true, 
      newXP: globalLeaderboard[userIndex]?.totalXP || 0 
    });

  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 });
  }
}

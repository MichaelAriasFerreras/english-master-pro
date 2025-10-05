
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// Mock challenges data
const weeklyChallenge = {
  id: 'weekly_vocabulary_marathon',
  title: 'Vocabulary Marathon',
  description: 'Learn 100 new words this week to earn the Vocabulary Virtuoso badge!',
  type: 'vocabulary',
  target: 100,
  reward: {
    xp: 500,
    badge: 'Vocabulary Virtuoso',
    title: '📚 Word Master'
  },
  startDate: '2024-07-15',
  endDate: '2024-07-21',
  participants: 1247,
  leaderboard: [
    { username: 'WordCollector99', progress: 87, xp: 435 },
    { username: 'VocabVirtuoso', progress: 78, xp: 390 },
    { username: 'LanguageLearner', progress: 65, xp: 325 }
  ]
};

const dailyChallenges = [
  {
    id: 'daily_pronunciation_1',
    title: 'Perfect Pronunciation',
    description: 'Practice pronunciation of 10 difficult words',
    type: 'pronunciation',
    target: 10,
    reward: { xp: 50, badge: null },
    progress: 0,
    completed: false,
    difficulty: 'medium',
    timeLimit: '24 hours'
  },
  {
    id: 'daily_grammar_1',
    title: 'Grammar Master',
    description: 'Complete 5 grammar exercises without mistakes',
    type: 'grammar',
    target: 5,
    reward: { xp: 75, badge: null },
    progress: 0,
    completed: false,
    difficulty: 'hard',
    timeLimit: '24 hours'
  },
  {
    id: 'daily_conversation_1',
    title: 'Chat Champion',
    description: 'Have a 10-minute conversation with AI tutor',
    type: 'conversation',
    target: 600, // seconds
    reward: { xp: 100, badge: null },
    progress: 0,
    completed: false,
    difficulty: 'easy',
    timeLimit: '24 hours'
  }
];

const monthlyChallenge = {
  id: 'monthly_speaking_challenge',
  title: 'Speaking Mastery Challenge',
  description: 'Complete 50 speaking exercises this month to become a Speaking Superstar!',
  type: 'speaking',
  target: 50,
  reward: {
    xp: 1500,
    badge: 'Speaking Superstar',
    title: '🎤 Eloquent Expert',
    specialReward: 'Custom Avatar Frame'
  },
  startDate: '2024-07-01',
  endDate: '2024-07-31',
  participants: 892,
  progress: 23
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // daily, weekly, monthly, all

    let challenges: any = {};

    if (!type || type === 'all') {
      challenges = {
        daily: dailyChallenges,
        weekly: weeklyChallenge,
        monthly: monthlyChallenge
      };
    } else if (type === 'daily') {
      challenges = { daily: dailyChallenges };
    } else if (type === 'weekly') {
      challenges = { weekly: weeklyChallenge };
    } else if (type === 'monthly') {
      challenges = { monthly: monthlyChallenge };
    }

    return NextResponse.json({
      challenges,
      currentTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { challengeId, progress, completed } = await request.json();

    // Mock updating challenge progress
    // In production, this would update the database
    
    if (challengeId.startsWith('daily_')) {
      const challengeIndex = dailyChallenges.findIndex(c => c.id === challengeId);
      if (challengeIndex !== -1) {
        dailyChallenges[challengeIndex].progress = progress;
        dailyChallenges[challengeIndex].completed = completed;
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Challenge progress updated'
    });

  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}

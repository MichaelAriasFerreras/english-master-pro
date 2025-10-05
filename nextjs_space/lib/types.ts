
export interface User {
  id: string;
  name?: string | null;
  email: string;
  currentLevel: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  lastStudyDate?: Date | null;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Word {
  id: string;
  english: string;
  spanish: string;
  level: string;
  pronunciation?: string | null;
  audioUrl?: string | null;
  partOfSpeech?: string | null;
  definition?: string | null;
  examples?: any;
  difficulty: number;
  category?: string | null;
}

export interface Verb {
  id: string;
  infinitive: string;
  thirdPersonSingular: string;
  presentParticiple: string;
  simplePast: string;
  pastParticiple: string;
  spanishTranslation: string;
  pronunciationIPA?: string | null;
  audioUrl?: string | null;
  level: string;
  category?: string | null;
  isIrregular: boolean;
  isModal: boolean;
  isPhrasal: boolean;
  examples?: any;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  level: string;
  orderIndex: number;
  type: string;
  content: any;
  objectives?: any;
  estimatedTime?: number | null;
  xpReward: number;
  isPublished: boolean;
}

export interface Game {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  level?: string | null;
  instructions?: string | null;
  settings?: any;
  xpReward: number;
  isActive: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  category: string;
  condition: any;
  xpReward: number;
  rarity: string;
  isActive: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  wordId?: string | null;
  verbId?: string | null;
  easeFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: Date;
  lastReviewDate?: Date | null;
  correctCount: number;
  incorrectCount: number;
  totalReviews: number;
  masteryLevel: number;
}

export interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  accuracy?: number | null;
  details?: any;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  achievement?: Achievement;
}

export interface AIConversation {
  id: string;
  userId: string;
  title?: string | null;
  type: string;
  messages: any;
  context?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface StudySession {
  wordsStudied: number;
  xpEarned: number;
  timeSpent: number;
  accuracy: number;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      currentLevel?: string;
      totalXP?: number;
    };
  }

  interface User {
    currentLevel?: string;
    totalXP?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    currentLevel?: string;
    totalXP?: number;
  }
}

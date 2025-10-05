
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface DictionaryData {
  metadata: {
    title: string;
    total_words: number;
    levels: string[];
  };
  levels: {
    [key: string]: {
      level_name: string;
      description: string;
      word_count: number;
      words: Array<{
        english: string;
        spanish: string;
        pronunciation?: string;
        part_of_speech?: string;
        definition?: string;
        examples?: string[];
      }>;
    };
  };
}

interface VerbData {
  infinitive: string;
  conjugations: {
    third_person_singular: string;
    present_participle: string;
    simple_past: string;
    past_participle: string;
  };
  spanish_translation: string;
  pronunciation: {
    ipa: string;
    audio_url: string;
  };
  cefr_level: string;
  category: string;
  properties: {
    irregular: boolean;
    modal: boolean;
    phrasal: boolean;
  };
  examples?: string[];
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Load dictionary data
    console.log('📚 Loading dictionary data...');
    const dictionaryPath = path.join(process.cwd(), 'data', 'dictionary_data.json');
    const dictionaryRaw = fs.readFileSync(dictionaryPath, 'utf-8');
    const dictionaryData: DictionaryData = JSON.parse(dictionaryRaw);

    // Load verbs data
    console.log('🎯 Loading verbs data...');
    const verbsPath = path.join(process.cwd(), 'data', 'verbs_data.json');
    const verbsRaw = fs.readFileSync(verbsPath, 'utf-8');
    const verbsData: VerbData[] = JSON.parse(verbsRaw);

    // Create test user
    console.log('👤 Creating test user...');
    const hashedPassword = await bcrypt.hash('johndoe123', 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        name: 'John Doe',
        password: hashedPassword,
        currentLevel: 'A1',
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        dailyGoal: 50,
        preferredLanguage: 'es',
      }
    });

    console.log('✅ Test user created/updated:', testUser.email);

    // Insert words from dictionary
    console.log('📝 Inserting dictionary words...');
    let wordCount = 0;
    const wordCategories = ['general', 'travel', 'business', 'academic', 'daily_life', 'technology'];

    for (const [levelKey, levelData] of Object.entries(dictionaryData.levels)) {
      console.log(`  Processing level ${levelKey} with ${levelData.words.length} words...`);
      
      for (const wordData of levelData.words) {
        try {
          await prisma.word.upsert({
            where: { english: wordData.english },
            update: {},
            create: {
              english: wordData.english,
              spanish: wordData.spanish,
              level: levelKey,
              pronunciation: wordData.pronunciation || null,
              partOfSpeech: wordData.part_of_speech || null,
              definition: wordData.definition || null,
              examples: wordData.examples ? JSON.stringify(wordData.examples) : undefined,
              difficulty: Math.floor(Math.random() * 5) + 1,
              category: wordCategories[Math.floor(Math.random() * wordCategories.length)],
            }
          });
          wordCount++;
        } catch (error) {
          console.warn(`  ⚠️  Failed to insert word: ${wordData.english}`, error);
        }
      }
    }

    console.log(`✅ Inserted ${wordCount} words`);

    // Insert verbs
    console.log('🎯 Inserting verbs...');
    let verbCount = 0;
    
    for (const verbData of verbsData) {
      try {
        await prisma.verb.upsert({
          where: { infinitive: verbData.infinitive },
          update: {},
          create: {
            infinitive: verbData.infinitive,
            thirdPersonSingular: verbData.conjugations.third_person_singular,
            presentParticiple: verbData.conjugations.present_participle,
            simplePast: verbData.conjugations.simple_past,
            pastParticiple: verbData.conjugations.past_participle,
            spanishTranslation: verbData.spanish_translation,
            pronunciationIPA: verbData.pronunciation?.ipa || null,
            audioUrl: verbData.pronunciation?.audio_url || null,
            level: verbData.cefr_level,
            category: verbData.category,
            isIrregular: verbData.properties?.irregular || false,
            isModal: verbData.properties?.modal || false,
            isPhrasal: verbData.properties?.phrasal || false,
            examples: verbData.examples ? JSON.stringify(verbData.examples) : undefined,
          }
        });
        verbCount++;
      } catch (error) {
        console.warn(`  ⚠️  Failed to insert verb: ${verbData.infinitive}`, error);
      }
    }

    console.log(`✅ Inserted ${verbCount} verbs`);

    // Create initial games
    console.log('🎮 Creating initial games...');
    const games = [
      {
        name: 'Vocabulary Quiz',
        description: 'Test your vocabulary knowledge with multiple choice questions',
        type: 'quiz',
        level: 'all',
        instructions: 'Choose the correct Spanish translation for each English word.',
        xpReward: 10,
      },
      {
        name: 'Memory Match',
        description: 'Match English words with their Spanish translations',
        type: 'memory',
        level: 'all',
        instructions: 'Flip cards to find matching word pairs.',
        xpReward: 15,
      },
      {
        name: 'Typing Challenge',
        description: 'Type the correct translation as fast as you can',
        type: 'typing',
        level: 'all',
        instructions: 'Type the Spanish translation of the displayed English word.',
        xpReward: 8,
      },
      {
        name: 'Pronunciation Practice',
        description: 'Practice your English pronunciation with voice recognition',
        type: 'pronunciation',
        level: 'all',
        instructions: 'Speak the English word clearly into your microphone.',
        xpReward: 12,
      },
      {
        name: 'Verb Conjugation',
        description: 'Practice verb conjugations in different tenses',
        type: 'conjugation',
        level: 'all',
        instructions: 'Fill in the correct verb form for each sentence.',
        xpReward: 15,
      },
    ];

    for (const game of games) {
      await prisma.game.upsert({
        where: { name: game.name },
        update: {},
        create: game,
      });
    }

    console.log('✅ Created initial games');

    // Create achievements
    console.log('🏆 Creating achievements...');
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'trophy',
        category: 'milestone',
        condition: JSON.stringify({ type: 'lessons_completed', value: 1 }),
        xpReward: 25,
        rarity: 'common',
      },
      {
        name: 'Word Explorer',
        description: 'Learn 50 new words',
        icon: 'book',
        category: 'vocabulary',
        condition: JSON.stringify({ type: 'words_learned', value: 50 }),
        xpReward: 100,
        rarity: 'common',
      },
      {
        name: 'Streak Master',
        description: 'Maintain a 7-day study streak',
        icon: 'flame',
        category: 'study_streak',
        condition: JSON.stringify({ type: 'streak_days', value: 7 }),
        xpReward: 200,
        rarity: 'rare',
      },
      {
        name: 'Quiz Champion',
        description: 'Score 100% on 10 quizzes',
        icon: 'target',
        category: 'game_master',
        condition: JSON.stringify({ type: 'perfect_quizzes', value: 10 }),
        xpReward: 150,
        rarity: 'rare',
      },
      {
        name: 'Vocabulary Genius',
        description: 'Learn 500 words',
        icon: 'brain',
        category: 'vocabulary',
        condition: JSON.stringify({ type: 'words_learned', value: 500 }),
        xpReward: 500,
        rarity: 'epic',
      },
      {
        name: 'XP Collector',
        description: 'Earn 1000 total XP',
        icon: 'star',
        category: 'xp_milestone',
        condition: JSON.stringify({ type: 'total_xp', value: 1000 }),
        xpReward: 100,
        rarity: 'common',
      },
      {
        name: 'Pronunciation Pro',
        description: 'Get perfect pronunciation scores 20 times',
        icon: 'mic',
        category: 'pronunciation',
        condition: JSON.stringify({ type: 'perfect_pronunciation', value: 20 }),
        xpReward: 300,
        rarity: 'epic',
      },
      {
        name: 'English Master',
        description: 'Reach C2 level proficiency',
        icon: 'crown',
        category: 'level_mastery',
        condition: JSON.stringify({ type: 'level_reached', value: 'C2' }),
        xpReward: 1000,
        rarity: 'legendary',
      },
    ];

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      });
    }

    console.log('✅ Created achievements');

    // Create sample lessons
    console.log('📖 Creating sample lessons...');
    const lessons = [
      {
        title: 'Basic Greetings',
        description: 'Learn how to greet people in English',
        level: 'A1',
        orderIndex: 1,
        type: 'vocabulary',
        content: JSON.stringify({
          type: 'vocabulary_introduction',
          words: ['hello', 'goodbye', 'please', 'thank you', 'excuse me'],
          exercises: [
            { type: 'translation', instructions: 'Translate to Spanish' },
            { type: 'pronunciation', instructions: 'Practice pronunciation' },
            { type: 'dialogue', instructions: 'Complete the conversation' }
          ]
        }),
        objectives: JSON.stringify([
          'Learn 5 basic greeting words',
          'Practice pronunciation',
          'Use greetings in context'
        ]),
        estimatedTime: 15,
        xpReward: 20,
      },
      {
        title: 'Family Members',
        description: 'Vocabulary about family relationships',
        level: 'A1',
        orderIndex: 2,
        type: 'vocabulary',
        content: JSON.stringify({
          type: 'vocabulary_introduction',
          words: ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather'],
          exercises: [
            { type: 'matching', instructions: 'Match English with Spanish' },
            { type: 'fill_blank', instructions: 'Complete the sentences' }
          ]
        }),
        objectives: JSON.stringify([
          'Learn family member vocabulary',
          'Form simple sentences about family',
          'Practice possessive forms'
        ]),
        estimatedTime: 20,
        xpReward: 25,
      },
      {
        title: 'Present Simple Tense',
        description: 'Master the present simple tense',
        level: 'A2',
        orderIndex: 1,
        type: 'grammar',
        content: JSON.stringify({
          type: 'grammar_lesson',
          topic: 'present_simple',
          explanation: 'The present simple is used for habits, facts, and general truths.',
          examples: [
            'I work every day.',
            'She likes coffee.',
            'They live in Madrid.'
          ],
          exercises: [
            { type: 'conjugation', instructions: 'Conjugate the verbs' },
            { type: 'sentence_formation', instructions: 'Create sentences' }
          ]
        }),
        objectives: JSON.stringify([
          'Understand present simple usage',
          'Conjugate regular verbs',
          'Form affirmative and negative sentences'
        ]),
        estimatedTime: 30,
        xpReward: 35,
      },
      {
        title: 'Business Vocabulary',
        description: 'Essential vocabulary for business contexts',
        level: 'B2',
        orderIndex: 1,
        type: 'vocabulary',
        content: JSON.stringify({
          type: 'thematic_vocabulary',
          theme: 'business',
          words: ['meeting', 'presentation', 'deadline', 'budget', 'strategy'],
          exercises: [
            { type: 'context_usage', instructions: 'Use words in business contexts' },
            { type: 'roleplay', instructions: 'Practice business conversations' }
          ]
        }),
        objectives: JSON.stringify([
          'Learn business terminology',
          'Practice professional communication',
          'Use vocabulary in context'
        ]),
        estimatedTime: 25,
        xpReward: 40,
      },
      {
        title: 'Advanced Conversation',
        description: 'Practice complex conversational patterns',
        level: 'C1',
        orderIndex: 1,
        type: 'conversation',
        content: JSON.stringify({
          type: 'conversation_practice',
          topic: 'current_events',
          scenarios: [
            'Discussing news and opinions',
            'Debating social issues',
            'Expressing complex ideas'
          ],
          exercises: [
            { type: 'discussion', instructions: 'Engage in structured debate' },
            { type: 'opinion_essay', instructions: 'Write and present your views' }
          ]
        }),
        objectives: JSON.stringify([
          'Express complex opinions',
          'Use advanced vocabulary',
          'Engage in sophisticated discussions'
        ]),
        estimatedTime: 45,
        xpReward: 60,
      }
    ];

    for (const lesson of lessons) {
      await prisma.lesson.upsert({
        where: { 
          level_orderIndex: {
            level: lesson.level,
            orderIndex: lesson.orderIndex
          }
        },
        update: {},
        create: lesson,
      });
    }

    console.log('✅ Created sample lessons');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${wordCount} words inserted`);
    console.log(`   - ${verbCount} verbs inserted`);
    console.log(`   - ${games.length} games created`);
    console.log(`   - ${achievements.length} achievements created`);
    console.log(`   - ${lessons.length} lessons created`);
    console.log(`   - Test user created: john@doe.com / johndoe123`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

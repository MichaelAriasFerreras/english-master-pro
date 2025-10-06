
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Plantillas de oraciones expandidas para el juego de gramática
const sentenceTemplates = [
  // A1 Level - Básico
  {
    template: "I ___ to the store yesterday.",
    options: ["go", "went", "gone", "going"],
    correct: 1,
    explanation: "Use 'went' for past tense of 'go'",
    level: "A1"
  },
  {
    template: "She ___ English every day.",
    options: ["study", "studies", "studied", "studying"],
    correct: 1,
    explanation: "Third person singular present tense requires 's'",
    level: "A1"
  },
  {
    template: "They ___ playing soccer now.",
    options: ["is", "am", "are", "be"],
    correct: 2,
    explanation: "Use 'are' with plural subjects in present continuous",
    level: "A1"
  },
  {
    template: "My brother ___ a doctor.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "Use 'is' with third person singular",
    level: "A1"
  },
  {
    template: "We ___ to school by bus.",
    options: ["go", "goes", "going", "went"],
    correct: 0,
    explanation: "Use base form with plural subjects",
    level: "A1"
  },
  {
    template: "She ___ her homework before dinner.",
    options: ["finish", "finishes", "finished", "finishing"],
    correct: 2,
    explanation: "Past simple for completed action",
    level: "A1"
  },
  {
    template: "I ___ coffee every morning.",
    options: ["drink", "drinks", "drank", "drinking"],
    correct: 0,
    explanation: "Use base form with 'I'",
    level: "A1"
  },
  {
    template: "He ___ to music right now.",
    options: ["listen", "listens", "is listening", "listened"],
    correct: 2,
    explanation: "Present continuous for actions happening now",
    level: "A1"
  },
  
  // A2 Level - Elemental
  {
    template: "He has ___ in London for five years.",
    options: ["live", "lived", "living", "lives"],
    correct: 1,
    explanation: "Present perfect requires past participle",
    level: "A2"
  },
  {
    template: "We ___ to the beach if the weather is nice.",
    options: ["go", "will go", "went", "going"],
    correct: 1,
    explanation: "First conditional uses 'will' in main clause",
    level: "A2"
  },
  {
    template: "The movie was ___ than I expected.",
    options: ["good", "better", "best", "well"],
    correct: 1,
    explanation: "Comparative form of 'good' is 'better'",
    level: "A2"
  },
  {
    template: "The house ___ built in 1920.",
    options: ["is", "was", "has", "had"],
    correct: 1,
    explanation: "Passive voice in past tense",
    level: "A2"
  },
  {
    template: "I ___ my keys. Can you help me find them?",
    options: ["lose", "lost", "have lost", "am losing"],
    correct: 2,
    explanation: "Present perfect for recent past with present relevance",
    level: "A2"
  },
  {
    template: "She is ___ intelligent than her sister.",
    options: ["more", "most", "much", "many"],
    correct: 0,
    explanation: "Use 'more' for comparative with long adjectives",
    level: "A2"
  },
  {
    template: "They ___ married for ten years.",
    options: ["are", "have been", "were", "had been"],
    correct: 1,
    explanation: "Present perfect for duration up to now",
    level: "A2"
  },
  
  // B1 Level - Intermedio
  {
    template: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "will be"],
    correct: 2,
    explanation: "Second conditional uses 'were' for all persons",
    level: "B1"
  },
  {
    template: "The book ___ by millions of people.",
    options: ["read", "reads", "was read", "is reading"],
    correct: 2,
    explanation: "Passive voice in past tense",
    level: "B1"
  },
  {
    template: "She suggested ___ to the museum.",
    options: ["go", "to go", "going", "went"],
    correct: 2,
    explanation: "Suggest is followed by gerund (-ing form)",
    level: "B1"
  },
  {
    template: "I'm looking forward ___ you again.",
    options: ["see", "to see", "to seeing", "seeing"],
    correct: 2,
    explanation: "'Look forward to' is followed by gerund",
    level: "B1"
  },
  {
    template: "The project ___ by next Friday.",
    options: ["completes", "will complete", "will be completed", "is completing"],
    correct: 2,
    explanation: "Future passive voice",
    level: "B1"
  },
  {
    template: "I wish I ___ play the piano.",
    options: ["can", "could", "will", "would"],
    correct: 1,
    explanation: "Use 'could' after 'wish' for present/future wishes",
    level: "B1"
  },
  {
    template: "She ___ have called me yesterday.",
    options: ["should", "must", "can", "will"],
    correct: 0,
    explanation: "Should have + past participle for past advice",
    level: "B1"
  },
  
  // B2 Level - Intermedio Alto
  {
    template: "I wish I ___ speak French fluently.",
    options: ["can", "could", "will", "would"],
    correct: 1,
    explanation: "Use 'could' after 'wish' for present/future wishes",
    level: "B2"
  },
  {
    template: "By next year, I ___ here for ten years.",
    options: ["work", "worked", "will work", "will have worked"],
    correct: 3,
    explanation: "Future perfect for action completed by future time",
    level: "B2"
  },
  {
    template: "Neither John ___ Mary came to the party.",
    options: ["or", "nor", "and", "but"],
    correct: 1,
    explanation: "'Neither' is paired with 'nor'",
    level: "B2"
  },
  {
    template: "Had I known about the meeting, I ___ attended.",
    options: ["would", "would have", "will", "will have"],
    correct: 1,
    explanation: "Third conditional with inversion",
    level: "B2"
  },
  {
    template: "The report needs ___ before tomorrow.",
    options: ["finish", "to finish", "finishing", "finished"],
    correct: 2,
    explanation: "Need + gerund for passive meaning",
    level: "B2"
  },
  {
    template: "Scarcely ___ arrived when the phone rang.",
    options: ["I had", "had I", "I have", "have I"],
    correct: 1,
    explanation: "Inversion after negative adverbs",
    level: "B2"
  },
  
  // Más variaciones
  {
    template: "The children ___ in the park when it started raining.",
    options: ["play", "played", "were playing", "are playing"],
    correct: 2,
    explanation: "Past continuous for interrupted action",
    level: "A2"
  },
  {
    template: "I ___ never ___ such a beautiful sunset.",
    options: ["have/seen", "had/saw", "am/seeing", "was/seen"],
    correct: 0,
    explanation: "Present perfect for life experience",
    level: "A2"
  },
  {
    template: "She ___ be at home now. Her car is in the driveway.",
    options: ["can", "must", "should", "might"],
    correct: 1,
    explanation: "Must for strong deduction",
    level: "B1"
  },
  {
    template: "If you ___ harder, you would have passed the exam.",
    options: ["study", "studied", "had studied", "have studied"],
    correct: 2,
    explanation: "Third conditional for past unreal situations",
    level: "B2"
  }
];

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
    const count = parseInt(searchParams.get('count') || '10');
    const level = searchParams.get('level');
    const random = searchParams.get('random') !== 'false'; // Por defecto true

    // Limitar el count a un máximo razonable
    const safeCount = Math.min(count, 50);

    let sentences = [...sentenceTemplates];
    
    // Filtrar por nivel si se especifica
    if (level) {
      sentences = sentences.filter(s => s.level === level);
    }

    // Mezclar usando Fisher-Yates shuffle para verdadera aleatoriedad
    if (random) {
      for (let i = sentences.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
      }
    }

    // Tomar la cantidad solicitada
    sentences = sentences.slice(0, Math.min(safeCount, sentences.length));

    return NextResponse.json({ sentences });
  } catch (error) {
    console.error('Error obteniendo oraciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

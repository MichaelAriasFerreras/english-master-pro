
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Plantillas de oraciones para el juego de gramática
const sentenceTemplates = [
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
    template: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "will be"],
    correct: 2,
    explanation: "Second conditional uses 'were' for all persons",
    level: "B1"
  },
  {
    template: "He has ___ in London for five years.",
    options: ["live", "lived", "living", "lives"],
    correct: 1,
    explanation: "Present perfect requires past participle",
    level: "A2"
  },
  {
    template: "The book ___ by millions of people.",
    options: ["read", "reads", "was read", "is reading"],
    correct: 2,
    explanation: "Passive voice in past tense",
    level: "B1"
  },
  {
    template: "I wish I ___ speak French fluently.",
    options: ["can", "could", "will", "would"],
    correct: 1,
    explanation: "Use 'could' after 'wish' for present/future wishes",
    level: "B2"
  },
  {
    template: "She ___ her homework before dinner.",
    options: ["finish", "finishes", "finished", "finishing"],
    correct: 2,
    explanation: "Past simple for completed action",
    level: "A1"
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
    template: "By next year, I ___ here for ten years.",
    options: ["work", "worked", "will work", "will have worked"],
    correct: 3,
    explanation: "Future perfect for action completed by future time",
    level: "B2"
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
    template: "The house ___ built in 1920.",
    options: ["is", "was", "has", "had"],
    correct: 1,
    explanation: "Passive voice in past tense",
    level: "A2"
  },
  {
    template: "Neither John ___ Mary came to the party.",
    options: ["or", "nor", "and", "but"],
    correct: 1,
    explanation: "'Neither' is paired with 'nor'",
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

    let sentences = [...sentenceTemplates];
    
    if (level) {
      sentences = sentences.filter(s => s.level === level);
    }

    // Mezclar y tomar la cantidad solicitada
    sentences = sentences
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, sentences.length));

    return NextResponse.json({ sentences });
  } catch (error) {
    console.error('Error obteniendo oraciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userLevel, weakAreas, interests, lessonType, difficulty } = await request.json();

    const systemPrompt = `You are an expert English lesson generator. Create a personalized, engaging English lesson based on the user's profile.

User Profile:
- Level: ${userLevel}
- Weak areas: ${weakAreas?.join(', ') || 'General improvement'}
- Interests: ${interests?.join(', ') || 'General topics'}
- Lesson type: ${lessonType || 'Mixed skills'}
- Difficulty: ${difficulty || 'Appropriate for level'}

Generate a comprehensive lesson in the following JSON format:
{
  "title": "Engaging lesson title",
  "description": "Brief description of what the lesson covers",
  "duration": "15-20 minutes",
  "objectives": [
    "Learn 10 new vocabulary words about travel",
    "Practice past tense in context"
  ],
  "warmUp": {
    "activity": "Quick conversation starter",
    "instructions": "Talk about your last vacation for 2 minutes",
    "timeLimit": "2 minutes"
  },
  "mainActivities": [
    {
      "type": "vocabulary",
      "title": "Travel Vocabulary",
      "content": "Learn these essential travel words...",
      "words": [
        {
          "word": "itinerary",
          "definition": "a planned route or journey",
          "example": "I need to check my itinerary for tomorrow's flight."
        }
      ],
      "activity": "Create sentences using each new word"
    },
    {
      "type": "grammar",
      "title": "Past Tense Practice",
      "explanation": "Use past tense to describe completed actions...",
      "examples": ["I visited Paris last year", "She traveled to Japan"],
      "practice": [
        {
          "question": "What did you do yesterday?",
          "sampleAnswer": "I went to work and had lunch with a friend."
        }
      ]
    }
  ],
  "practiceExercises": [
    {
      "type": "fill_in_the_blank",
      "instruction": "Complete the sentences with the correct past tense form",
      "questions": [
        {
          "sentence": "Last week, I _____ to the museum.",
          "answer": "went",
          "options": ["go", "went", "going"]
        }
      ]
    }
  ],
  "conversation": {
    "topic": "Travel experiences",
    "prompts": [
      "Describe your favorite trip",
      "What's one place you'd like to visit?"
    ],
    "expectedLanguage": ["Past tense", "Travel vocabulary", "Descriptive adjectives"]
  },
  "homework": {
    "task": "Write a short paragraph about a place you visited",
    "requirements": ["Use at least 5 travel vocabulary words", "Use past tense correctly"],
    "timeEstimate": "10 minutes"
  },
  "additionalResources": [
    "Travel vocabulary flashcards",
    "Past tense grammar rules summary"
  ]
}

Make the lesson engaging, practical, and perfectly suited to the user's level and interests.`;

    // Call the LLM API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: systemPrompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const result = await response.json();
    const lessonText = result.choices[0]?.message?.content;

    if (!lessonText) {
      throw new Error('No lesson generated from LLM');
    }

    const lesson = JSON.parse(lessonText);
    return NextResponse.json(lesson);

  } catch (error) {
    console.error('Error in lesson generator route:', error);
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 });
  }
}

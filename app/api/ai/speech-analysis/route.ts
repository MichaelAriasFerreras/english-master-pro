
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { spokenText, targetText, userLevel, analysisType } = await request.json();

    const systemPrompt = `You are an advanced English pronunciation and speech analysis AI. Analyze the user's spoken text compared to the target text and provide detailed feedback.

User's spoken text: "${spokenText}"
Target text: "${targetText}"
User's level: ${userLevel}
Analysis type: ${analysisType}

Provide analysis in the following JSON format:
{
  "pronunciationScore": 85,
  "overallFeedback": "Great job! Your pronunciation is clear and accurate.",
  "specificIssues": [
    {
      "word": "example",
      "issue": "The 'x' sound should be /ks/ not /gz/",
      "improvement": "Try saying 'ek-SAM-ple' with emphasis on the middle syllable"
    }
  ],
  "strengths": ["Clear consonants", "Good rhythm"],
  "areasToImprove": ["Vowel sounds", "Word stress"],
  "practiceRecommendations": [
    "Practice minimal pairs with /æ/ and /ɛ/ sounds",
    "Record yourself saying the target phrase 5 times"
  ],
  "encouragement": "You're making excellent progress! Keep practicing."
}

Focus on being constructive and encouraging while providing specific, actionable feedback.`;

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
        max_tokens: 800,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const result = await response.json();
    const analysisText = result.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis received from LLM');
    }

    const analysis = JSON.parse(analysisText);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in speech analysis route:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze speech',
      fallback: {
        pronunciationScore: 75,
        overallFeedback: "Good attempt! Keep practicing.",
        specificIssues: [],
        strengths: ["Clear speech"],
        areasToImprove: ["Continue practicing"],
        practiceRecommendations: ["Practice reading aloud daily"],
        encouragement: "You're doing great!"
      }
    }, { status: 500 });
  }
}

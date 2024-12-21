import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

interface UserProfile {
  name: string;
  bio: string;
  public_repos: number;
  hireable: boolean;
}

interface Repository {
  name: string;
  language: string;
  topics: string[];
}

interface ChatContext {
  userProfile: UserProfile;
  previousMessages: ChatMessage[];
  currentQuery: string;
  userRepos: Repository[];
  technicalContext: {
    languages: string[];
    topics: string[];
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const context: ChatContext = await request.json();

    // converts array to formatted string for AI to understand 
    const chatHistory = context.previousMessages
      .map(msg => `${msg.type.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const prompt = `
You are an experienced open source mentor helping a beginner developer. Your goal is to provide specific, actionable guidance while being encouraging and supportive.

USER TECHNICAL PROFILE:
- Languages: ${context.technicalContext.languages.join(', ')}
- Interests/Topics: ${context.technicalContext.topics.join(', ')}
- Public Repos: ${context.userProfile?.public_repos || 0}

CHAT HISTORY:
${chatHistory}

CURRENT QUESTION:
${context.currentQuery}

RESPONSE GUIDELINES:
1. Be extremely specific - break down concepts into small, manageable steps
2. Use the user's known programming languages in examples when relevant
3. Acknowledge and validate any concerns or anxieties
4. Provide concrete examples and explanations
5. Be encouraging and emphasize growth mindset
6. Use friendly, conversational tone with emojis
7. Reference specific tools or resources when applicable
8. Highlight small wins and progress
9. Always relate advice back to their skill level and interests
10. If they express difficulty, break down the task into smaller steps

Remember: This user is a beginner, so avoid jargon without explanation and always provide context for technical terms.

Please provide a response that follows these guidelines and addresses their specific question.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a supportive and knowledgeable open source mentor. Your responses should be specific, encouraging, and tailored to beginners. Use a friendly tone and provide detailed, actionable guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: responseContent });

  } catch (error) {
    console.error('Error in chat follow-up:', error);
    return NextResponse.json(
      { error: 'Failed to process chat follow-up', details: error },
      { status: 500 }
    );
  }
}
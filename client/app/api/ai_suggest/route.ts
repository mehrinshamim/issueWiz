import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the entire request body
    const fullData = await request.json();

    // Extract unique languages and topics
    const userLanguages = [...new Set(
      fullData.repositories
        .map((repo: any) => repo.language)
        .filter(Boolean)
    )];

    const userTopics = [...new Set(
      fullData.repositories
        .flatMap((repo: any) => repo.topics || [])
    )];

    // Create a comprehensive prompt
    const prompt = `
OPEN-SOURCE CONTRIBUTION MATCHER

## DEVELOPER SKILLS
- Programming Languages: ${userLanguages.join(', ')}
- Technical Interests: ${userTopics.join(', ')}

## AVAILABLE ISSUES
${fullData.repoissues.map((issue: any, index: number) => `
Issue #${index + 1}:
- Title: ${issue.title}
- Repository: ${fullData.issue_owner}/${fullData.issue_repo}
- Full GitHub Issue URL: https://github.com/${fullData.issue_owner}/${fullData.issue_repo}/issues/${issue.number}
`).join('\n')}

## RECOMMENDATION OBJECTIVE
For EACH of the above issues, provide:
1. Issue Title
2. Full GitHub Issue URL
3. Difficulty Level
4. Learning Opportunities
5. Why Recommended

IMPORTANT:
- Base recommendations on the issues provided
- Match developer's technical background
- Focus on learning potential
`;

    // Generate AI recommendation
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert open-source contribution advisor. Only respond in valid JSON format. Avoid any markdown, code blocks, or additional formatting.
          
          The response must strictly follow this JSON format:
          {
            "recommendations": [
              {
                "issue_title": "Exact Issue Title from Input",
                "issue_url": "https://github.com/{issue_owner}/{issue_repo}/issues/{issue_number}",
                "difficulty_level": "Beginner/Intermediate/Advanced",
                "learning_opportunities": "Specific skills to learn",
                "why_recommended": "Detailed explanation of why this issue is a good match"
              }
            ]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 600
    });

    const recommendationContent = completion.choices[0]?.message?.content;

    if (!recommendationContent) {
      return NextResponse.json(
        { error: 'Failed to generate recommendations' },
        { status: 500 }
      );
    }

    // Remove any unexpected formatting like backticks or non-JSON parts
    const sanitizedContent = recommendationContent.replace(/```.*?(\n|$)/g, '').trim();

    try {
      // Parse the sanitized JSON response
      const parsedRecommendations = JSON.parse(sanitizedContent);

      // Ensure recommendations follow the correct format
      if (!Array.isArray(parsedRecommendations.recommendations)) {
        throw new Error('Recommendations are not in the expected array format');
      }

      // Return the response with recommendations
      return NextResponse.json({
        reply: { recommendations: parsedRecommendations.recommendations }
      });

    } catch (error) {
      console.error('AI Recommendation Error:', error, sanitizedContent);
      return NextResponse.json(
        {
          error: 'Issue recommendation process failed',
          details: error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error during POST request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
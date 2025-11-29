import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatContext } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      userName,
      ecoMonName,
      personality,
      emotionalState,
      evolutionStage,
      memories,
      recentActions,
      chatHistory
    } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const context: ChatContext = {
      userName: userName || 'Guardian',
      ecoMonName: ecoMonName || 'Seedling',
      personality: personality || 'sage',
      emotionalState: emotionalState || {
        trust: 50,
        joy: 50,
        curiosity: 50,
        worry: 50,
        pride: 50,
      },
      evolutionStage: evolutionStage || 1,
      memories: memories || [],
      recentActions: recentActions || [],
    };
    
    const response = await generateChatResponse(
      message,
      context,
      chatHistory || []
    );
    
    return NextResponse.json({ 
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

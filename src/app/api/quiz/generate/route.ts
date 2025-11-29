import { NextRequest, NextResponse } from 'next/server';
import { generateQuizQuestions } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, difficulty = 'medium', count = 5, userId } = body;
    
    // In production, check if user has already taken quiz today
    // const today = new Date().toISOString().split('T')[0];
    // const existingAttempt = await prisma.quizAttempt.findUnique({
    //   where: { userId_quizDate: { userId, quizDate: new Date(today) } }
    // });
    // if (existingAttempt) {
    //   return NextResponse.json(
    //     { error: 'You have already completed today\'s quiz', nextAvailable: getNextQuizTime() },
    //     { status: 429 }
    //   );
    // }
    
    const questions = await generateQuizQuestions(category, difficulty, count);
    
    return NextResponse.json({
      success: true,
      questions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return quiz availability status
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return NextResponse.json({
    available: true,
    nextAvailable: tomorrow.toISOString(),
    currentStreak: 0, // Would come from database
  });
}

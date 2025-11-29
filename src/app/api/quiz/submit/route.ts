import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, questions, answers, timeSpent } = body;
    
    // More lenient validation
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions are required' },
        { status: 400 }
      );
    }
    
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }
    
    // Pad answers if needed (in case of incomplete submission)
    const paddedAnswers = [...answers];
    while (paddedAnswers.length < questions.length) {
      paddedAnswers.push(-1); // -1 means unanswered
    }
    
    // Calculate score
    let correctCount = 0;
    const results = questions.map((q: any, index: number) => {
      const isCorrect = paddedAnswers[index] === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id || index,
        selectedIndex: paddedAnswers[index],
        correctIndex: q.correctIndex,
        isCorrect,
      };
    });
    
    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Calculate rewards
    const basePoints = correctCount * 10;
    const bonusPoints = percentage === 100 ? 50 : percentage >= 80 ? 25 : 0;
    const pointsEarned = basePoints + bonusPoints;
    
    const baseXP = correctCount * 5;
    const bonusXP = percentage === 100 ? 25 : percentage >= 80 ? 10 : 0;
    const xpEarned = baseXP + bonusXP;
    
    // In production, save to database and update user stats
    // await prisma.quizAttempt.create({
    //   data: {
    //     userId,
    //     questions,
    //     answers: results,
    //     score: correctCount,
    //     totalQuestions,
    //     pointsEarned,
    //     xpEarned,
    //     timeSpent,
    //     quizDate: new Date(),
    //   }
    // });
    
    // Update user points and XP
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     ecoPoints: { increment: pointsEarned },
    //     totalXP: { increment: xpEarned },
    //   }
    // });
    
    return NextResponse.json({
      success: true,
      result: {
        score: correctCount,
        totalQuestions,
        percentage,
        pointsEarned,
        xpEarned,
        correctAnswers: correctCount,
        timeSpent,
        results,
        isPersonalBest: false, // Would check against database
        newStreak: 1, // Would calculate from database
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

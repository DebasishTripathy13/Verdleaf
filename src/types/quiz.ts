// ============================================
// QUIZ TYPES
// ============================================

export type QuizCategory = 
  | 'recycling' 
  | 'energy' 
  | 'water' 
  | 'wildlife' 
  | 'climate'
  | 'general';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  explanation: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  xpEarned: number;
  startedAt: Date;
  completedAt: Date | null;
  timeSpent: number | null;
  quizDate: Date;
}

export interface QuizState {
  isActive: boolean;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  timeRemaining: number;
  startedAt: Date | null;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  pointsEarned: number;
  xpEarned: number;
  correctAnswers: number;
  timeSpent: number;
  newStreak: number;
  isPersonalBest: boolean;
}

export interface DailyQuizStatus {
  hasCompletedToday: boolean;
  lastAttempt: QuizAttempt | null;
  streak: number;
  nextAvailable: Date;
}

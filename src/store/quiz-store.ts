import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizQuestion, QuizAnswer, QuizState, QuizResult, DailyQuizStatus } from '@/types/quiz';

interface QuizStore {
  // State
  quizState: QuizState;
  dailyStatus: DailyQuizStatus;
  lastResult: QuizResult | null;
  totalQuizzesTaken: number;
  bestScore: number;
  currentStreak: number;
  
  // Actions
  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  completeQuiz: () => QuizResult;
  resetQuiz: () => void;
  updateDailyStatus: (status: DailyQuizStatus) => void;
  decrementTimer: () => void;
  
  // Computed
  getCurrentQuestion: () => QuizQuestion | null;
  getProgress: () => { current: number; total: number };
  isQuizComplete: () => boolean;
}

const INITIAL_QUIZ_STATE: QuizState = {
  isActive: false,
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  timeRemaining: 60, // 60 seconds per question
  startedAt: null,
};

const INITIAL_DAILY_STATUS: DailyQuizStatus = {
  hasCompletedToday: false,
  lastAttempt: null,
  streak: 0,
  nextAvailable: new Date(),
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quizState: INITIAL_QUIZ_STATE,
      dailyStatus: INITIAL_DAILY_STATUS,
      lastResult: null,
      totalQuizzesTaken: 0,
      bestScore: 0,
      currentStreak: 0,
      
      startQuiz: (questions) => set({
        quizState: {
          isActive: true,
          currentQuestionIndex: 0,
          questions,
          answers: [],
          timeRemaining: 60,
          startedAt: new Date(),
        },
      }),
      
      answerQuestion: (answer) => set((state) => ({
        quizState: {
          ...state.quizState,
          answers: [...state.quizState.answers, answer],
        },
      })),
      
      nextQuestion: () => set((state) => {
        const nextIndex = state.quizState.currentQuestionIndex + 1;
        
        return {
          quizState: {
            ...state.quizState,
            currentQuestionIndex: nextIndex,
            timeRemaining: 60, // Reset timer for next question
          },
        };
      }),
      
      completeQuiz: () => {
        const state = get();
        const { questions, answers, startedAt } = state.quizState;
        
        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const totalQuestions = questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Calculate rewards
        const basePoints = correctAnswers * 10;
        const bonusPoints = percentage === 100 ? 50 : percentage >= 80 ? 25 : 0;
        const pointsEarned = basePoints + bonusPoints;
        
        const baseXP = correctAnswers * 5;
        const bonusXP = percentage === 100 ? 25 : percentage >= 80 ? 10 : 0;
        const xpEarned = baseXP + bonusXP;
        
        const timeSpent = startedAt 
          ? Math.round((Date.now() - startedAt.getTime()) / 1000)
          : 0;
        
        const isPersonalBest = percentage > state.bestScore;
        const newStreak = percentage >= 60 ? state.currentStreak + 1 : 0;
        
        const result: QuizResult = {
          score: correctAnswers,
          totalQuestions,
          percentage,
          pointsEarned,
          xpEarned,
          correctAnswers,
          timeSpent,
          newStreak,
          isPersonalBest,
        };
        
        // Update state
        set({
          lastResult: result,
          totalQuizzesTaken: state.totalQuizzesTaken + 1,
          bestScore: isPersonalBest ? percentage : state.bestScore,
          currentStreak: newStreak,
          quizState: {
            ...state.quizState,
            isActive: false,
          },
          dailyStatus: {
            ...state.dailyStatus,
            hasCompletedToday: true,
            streak: newStreak,
            nextAvailable: getNextQuizTime(),
          },
        });
        
        return result;
      },
      
      resetQuiz: () => set({
        quizState: INITIAL_QUIZ_STATE,
      }),
      
      updateDailyStatus: (status) => set({
        dailyStatus: status,
      }),
      
      decrementTimer: () => set((state) => ({
        quizState: {
          ...state.quizState,
          timeRemaining: Math.max(0, state.quizState.timeRemaining - 1),
        },
      })),
      
      getCurrentQuestion: () => {
        const state = get();
        const { questions, currentQuestionIndex } = state.quizState;
        return questions[currentQuestionIndex] || null;
      },
      
      getProgress: () => {
        const state = get();
        return {
          current: state.quizState.currentQuestionIndex + 1,
          total: state.quizState.questions.length,
        };
      },
      
      isQuizComplete: () => {
        const state = get();
        return state.quizState.currentQuestionIndex >= state.quizState.questions.length;
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        dailyStatus: state.dailyStatus,
        totalQuizzesTaken: state.totalQuizzesTaken,
        bestScore: state.bestScore,
        currentStreak: state.currentStreak,
      }),
    }
  )
);

// Helper function to get next quiz availability time
function getNextQuizTime(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// Helper to check if quiz is available today
export function isQuizAvailableToday(lastAttemptDate: Date | null): boolean {
  if (!lastAttemptDate) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastAttempt = new Date(lastAttemptDate);
  lastAttempt.setHours(0, 0, 0, 0);
  
  return today.getTime() > lastAttempt.getTime();
}

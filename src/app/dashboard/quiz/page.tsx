'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, Clock } from 'lucide-react';
import { QuizCard, QuizResults } from '@/components/quiz/QuizCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuizStore, useUserStore, useEcoMonStore, DEMO_USER } from '@/store';
import { createNewEcoMon } from '@/store';
import { QuizQuestion, QuizResult } from '@/types/quiz';

export default function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { dailyStatus, startQuiz, quizState, resetQuiz } = useQuizStore();
  const { user, setUser, updatePoints, updateXP } = useUserStore();
  const { ecomon, setEcoMon, addXP, updateEmotionalState } = useEcoMonStore();
  
  // Initialize demo user and ecomon if not set
  useEffect(() => {
    if (!user) {
      setUser(DEMO_USER);
    }
    if (!ecomon) {
      setEcoMon(createNewEcoMon('Seedling', 'sage'));
    }
  }, [user, ecomon, setUser, setEcoMon]);
  
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: 'medium',
          count: 5,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const formattedQuestions = data.questions.map((q: any, i: number) => ({
          ...q,
          id: `q-${i}`,
        }));
        setQuizQuestions(formattedQuestions);
        startQuiz(formattedQuestions);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuizComplete = async (answers: number[], timeSpent: number) => {
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: quizQuestions,
          answers,
          timeSpent,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQuizResult(data.result);
        setShowResults(true);
        
        // Update stores
        updatePoints(data.result.pointsEarned);
        updateXP(data.result.xpEarned);
        addXP(data.result.xpEarned);
        
        // Update EcoMon emotions
        const isPerfect = data.result.percentage === 100;
        updateEmotionalState({
          joy: isPerfect ? 20 : 5,
          pride: isPerfect ? 15 : 5,
          curiosity: 5,
        });
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };
  
  const handleCloseResults = () => {
    setShowResults(false);
    setQuizResult(null);
    setQuizQuestions([]);
    resetQuiz();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Eco Quiz</h1>
        <p className="text-gray-400">Test your environmental knowledge and earn rewards!</p>
      </div>
      
      {/* Quiz Not Started */}
      {!quizState.isActive && quizQuestions.length === 0 && !showResults && (
        <div className="flex justify-center">
          <Card glass className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <CardTitle className="text-white">Ready to Test Your Knowledge?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-sm text-gray-400">Questions</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <p className="text-2xl font-bold text-white">30s</p>
                  <p className="text-sm text-gray-400">Per Question</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="font-semibold text-emerald-400 mb-2">Rewards</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 10 points per correct answer</li>
                  <li>• 50 bonus points for perfect score</li>
                  <li>• XP to help your EcoMon evolve</li>
                </ul>
              </div>
              
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <Button
                onClick={handleStartQuiz}
                disabled={isLoading}
                variant="eco"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Start Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Quiz Active */}
      {quizState.isActive && quizQuestions.length > 0 && (
        <div className="flex justify-center">
          <QuizCard
            questions={quizQuestions}
            onComplete={handleQuizComplete}
            timePerQuestion={30}
          />
        </div>
      )}
      
      {/* Results Modal */}
      {showResults && quizResult && (
        <QuizResults result={quizResult} onClose={handleCloseResults} />
      )}
    </motion.div>
  );
}

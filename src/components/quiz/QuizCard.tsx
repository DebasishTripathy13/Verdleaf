'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Trophy, Flame, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion, QuizResult } from '@/types/quiz';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (answers: number[], timeSpent: number) => void;
  timePerQuestion?: number;
  className?: string;
}

export function QuizCard({
  questions,
  onComplete,
  timePerQuestion = 30,
  className,
}: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timePerQuestion);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  
  // Timer countdown
  useEffect(() => {
    if (isAnswered) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);
  
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // No answer selected
    setSelectedAnswers((prev) => [...prev, -1]);
    setShowExplanation(true);
  }, [isAnswered]);
  
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setSelectedAnswers((prev) => [...prev, optionIndex]);
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete(selectedAnswers, timeSpent);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeRemaining(timePerQuestion);
      setIsAnswered(false);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };
  
  const isCorrect = selectedOption === currentQuestion?.correctIndex;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  return (
    <Card glass className={cn('w-full max-w-2xl', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <CardTitle className="text-lg text-white">Daily Eco Quiz</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            {/* Question Counter */}
            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {questions.length}
            </span>
            
            {/* Timer */}
            <div
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                timeRemaining <= 10
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              )}
            >
              <Clock className="w-4 h-4" />
              {timeRemaining}s
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <Progress
          value={progress}
          className="h-1 mt-3 bg-gray-700"
          indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-400"
        />
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                Q{currentIndex + 1}
              </span>
              <h3 className="text-lg text-white leading-relaxed">
                {currentQuestion?.question}
              </h3>
            </div>
            
            {/* Category Badge */}
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 capitalize">
                {currentQuestion?.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 capitalize">
                {currentQuestion?.difficulty}
              </span>
            </div>
            
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = index === currentQuestion.correctIndex;
                
                let optionState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
                if (isAnswered) {
                  if (isCorrectOption) optionState = 'correct';
                  else if (isSelected) optionState = 'incorrect';
                } else if (isSelected) {
                  optionState = 'selected';
                }
                
                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelectOption(index)}
                    disabled={isAnswered}
                    className={cn(
                      'w-full p-4 rounded-xl text-left transition-all flex items-center gap-3',
                      optionState === 'default' && 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 border border-gray-700',
                      optionState === 'selected' && 'bg-blue-500/20 border-blue-500 text-blue-400',
                      optionState === 'correct' && 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
                      optionState === 'incorrect' && 'bg-red-500/20 border-red-500 text-red-400',
                      'border'
                    )}
                  >
                    <span
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                        optionState === 'default' && 'bg-gray-700 text-gray-300',
                        optionState === 'correct' && 'bg-emerald-500 text-white',
                        optionState === 'incorrect' && 'bg-red-500 text-white'
                      )}
                    >
                      {optionState === 'correct' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : optionState === 'incorrect' ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="flex-1">{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && currentQuestion?.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  'p-4 rounded-xl border',
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                )}
              >
                <div className="flex items-start gap-2">
                  <Sparkles
                    className={cn(
                      'w-5 h-5 shrink-0 mt-0.5',
                      isCorrect ? 'text-emerald-400' : 'text-amber-400'
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'font-medium mb-1',
                        isCorrect ? 'text-emerald-400' : 'text-amber-400'
                      )}
                    >
                      {isCorrect ? 'Correct! 🎉' : selectedOption === -1 ? 'Time\'s up! ⏰' : 'Not quite right'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Next Button */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button onClick={handleNext} variant="eco" size="lg">
              {isLastQuestion ? (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  See Results
                </>
              ) : (
                'Next Question →'
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Results Component
interface QuizResultsProps {
  result: QuizResult;
  onClose: () => void;
}

export function QuizResults({ result, onClose }: QuizResultsProps) {
  const isPerfect = result.percentage === 100;
  const isGreat = result.percentage >= 80;
  const isPassing = result.percentage >= 60;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card glass className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-6">
          {/* Trophy Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={cn(
              'w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl',
              isPerfect
                ? 'bg-yellow-500/20'
                : isGreat
                  ? 'bg-emerald-500/20'
                  : isPassing
                    ? 'bg-blue-500/20'
                    : 'bg-gray-500/20'
            )}
          >
            {isPerfect ? '🏆' : isGreat ? '🌟' : isPassing ? '✨' : '💪'}
          </motion.div>
          
          {/* Score */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isPerfect
                ? 'Perfect Score!'
                : isGreat
                  ? 'Great Job!'
                  : isPassing
                    ? 'Nice Try!'
                    : 'Keep Learning!'}
            </h2>
            <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {result.percentage}%
            </p>
            <p className="text-gray-400 mt-1">
              {result.correctAnswers} of {result.totalQuestions} correct
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-emerald-400">+{result.pointsEarned}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-blue-400">+{result.xpEarned}</p>
              <p className="text-xs text-gray-400">XP</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/50">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-400" />
                <p className="text-2xl font-bold text-orange-400">{result.newStreak}</p>
              </div>
              <p className="text-xs text-gray-400">Streak</p>
            </div>
          </div>
          
          {/* Personal Best */}
          {result.isPersonalBest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-yellow-400"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">New Personal Best!</span>
            </motion.div>
          )}
          
          {/* Time */}
          <p className="text-sm text-gray-500">
            Completed in {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
          </p>
          
          {/* Close Button */}
          <Button onClick={onClose} variant="eco" className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

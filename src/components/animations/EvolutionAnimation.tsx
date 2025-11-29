'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EvolutionAnimationProps {
  isAnimating: boolean;
  ecomonName: string;
  fromStage: number;
  toStage: number;
  onComplete?: () => void;
}

const stageNames = ['Sproutling', 'Bloomkin', 'Florazen', 'Terravine', 'Gaiabloom'];

export function EvolutionAnimation({
  isAnimating,
  ecomonName,
  fromStage,
  toStage,
  onComplete,
}: EvolutionAnimationProps) {
  const [phase, setPhase] = useState<'glow' | 'transform' | 'reveal' | 'complete'>('glow');
  
  useEffect(() => {
    if (isAnimating) {
      setPhase('glow');
      
      const timer1 = setTimeout(() => setPhase('transform'), 1000);
      const timer2 = setTimeout(() => setPhase('reveal'), 2500);
      const timer3 = setTimeout(() => {
        setPhase('complete');
        onComplete?.();
      }, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isAnimating, onComplete]);
  
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        >
          {/* Particle effects */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute w-2 h-2 rounded-full bg-emerald-400"
              />
            ))}
          </div>
          
          <div className="relative text-center">
            {/* Main glow effect */}
            <motion.div
              animate={{
                scale: phase === 'transform' ? [1, 2, 1.5] : 1,
                opacity: phase === 'transform' ? [0.5, 1, 0] : 0.5,
              }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 -m-32 bg-gradient-radial from-emerald-500/50 to-transparent rounded-full blur-3xl"
            />
            
            {/* Evolution icon */}
            <motion.div
              animate={{
                scale: phase === 'glow' ? [1, 1.2, 1] : 
                       phase === 'transform' ? [1, 1.5, 0.8, 1.2] : 1,
                rotate: phase === 'transform' ? [0, 360] : 0,
              }}
              transition={{
                duration: phase === 'glow' ? 1 : 2,
                repeat: phase === 'glow' ? Infinity : 0,
              }}
              className="relative z-10 w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/50"
            >
              {phase === 'reveal' || phase === 'complete' ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-6xl"
                >
                  ✨
                </motion.div>
              ) : (
                <Sparkles className="w-20 h-20 text-white" />
              )}
            </motion.div>
            
            {/* Stage indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-4"
            >
              <div className="text-center">
                <p className="text-gray-400 text-sm">From</p>
                <p className="text-xl font-bold text-white">{stageNames[fromStage - 1]}</p>
              </div>
              
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowUp className="w-6 h-6 text-emerald-400 rotate-90" />
              </motion.div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm">To</p>
                <p className="text-xl font-bold text-emerald-400">{stageNames[toStage - 1]}</p>
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mt-8"
            >
              {phase === 'glow' && 'Gathering Energy...'}
              {phase === 'transform' && 'Evolving!'}
              {phase === 'reveal' && `${ecomonName} Evolved!`}
              {phase === 'complete' && `${ecomonName} Evolved!`}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-emerald-400 mt-2"
            >
              {phase === 'reveal' || phase === 'complete' 
                ? `Now a ${stageNames[toStage - 1]}!`
                : 'Please wait...'}
            </motion.p>
            
            {/* Stage dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-2 mt-6"
            >
              {[1, 2, 3, 4, 5].map((stage) => (
                <motion.div
                  key={stage}
                  animate={{
                    scale: stage === toStage && (phase === 'reveal' || phase === 'complete')
                      ? [1, 1.3, 1]
                      : 1,
                  }}
                  transition={{ duration: 0.5, repeat: stage === toStage ? Infinity : 0 }}
                  className={`w-3 h-3 rounded-full ${
                    stage <= toStage
                      ? 'bg-emerald-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

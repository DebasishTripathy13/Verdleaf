'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Leaf, Lock, ArrowRight, Check, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EcoMonDisplay } from '@/components/ecomon/EcoMonDisplay';
import { useEcoMonStore, createNewEcoMon } from '@/store';
import { EVOLUTION_PATHS, EvolutionPathKey } from '@/constants';
import { cn } from '@/lib/utils';

export default function EvolutionPage() {
  const { ecomon, setEcoMon, evolve } = useEcoMonStore();
  const [selectedPath, setSelectedPath] = useState<EvolutionPathKey | null>(null);
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (!ecomon) {
      const demoEcoMon = createNewEcoMon('demo-user-1', 'Sproutie', 'leaf', 'cheerleader');
      demoEcoMon.evolutionStage = 2;
      demoEcoMon.evolutionXP = 65;
      demoEcoMon.emotionalState = { trust: 72, joy: 85, curiosity: 60, worry: 15, pride: 70 };
      demoEcoMon.currentMood = 'happy';
      setEcoMon(demoEcoMon);
    }
    
    if (ecomon?.evolutionPath) {
      setSelectedPath(ecomon.evolutionPath as EvolutionPathKey);
    }
  }, [ecomon, setEcoMon]);
  
  if (!mounted || !ecomon) return null;
  
  const canEvolve = ecomon.evolutionXP >= 100 && ecomon.evolutionStage < 5;
  const xpProgress = Math.min(100, ecomon.evolutionXP);
  
  const handleSelectPath = (pathKey: EvolutionPathKey) => {
    if (ecomon.evolutionPath && ecomon.evolutionPath !== pathKey) return;
    setSelectedPath(pathKey);
  };
  
  const handleEvolve = () => {
    if (!canEvolve || !selectedPath) return;
    
    setShowEvolutionAnimation(true);
    
    setTimeout(() => {
      evolve(ecomon.evolutionStage + 1, selectedPath as any);
      setShowEvolutionAnimation(false);
    }, 3000);
  };
  
  const stageNames = ['Sproutling', 'Bloomkin', 'Florazen', 'Terravine', 'Gaiabloom'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Evolution Path</h1>
        <p className="text-gray-400">Guide your EcoMon's growth through eco-actions!</p>
      </div>

      {/* Evolution Animation Overlay */}
      <AnimatePresence>
        {showEvolutionAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ duration: 2, times: [0, 0.5, 1] }}
              className="text-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full blur-3xl"
                />
                <Sparkles className="w-32 h-32 text-emerald-400 mx-auto relative z-10" />
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-3xl font-bold text-white mt-8"
              >
                Evolving...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-emerald-400 mt-2"
              >
                {ecomon.name} is transforming!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current EcoMon */}
        <Card glass>
          <CardHeader>
            <CardTitle className="text-white">Your EcoMon</CardTitle>
          </CardHeader>
          <CardContent>
            <EcoMonDisplay ecomon={ecomon} size="lg" showStats={true} />
            
            {/* Evolution Stage Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Evolution Stage</span>
                <span>{stageNames[ecomon.evolutionStage - 1]} ({ecomon.evolutionStage}/5)</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((stage) => (
                  <div
                    key={stage}
                    className={cn(
                      'flex-1 h-2 rounded-full transition-colors',
                      stage <= ecomon.evolutionStage
                        ? 'bg-emerald-500'
                        : 'bg-gray-700'
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Evolution XP */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Evolution XP</span>
                <span className="text-emerald-400">{ecomon.evolutionXP}/100</span>
              </div>
              <Progress
                value={xpProgress}
                className="h-3 bg-gray-700"
                indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-400"
              />
            </div>
            
            {canEvolve && (
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mt-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-center"
              >
                <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-emerald-400 font-medium">Ready to Evolve!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Evolution Paths */}
        <div className="lg:col-span-2">
          <Card glass>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Choose Evolution Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(EVOLUTION_PATHS).map(([key, path]) => {
                  const pathKey = key as EvolutionPathKey;
                  const isLocked = ecomon.evolutionPath && ecomon.evolutionPath !== pathKey;
                  const isSelected = selectedPath === pathKey;
                  const isCurrentPath = ecomon.evolutionPath === pathKey;
                  
                  return (
                    <motion.div
                      key={pathKey}
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      onClick={() => !isLocked && handleSelectPath(pathKey)}
                      className={cn(
                        'relative p-4 rounded-xl border-2 cursor-pointer transition-all',
                        isLocked
                          ? 'bg-gray-800/30 border-gray-700 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      )}
                    >
                      {isLocked && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      
                      {isCurrentPath && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                            `bg-${path.color}-500/20`
                          )}
                        >
                          {path.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{path.name}</h3>
                          <p className="text-xs text-gray-400">{path.requiredActions.join(' • ')}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{path.description}</p>
                      
                      <div className="text-xs text-gray-500">
                        <strong className="text-gray-400">Final Form:</strong> {path.finalForm}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Evolve Button */}
              <div className="mt-6 flex flex-col items-center gap-4">
                {selectedPath && !ecomon.evolutionPath && (
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <Info className="w-4 h-4" />
                    <span>Once chosen, you cannot change your evolution path</span>
                  </div>
                )}
                
                <Button
                  onClick={handleEvolve}
                  disabled={!canEvolve || !selectedPath}
                  variant="eco"
                  size="lg"
                  className="min-w-48"
                >
                  {!selectedPath
                    ? 'Select a Path'
                    : !canEvolve
                    ? `Need ${100 - ecomon.evolutionXP} more XP`
                    : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Evolve Now
                      </>
                    )
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evolution Tips */}
      <Card glass>
        <CardHeader>
          <CardTitle className="text-white">How to Earn Evolution XP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { action: 'Verify Eco-Actions', xp: '10-50 XP', icon: '📸' },
              { action: 'Complete Daily Quiz', xp: '25-50 XP', icon: '🧠' },
              { action: 'Maintain Streak', xp: '5 XP/day', icon: '🔥' },
              { action: 'Chat Sessions', xp: '5 XP/session', icon: '💬' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-800/50 text-center">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-medium text-white mt-2">{item.action}</p>
                <p className="text-sm text-emerald-400">{item.xp}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

'use client';

import Image from 'next/image';
import { motion, type TargetAndTransition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EcoMon, EcoMonMood } from '@/types/ecomon';
import { MOOD_EXPRESSIONS } from '@/constants/emotions';
import { SPECIES_INFO, PERSONALITY_TRAITS } from '@/constants/personalities';
import { EVOLUTION_BRANCHES } from '@/constants/evolution-paths';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface EcoMonDisplayProps {
  ecomon: EcoMon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStats?: boolean;
  showMood?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64',
};

const animations: Record<string, TargetAndTransition> = {
  float: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  bounce: {
    y: [0, -20, 0],
    transition: { duration: 0.5, repeat: Infinity },
  },
  wiggle: {
    rotate: [-3, 3, -3],
    transition: { duration: 0.5, repeat: Infinity },
  },
  glow: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 1, repeat: Infinity },
  },
  shake: {
    x: [-2, 2, -2],
    transition: { duration: 0.3, repeat: Infinity },
  },
  tilt: {
    rotate: [0, 5, 0, -5, 0],
    transition: { duration: 2, repeat: Infinity },
  },
  droop: {
    y: [0, 5, 0],
    rotate: [-2, 0, -2],
    transition: { duration: 3, repeat: Infinity },
  },
  'slow-pulse': {
    opacity: [1, 0.7, 1],
    transition: { duration: 4, repeat: Infinity },
  },
};

export function EcoMonDisplay({
  ecomon,
  size = 'lg',
  showStats = true,
  showMood = true,
  animated = true,
  className,
}: EcoMonDisplayProps) {
  const mood = MOOD_EXPRESSIONS[ecomon.currentMood];
  const species = SPECIES_INFO[ecomon.species];
  const personality = PERSONALITY_TRAITS[ecomon.personality];
  
  const animationKey = mood.animation;
  const animation = animated ? (animations[animationKey] || animations.float) : undefined;
  
  // Calculate sprite path based on evolution stage and dark form
  const getSpritePath = () => {
    if (ecomon.isDarkForm) {
      return `/ecomon/dark/stage-${Math.min(ecomon.evolutionStage, 3)}.svg`;
    }

    // Try to get sprite from evolution config
    const pathKey = ecomon.evolutionPath || 'forest-guardian'; // Default to forest-guardian
    const branch = EVOLUTION_BRANCHES[pathKey as keyof typeof EVOLUTION_BRANCHES];
    if (branch) {
      const stageConfig = branch.stages.find(s => s.stage === ecomon.evolutionStage);
      if (stageConfig?.sprite) {
        return stageConfig.sprite;
      }
    }

    if (ecomon.evolutionPath) {
      const pathFolder = ecomon.evolutionPath.replace('-', '/');
      return `/ecomon/${pathFolder}/stage-${ecomon.evolutionStage}.svg`;
    }
    return `/ecomon/base/stage-${ecomon.evolutionStage}.svg`;
  };
  
  return (
    <TooltipProvider>
      <div className={cn('flex flex-col items-center gap-4', className)}>
        {/* EcoMon Sprite */}
        <div className="relative">
          {/* Glow Effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-2xl opacity-30',
              ecomon.isDarkForm ? 'bg-purple-500' : `bg-[${species.color}]`
            )}
            style={{ backgroundColor: ecomon.isDarkForm ? '#8b5cf6' : species.color }}
          />
          
          {/* Main Sprite */}
          <motion.div
            animate={animation}
            className={cn(
              'relative rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2',
              sizeClasses[size],
              ecomon.isDarkForm ? 'border-purple-500/50' : 'border-white/20'
            )}
          >
            <Image
              src={getSpritePath()}
              alt={ecomon.name}
              fill
              className="object-contain p-2"
              onError={(e) => {
                // Fallback to placeholder if image not found
                (e.target as HTMLImageElement).src = '/ecomon/placeholder.svg';
              }}
            />
          </motion.div>
          
          {/* Mood Indicator */}
          {showMood && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 text-2xl bg-white/90 dark:bg-gray-800/90 rounded-full p-1 shadow-lg cursor-help"
                >
                  {mood.emoji}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{mood.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Corruption Warning */}
          {ecomon.corruptionLevel > 50 && !ecomon.isDarkForm && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -left-1 text-xl"
            >
              ⚠️
            </motion.div>
          )}
        </div>
        
        {/* Name & Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">{ecomon.name}</h3>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <span>{species.icon}</span>
            <span>{species.name}</span>
            <span>•</span>
            <span>{personality.icon}</span>
            <span>{personality.name}</span>
          </div>
          <p className="text-sm text-gray-400">
            Stage {ecomon.evolutionStage} • Level {Math.floor(ecomon.evolutionXP / 20) + 1}
          </p>
        </div>
        
        {/* Stats */}
        {showStats && (
          <Card glass className="w-full max-w-xs">
            <CardContent className="p-4 space-y-3">
              {/* Evolution Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Evolution</span>
                  <span className="text-emerald-400">
                    {ecomon.evolutionXP}/{ecomon.evolutionXPNeeded} XP
                  </span>
                </div>
                <Progress
                  value={(ecomon.evolutionXP / ecomon.evolutionXPNeeded) * 100}
                  className="h-2 bg-gray-700"
                  indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-400"
                />
              </div>
              
              {/* Emotional Stats */}
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(ecomon.emotionalState).map(([key, value]) => (
                  <Tooltip key={key}>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center gap-1">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ 
                            backgroundColor: `${getEmotionColor(key)}20`,
                            color: getEmotionColor(key)
                          }}
                        >
                          {value}
                        </div>
                        <span className="text-[10px] text-gray-400 capitalize">
                          {key.slice(0, 3)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="capitalize">{key}: {value}/100</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              
              {/* Corruption Bar (if any) */}
              {ecomon.corruptionLevel > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Corruption</span>
                    <span className="text-red-400">{ecomon.corruptionLevel}%</span>
                  </div>
                  <Progress
                    value={ecomon.corruptionLevel}
                    className="h-2 bg-gray-700"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-red-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    trust: '#3b82f6',
    joy: '#eab308',
    curiosity: '#8b5cf6',
    worry: '#ef4444',
    pride: '#22c55e',
  };
  return colors[emotion] || '#6b7280';
}

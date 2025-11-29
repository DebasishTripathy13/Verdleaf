import { EcoMonMood, EmotionalState } from '@/types/ecomon';

export const DEFAULT_EMOTIONAL_STATE: EmotionalState = {
  trust: 50,
  joy: 50,
  curiosity: 50,
  worry: 50,
  pride: 50,
};

export const EMOTION_THRESHOLDS = {
  low: 30,
  medium: 60,
  high: 80,
};

export const MOOD_EXPRESSIONS: Record<EcoMonMood, {
  emoji: string;
  description: string;
  animation: string;
  dialogueModifier: string;
}> = {
  happy: {
    emoji: '😊',
    description: 'Feeling joyful and content',
    animation: 'bounce',
    dialogueModifier: 'cheerful and warm',
  },
  sad: {
    emoji: '😢',
    description: 'Feeling a bit down',
    animation: 'droop',
    dialogueModifier: 'subdued and gentle',
  },
  excited: {
    emoji: '🤩',
    description: 'Bursting with excitement!',
    animation: 'wiggle',
    dialogueModifier: 'enthusiastic and energetic',
  },
  curious: {
    emoji: '🤔',
    description: 'Pondering and wondering',
    animation: 'tilt',
    dialogueModifier: 'inquisitive and thoughtful',
  },
  worried: {
    emoji: '😟',
    description: 'Concerned about something',
    animation: 'shake',
    dialogueModifier: 'anxious and caring',
  },
  proud: {
    emoji: '🥹',
    description: 'Feeling accomplished',
    animation: 'glow',
    dialogueModifier: 'confident and encouraging',
  },
  content: {
    emoji: '😌',
    description: 'Peaceful and satisfied',
    animation: 'float',
    dialogueModifier: 'calm and balanced',
  },
  sleepy: {
    emoji: '😴',
    description: 'Getting drowsy',
    animation: 'slow-pulse',
    dialogueModifier: 'drowsy and peaceful',
  },
  energetic: {
    emoji: '⚡',
    description: 'Full of energy!',
    animation: 'pulse',
    dialogueModifier: 'dynamic and lively',
  },
  thoughtful: {
    emoji: '💭',
    description: 'Deep in thought',
    animation: 'float',
    dialogueModifier: 'contemplative and wise',
  },
};

export const EMOTION_TRIGGERS = {
  trust: {
    increase: [
      'daily_login',
      'completed_quest',
      'honest_upload',
      'consistent_activity',
    ],
    decrease: [
      'long_absence',
      'failed_verification',
      'suspicious_activity',
    ],
  },
  joy: {
    increase: [
      'milestone_reached',
      'evolution_unlocked',
      'quiz_perfect_score',
      'streak_extended',
    ],
    decrease: [
      'quest_failed',
      'streak_broken',
      'negative_feedback',
    ],
  },
  curiosity: {
    increase: [
      'new_eco_fact',
      'new_quest_type',
      'exploration_action',
      'learning_moment',
    ],
    decrease: [
      'repetitive_actions',
      'no_new_content',
    ],
  },
  worry: {
    increase: [
      'long_inactivity',
      'skipped_challenge',
      'low_eco_actions',
      'corruption_rising',
    ],
    decrease: [
      'resumed_activity',
      'completed_action',
      'positive_progress',
    ],
  },
  pride: {
    increase: [
      'badge_earned',
      'high_score',
      'community_recognition',
      'evolution_achieved',
    ],
    decrease: [
      'low_performance',
      'lost_ranking',
    ],
  },
};

export function calculateMood(emotionalState: EmotionalState): EcoMonMood {
  const { trust, joy, curiosity, worry, pride } = emotionalState;
  
  // Priority-based mood calculation
  if (worry > EMOTION_THRESHOLDS.high) return 'worried';
  if (joy > EMOTION_THRESHOLDS.high && pride > EMOTION_THRESHOLDS.medium) return 'excited';
  if (pride > EMOTION_THRESHOLDS.high) return 'proud';
  if (joy > EMOTION_THRESHOLDS.high) return 'happy';
  if (curiosity > EMOTION_THRESHOLDS.high) return 'curious';
  if (trust < EMOTION_THRESHOLDS.low && joy < EMOTION_THRESHOLDS.low) return 'sad';
  
  // Calculate average for general state
  const avg = (trust + joy + curiosity + (100 - worry) + pride) / 5;
  
  if (avg > EMOTION_THRESHOLDS.high) return 'energetic';
  if (avg > EMOTION_THRESHOLDS.medium) return 'content';
  if (avg > EMOTION_THRESHOLDS.low) return 'thoughtful';
  
  return 'sleepy';
}

export function getEmotionColor(emotion: keyof EmotionalState): string {
  const colors: Record<keyof EmotionalState, string> = {
    trust: '#3b82f6',    // blue
    joy: '#eab308',      // yellow
    curiosity: '#8b5cf6', // purple
    worry: '#ef4444',     // red
    pride: '#22c55e',     // green
  };
  return colors[emotion];
}

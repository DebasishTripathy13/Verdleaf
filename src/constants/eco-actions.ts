import { EcoAction, EcoActionType } from '@/types/ecomon';

export const ECO_ACTIONS: Record<EcoActionType, EcoAction> = {
  recycle: {
    type: 'recycle',
    name: 'Recycle',
    description: 'Properly sort and recycle materials',
    icon: '♻️',
    basePoints: 10,
    baseXP: 5,
    category: 'recycling',
  },
  'plant-tree': {
    type: 'plant-tree',
    name: 'Plant a Tree',
    description: 'Plant a tree or seedling',
    icon: '🌳',
    basePoints: 50,
    baseXP: 25,
    category: 'nature',
  },
  'clean-beach': {
    type: 'clean-beach',
    name: 'Beach Cleanup',
    description: 'Clean up trash from beaches or waterways',
    icon: '🏖️',
    basePoints: 40,
    baseXP: 20,
    category: 'nature',
  },
  'public-transit': {
    type: 'public-transit',
    name: 'Public Transit',
    description: 'Use bus, train, or subway instead of driving',
    icon: '🚌',
    basePoints: 15,
    baseXP: 8,
    category: 'transport',
  },
  'bike-commute': {
    type: 'bike-commute',
    name: 'Bike Commute',
    description: 'Cycle instead of driving',
    icon: '🚲',
    basePoints: 20,
    baseXP: 10,
    category: 'transport',
  },
  compost: {
    type: 'compost',
    name: 'Compost',
    description: 'Compost organic waste',
    icon: '🌱',
    basePoints: 15,
    baseXP: 8,
    category: 'recycling',
  },
  'reusable-bag': {
    type: 'reusable-bag',
    name: 'Reusable Bag',
    description: 'Use reusable bags for shopping',
    icon: '🛍️',
    basePoints: 5,
    baseXP: 3,
    category: 'recycling',
  },
  'energy-saving': {
    type: 'energy-saving',
    name: 'Energy Saving',
    description: 'Reduce energy consumption',
    icon: '💡',
    basePoints: 25,
    baseXP: 12,
    category: 'energy',
  },
  'water-saving': {
    type: 'water-saving',
    name: 'Water Conservation',
    description: 'Reduce water usage',
    icon: '💧',
    basePoints: 20,
    baseXP: 10,
    category: 'water',
  },
  'wildlife-help': {
    type: 'wildlife-help',
    name: 'Wildlife Support',
    description: 'Help local wildlife (bird feeders, bee houses, etc.)',
    icon: '🦋',
    basePoints: 30,
    baseXP: 15,
    category: 'nature',
  },
};

export const ACTION_CATEGORIES = {
  recycling: {
    name: 'Recycling',
    icon: '♻️',
    color: '#22c55e',
    description: 'Reduce, reuse, recycle!',
  },
  energy: {
    name: 'Energy',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Save power, save the planet',
  },
  water: {
    name: 'Water',
    icon: '💧',
    color: '#0ea5e9',
    description: 'Every drop counts',
  },
  transport: {
    name: 'Transport',
    icon: '🚲',
    color: '#8b5cf6',
    description: 'Green commuting',
  },
  nature: {
    name: 'Nature',
    icon: '🌿',
    color: '#10b981',
    description: 'Protect our ecosystems',
  },
};

export const DAILY_QUESTS = [
  {
    id: 'daily-recycle',
    title: 'Daily Recycler',
    description: 'Recycle at least one item today',
    actionType: 'recycle' as EcoActionType,
    targetCount: 1,
    pointReward: 20,
    xpReward: 10,
  },
  {
    id: 'daily-transit',
    title: 'Green Commuter',
    description: 'Use public transit or bike to work',
    actionType: 'public-transit' as EcoActionType,
    targetCount: 1,
    pointReward: 25,
    xpReward: 15,
  },
  {
    id: 'daily-water',
    title: 'Water Warrior',
    description: 'Take a shorter shower or fix a leak',
    actionType: 'water-saving' as EcoActionType,
    targetCount: 1,
    pointReward: 20,
    xpReward: 10,
  },
];

export const WEEKLY_QUESTS = [
  {
    id: 'weekly-cleanup',
    title: 'Weekend Warrior',
    description: 'Participate in a cleanup event',
    actionType: 'clean-beach' as EcoActionType,
    targetCount: 1,
    pointReward: 100,
    xpReward: 50,
  },
  {
    id: 'weekly-plant',
    title: 'Green Thumb',
    description: 'Plant something this week',
    actionType: 'plant-tree' as EcoActionType,
    targetCount: 1,
    pointReward: 80,
    xpReward: 40,
  },
];

export function getActionRewards(actionType: EcoActionType, confidence: number = 1) {
  const action = ECO_ACTIONS[actionType];
  return {
    points: Math.round(action.basePoints * confidence),
    xp: Math.round(action.baseXP * confidence),
  };
}

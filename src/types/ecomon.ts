// ============================================
// ECOMON TYPES
// ============================================

export type EcoMonSpecies = 'leaf' | 'water' | 'fire' | 'earth' | 'air';

export type EcoMonPersonality = 'sage' | 'cheerleader' | 'scientist' | 'empath';

export type EcoMonMood = 
  | 'happy' 
  | 'sad' 
  | 'excited' 
  | 'curious' 
  | 'worried' 
  | 'proud' 
  | 'content' 
  | 'sleepy'
  | 'energetic'
  | 'thoughtful';

export interface EmotionalState {
  trust: number;      // 0-100
  joy: number;        // 0-100
  curiosity: number;  // 0-100
  worry: number;      // 0-100
  pride: number;      // 0-100
}

export interface EcoMonStats {
  happiness: number;  // 0-100
  energy: number;     // 0-100
  hunger: number;     // 0-100
}

export interface EcoMonMemory {
  id: string;
  type: 'action' | 'chat' | 'milestone' | 'evolution';
  content: string;
  timestamp: Date;
  emotion: EcoMonMood;
}

export interface EcoMon {
  id: string;
  userId: string;
  name: string;
  species: EcoMonSpecies;
  personality: EcoMonPersonality;
  
  // Evolution
  evolutionStage: number;
  evolutionPath: EvolutionPath | null;
  evolutionXP: number;
  evolutionXPNeeded: number;
  
  // Emotional State
  emotionalState: EmotionalState;
  currentMood: EcoMonMood;
  
  // Stats
  stats: EcoMonStats;
  
  // Memories
  memories: EcoMonMemory[];
  
  // Dark Evolution
  corruptionLevel: number;
  isDarkForm: boolean;
  
  // NFT
  nftTokenId: string | null;
  nftMintedAt: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// EVOLUTION TYPES
// ============================================

export type EvolutionPath = 
  | 'forest-guardian'
  | 'ocean-keeper'
  | 'urban-sage'
  | 'sky-watcher'
  | 'flame-keeper';

export interface EvolutionRequirement {
  actionType: string;
  count: number;
}

export interface EvolutionStage {
  stage: number;
  name: string;
  description: string;
  xpRequired: number;
  sprite: string;
  abilities: string[];
}

export interface EvolutionBranch {
  path: EvolutionPath;
  name: string;
  description: string;
  requirements: EvolutionRequirement[];
  stages: EvolutionStage[];
  element: EcoMonSpecies;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  walletAddress: string | null;
  email: string | null;
  name: string | null;
  avatar: string | null;
  
  ecoPoints: number;
  ecoTokens: number;
  totalXP: number;
  level: number;
  streak: number;
  lastActiveAt: Date;
  
  ecomon: EcoMon | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ACTION TYPES
// ============================================

export type EcoActionType = 
  | 'recycle'
  | 'plant-tree'
  | 'clean-beach'
  | 'public-transit'
  | 'bike-commute'
  | 'compost'
  | 'reusable-bag'
  | 'energy-saving'
  | 'water-saving'
  | 'wildlife-help';

export interface EcoAction {
  type: EcoActionType;
  name: string;
  description: string;
  icon: string;
  basePoints: number;
  baseXP: number;
  category: 'recycling' | 'energy' | 'water' | 'transport' | 'nature';
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  EcoMon, 
  EcoMonMood, 
  EcoMonPersonality, 
  EcoMonSpecies, 
  EmotionalState,
  EvolutionPath 
} from '@/types/ecomon';
import { DEFAULT_EMOTIONAL_STATE, calculateMood } from '@/constants/emotions';

interface EcoMonState {
  ecomon: EcoMon | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEcoMon: (ecomon: EcoMon | null) => void;
  updateEmotionalState: (updates: Partial<EmotionalState>) => void;
  updateMood: () => void;
  addMemory: (memory: { type: string; content: string }) => void;
  addXP: (amount: number) => void;
  evolve: (newStage: number, path?: EvolutionPath) => void;
  increaseCorruption: (amount: number) => void;
  decreaseCorruption: (amount: number) => void;
  resetEcoMon: () => void;
  
  // Computed
  canEvolve: () => boolean;
  getEvolutionProgress: () => number;
}

export const useEcoMonStore = create<EcoMonState>()(
  persist(
    (set, get) => ({
      ecomon: null,
      isLoading: false,
      error: null,
      
      setEcoMon: (ecomon) => set({ ecomon }),
      
      updateEmotionalState: (updates) => set((state) => {
        if (!state.ecomon) return state;
        
        const newEmotionalState = {
          ...state.ecomon.emotionalState,
          ...updates,
        };
        
        // Clamp values between 0-100
        Object.keys(newEmotionalState).forEach((key) => {
          const k = key as keyof EmotionalState;
          newEmotionalState[k] = Math.max(0, Math.min(100, newEmotionalState[k]));
        });
        
        const newMood = calculateMood(newEmotionalState);
        
        return {
          ecomon: {
            ...state.ecomon,
            emotionalState: newEmotionalState,
            currentMood: newMood,
          },
        };
      }),
      
      updateMood: () => set((state) => {
        if (!state.ecomon) return state;
        
        const newMood = calculateMood(state.ecomon.emotionalState);
        return {
          ecomon: {
            ...state.ecomon,
            currentMood: newMood,
          },
        };
      }),
      
      addMemory: (memory) => set((state) => {
        if (!state.ecomon) return state;
        
        const newMemory = {
          id: Date.now().toString(),
          type: memory.type as 'action' | 'chat' | 'milestone' | 'evolution',
          content: memory.content,
          timestamp: new Date(),
          emotion: state.ecomon.currentMood,
        };
        
        // Keep only last 50 memories
        const memories = [...state.ecomon.memories, newMemory].slice(-50);
        
        return {
          ecomon: {
            ...state.ecomon,
            memories,
          },
        };
      }),
      
      addXP: (amount) => set((state) => {
        if (!state.ecomon) return state;
        
        const newXP = state.ecomon.evolutionXP + amount;
        const canEvolve = newXP >= state.ecomon.evolutionXPNeeded;
        
        return {
          ecomon: {
            ...state.ecomon,
            evolutionXP: newXP,
          },
        };
      }),
      
      evolve: (newStage, path) => set((state) => {
        if (!state.ecomon) return state;
        
        return {
          ecomon: {
            ...state.ecomon,
            evolutionStage: newStage,
            evolutionPath: path || state.ecomon.evolutionPath,
            evolutionXP: 0,
            evolutionXPNeeded: newStage * 100 + 100,
          },
        };
      }),
      
      increaseCorruption: (amount) => set((state) => {
        if (!state.ecomon) return state;
        
        const newCorruption = Math.min(100, state.ecomon.corruptionLevel + amount);
        const isDarkForm = newCorruption >= 100;
        
        return {
          ecomon: {
            ...state.ecomon,
            corruptionLevel: newCorruption,
            isDarkForm,
          },
        };
      }),
      
      decreaseCorruption: (amount) => set((state) => {
        if (!state.ecomon) return state;
        
        const newCorruption = Math.max(0, state.ecomon.corruptionLevel - amount);
        
        return {
          ecomon: {
            ...state.ecomon,
            corruptionLevel: newCorruption,
            isDarkForm: newCorruption >= 100,
          },
        };
      }),
      
      resetEcoMon: () => set({ ecomon: null }),
      
      canEvolve: () => {
        const state = get();
        if (!state.ecomon) return false;
        return state.ecomon.evolutionXP >= state.ecomon.evolutionXPNeeded && state.ecomon.evolutionStage < 5;
      },
      
      getEvolutionProgress: () => {
        const state = get();
        if (!state.ecomon) return 0;
        return (state.ecomon.evolutionXP / state.ecomon.evolutionXPNeeded) * 100;
      },
    }),
    {
      name: 'ecomon-storage',
      partialize: (state) => ({ ecomon: state.ecomon }),
    }
  )
);

// Helper function to create a new EcoMon
export function createNewEcoMon(
  userId: string,
  name: string,
  species: EcoMonSpecies = 'leaf',
  personality: EcoMonPersonality = 'sage'
): EcoMon {
  return {
    id: Date.now().toString(),
    userId,
    name,
    species,
    personality,
    evolutionStage: 1,
    evolutionPath: null,
    evolutionXP: 0,
    evolutionXPNeeded: 100,
    emotionalState: DEFAULT_EMOTIONAL_STATE,
    currentMood: 'content',
    stats: {
      happiness: 50,
      energy: 100,
      hunger: 0,
    },
    memories: [],
    corruptionLevel: 0,
    isDarkForm: false,
    nftTokenId: null,
    nftMintedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

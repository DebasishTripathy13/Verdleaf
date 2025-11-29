import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/ecomon';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  updatePoints: (points: number) => void;
  updateXP: (xp: number) => void;
  updateTokens: (tokens: number) => void;
  updateStreak: (streak: number) => void;
  logout: () => void;
  
  // Computed
  getLevel: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
      }),
      
      updatePoints: (points) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            ecoPoints: state.user.ecoPoints + points,
          },
        };
      }),
      
      updateXP: (xp) => set((state) => {
        if (!state.user) return state;
        const newXP = state.user.totalXP + xp;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        
        return {
          user: {
            ...state.user,
            totalXP: newXP,
            level: newLevel,
          },
        };
      }),
      
      updateTokens: (tokens) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            ecoTokens: state.user.ecoTokens + tokens,
          },
        };
      }),
      
      updateStreak: (streak) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            streak,
            lastActiveAt: new Date(),
          },
        };
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
      }),
      
      getLevel: () => {
        const state = get();
        if (!state.user) return 1;
        return Math.floor(Math.sqrt(state.user.totalXP / 100)) + 1;
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Demo user for testing
export const DEMO_USER: User = {
  id: 'demo-user-1',
  walletAddress: null,
  email: 'demo@ecomon.io',
  name: 'Eco Guardian',
  avatar: '/ecomon/sproutling.png',
  ecoPoints: 1250,
  ecoTokens: 50,
  totalXP: 850,
  level: 3,
  streak: 7,
  lastActiveAt: new Date(),
  ecomon: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

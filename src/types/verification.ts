// ============================================
// VERIFICATION TYPES
// ============================================

import { EcoActionType } from './ecomon';

export interface Verification {
  id: string;
  userId: string;
  
  // Image Data
  imageUrl: string;
  imageHash: string | null;
  
  // Action Details
  actionType: EcoActionType;
  description: string | null;
  
  // Location & Time
  latitude: number | null;
  longitude: number | null;
  timestamp: Date;
  
  // AI Verification
  geminiAnalysis: GeminiAnalysis | null;
  confidence: number | null;
  isVerified: boolean;
  verifiedAt: Date | null;
  
  // Community Flagging
  flagCount: number;
  isFlagged: boolean;
  flagReason: string | null;
  
  // Rewards
  pointsAwarded: number;
  xpAwarded: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface GeminiAnalysis {
  isVerified: boolean;
  confidence: number;
  actionType: string | null;
  description: string;
  detectedObjects: string[];
  suggestions: string[];
  environmentalImpact: string;
  pointsRecommended: number;
}

export interface VerificationRequest {
  imageBase64: string;
  mimeType: string;
  actionType?: EcoActionType;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface VerificationResponse {
  success: boolean;
  verification: Verification | null;
  analysis: GeminiAnalysis | null;
  error?: string;
}

export interface VerificationStats {
  totalVerifications: number;
  successfulVerifications: number;
  totalPointsEarned: number;
  totalXPEarned: number;
  actionBreakdown: Record<EcoActionType, number>;
}

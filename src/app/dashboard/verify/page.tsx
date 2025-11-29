'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageUploader } from '@/components/verify/ImageUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore, useEcoMonStore, DEMO_USER, createNewEcoMon } from '@/store';
import { Sparkles, TrendingUp, Trophy } from 'lucide-react';

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  actionType: string | null;
  description: string;
  suggestions: string[];
  detectedObjects: string[];
  environmentalImpact: string;
  pointsRecommended: number;
}

export default function VerifyPage() {
  const [verificationCount, setVerificationCount] = useState(3); // Demo value
  const { user, setUser, updatePoints, updateXP } = useUserStore();
  const { ecomon, setEcoMon, addXP, updateEmotionalState, addMemory } = useEcoMonStore();
  
  // Initialize demo user and ecomon if not set
  useEffect(() => {
    if (!user) {
      setUser(DEMO_USER);
    }
    if (!ecomon) {
      setEcoMon(createNewEcoMon('Seedling', 'sage'));
    }
  }, [user, ecomon, setUser, setEcoMon]);
  
  const handleVerify = async (imageBase64: string, mimeType: string): Promise<VerificationResult> => {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        mimeType,
      }),
    });
    
    const data = await response.json();
    
    if (data.success && data.verification) {
      return data.verification;
    }
    
    throw new Error(data.error || 'Verification failed');
  };
  
  const handleVerificationSuccess = (result: VerificationResult) => {
    // Update user stats
    updatePoints(result.pointsRecommended);
    updateXP(Math.round(result.pointsRecommended / 2));
    
    // Update EcoMon
    addXP(Math.round(result.pointsRecommended / 2));
    updateEmotionalState({
      joy: 10,
      pride: 15,
      trust: 5,
    });
    
    // Add memory
    addMemory({
      type: 'action',
      content: `Verified ${result.actionType}: ${result.description}`,
    });
    
    setVerificationCount((prev) => prev + 1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Verify Eco-Action</h1>
        <p className="text-gray-400">Upload a photo of your eco-action to earn rewards!</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-2 flex justify-center">
          <ImageUploader
            onVerify={handleVerify}
            onSuccess={handleVerificationSuccess}
          />
        </div>
        
        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Your Stats */}
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Your Verification Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-800/50">
                  <p className="text-2xl font-bold text-emerald-400">{verificationCount}</p>
                  <p className="text-xs text-gray-400">Total Verified</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-800/50">
                  <p className="text-2xl font-bold text-blue-400">89%</p>
                  <p className="text-xs text-gray-400">Success Rate</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-emerald-400">Most Verified</span>
                </div>
                <p className="text-sm text-gray-300">Recycling (45%)</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Tips */}
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Tips for Better Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">📸</span>
                  <span>Take clear, well-lit photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">🎯</span>
                  <span>Focus on the eco-action itself</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">📍</span>
                  <span>Include context in your photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">❌</span>
                  <span>Avoid stock photos or screenshots</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Accepted Actions */}
          <Card glass>
            <CardHeader>
              <CardTitle className="text-white text-lg">Accepted Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  '♻️ Recycling',
                  '🌳 Tree Planting',
                  '🏖️ Beach Cleanup',
                  '🚌 Public Transit',
                  '🚲 Biking',
                  '🌱 Composting',
                  '💡 Energy Saving',
                  '💧 Water Saving',
                ].map((action, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

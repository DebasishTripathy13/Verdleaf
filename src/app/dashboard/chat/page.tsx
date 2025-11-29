'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useEcoMonStore, useUserStore, createNewEcoMon } from '@/store';
import { DEMO_USER } from '@/store/user-store';

export default function ChatPage() {
  const { user, setUser } = useUserStore();
  const { ecomon, setEcoMon, addMemory, updateEmotionalState } = useEcoMonStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (!user) {
      setUser(DEMO_USER);
    }
    
    if (!ecomon) {
      const demoEcoMon = createNewEcoMon('demo-user-1', 'Sproutie', 'leaf', 'cheerleader');
      demoEcoMon.evolutionStage = 2;
      demoEcoMon.emotionalState = { trust: 72, joy: 85, curiosity: 60, worry: 15, pride: 70 };
      demoEcoMon.currentMood = 'happy';
      setEcoMon(demoEcoMon);
    }
  }, [user, ecomon, setUser, setEcoMon]);
  
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userName: user?.name || 'Guardian',
          ecoMonName: ecomon?.name || 'Sproutie',
          personality: ecomon?.personality || 'cheerleader',
          emotionalState: ecomon?.emotionalState,
          evolutionStage: ecomon?.evolutionStage,
          memories: ecomon?.memories?.slice(-5).map(m => m.content) || [],
          recentActions: [],
          chatHistory: [],
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add to memories
        addMemory({
          type: 'chat',
          content: `User: "${message.slice(0, 50)}..."`,
        });
        
        // Increase joy and trust slightly
        updateEmotionalState({
          joy: Math.min(100, (ecomon?.emotionalState.joy || 50) + 2),
          trust: Math.min(100, (ecomon?.emotionalState.trust || 50) + 1),
        });
        
        return data.response;
      }
      
      return "I'm having trouble responding right now. Let's try again! 🌱";
    } catch (error) {
      console.error('Chat error:', error);
      return "Oops! Something went wrong. Don't worry, I'm still here for you! 💚";
    }
  };
  
  if (!mounted) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[calc(100vh-12rem)]"
    >
      <ChatInterface
        ecomonName={ecomon?.name || 'Sproutie'}
        personality={ecomon?.personality || 'cheerleader'}
        onSendMessage={handleSendMessage}
      />
    </motion.div>
  );
}

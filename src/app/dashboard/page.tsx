'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Camera, 
  Brain, 
  Sparkles, 
  Trophy,
  ArrowRight,
  ShoppingBag,
  Leaf,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EcoMonDisplay } from '@/components/ecomon/EcoMonDisplay';
import { useUserStore, useEcoMonStore, createNewEcoMon, DEMO_USER } from '@/store';
import { getGreeting } from '@/lib/utils';

const quickActions = [
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat', color: 'emerald' },
  { href: '/dashboard/verify', icon: Camera, label: 'Verify', color: 'teal' },
  { href: '/dashboard/quiz', icon: Brain, label: 'Quiz', color: 'green' },
  { href: '/dashboard/store', icon: ShoppingBag, label: 'Store', color: 'lime' },
];

const recentActivities = [
  { action: 'Completed eco-quiz!', points: 35, time: '2 hours ago', icon: '🧠' },
  { action: 'Verdleaf leveled up!', points: 50, time: '5 hours ago', icon: '🌱' },
  { action: 'Verified recycling', points: 20, time: 'Yesterday', icon: '♻️' },
  { action: 'Chat with Verdleaf', points: 5, time: 'Yesterday', icon: '💬' },
];

export default function DashboardPage() {
  const { user, setUser } = useUserStore();
  const { ecomon, setEcoMon } = useEcoMonStore();
  const [mounted, setMounted] = useState(false);
  
  // Initialize demo data
  useEffect(() => {
    setMounted(true);
    
    // Set demo user if not logged in
    if (!user) {
      setUser(DEMO_USER);
    }
    
    // Create demo EcoMon if none exists
    if (!ecomon) {
      const demoEcoMon = createNewEcoMon('demo-user-1', 'Sproutie', 'leaf', 'cheerleader');
      demoEcoMon.evolutionStage = 2;
      demoEcoMon.evolutionXP = 65;
      demoEcoMon.emotionalState = { trust: 72, joy: 85, curiosity: 60, worry: 15, pride: 70 };
      demoEcoMon.currentMood = 'happy';
      setEcoMon(demoEcoMon);
    }
  }, [user, ecomon, setUser, setEcoMon]);
  
  if (!mounted) return null;
  
  const userData = user || DEMO_USER;
  const greeting = getGreeting();
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting}, {userData.name}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Your Verdleaf companion is excited to see you today!
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Leaf className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="text-2xl font-bold text-emerald-400">{userData.streak} days</p>
            <p className="text-sm text-gray-400">Eco Streak</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* EcoMon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card glass className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Leaf className="w-5 h-5 text-emerald-400" />
                Your Verdleaf
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ecomon ? (
                <EcoMonDisplay ecomon={ecomon} size="md" showStats={true} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Leaf className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Loading your Verdleaf...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card glass>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold text-white">{userData.ecoPoints}</p>
                <p className="text-sm text-gray-400">Eco Points</p>
              </CardContent>
            </Card>
            
            <Card glass>
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold text-white">{userData.totalXP}</p>
                <p className="text-sm text-gray-400">Total XP</p>
              </CardContent>
            </Card>
            
            <Card glass>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold text-white">Level {userData.level}</p>
                <p className="text-sm text-gray-400">Guardian Rank</p>
              </CardContent>
            </Card>
            
            <Card glass>
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400">Quizzes Done</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card glass>
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/30 text-center cursor-pointer transition-all hover:bg-${action.color}-500/20`}
                    >
                      <action.icon className={`w-8 h-8 mx-auto mb-2 text-${action.color}-400`} />
                      <p className="font-medium text-white">{action.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Daily Quests */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-400">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{activity.action}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">+{activity.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="text-white">Daily Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Complete Daily Quiz', progress: 100, reward: 30, icon: '🧠', href: '/dashboard/quiz' },
                  { title: 'Verify 1 Eco-Action', progress: 0, reward: 25, icon: '📸', href: '/dashboard/verify' },
                  { title: 'Chat with EcoMon', progress: 50, reward: 10, icon: '💬', href: '/dashboard/chat' },
                  { title: 'Share on Social', progress: 0, reward: 20, icon: '📢', href: 'https://twitter.com/intent/tweet?text=Check%20out%20Verdleaf!%20I%27m%20saving%20the%20planet%20one%20action%20at%20a%20time.%20%23Verdleaf', external: true },
                ].map((quest, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{quest.icon}</span>
                        <div>
                          <p className="font-medium text-white">{quest.title}</p>
                          <p className="text-sm text-emerald-400">+{quest.reward} points</p>
                        </div>
                      </div>
                      {quest.progress === 100 ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                          ✓ Done
                        </span>
                      ) : (
                        <Link href={quest.href} target={quest.external ? "_blank" : undefined}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Start
                          </Button>
                        </Link>
                      )}
                    </div>
                    <Progress
                      value={quest.progress}
                      className="h-2 bg-gray-700"
                      indicatorClassName={quest.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Eco Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card glass className="bg-gradient-to-r from-emerald-500/10 to-green-500/10">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl shrink-0">
                💡
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-white mb-1">Eco Tip of the Day</h3>
                <p className="text-gray-300">
                  Switching to LED bulbs can reduce energy consumption by up to 75% compared to 
                  incandescent bulbs. One LED bulb can save over $100 in electricity costs over its lifetime!
                </p>
              </div>
              <Button variant="eco" className="shrink-0">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

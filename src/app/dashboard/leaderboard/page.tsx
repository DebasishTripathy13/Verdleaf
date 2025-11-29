'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Leaf, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Demo leaderboard data
const leaderboardData = {
  global: [
    { rank: 1, name: 'EcoWarrior99', points: 12450, streak: 45, level: 12, badge: '🌟' },
    { rank: 2, name: 'GreenThumb', points: 11200, streak: 38, level: 11, badge: '🌿' },
    { rank: 3, name: 'NatureLover', points: 10850, streak: 42, level: 10, badge: '🦋' },
    { rank: 4, name: 'RecycleKing', points: 9600, streak: 30, level: 9, badge: '♻️' },
    { rank: 5, name: 'EcoChampion', points: 8900, streak: 28, level: 9, badge: '🏆' },
    { rank: 6, name: 'PlanetSaver', points: 8400, streak: 25, level: 8, badge: '🌍' },
    { rank: 7, name: 'TreeHugger', points: 7800, streak: 22, level: 8, badge: '🌳' },
    { rank: 8, name: 'OceanGuard', points: 7200, streak: 20, level: 7, badge: '🌊' },
    { rank: 9, name: 'CleanAir', points: 6800, streak: 18, level: 7, badge: '💨' },
    { rank: 10, name: 'SolarPower', points: 6400, streak: 15, level: 6, badge: '☀️' },
  ],
  weekly: [
    { rank: 1, name: 'GreenThumb', points: 850, streak: 7, level: 11, badge: '🌿' },
    { rank: 2, name: 'EcoWarrior99', points: 780, streak: 7, level: 12, badge: '🌟' },
    { rank: 3, name: 'NewHero', points: 650, streak: 5, level: 4, badge: '🌱' },
    { rank: 4, name: 'RecycleKing', points: 620, streak: 6, level: 9, badge: '♻️' },
    { rank: 5, name: 'QuickStart', points: 580, streak: 4, level: 3, badge: '⚡' },
    { rank: 6, name: 'NatureLover', points: 520, streak: 5, level: 10, badge: '🦋' },
    { rank: 7, name: 'Sproutie', points: 480, streak: 3, level: 3, badge: '🌱' },
    { rank: 8, name: 'EcoNewbie', points: 420, streak: 3, level: 2, badge: '🍀' },
    { rank: 9, name: 'GreenPath', points: 380, streak: 2, level: 2, badge: '🛤️' },
    { rank: 10, name: 'EcoChampion', points: 350, streak: 4, level: 9, badge: '🏆' },
  ],
  streak: [
    { rank: 1, name: 'EcoWarrior99', points: 12450, streak: 45, level: 12, badge: '🔥' },
    { rank: 2, name: 'NatureLover', points: 10850, streak: 42, level: 10, badge: '🔥' },
    { rank: 3, name: 'GreenThumb', points: 11200, streak: 38, level: 11, badge: '🔥' },
    { rank: 4, name: 'RecycleKing', points: 9600, streak: 30, level: 9, badge: '🔥' },
    { rank: 5, name: 'EcoChampion', points: 8900, streak: 28, level: 9, badge: '🔥' },
    { rank: 6, name: 'PlanetSaver', points: 8400, streak: 25, level: 8, badge: '🔥' },
    { rank: 7, name: 'TreeHugger', points: 7800, streak: 22, level: 8, badge: '🔥' },
    { rank: 8, name: 'OceanGuard', points: 7200, streak: 20, level: 7, badge: '🔥' },
    { rank: 9, name: 'CleanAir', points: 6800, streak: 18, level: 7, badge: '🔥' },
    { rank: 10, name: 'SolarPower', points: 6400, streak: 15, level: 6, badge: '🔥' },
  ],
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-gray-400 font-bold">#{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
    default:
      return 'bg-gray-800/50 border-gray-700';
  }
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');
  
  // Current user stats (demo)
  const currentUser = {
    name: 'You (Eco Guardian)',
    rank: 42,
    points: 1250,
    streak: 7,
    level: 3,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">See how you rank against other eco-guardians!</p>
      </div>

      {/* Your Stats Card */}
      <Card glass className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-emerald-500">
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xl">
                    Y
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.level}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                <p className="text-emerald-400">Rank #{currentUser.rank} Globally</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{currentUser.points.toLocaleString()}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 justify-center">
                  <Leaf className="w-3 h-3" /> Points
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">{currentUser.streak}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 justify-center">
                  <Flame className="w-3 h-3" /> Streak
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">Level {currentUser.level}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 justify-center">
                  <TrendingUp className="w-3 h-3" /> Rank
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Card glass>
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="global" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <Trophy className="w-4 h-4 mr-2" />
                All Time
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <TrendingUp className="w-4 h-4 mr-2" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="streak" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <Flame className="w-4 h-4 mr-2" />
                Streak
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {['global', 'weekly', 'streak'].map((tab) => (
            <div key={tab} className={activeTab === tab ? 'block' : 'hidden'}>
              <div className="space-y-3">
                {leaderboardData[tab as keyof typeof leaderboardData].map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border transition-all',
                      getRankBg(user.rank),
                      user.rank <= 3 && 'shadow-lg'
                    )}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 border border-gray-600">
                      <AvatarFallback className="bg-gray-700 text-white">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Name & Badge */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{user.name}</span>
                        <span>{user.badge}</span>
                      </div>
                      <p className="text-sm text-gray-400">Level {user.level}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-6 text-right">
                      <div>
                        <p className="font-bold text-emerald-400">
                          {user.points.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="font-bold text-orange-400">🔥 {user.streak}</p>
                        <p className="text-xs text-gray-500">streak</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Global Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="py-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-bold text-white">12,847</p>
            <p className="text-sm text-gray-400">Total Guardians</p>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="py-6 text-center">
            <Leaf className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-3xl font-bold text-white">1.2M</p>
            <p className="text-sm text-gray-400">Eco-Actions Verified</p>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="py-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-3xl font-bold text-white">458K</p>
            <p className="text-sm text-gray-400">Quizzes Completed</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

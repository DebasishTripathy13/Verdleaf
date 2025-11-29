'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Leaf, 
  Home, 
  MessageCircle, 
  Camera, 
  Brain, 
  Sparkles, 
  Trophy,
  ShoppingBag,
  Gem,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/store';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/dashboard/verify', icon: Camera, label: 'Verify Action' },
  { href: '/dashboard/quiz', icon: Brain, label: 'Daily Quiz' },
  { href: '/dashboard/store', icon: ShoppingBag, label: 'Eco Store' },
  { href: '/dashboard/nfts', icon: Gem, label: 'NFT Gallery' },
  { href: '/dashboard/evolution', icon: Sparkles, label: 'Growth' },
  { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUserStore();
  
  // Demo user data
  const userData = user || {
    name: 'Eco Guardian',
    ecoPoints: 1250,
    totalXP: 850,
    level: 3,
    streak: 7,
  };
  
  const xpProgress = (userData.totalXP % 100) / 100 * 100;
  
  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900/95 border-r border-gray-800 transform transition-transform lg:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Verdleaf</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* User Card */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-emerald-500">
                <AvatarImage src={userData.avatar || undefined} alt={userData.name} className="object-cover" />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {userData.name?.[0] || 'G'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{userData.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span>Level {userData.level}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">XP Progress</span>
                <span className="text-emerald-400">{userData.totalXP % 100}/100</span>
              </div>
              <Progress
                value={xpProgress}
                className="h-2 bg-gray-800"
                indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-400"
              />
            </div>
            
            <div className="flex gap-4 mt-3 text-center">
              <div className="flex-1 p-2 rounded-lg bg-gray-800/50">
                <p className="text-lg font-bold text-emerald-400">{userData.ecoPoints}</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-gray-800/50">
                <p className="text-lg font-bold text-green-400">🌱 {userData.streak}</p>
                <p className="text-xs text-gray-500">Streak</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-800">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-gray-800">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-white hidden sm:block">
                {navItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <ConnectButton 
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

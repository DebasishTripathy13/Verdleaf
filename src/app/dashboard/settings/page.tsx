'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Wallet,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    evolutionAlert: true,
    leaderboardUpdate: false,
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: true,
    soundEffects: true,
    animations: true,
  });
  
  const [profile, setProfile] = useState({
    displayName: 'Eco Guardian',
    email: 'guardian@example.com',
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your EcoMon Guardian experience</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-500/20">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500/20">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-emerald-500/20">
            <Palette className="w-4 h-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-emerald-500/20">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-emerald-400" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-3xl">
                  🌱
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Display Name
                  </label>
                  <Input
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <Button variant="eco">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5 text-blue-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'dailyReminder', label: 'Daily Reminder', desc: 'Get reminded to complete your daily eco-actions' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a summary of your weekly progress' },
                { key: 'evolutionAlert', label: 'Evolution Alerts', desc: 'Know when your EcoMon is ready to evolve' },
                { key: 'leaderboardUpdate', label: 'Leaderboard Updates', desc: 'Get notified about rank changes' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                >
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key as keyof typeof notifications],
                    })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-emerald-500'
                        : 'bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all',
                        notifications[item.key as keyof typeof notifications]
                          ? 'left-6'
                          : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="w-5 h-5 text-purple-400" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'darkMode',
                  label: 'Dark Mode',
                  desc: 'Use dark theme (recommended)',
                  iconOn: Moon,
                  iconOff: Sun,
                },
                {
                  key: 'soundEffects',
                  label: 'Sound Effects',
                  desc: 'Play sounds for actions and achievements',
                  iconOn: Volume2,
                  iconOff: VolumeX,
                },
                {
                  key: 'animations',
                  label: 'Animations',
                  desc: 'Enable UI animations and transitions',
                  iconOn: Settings,
                  iconOff: Settings,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    {preferences[item.key as keyof typeof preferences] ? (
                      <item.iconOn className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <item.iconOff className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences({
                      ...preferences,
                      [item.key]: !preferences[item.key as keyof typeof preferences],
                    })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      preferences[item.key as keyof typeof preferences]
                        ? 'bg-emerald-500'
                        : 'bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all',
                        preferences[item.key as keyof typeof preferences]
                          ? 'left-6'
                          : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="w-5 h-5 text-orange-400" />
                Wallet Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                <p className="text-gray-400 mb-4">No wallet connected</p>
                <Button variant="eco">
                  Connect Wallet
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-medium text-white mb-3">Supported Networks</h3>
                <div className="flex flex-wrap gap-2">
                  {['Base', 'Base Sepolia (Testnet)'].map((network) => (
                    <span
                      key={network}
                      className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                    >
                      {network}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card glass className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Shield className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10">
            <div>
              <p className="font-medium text-white">Log Out</p>
              <p className="text-sm text-gray-400">Sign out of your account</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10">
            <div>
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

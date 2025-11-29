'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Brain, 
  Camera, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ChevronDown,
  Wallet,
  TreePine,
  Star,
  Shield,
  Users,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-emerald-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Verdleaf</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Features
            </Link>
            <Link href="#evolution" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Journey
            </Link>
            <Link href="#store" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Store
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold">
                <Wallet className="w-4 h-4" />
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Floating Leaves */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {['🌿', '🍃', '🌱', '☘️'][i % 4]}
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Hackathon Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Eco-Friendly AI Agent • Built on Base</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-white">Meet</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Verdleaf</span>
                <br />
                <span className="text-white">Your Eco AI</span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-lg">
                Your eco-friendly AI companion that evolves, learns, and helps you live sustainably. 
                Shop eco-products on-chain, verify green actions, and grow together on Base.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold shadow-lg shadow-emerald-500/25">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/store">
                  <Button variant="outline" size="lg" className="gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    Eco Store
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Built With */}
              <div className="pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-500 mb-4">Built With</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">B</div>
                    <span className="text-blue-400 font-medium">Base</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Gemini AI</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Leaf className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Web3</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Content - Pokémon Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Electric Glow Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Leaf Ring */}
                <motion.div
                  className="absolute inset-4 rounded-full border-4 border-dashed border-emerald-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Agent Container */}
                <div className="relative w-full h-full rounded-3xl glass p-8 border border-emerald-500/30">
                  <div className="relative w-full h-full floating">
                    <Image
                      src="/ecomon/florazen.png"
                      alt="Verdleaf AI Agent"
                      fill
                      className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                      priority
                    />
                  </div>
                  
                  {/* Type Badge */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center gap-2"
                  >
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">Eco/Nature</span>
                  </motion.div>
                  
                  {/* Level Badge */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full glass flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">Lv. 25</span>
                  </motion.div>
                  
                  {/* Stats */}
                  <div className="absolute bottom-4 left-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-emerald-400" />
                      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-gradient-to-r from-emerald-500 to-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TreePine className="w-3 h-3 text-teal-400" />
                      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Verdleaf <span className="text-emerald-400">Features</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your eco-friendly AI companion comes with powerful abilities to help you live sustainably.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Emotional AI',
                description: 'Your agent has real emotions - trust, joy, curiosity. It remembers and forms bonds with you.',
                gradient: 'from-emerald-500 to-green-500',
              },
              {
                icon: Camera,
                title: 'Eco Verification',
                description: 'Verify your eco-friendly actions with AI vision. Earn rewards for sustainable choices.',
                gradient: 'from-teal-500 to-cyan-500',
              },
              {
                icon: Star,
                title: 'Daily Quizzes',
                description: 'Test your environmental knowledge with AI-generated quizzes. Learn and earn!',
                gradient: 'from-green-500 to-lime-500',
              },
              {
                icon: Sparkles,
                title: 'Eco Store',
                description: 'Shop eco-friendly products on-chain. Use your earned tokens for sustainable purchases.',
                gradient: 'from-emerald-500 to-teal-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 transition-all duration-300 group">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Journey Section */}
      <section id="evolution" className="py-20 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Growth <span className="text-emerald-400">Journey</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your eco-impact grows as you complete more sustainable actions and verify your contributions.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { stage: 1, name: 'Sproutling', emoji: '🌱' },
              { stage: 2, name: 'Bloomkin', emoji: '🌿' },
              { stage: 3, name: 'Florazen', emoji: '🌳' },
              { stage: 4, name: 'Terravine', emoji: '🏔️' },
              { stage: 5, name: 'Gaiabloom', emoji: '🌍' },
            ].map((evo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center mb-3 relative">
                  <span className="text-4xl">{evo.emoji}</span>
                  {i < 4 && (
                    <ArrowRight className="absolute -right-6 text-gray-600 hidden md:block" />
                  )}
                </div>
                <span className="text-sm text-gray-400">Level {evo.stage}</span>
                <span className="text-white font-medium">{evo.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eco Store Section */}
      <section id="store" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border-emerald-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
              
              <CardContent className="relative p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Blockchain Eco Store</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Shop Sustainable with <span className="text-emerald-400">Crypto</span>
                    </h2>
                    
                    <p className="text-gray-400">
                      Use your earned eco-points or cryptocurrency to purchase verified eco-friendly products. 
                      Every transaction is recorded on Base L2 blockchain for full transparency.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-gray-900/50">
                        <p className="text-2xl font-bold text-emerald-400">100+</p>
                        <p className="text-xs text-gray-500">Eco Products</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gray-900/50">
                        <p className="text-2xl font-bold text-emerald-400">Base</p>
                        <p className="text-xs text-gray-500">Blockchain</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gray-900/50">
                        <p className="text-2xl font-bold text-emerald-400">0%</p>
                        <p className="text-xs text-gray-500">Carbon Fees</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link href="/dashboard/store">
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                          Browse Store
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <a href="https://base.org/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                          Learn About Base
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Why Blockchain Eco Store?</h3>
                    {[
                      { icon: Leaf, text: 'Verified eco-friendly products only' },
                      { icon: Shield, text: 'Transparent blockchain transactions' },
                      { icon: Star, text: 'Earn rewards for sustainable purchases' },
                      { icon: Users, text: 'Support ethical vendors worldwide' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50"
                      >
                        <item.icon className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Go <span className="text-emerald-400">Green</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands making a real environmental impact. Your sustainable journey starts now!
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-lg px-8 py-6 shadow-lg shadow-emerald-500/25">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Verdleaf</span>
            </div>
            
            <p className="text-gray-500 text-sm">
              Sustainable living powered by AI & Blockchain
            </p>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link href="/dashboard/store" className="hover:text-emerald-400 transition-colors">Store</Link>
              <a href="https://base.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Base</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

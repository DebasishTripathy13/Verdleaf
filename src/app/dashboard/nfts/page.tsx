'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Sparkles, 
  Wallet, 
  Trophy, 
  Leaf, 
  Star, 
  Lock,
  CheckCircle,
  ExternalLink,
  Loader2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useAccount } from 'wagmi';
import { useUserStore } from '@/store';
import { NFT_DEFINITIONS, RARITY_CONFIG, VERDLEAF_COLLECTION } from '@/constants/nft';
import { NFTType, NFTRarity } from '@/types/nft';

interface NFTCardData {
  type: NFTType;
  name: string;
  description: string;
  baseImage: string;
  rarity: NFTRarity;
  requirement: string;
  isOwned: boolean;
  isEligible: boolean;
  progress: number;
  mintAddress?: string;
}

export default function NFTGalleryPage() {
  const [nftCards, setNftCards] = useState<NFTCardData[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTCardData | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [filter, setFilter] = useState<'all' | 'owned' | 'available'>('all');
  
  const { isConnected, address } = useAccount();
  const { user } = useUserStore();
  
  // Demo user stats for eligibility
  const userStats = {
    totalActions: 15,
    treesPlanted: 3,
    beachCleanups: 1,
    itemsRecycled: 25,
    co2Offset: 45,
    streakDays: 12,
    perfectQuizzes: 4,
    evolutionStage: 2,
  };
  
  // Calculate progress for each NFT type
  const getProgress = (type: NFTType): number => {
    const thresholds: Record<NFTType, { stat: keyof typeof userStats; target: number }> = {
      'eco-warrior': { stat: 'totalActions', target: 10 },
      'tree-planter': { stat: 'treesPlanted', target: 5 },
      'ocean-guardian': { stat: 'beachCleanups', target: 3 },
      'recycling-champion': { stat: 'itemsRecycled', target: 50 },
      'carbon-neutral': { stat: 'co2Offset', target: 100 },
      'streak-master': { stat: 'streakDays', target: 30 },
      'quiz-genius': { stat: 'perfectQuizzes', target: 10 },
      'verdleaf-companion': { stat: 'evolutionStage', target: 3 },
      'legendary-guardian': { stat: 'totalActions', target: 100 },
    };
    
    const threshold = thresholds[type];
    const current = userStats[threshold.stat];
    return Math.min(100, (current / threshold.target) * 100);
  };
  
  // Demo owned NFTs
  const ownedNFTs = ['eco-warrior'];
  
  useEffect(() => {
    // Build NFT cards
    const cards: NFTCardData[] = Object.entries(NFT_DEFINITIONS).map(([type, def]) => {
      const progress = getProgress(type as NFTType);
      return {
        type: type as NFTType,
        name: def.name,
        description: def.description,
        baseImage: def.baseImage,
        rarity: def.rarity,
        requirement: def.requirement,
        isOwned: ownedNFTs.includes(type),
        isEligible: progress >= 100,
        progress,
      };
    });
    
    setNftCards(cards);
  }, []);
  
  const handleMint = async () => {
    if (!selectedNFT || !address) return;
    
    setIsMinting(true);
    
    try {
      const response = await fetch('/api/nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'demo-user',
          walletAddress: address,
          nftType: selectedNFT.type,
          achievementData: {
            type: selectedNFT.type,
            value: 100,
            description: selectedNFT.requirement,
            earnedAt: new Date(),
          },
        }),
      });
      
      if (response.ok) {
        setMintSuccess(true);
        // Update local state
        setNftCards(prev => prev.map(nft => 
          nft.type === selectedNFT.type ? { ...nft, isOwned: true } : nft
        ));
      }
    } catch (error) {
      console.error('Minting error:', error);
    } finally {
      setIsMinting(false);
    }
  };
  
  const filteredNFTs = nftCards.filter(nft => {
    if (filter === 'owned') return nft.isOwned;
    if (filter === 'available') return nft.isEligible && !nft.isOwned;
    return true;
  });
  
  const getRarityColor = (rarity: NFTRarity): string => {
    return RARITY_CONFIG[rarity].color;
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            NFT Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            Collect unique NFTs by completing eco-achievements on Solana
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm font-mono">
                {address?.slice(0, 4)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      
      {/* Collection Info */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{VERDLEAF_COLLECTION.name}</h3>
                <p className="text-gray-400">Symbol: {VERDLEAF_COLLECTION.symbol} • Solana</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-400">{nftCards.length}</p>
                <p className="text-xs text-gray-500">Total NFTs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{nftCards.filter(n => n.isOwned).length}</p>
                <p className="text-xs text-gray-500">Owned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{nftCards.filter(n => n.isEligible && !n.isOwned).length}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'owned', 'available'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'border-gray-700 hover:border-purple-500'
            }
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      
      {/* NFT Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft, i) => (
          <motion.div
            key={nft.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className={`h-full cursor-pointer transition-all hover:scale-[1.02] ${
                nft.isOwned 
                  ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/50' 
                  : 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedNFT(nft)}
            >
              <CardContent className="p-4">
                {/* NFT Image */}
                <div className="relative aspect-square mb-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                  
                  {nft.isOwned ? (
                    <>
                      <Image 
                        src={nft.baseImage} 
                        alt={nft.name}
                        fill
                        className="object-cover"
                      />
                      <Badge 
                        className="absolute top-2 right-2 z-10"
                        style={{ backgroundColor: getRarityColor(nft.rarity) }}
                      >
                        {nft.rarity.toUpperCase()}
                      </Badge>
                      <CheckCircle className="absolute top-2 left-2 w-6 h-6 text-green-400 z-10" />
                    </>
                  ) : nft.isEligible ? (
                    <>
                      <Image 
                        src={nft.baseImage} 
                        alt={nft.name}
                        fill
                        className="object-cover opacity-80"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-black z-10">
                        Ready to Mint!
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Image 
                        src={nft.baseImage} 
                        alt={nft.name}
                        fill
                        className="object-cover opacity-20 grayscale"
                      />
                      <Lock className="w-16 h-16 text-gray-600 absolute z-10" />
                      <div className="absolute bottom-2 left-2 right-2 z-10">
                        <Progress value={nft.progress} className="h-2 bg-gray-700" />
                        <p className="text-xs text-gray-500 mt-1 text-center">{Math.round(nft.progress)}%</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* NFT Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{nft.name}</h3>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRarityColor(nft.rarity) }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
                  <p className="text-xs text-gray-500">
                    Requirement: {nft.requirement}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* NFT Detail Modal */}
      <Dialog open={!!selectedNFT} onOpenChange={() => {
        setSelectedNFT(null);
        setMintSuccess(false);
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
          {selectedNFT && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {selectedNFT.name}
                </DialogTitle>
                <DialogDescription>
                  <Badge 
                    className="mt-2"
                    style={{ backgroundColor: getRarityColor(selectedNFT.rarity) }}
                  >
                    {selectedNFT.rarity.toUpperCase()}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* NFT Preview */}
                <div className="relative aspect-square rounded-xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center overflow-hidden">
                  <Image 
                    src={selectedNFT.baseImage} 
                    alt={selectedNFT.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Description */}
                <p className="text-gray-300">{selectedNFT.description}</p>
                
                {/* Requirement */}
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <p className="text-sm text-gray-400 mb-2">Requirement:</p>
                  <p className="text-white font-medium">{selectedNFT.requirement}</p>
                  {!selectedNFT.isOwned && (
                    <div className="mt-3">
                      <Progress value={selectedNFT.progress} className="h-2 bg-gray-700" />
                      <p className="text-xs text-gray-500 mt-1">{Math.round(selectedNFT.progress)}% complete</p>
                    </div>
                  )}
                </div>
                
                {/* Bonus Info */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400">
                    +{RARITY_CONFIG[selectedNFT.rarity].bonusPoints} bonus eco-points on mint
                  </span>
                </div>
                
                {mintSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">NFT minted successfully!</span>
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedNFT(null)}>
                  Close
                </Button>
                
                {selectedNFT.isOwned ? (
                  <Button className="bg-purple-600 hover:bg-purple-700" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Owned
                  </Button>
                ) : selectedNFT.isEligible ? (
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleMint}
                    disabled={isMinting || !isConnected}
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mint NFT
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="bg-gray-700" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Info Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-white mb-2">About Verdleaf NFTs</h4>
              <p className="text-gray-400 text-sm">
                Verdleaf NFTs are minted on the Solana blockchain as proof of your eco-achievements. 
                Each NFT is unique and represents your commitment to sustainability. Complete eco-actions, 
                maintain streaks, and reach milestones to unlock new NFTs. Rarer NFTs award more bonus points!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

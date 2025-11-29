// Verdleaf NFT Collection Constants

import { NFTType, NFTRarity, NFTMetadata, NFTAttribute } from '@/types/nft';

// Solana Configuration
export const SOLANA_CONFIG = {
  network: process.env.SOLANA_NETWORK || 'devnet',
  rpcEndpoint: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  treasury: process.env.SOLANA_TREASURY_ADDRESS || '',
  royaltyBps: 500, // 5%
};

// Collection Info
export const VERDLEAF_COLLECTION = {
  name: 'Verdleaf Eco Achievements',
  symbol: 'VLEAF',
  description: 'Collectible NFTs earned by completing eco-friendly actions and milestones in the Verdleaf app.',
  image: 'https://verdleaf.app/collection/cover.png',
  externalUrl: 'https://verdleaf.app/nfts',
  family: 'Verdleaf',
};

// NFT Definitions by Type
export const NFT_DEFINITIONS: Record<NFTType, {
  name: string;
  description: string;
  baseImage: string;
  rarity: NFTRarity;
  requirement: string;
  baseAttributes: NFTAttribute[];
}> = {
  'eco-warrior': {
    name: 'Eco Warrior',
    description: 'Awarded for completing 10 verified eco-actions. You are a true defender of the planet!',
    baseImage: '/nfts/eco-warrior.png',
    rarity: 'common',
    requirement: '10 verified eco-actions',
    baseAttributes: [
      { trait_type: 'Category', value: 'Achievement' },
      { trait_type: 'Tier', value: 'Bronze' },
      { trait_type: 'Actions Required', value: 10, display_type: 'number' },
    ],
  },
  'tree-planter': {
    name: 'Tree Planter',
    description: 'Awarded for planting or verifying 5 trees. Every tree counts in the fight against climate change!',
    baseImage: '/nfts/first-steps.png',
    rarity: 'uncommon',
    requirement: '5 trees planted',
    baseAttributes: [
      { trait_type: 'Category', value: 'Nature' },
      { trait_type: 'Element', value: 'Earth' },
      { trait_type: 'Trees Planted', value: 5, display_type: 'number' },
    ],
  },
  'ocean-guardian': {
    name: 'Ocean Guardian',
    description: 'Awarded for participating in 3 beach cleanups. Protecting our oceans from pollution!',
    baseImage: '/nfts/nature-guardian.png',
    rarity: 'rare',
    requirement: '3 beach cleanups',
    baseAttributes: [
      { trait_type: 'Category', value: 'Ocean' },
      { trait_type: 'Element', value: 'Water' },
      { trait_type: 'Cleanups', value: 3, display_type: 'number' },
    ],
  },
  'recycling-champion': {
    name: 'Recycling Champion',
    description: 'Awarded for recycling 50 items. Master of the three Rs: Reduce, Reuse, Recycle!',
    baseImage: '/nfts/carbon-crusher.png',
    rarity: 'common',
    requirement: '50 items recycled',
    baseAttributes: [
      { trait_type: 'Category', value: 'Recycling' },
      { trait_type: 'Tier', value: 'Gold' },
      { trait_type: 'Items Recycled', value: 50, display_type: 'number' },
    ],
  },
  'carbon-neutral': {
    name: 'Carbon Neutral Hero',
    description: 'Awarded for offsetting 100kg of CO2 through eco-actions. Climate champion!',
    baseImage: '/nfts/carbon-crusher.png',
    rarity: 'epic',
    requirement: '100kg CO2 offset',
    baseAttributes: [
      { trait_type: 'Category', value: 'Climate' },
      { trait_type: 'Impact', value: 'High' },
      { trait_type: 'CO2 Offset (kg)', value: 100, display_type: 'number' },
    ],
  },
  'streak-master': {
    name: 'Streak Master',
    description: 'Awarded for maintaining a 30-day eco-action streak. Consistency is key!',
    baseImage: '/nfts/green-streak.png',
    rarity: 'rare',
    requirement: '30-day streak',
    baseAttributes: [
      { trait_type: 'Category', value: 'Dedication' },
      { trait_type: 'Streak Days', value: 30, display_type: 'number' },
      { trait_type: 'Commitment Level', value: 'Dedicated' },
    ],
  },
  'quiz-genius': {
    name: 'Eco Quiz Genius',
    description: 'Awarded for achieving perfect scores on 10 eco quizzes. Knowledge is power!',
    baseImage: '/nfts/first-steps.png',
    rarity: 'uncommon',
    requirement: '10 perfect quiz scores',
    baseAttributes: [
      { trait_type: 'Category', value: 'Knowledge' },
      { trait_type: 'Perfect Scores', value: 10, display_type: 'number' },
      { trait_type: 'Intelligence', value: 'Genius' },
    ],
  },
  'verdleaf-companion': {
    name: 'Verdleaf Companion',
    description: 'Your unique Verdleaf AI companion as an NFT. Evolution stage and traits preserved forever!',
    baseImage: '/nfts/eco-warrior.png',
    rarity: 'rare',
    requirement: 'Reach Evolution Stage 3',
    baseAttributes: [
      { trait_type: 'Category', value: 'Companion' },
      { trait_type: 'Evolution Stage', value: 3, display_type: 'number' },
      { trait_type: 'Bond Level', value: 'Strong' },
    ],
  },
  'legendary-guardian': {
    name: 'Legendary Guardian',
    description: 'The ultimate achievement. Awarded to those who have mastered all aspects of sustainable living.',
    baseImage: '/nfts/nature-guardian.png',
    rarity: 'legendary',
    requirement: 'Complete all achievements',
    baseAttributes: [
      { trait_type: 'Category', value: 'Ultimate' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Status', value: 'Guardian of Earth' },
    ],
  },
};

// Rarity Configuration
export const RARITY_CONFIG: Record<NFTRarity, {
  color: string;
  dropRate: number;
  bonusPoints: number;
}> = {
  common: {
    color: '#9CA3AF', // gray
    dropRate: 50,
    bonusPoints: 10,
  },
  uncommon: {
    color: '#22C55E', // green
    dropRate: 25,
    bonusPoints: 25,
  },
  rare: {
    color: '#3B82F6', // blue
    dropRate: 15,
    bonusPoints: 50,
  },
  epic: {
    color: '#A855F7', // purple
    dropRate: 8,
    bonusPoints: 100,
  },
  legendary: {
    color: '#F59E0B', // gold
    dropRate: 2,
    bonusPoints: 250,
  },
};

// Achievement thresholds for automatic NFT minting
export const NFT_THRESHOLDS = {
  'eco-warrior': { type: 'total_actions', value: 10 },
  'tree-planter': { type: 'trees_planted', value: 5 },
  'ocean-guardian': { type: 'beach_cleanups', value: 3 },
  'recycling-champion': { type: 'items_recycled', value: 50 },
  'carbon-neutral': { type: 'co2_offset', value: 100 },
  'streak-master': { type: 'streak_days', value: 30 },
  'quiz-genius': { type: 'perfect_quizzes', value: 10 },
  'verdleaf-companion': { type: 'evolution_stage', value: 3 },
  'legendary-guardian': { type: 'all_achievements', value: 8 },
};

// Generate NFT metadata
export function generateNFTMetadata(
  nftType: NFTType,
  userId: string,
  additionalAttributes: NFTAttribute[] = []
): NFTMetadata {
  const definition = NFT_DEFINITIONS[nftType];
  
  return {
    name: definition.name,
    symbol: VERDLEAF_COLLECTION.symbol,
    description: definition.description,
    image: definition.baseImage,
    external_url: `${VERDLEAF_COLLECTION.externalUrl}/${nftType}`,
    attributes: [
      ...definition.baseAttributes,
      { trait_type: 'Rarity', value: definition.rarity },
      { trait_type: 'Minted Date', value: Math.floor(Date.now() / 1000), display_type: 'date' },
      ...additionalAttributes,
    ],
    properties: {
      files: [{ uri: definition.baseImage, type: 'image/png' }],
      category: 'image',
      creators: [
        { address: SOLANA_CONFIG.treasury, share: 100 },
      ],
    },
    collection: {
      name: VERDLEAF_COLLECTION.name,
      family: VERDLEAF_COLLECTION.family,
    },
  };
}

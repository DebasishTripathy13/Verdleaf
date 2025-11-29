// Verdleaf NFT Types for Solana Blockchain

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date';
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: NFTAttribute[];
  properties: {
    files: { uri: string; type: string }[];
    category: string;
    creators: { address: string; share: number }[];
  };
  collection?: {
    name: string;
    family: string;
  };
}

export interface MintNFTRequest {
  userId: string;
  walletAddress: string;
  nftType: NFTType;
  achievementData?: AchievementData;
}

export interface MintNFTResponse {
  success: boolean;
  mintAddress?: string;
  txSignature?: string;
  metadataUri?: string;
  error?: string;
}

export type NFTType = 
  | 'eco-warrior'
  | 'tree-planter'
  | 'ocean-guardian'
  | 'recycling-champion'
  | 'carbon-neutral'
  | 'streak-master'
  | 'quiz-genius'
  | 'verdleaf-companion'
  | 'legendary-guardian';

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementData {
  type: string;
  value: number;
  description: string;
  earnedAt: Date;
}

export interface NFTCollectionInfo {
  name: string;
  symbol: string;
  description: string;
  image: string;
  totalSupply: number;
  mintedCount: number;
}

// Solana-specific types
export interface SolanaNFTData {
  mint: string;
  tokenAccount: string;
  metadataAccount: string;
  masterEdition?: string;
  updateAuthority: string;
  collection?: string;
}

export interface NFTMintingConfig {
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  rpcEndpoint: string;
  collectionMint?: string;
  treasury: string;
  royaltyBps: number;
}

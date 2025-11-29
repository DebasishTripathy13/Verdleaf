import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { 
  NFTMetadata, 
  MintNFTRequest, 
  MintNFTResponse, 
  NFTType,
  SolanaNFTData 
} from '@/types/nft';
import { 
  SOLANA_CONFIG, 
  NFT_DEFINITIONS, 
  generateNFTMetadata,
  VERDLEAF_COLLECTION 
} from '@/constants/nft';

// Initialize Solana connection
function getConnection(): Connection {
  const endpoint = SOLANA_CONFIG.network === 'mainnet-beta' 
    ? SOLANA_CONFIG.rpcEndpoint 
    : clusterApiUrl(SOLANA_CONFIG.network as 'devnet' | 'testnet');
  return new Connection(endpoint, 'confirmed');
}

// Get treasury keypair from environment
function getTreasuryKeypair(): Keypair | null {
  const privateKey = process.env.SOLANA_TREASURY_PRIVATE_KEY;
  if (!privateKey) {
    console.warn('SOLANA_TREASURY_PRIVATE_KEY not set');
    return null;
  }
  
  try {
    const secretKey = bs58.decode(privateKey);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Invalid treasury private key:', error);
    return null;
  }
}

// Initialize Metaplex
function getMetaplex(connection: Connection, payer: Keypair): Metaplex {
  return Metaplex.make(connection)
    .use(keypairIdentity(payer));
}

/**
 * Mint a new Verdleaf NFT on Solana
 */
export async function mintVerdleafNFT(
  request: MintNFTRequest
): Promise<MintNFTResponse> {
  try {
    const connection = getConnection();
    const treasury = getTreasuryKeypair();
    
    if (!treasury) {
      // Demo mode - return simulated response
      return simulateMint(request);
    }
    
    const metaplex = getMetaplex(connection, treasury);
    const ownerPublicKey = new PublicKey(request.walletAddress);
    
    // Generate metadata
    const metadata = generateNFTMetadata(
      request.nftType,
      request.userId,
      request.achievementData ? [
        { trait_type: 'Achievement', value: request.achievementData.type },
        { trait_type: 'Achievement Value', value: String(request.achievementData.value) },
      ] : []
    );
    
    // For demo, use a placeholder URI (in production would upload to Arweave/IPFS)
    const metadataUri = `https://verdleaf.app/api/nft/metadata/${request.nftType}/${Date.now()}`;
    
    // Mint NFT
    const { nft, response } = await metaplex.nfts().create({
      uri: metadataUri,
      name: metadata.name,
      symbol: metadata.symbol,
      sellerFeeBasisPoints: SOLANA_CONFIG.royaltyBps,
      tokenOwner: ownerPublicKey,
      creators: [
        {
          address: treasury.publicKey,
          share: 100,
        },
      ],
    });
    
    return {
      success: true,
      mintAddress: nft.address.toString(),
      txSignature: response.signature,
      metadataUri,
    };
    
  } catch (error) {
    console.error('NFT minting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT',
    };
  }
}

/**
 * Simulate NFT minting for demo/testing (when no treasury key is set)
 */
function simulateMint(request: MintNFTRequest): MintNFTResponse {
  const fakeMintAddress = Keypair.generate().publicKey.toString();
  const fakeTxSignature = bs58.encode(Buffer.from(
    Array(64).fill(0).map(() => Math.floor(Math.random() * 256))
  ));
  
  return {
    success: true,
    mintAddress: fakeMintAddress,
    txSignature: fakeTxSignature,
    metadataUri: `https://arweave.net/demo/${request.nftType}/${Date.now()}`,
  };
}

/**
 * Get all NFTs owned by a wallet
 */
export async function getWalletNFTs(walletAddress: string): Promise<SolanaNFTData[]> {
  try {
    const connection = getConnection();
    const treasury = getTreasuryKeypair();
    
    if (!treasury) {
      // Return demo NFTs
      return getDemoNFTs(walletAddress);
    }
    
    const metaplex = getMetaplex(connection, treasury);
    const owner = new PublicKey(walletAddress);
    
    const nfts = await metaplex.nfts().findAllByOwner({ owner });
    
    // Filter for Verdleaf collection
    const verdleafNFTs = nfts.filter(nft => {
      if ('collection' in nft && nft.collection) {
        // Check if part of Verdleaf collection
        return true; // Would check collection address in production
      }
      return nft.name.includes('Verdleaf') || nft.symbol === 'VLEAF';
    });
    
    return verdleafNFTs.map(nft => ({
      mint: nft.address.toString(),
      tokenAccount: '', // Would fetch from chain
      metadataAccount: '', // Would fetch from chain
      updateAuthority: treasury.publicKey.toString(),
    }));
    
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
}

/**
 * Demo NFTs for testing
 */
function getDemoNFTs(walletAddress: string): SolanaNFTData[] {
  return [
    {
      mint: 'DemoMint1111111111111111111111111111111111111',
      tokenAccount: 'DemoToken111111111111111111111111111111111',
      metadataAccount: 'DemoMeta1111111111111111111111111111111111',
      updateAuthority: 'DemoAuth1111111111111111111111111111111111',
    },
  ];
}

/**
 * Check if user is eligible for an NFT based on their achievements
 */
export function checkNFTEligibility(
  userStats: {
    totalActions: number;
    treesPlanted: number;
    beachCleanups: number;
    itemsRecycled: number;
    co2Offset: number;
    streakDays: number;
    perfectQuizzes: number;
    evolutionStage: number;
    totalAchievements: number;
  }
): NFTType[] {
  const eligible: NFTType[] = [];
  
  if (userStats.totalActions >= 10) eligible.push('eco-warrior');
  if (userStats.treesPlanted >= 5) eligible.push('tree-planter');
  if (userStats.beachCleanups >= 3) eligible.push('ocean-guardian');
  if (userStats.itemsRecycled >= 50) eligible.push('recycling-champion');
  if (userStats.co2Offset >= 100) eligible.push('carbon-neutral');
  if (userStats.streakDays >= 30) eligible.push('streak-master');
  if (userStats.perfectQuizzes >= 10) eligible.push('quiz-genius');
  if (userStats.evolutionStage >= 3) eligible.push('verdleaf-companion');
  if (userStats.totalAchievements >= 8) eligible.push('legendary-guardian');
  
  return eligible;
}

/**
 * Get NFT balance for an address
 */
export async function getNFTBalance(walletAddress: string): Promise<number> {
  try {
    const nfts = await getWalletNFTs(walletAddress);
    return nfts.length;
  } catch {
    return 0;
  }
}

/**
 * Verify NFT ownership
 */
export async function verifyNFTOwnership(
  walletAddress: string,
  mintAddress: string
): Promise<boolean> {
  try {
    const connection = getConnection();
    const mint = new PublicKey(mintAddress);
    const owner = new PublicKey(walletAddress);
    
    // Get token accounts for this mint
    const tokenAccounts = await connection.getTokenAccountsByOwner(owner, {
      mint,
    });
    
    return tokenAccounts.value.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get Solana balance for airdrop/fee estimation
 */
export async function getSolanaBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

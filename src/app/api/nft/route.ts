import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mintVerdleafNFT, checkNFTEligibility, getWalletNFTs } from '@/lib/solana-nft';
import { NFT_DEFINITIONS, RARITY_CONFIG } from '@/constants/nft';
import { MintNFTRequest, NFTType } from '@/types/nft';

// GET - Fetch user's NFTs or all available NFT types
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const walletAddress = searchParams.get('wallet');
  const type = searchParams.get('type');
  
  try {
    // If type specified, return NFT definition
    if (type && type in NFT_DEFINITIONS) {
      const definition = NFT_DEFINITIONS[type as NFTType];
      return NextResponse.json({
        type,
        ...definition,
        rarityInfo: RARITY_CONFIG[definition.rarity],
      });
    }
    
    // If wallet specified, get on-chain NFTs
    if (walletAddress) {
      const onChainNFTs = await getWalletNFTs(walletAddress);
      
      // Also get from database
      const dbNFTs = await prisma.nFT.findMany({
        where: { userId: userId || undefined },
        orderBy: { createdAt: 'desc' },
      });
      
      return NextResponse.json({
        onChain: onChainNFTs,
        database: dbNFTs,
        total: dbNFTs.length,
      });
    }
    
    // If userId specified, get user's NFTs from database
    if (userId) {
      const nfts = await prisma.nFT.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      
      return NextResponse.json({ nfts, total: nfts.length });
    }
    
    // Return all NFT types
    const nftTypes = Object.entries(NFT_DEFINITIONS).map(([key, def]) => ({
      type: key,
      ...def,
      rarityInfo: RARITY_CONFIG[def.rarity],
    }));
    
    return NextResponse.json({ 
      nftTypes,
      collection: {
        name: 'Verdleaf Eco Achievements',
        symbol: 'VLEAF',
        total: nftTypes.length,
      }
    });
    
  } catch (error) {
    console.error('NFT fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

// POST - Mint a new NFT
export async function POST(request: NextRequest) {
  try {
    const body: MintNFTRequest = await request.json();
    const { userId, walletAddress, nftType, achievementData } = body;
    
    // Validate inputs
    if (!userId || !walletAddress || !nftType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, walletAddress, nftType' },
        { status: 400 }
      );
    }
    
    if (!(nftType in NFT_DEFINITIONS)) {
      return NextResponse.json(
        { error: 'Invalid NFT type' },
        { status: 400 }
      );
    }
    
    // Check if user already has this NFT type
    const existingNFT = await prisma.nFT.findFirst({
      where: {
        userId,
        category: nftType,
      },
    });
    
    if (existingNFT) {
      return NextResponse.json(
        { error: 'User already owns this NFT type', existingNFT },
        { status: 409 }
      );
    }
    
    // Mint NFT on Solana
    const mintResult = await mintVerdleafNFT({
      userId,
      walletAddress,
      nftType,
      achievementData,
    });
    
    if (!mintResult.success) {
      return NextResponse.json(
        { error: mintResult.error || 'Minting failed' },
        { status: 500 }
      );
    }
    
    // Get NFT definition
    const definition = NFT_DEFINITIONS[nftType];
    
    // Save to database
    const nft = await prisma.nFT.create({
      data: {
        userId,
        mintAddress: mintResult.mintAddress!,
        metadataUri: mintResult.metadataUri!,
        name: definition.name,
        description: definition.description,
        image: definition.baseImage,
        collection: 'verdleaf-achievements',
        category: nftType,
        attributes: JSON.parse(JSON.stringify(definition.baseAttributes)),
        rarity: definition.rarity,
        rarityScore: RARITY_CONFIG[definition.rarity].dropRate,
        achievementType: achievementData?.type,
        achievementData: achievementData ? JSON.parse(JSON.stringify(achievementData)) : null,
        txSignature: mintResult.txSignature,
        blockTime: new Date(),
      },
    });
    
    // Update collection stats
    await prisma.nFTCollection.upsert({
      where: { name: 'verdleaf-achievements' },
      update: {
        totalMinted: { increment: 1 },
      },
      create: {
        name: 'verdleaf-achievements',
        symbol: 'VLEAF',
        description: 'Verdleaf Eco Achievement NFTs',
        image: '/collection/verdleaf.png',
        totalMinted: 1,
      },
    });
    
    // Award bonus points to user
    const bonusPoints = RARITY_CONFIG[definition.rarity].bonusPoints;
    await prisma.user.update({
      where: { id: userId },
      data: {
        ecoPoints: { increment: bonusPoints },
        totalXP: { increment: bonusPoints },
      },
    });
    
    return NextResponse.json({
      success: true,
      nft,
      mintAddress: mintResult.mintAddress,
      txSignature: mintResult.txSignature,
      bonusPoints,
      message: `Successfully minted ${definition.name} NFT!`,
    });
    
  } catch (error) {
    console.error('NFT minting error:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}

// Check eligibility for NFTs
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      );
    }
    
    // Get user stats (would come from database in production)
    // For demo, using placeholder values
    const userStats = {
      totalActions: 15,
      treesPlanted: 3,
      beachCleanups: 1,
      itemsRecycled: 25,
      co2Offset: 45,
      streakDays: 12,
      perfectQuizzes: 4,
      evolutionStage: 2,
      totalAchievements: 3,
    };
    
    // Check eligibility
    const eligibleTypes = checkNFTEligibility(userStats);
    
    // Get already owned NFTs
    const ownedNFTs = await prisma.nFT.findMany({
      where: { userId },
      select: { category: true },
    });
    
    const ownedTypes = ownedNFTs.map((n: { category: string }) => n.category);
    
    // Filter out already owned
    const availableToMint = eligibleTypes.filter(type => !ownedTypes.includes(type));
    
    return NextResponse.json({
      eligible: eligibleTypes,
      owned: ownedTypes,
      availableToMint,
      stats: userStats,
    });
    
  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}

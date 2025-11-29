import { NextRequest, NextResponse } from 'next/server';
import { verifyEcoAction, analyzeImageMetadata } from '@/lib/gemini-vision';
import { getActionRewards } from '@/constants/eco-actions';
import { EcoActionType } from '@/types/ecomon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType = 'image/jpeg', description, actionType, userId } = body;
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }
    
    // Verify the eco-action using Gemini Vision
    const verificationResult = await verifyEcoAction(imageBase64, mimeType, description);
    
    // Analyze image metadata for additional authenticity checks
    const metadataAnalysis = await analyzeImageMetadata(imageBase64, mimeType);
    
    // Apply bonus for authenticity indicators
    let finalPoints = verificationResult.pointsRecommended;
    if (metadataAnalysis.hasTimestamp) {
      finalPoints = Math.round(finalPoints * 1.2); // 20% bonus for timestamp
    }
    if (metadataAnalysis.isLikelyStockPhoto) {
      finalPoints = 0;
      verificationResult.isVerified = false;
      verificationResult.suggestions.push('Image appears to be a stock photo. Please upload your own photos.');
    }
    
    // Calculate XP based on action type
    let xpEarned = 0;
    if (verificationResult.isVerified && verificationResult.actionType) {
      const rewards = getActionRewards(
        verificationResult.actionType as EcoActionType,
        verificationResult.confidence
      );
      xpEarned = rewards.xp;
    }
    
    // In production, save verification to database
    // const verification = await prisma.verification.create({
    //   data: {
    //     userId,
    //     imageUrl: 'stored-image-url',
    //     actionType: verificationResult.actionType || 'unknown',
    //     description: verificationResult.description,
    //     geminiAnalysis: verificationResult,
    //     confidence: verificationResult.confidence,
    //     isVerified: verificationResult.isVerified,
    //     verifiedAt: verificationResult.isVerified ? new Date() : null,
    //     pointsAwarded: finalPoints,
    //     xpAwarded: xpEarned,
    //   }
    // });
    
    // Update user stats if verified
    // if (verificationResult.isVerified) {
    //   await prisma.user.update({
    //     where: { id: userId },
    //     data: {
    //       ecoPoints: { increment: finalPoints },
    //       totalXP: { increment: xpEarned },
    //     }
    //   });
    //   
    //   // Update global stats
    //   await updateGlobalStats(verificationResult.actionType);
    // }
    
    return NextResponse.json({
      success: true,
      verification: {
        ...verificationResult,
        pointsRecommended: finalPoints,
        xpEarned,
      },
      metadata: {
        hasTimestamp: metadataAnalysis.hasTimestamp,
        imageQuality: metadataAnalysis.imageQuality,
        isLikelyStockPhoto: metadataAnalysis.isLikelyStockPhoto,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify image' },
      { status: 500 }
    );
  }
}

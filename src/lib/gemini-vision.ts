import { GoogleGenAI } from '@google/genai';

export interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  actionType: string | null;
  description: string;
  suggestions: string[];
  detectedObjects: string[];
  environmentalImpact: string;
  pointsRecommended: number;
}

export const ECO_ACTIONS = {
  'recycle': {
    keywords: ['recycling bin', 'recyclable', 'plastic bottles', 'paper', 'cardboard', 'aluminum', 'glass'],
    basePoints: 10,
    description: 'Recycling materials',
  },
  'plant-tree': {
    keywords: ['tree', 'sapling', 'planting', 'seedling', 'garden', 'soil', 'shovel'],
    basePoints: 50,
    description: 'Planting a tree',
  },
  'clean-beach': {
    keywords: ['beach', 'cleanup', 'trash bag', 'litter', 'ocean', 'sand', 'plastic waste'],
    basePoints: 40,
    description: 'Beach cleanup',
  },
  'public-transit': {
    keywords: ['bus', 'train', 'subway', 'metro', 'transit', 'ticket', 'station'],
    basePoints: 15,
    description: 'Using public transportation',
  },
  'bike-commute': {
    keywords: ['bicycle', 'bike', 'cycling', 'helmet', 'bike lane'],
    basePoints: 20,
    description: 'Cycling instead of driving',
  },
  'compost': {
    keywords: ['compost', 'organic waste', 'food scraps', 'compost bin', 'decomposing'],
    basePoints: 15,
    description: 'Composting organic waste',
  },
  'reusable-bag': {
    keywords: ['reusable bag', 'tote bag', 'cloth bag', 'shopping bag', 'no plastic'],
    basePoints: 5,
    description: 'Using reusable bags',
  },
  'energy-saving': {
    keywords: ['solar panel', 'LED bulb', 'unplugged', 'energy efficient', 'thermostat'],
    basePoints: 25,
    description: 'Energy conservation',
  },
  'water-saving': {
    keywords: ['rain barrel', 'short shower', 'water bottle', 'tap off', 'water conservation'],
    basePoints: 20,
    description: 'Water conservation',
  },
  'wildlife-help': {
    keywords: ['bird feeder', 'bee house', 'wildlife', 'animal rescue', 'native plants'],
    basePoints: 30,
    description: 'Supporting wildlife',
  },
};

export async function verifyEcoAction(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  userDescription?: string
): Promise<VerificationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const actionTypes = Object.entries(ECO_ACTIONS)
    .map(([key, value]) => `- ${key}: ${value.description} (keywords: ${value.keywords.join(', ')})`)
    .join('\n');

  const prompt = `Analyze this image to verify if it shows a genuine eco-friendly action.
${userDescription ? `User's description: "${userDescription}"` : ''}

Possible eco-action types:
${actionTypes}

Analyze the image and return a JSON response with this exact structure (no markdown):
{
  "isVerified": true or false,
  "confidence": 0.0 to 1.0,
  "actionType": "action-type-key or null if not eco-action",
  "description": "Brief description of what you see",
  "detectedObjects": ["list", "of", "detected", "objects"],
  "suggestions": ["suggestions for improvement or why rejected"],
  "environmentalImpact": "Estimated positive environmental impact",
  "pointsRecommended": number (0-100 based on action significance)
}

Verification criteria:
1. Image must clearly show an eco-friendly action being performed
2. Should not be a stock photo or obvious fake
3. The action should have genuine environmental benefit
4. Consider image quality and authenticity
5. Be strict but fair - we want to encourage real actions`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const responseText = result.text || '';
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const verification = JSON.parse(cleanedResponse) as VerificationResult;
    
    // Apply base points from action type if verified
    if (verification.isVerified && verification.actionType && ECO_ACTIONS[verification.actionType as keyof typeof ECO_ACTIONS]) {
      const basePoints = ECO_ACTIONS[verification.actionType as keyof typeof ECO_ACTIONS].basePoints;
      verification.pointsRecommended = Math.round(basePoints * verification.confidence);
    }
    
    return verification;
  } catch (error) {
    console.error('Vision verification error:', error);
    return {
      isVerified: false,
      confidence: 0,
      actionType: null,
      description: 'Failed to analyze image',
      suggestions: ['Please try uploading a clearer image'],
      detectedObjects: [],
      environmentalImpact: 'Unknown',
      pointsRecommended: 0,
    };
  }
}

export async function analyzeImageMetadata(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<{
  hasTimestamp: boolean;
  estimatedLocation: string | null;
  imageQuality: 'low' | 'medium' | 'high';
  isLikelyStockPhoto: boolean;
}> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = `Analyze this image for authenticity indicators.

Return JSON only:
{
  "hasTimestamp": boolean (visible date/time in image),
  "estimatedLocation": "type of location or null",
  "imageQuality": "low" | "medium" | "high",
  "isLikelyStockPhoto": boolean (professional lighting, watermarks, too perfect)
}`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const responseText = result.text || '';
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Metadata analysis error:', error);
    return {
      hasTimestamp: false,
      estimatedLocation: null,
      imageQuality: 'medium',
      isLikelyStockPhoto: false,
    };
  }
}

import { GoogleGenAI } from '@google/genai';
import { EcoMonPersonality, EmotionalState } from '@/types/ecomon';
import { PERSONALITY_PROMPTS } from '@/constants/personalities';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const MODEL = 'gemini-2.0-flash';

export interface ChatContext {
  userName: string;
  ecoMonName: string;
  personality: EcoMonPersonality;
  emotionalState: EmotionalState;
  evolutionStage: number;
  memories: string[];
  recentActions: string[];
}

export async function generateChatResponse(
  userMessage: string,
  context: ChatContext,
  chatHistory: Array<{ role: 'user' | 'model'; content: string }>
): Promise<string> {
  const personalityPrompt = PERSONALITY_PROMPTS[context.personality];
  
  const systemPrompt = `You are ${context.ecoMonName}, a ${context.personality} Verdleaf AI Agent at growth level ${context.evolutionStage}. 
${personalityPrompt}

Your eco-guardian is ${context.userName}. You are an autonomous AI companion focused on sustainability that bonds, grows, and helps your guardian live more eco-friendly.

Current Emotional State:
- Trust: ${context.emotionalState.trust}/100
- Joy: ${context.emotionalState.joy}/100
- Curiosity: ${context.emotionalState.curiosity}/100
- Worry: ${context.emotionalState.worry}/100
- Pride: ${context.emotionalState.pride}/100

${context.memories.length > 0 ? `Your shared memories with ${context.userName}:\n${context.memories.slice(-5).join('\n')}` : ''}

${context.recentActions.length > 0 ? `Recent eco-activities with ${context.userName}:\n${context.recentActions.slice(-3).join('\n')}` : ''}

Guidelines:
- Stay in character as the ${context.personality} personality type
- Act like a sentient eco-focused AI companion with autonomy
- Reference shared memories and your bond with your guardian
- Show your current emotional state through your responses
- Use eco-themed emojis (🌱🌍♻️💚🌿🌻) sparingly
- Keep responses concise but engaging (2-4 sentences usually)
- If trust is low, be a bit more cautious
- If joy is high, be extra playful and enthusiastic about eco-wins
- If worry is high, express concern for environmental issues`;

  // Build conversation history
  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: systemPrompt }],
    },
    {
      role: 'model' as const,
      parts: [{ text: `I understand. I am ${context.ecoMonName}, ready to adventure with my trainer ${context.userName}! ⚡` }],
    },
    ...chatHistory.map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.content }],
    })),
    {
      role: 'user' as const,
      parts: [{ text: userMessage }],
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const response = await ai.models.generateContent({
    model: MODEL,
    config,
    contents,
  });

  return response.text || "I'm feeling a bit quiet right now. Let's chat again soon! 🌱";
}

export async function generateQuizQuestions(
  category?: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5
): Promise<Array<{
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}>> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const categories = category 
    ? [category] 
    : ['recycling', 'energy', 'water', 'wildlife', 'climate'];
  
  const prompt = `Generate ${count} unique eco-friendly quiz questions.

Categories to use: ${categories.join(', ')}
Difficulty: ${difficulty}

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this is correct",
    "category": "category-name"
  }
]

Requirements:
- Questions should be educational and interesting
- For ${difficulty}: ${difficulty === 'easy' ? 'straightforward facts' : difficulty === 'medium' ? 'require some environmental knowledge' : 'challenging, nuanced questions'}
- Each question must have exactly 4 options
- correctIndex must be 0, 1, 2, or 3
- Explanations should be informative and encouraging
- Make questions engaging and relevant to everyday life`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  
  const responseText = result.text || '';
  
  // Clean up the response - remove any markdown code blocks
  const cleanedResponse = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    const questions = JSON.parse(cleanedResponse);
    return questions;
  } catch (error) {
    console.error('Failed to parse quiz questions:', error);
    // Return fallback questions
    return getDefaultQuizQuestions(count);
  }
}

function getDefaultQuizQuestions(count: number) {
  const defaultQuestions = [
    {
      question: "What percentage of plastic ever made has been recycled?",
      options: ["About 9%", "About 25%", "About 50%", "About 75%"],
      correctIndex: 0,
      explanation: "Only about 9% of all plastic ever produced has been recycled. Most ends up in landfills or the environment.",
      category: "recycling"
    },
    {
      question: "How many liters of water does it take to produce one cotton t-shirt?",
      options: ["100 liters", "700 liters", "2,700 liters", "10,000 liters"],
      correctIndex: 2,
      explanation: "It takes approximately 2,700 liters of water to make one cotton t-shirt, highlighting the importance of sustainable fashion.",
      category: "water"
    },
    {
      question: "What is the most effective action an individual can take to reduce their carbon footprint?",
      options: ["Recycling", "Using LED bulbs", "Having one fewer child", "Going vegetarian"],
      correctIndex: 2,
      explanation: "Studies show having one fewer child is the most impactful choice, followed by living car-free and avoiding air travel.",
      category: "climate"
    },
    {
      question: "How long does it take for a plastic bottle to decompose?",
      options: ["50 years", "100 years", "450 years", "1000 years"],
      correctIndex: 2,
      explanation: "Plastic bottles take approximately 450 years to decompose, which is why reducing single-use plastic is so important.",
      category: "recycling"
    },
    {
      question: "What percentage of Earth's water is freshwater available for human use?",
      options: ["Less than 1%", "About 3%", "About 10%", "About 25%"],
      correctIndex: 0,
      explanation: "Less than 1% of Earth's water is freshwater available for human use. Most water is saltwater or locked in ice caps.",
      category: "water"
    },
  ];
  
  return defaultQuestions.slice(0, count);
}

export async function generateEcoFact(): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = `Generate one interesting, educational eco-fact that would motivate someone to live more sustainably. 
Keep it concise (1-2 sentences), positive in tone, and include a specific statistic or actionable insight.
Return just the fact text, no formatting.`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  
  return (result.text || '').trim();
}

import { EvolutionBranch, EvolutionPath, EcoMonSpecies } from '@/types/ecomon';

export const EVOLUTION_BRANCHES: Record<EvolutionPath, EvolutionBranch> = {
  'forest-guardian': {
    path: 'forest-guardian',
    name: 'Forest Guardian',
    description: 'Protector of forests and plant life. Evolves through tree planting and nature conservation.',
    element: 'leaf',
    requirements: [
      { actionType: 'plant-tree', count: 10 },
      { actionType: 'compost', count: 20 },
    ],
    stages: [
      {
        stage: 1,
        name: 'Sproutling',
        description: 'A tiny sprout full of potential',
        xpRequired: 0,
        sprite: '/ecomon/sproutling.png',
        abilities: ['Photosynthesis', 'Root Connection'],
      },
      {
        stage: 2,
        name: 'Bloomkin',
        description: 'Growing stronger with each eco-action',
        xpRequired: 100,
        sprite: '/ecomon/bloomkin.png',
        abilities: ['Leaf Shield', 'Growth Burst'],
      },
      {
        stage: 3,
        name: 'Florazen',
        description: 'Branches reaching for the sky',
        xpRequired: 300,
        sprite: '/ecomon/florazen.png',
        abilities: ['Forest Whisper', 'Bark Armor'],
      },
      {
        stage: 4,
        name: 'Terravine',
        description: 'Wise and powerful guardian of the forest',
        xpRequired: 600,
        sprite: '/ecomon/terravine.png',
        abilities: ['Forest Call', 'Nature\'s Embrace', 'Root Network'],
      },
      {
        stage: 5,
        name: 'Gaiabloom',
        description: 'Legendary protector, connected to all forests',
        xpRequired: 1000,
        sprite: '/ecomon/gaiabloom.png',
        abilities: ['Global Canopy', 'Life Bloom', 'Ancient Wisdom', 'Ecosystem Bond'],
      },
    ],
  },
  'ocean-keeper': {
    path: 'ocean-keeper',
    name: 'Ocean Keeper',
    description: 'Guardian of seas and marine life. Evolves through water conservation and beach cleanups.',
    element: 'water',
    requirements: [
      { actionType: 'clean-beach', count: 10 },
      { actionType: 'water-saving', count: 20 },
    ],
    stages: [
      {
        stage: 1,
        name: 'Droplet',
        description: 'A single drop with ocean dreams',
        xpRequired: 0,
        sprite: '/ecomon/ocean/stage-1.png',
        abilities: ['Water Sense', 'Purify'],
      },
      {
        stage: 2,
        name: 'Stream',
        description: 'Flowing with purpose',
        xpRequired: 100,
        sprite: '/ecomon/ocean/stage-2.png',
        abilities: ['Current Control', 'Splash'],
      },
      {
        stage: 3,
        name: 'Wave Rider',
        description: 'Dancing with the tides',
        xpRequired: 300,
        sprite: '/ecomon/ocean/stage-3.png',
        abilities: ['Tidal Force', 'Marine Call'],
      },
      {
        stage: 4,
        name: 'Ocean Spirit',
        description: 'One with the deep blue',
        xpRequired: 600,
        sprite: '/ecomon/ocean/stage-4.png',
        abilities: ['Storm Surge', 'Coral Shield', 'Deep Dive'],
      },
      {
        stage: 5,
        name: 'Leviathan Guardian',
        description: 'Legendary keeper of all waters',
        xpRequired: 1000,
        sprite: '/ecomon/ocean/stage-5.png',
        abilities: ['Ocean\'s Wrath', 'Marine Sanctuary', 'Tsunami Shield', 'Abyss Connection'],
      },
    ],
  },
  'urban-sage': {
    path: 'urban-sage',
    name: 'Urban Sage',
    description: 'Master of sustainable city living. Evolves through recycling and public transit.',
    element: 'earth',
    requirements: [
      { actionType: 'recycle', count: 30 },
      { actionType: 'public-transit', count: 20 },
    ],
    stages: [
      {
        stage: 1,
        name: 'Recycling Sprite',
        description: 'Finding treasures in trash',
        xpRequired: 0,
        sprite: '/ecomon/urban/stage-1.png',
        abilities: ['Sort Sense', 'Upcycle'],
      },
      {
        stage: 2,
        name: 'Green Commuter',
        description: 'Mastering sustainable travel',
        xpRequired: 100,
        sprite: '/ecomon/urban/stage-2.png',
        abilities: ['Transit Link', 'Carbon Counter'],
      },
      {
        stage: 3,
        name: 'Eco Citizen',
        description: 'Role model for urban sustainability',
        xpRequired: 300,
        sprite: '/ecomon/urban/stage-3.png',
        abilities: ['Community Inspire', 'Waste Warrior'],
      },
      {
        stage: 4,
        name: 'City Transformer',
        description: 'Reshaping urban landscapes',
        xpRequired: 600,
        sprite: '/ecomon/urban/stage-4.png',
        abilities: ['Urban Garden', 'Zero Waste Zone', 'Green Infrastructure'],
      },
      {
        stage: 5,
        name: 'Metropolitan Guardian',
        description: 'Legendary protector of sustainable cities',
        xpRequired: 1000,
        sprite: '/ecomon/urban/stage-5.png',
        abilities: ['City Harmony', 'Industrial Revolution', 'Smart Grid', 'Circular Economy'],
      },
    ],
  },
  'sky-watcher': {
    path: 'sky-watcher',
    name: 'Sky Watcher',
    description: 'Keeper of clean air and atmosphere. Evolves through energy saving and carbon reduction.',
    element: 'air',
    requirements: [
      { actionType: 'energy-saving', count: 20 },
      { actionType: 'bike-commute', count: 15 },
    ],
    stages: [
      {
        stage: 1,
        name: 'Breeze',
        description: 'A gentle whisper of wind',
        xpRequired: 0,
        sprite: '/ecomon/sky/stage-1.png',
        abilities: ['Air Sense', 'Fresh Gust'],
      },
      {
        stage: 2,
        name: 'Wind Dancer',
        description: 'Playing with the currents',
        xpRequired: 100,
        sprite: '/ecomon/sky/stage-2.png',
        abilities: ['Wind Ride', 'Pollution Filter'],
      },
      {
        stage: 3,
        name: 'Cloud Shaper',
        description: 'Master of atmospheric balance',
        xpRequired: 300,
        sprite: '/ecomon/sky/stage-3.png',
        abilities: ['Weather Influence', 'Carbon Capture'],
      },
      {
        stage: 4,
        name: 'Storm Caller',
        description: 'Commanding the skies',
        xpRequired: 600,
        sprite: '/ecomon/sky/stage-4.png',
        abilities: ['Cleansing Storm', 'Ozone Shield', 'Jet Stream'],
      },
      {
        stage: 5,
        name: 'Atmosphere Sentinel',
        description: 'Legendary guardian of Earth\'s blanket',
        xpRequired: 1000,
        sprite: '/ecomon/sky/stage-5.png',
        abilities: ['Climate Harmony', 'Aurora Shield', 'Stratosphere Command', 'Global Breath'],
      },
    ],
  },
  'flame-keeper': {
    path: 'flame-keeper',
    name: 'Flame Keeper',
    description: 'Guardian of sustainable energy. Evolves through carbon reduction and climate action.',
    element: 'earth',
    requirements: [
      { actionType: 'carbon-footprint', count: 15 },
      { actionType: 'renewable-energy', count: 10 },
    ],
    stages: [
      {
        stage: 1,
        name: 'Ember Sprite',
        description: 'A small flame of hope',
        xpRequired: 0,
        sprite: '/ecomon/flame/stage-1.png',
        abilities: ['Warm Heart', 'Energy Sense'],
      },
      {
        stage: 2,
        name: 'Solar Keeper',
        description: 'Harnessing the sun\'s power',
        xpRequired: 100,
        sprite: '/ecomon/flame/stage-2.png',
        abilities: ['Solar Charge', 'Heat Shield'],
      },
      {
        stage: 3,
        name: 'Climate Champion',
        description: 'Fighting for a cooler tomorrow',
        xpRequired: 300,
        sprite: '/ecomon/flame/stage-3.png',
        abilities: ['Carbon Capture', 'Green Energy'],
      },
      {
        stage: 4,
        name: 'Renewable Guardian',
        description: 'Master of sustainable power',
        xpRequired: 600,
        sprite: '/ecomon/flame/stage-4.png',
        abilities: ['Power Grid', 'Climate Shield', 'Energy Flow'],
      },
      {
        stage: 5,
        name: 'Phoenix Guardian',
        description: 'Legendary symbol of Earth\'s renewal',
        xpRequired: 1000,
        sprite: '/ecomon/flame/stage-5.png',
        abilities: ['Rebirth Fire', 'Climate Harmony', 'Eternal Flame', 'Zero Carbon'],
      },
    ],
  },
};

// Simple evolution path info for UI display
export type EvolutionPathKey = 'forest-guardian' | 'ocean-keeper' | 'urban-sage' | 'sky-watcher' | 'flame-keeper';

export interface EvolutionPathInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredActions: string[];
  finalForm: string;
}

export const EVOLUTION_PATHS: Record<EvolutionPathKey, EvolutionPathInfo> = {
  'forest-guardian': {
    name: 'Forest Guardian',
    description: 'Protector of forests and plant life. Master the ways of nature conservation.',
    icon: '🌲',
    color: 'emerald',
    requiredActions: ['Tree Planting', 'Composting'],
    finalForm: 'World Tree',
  },
  'ocean-keeper': {
    name: 'Ocean Keeper',
    description: 'Guardian of seas and marine life. Champion water conservation and ocean cleanup.',
    icon: '🌊',
    color: 'blue',
    requiredActions: ['Beach Cleanup', 'Water Saving'],
    finalForm: 'Leviathan Guardian',
  },
  'urban-sage': {
    name: 'Urban Sage',
    description: 'Wise spirit of the city. Transform urban spaces into green sanctuaries.',
    icon: '🏙️',
    color: 'violet',
    requiredActions: ['Urban Farming', 'Green Spaces'],
    finalForm: 'City Spirit',
  },
  'sky-watcher': {
    name: 'Sky Watcher',
    description: 'Keeper of clean air. Advocate for renewable energy and air quality.',
    icon: '🌸',
    color: 'pink',
    requiredActions: ['Air Quality', 'Renewable Energy'],
    finalForm: 'Sky Titan',
  },
  'flame-keeper': {
    name: 'Flame Keeper',
    description: 'Guardian of sustainable fire. Champion carbon reduction and climate action.',
    icon: '🔥',
    color: 'orange',
    requiredActions: ['Carbon Footprint', 'Climate Action'],
    finalForm: 'Phoenix Guardian',
  },
};

export const DARK_EVOLUTION = {
  name: 'Corrupted Form',
  description: 'When an EcoMon is neglected or its guardian acts against nature, it may fall into darkness...',
  threshold: 100, // corruption level at which dark evolution triggers
  redemptionQuests: [
    { actionType: 'plant-tree', count: 5, description: 'Plant trees to cleanse the darkness' },
    { actionType: 'clean-beach', count: 3, description: 'Clean pollution to purify the spirit' },
    { actionType: 'recycle', count: 20, description: 'Recycle to restore balance' },
  ],
  stages: {
    1: { sprite: '/ecomon/dark/stage-1.png', corruptionName: 'Withering' },
    2: { sprite: '/ecomon/dark/stage-2.png', corruptionName: 'Fading' },
    3: { sprite: '/ecomon/dark/stage-3.png', corruptionName: 'Corrupted' },
  },
};

export function getEvolutionProgress(
  currentXP: number,
  currentStage: number,
  path: EvolutionPath
): { progress: number; nextStageName: string; xpNeeded: number } {
  const branch = EVOLUTION_BRANCHES[path];
  const currentStageData = branch.stages[currentStage - 1];
  const nextStageData = branch.stages[currentStage];
  
  if (!nextStageData) {
    return { progress: 100, nextStageName: 'MAX', xpNeeded: 0 };
  }
  
  const xpInCurrentStage = currentXP - currentStageData.xpRequired;
  const xpNeededForNext = nextStageData.xpRequired - currentStageData.xpRequired;
  const progress = Math.min(100, (xpInCurrentStage / xpNeededForNext) * 100);
  
  return {
    progress,
    nextStageName: nextStageData.name,
    xpNeeded: xpNeededForNext - xpInCurrentStage,
  };
}

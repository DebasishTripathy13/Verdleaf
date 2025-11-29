// Eco Store Products and Categories

export interface EcoProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in eco-points
  priceInETH: string; // price in ETH for blockchain purchase
  category: ProductCategory;
  image: string;
  stock: number;
  carbonOffset: number; // kg CO2 saved
  sustainabilityScore: number; // 1-10
  tags: string[];
  vendor: string;
  featured?: boolean;
}

export type ProductCategory = 
  | 'reusables'
  | 'home'
  | 'fashion'
  | 'food'
  | 'energy'
  | 'garden'
  | 'personal-care';

export const PRODUCT_CATEGORIES = [
  { id: 'reusables', name: 'Reusables', emoji: '♻️', description: 'Reduce single-use waste' },
  { id: 'home', name: 'Home & Living', emoji: '🏠', description: 'Sustainable home products' },
  { id: 'fashion', name: 'Eco Fashion', emoji: '👕', description: 'Sustainable clothing & accessories' },
  { id: 'food', name: 'Food & Drink', emoji: '🥗', description: 'Organic and local products' },
  { id: 'energy', name: 'Energy', emoji: '⚡', description: 'Clean energy solutions' },
  { id: 'garden', name: 'Garden', emoji: '🌱', description: 'Seeds, plants & composting' },
  { id: 'personal-care', name: 'Personal Care', emoji: '🧴', description: 'Natural beauty products' },
] as const;

export const ECO_PRODUCTS: EcoProduct[] = [
  // Reusables
  {
    id: 'prod-001',
    name: 'Bamboo Water Bottle',
    description: 'Double-walled bamboo bottle keeps drinks cold for 24hrs. Replaces 1000+ plastic bottles.',
    price: 150,
    priceInETH: '0.005',
    category: 'reusables',
    image: '/store/BambooBottel.jpg',
    stock: 50,
    carbonOffset: 25,
    sustainabilityScore: 9,
    tags: ['bamboo', 'zero-waste', 'bpa-free'],
    vendor: 'EcoWare Co.',
    featured: true,
  },
  {
    id: 'prod-002',
    name: 'Beeswax Food Wraps (Set of 3)',
    description: 'Reusable food wraps made from organic cotton and beeswax. Perfect plastic wrap alternative.',
    price: 80,
    priceInETH: '0.003',
    category: 'reusables',
    image: '/store/waxstrip.jpg',
    stock: 100,
    carbonOffset: 12,
    sustainabilityScore: 10,
    tags: ['kitchen', 'zero-waste', 'organic'],
    vendor: 'BeeGreen',
  },
  {
    id: 'prod-003',
    name: 'Steel Lunch Container',
    description: 'Leak-proof stainless steel container with bamboo lid. Perfect for meal prep.',
    price: 120,
    priceInETH: '0.004',
    category: 'reusables',
    image: '/store/tiffin.jpg',
    stock: 75,
    carbonOffset: 18,
    sustainabilityScore: 9,
    tags: ['kitchen', 'stainless-steel', 'durable'],
    vendor: 'EcoWare Co.',
  },
  {
    id: 'prod-004',
    name: 'Reusable Produce Bags (5-pack)',
    description: 'Mesh bags for fruits and vegetables. Machine washable organic cotton.',
    price: 45,
    priceInETH: '0.0015',
    category: 'reusables',
    image: '/store/meshbags.jpg',
    stock: 200,
    carbonOffset: 8,
    sustainabilityScore: 9,
    tags: ['grocery', 'organic-cotton', 'zero-waste'],
    vendor: 'GreenBasket',
  },
  
  // Home
  {
    id: 'prod-005',
    name: 'Bamboo Utensil Set',
    description: 'Travel-ready bamboo fork, knife, spoon, chopsticks & straw set with case.',
    price: 65,
    priceInETH: '0.002',
    category: 'home',
    image: '/store/cutlery.jpg',
    stock: 150,
    carbonOffset: 10,
    sustainabilityScore: 9,
    tags: ['bamboo', 'travel', 'zero-waste'],
    vendor: 'BambooLife',
    featured: true,
  },
  {
    id: 'prod-006',
    name: 'LED Smart Bulb (4-pack)',
    description: 'Energy-efficient smart LED bulbs. 90% less energy than incandescent. Works with app.',
    price: 200,
    priceInETH: '0.007',
    category: 'home',
    image: '/store/bulbs.jpg',
    stock: 80,
    carbonOffset: 50,
    sustainabilityScore: 8,
    tags: ['energy', 'smart-home', 'led'],
    vendor: 'BrightEco',
  },
  {
    id: 'prod-007',
    name: 'Organic Cotton Towels (Set)',
    description: 'GOTS certified organic cotton bath towels. No pesticides, fair trade.',
    price: 180,
    priceInETH: '0.006',
    category: 'home',
    image: '/store/towels.jpg',
    stock: 40,
    carbonOffset: 15,
    sustainabilityScore: 9,
    tags: ['organic-cotton', 'fair-trade', 'bathroom'],
    vendor: 'PureHome',
  },
  
  // Fashion
  {
    id: 'prod-008',
    name: 'Recycled Ocean Plastic Sunglasses',
    description: 'Stylish sunglasses made from recycled ocean plastics. UV400 protection.',
    price: 250,
    priceInETH: '0.008',
    category: 'fashion',
    image: '/store/goggles.jpg',
    stock: 30,
    carbonOffset: 5,
    sustainabilityScore: 10,
    tags: ['recycled', 'ocean-plastic', 'accessories'],
    vendor: 'SeaWear',
    featured: true,
  },
  {
    id: 'prod-009',
    name: 'Hemp Canvas Tote Bag',
    description: 'Durable hemp canvas bag. Perfect for shopping and everyday use.',
    price: 55,
    priceInETH: '0.002',
    category: 'fashion',
    image: '/store/bags.jpg',
    stock: 120,
    carbonOffset: 8,
    sustainabilityScore: 9,
    tags: ['hemp', 'shopping', 'durable'],
    vendor: 'HempWorks',
  },
  
  // Energy
  {
    id: 'prod-010',
    name: 'Portable Solar Charger',
    description: '20W foldable solar panel with USB ports. Charge anywhere with sun power.',
    price: 350,
    priceInETH: '0.012',
    category: 'energy',
    image: '/store/solar.jpg',
    stock: 25,
    carbonOffset: 100,
    sustainabilityScore: 10,
    tags: ['solar', 'portable', 'electronics'],
    vendor: 'SunPower Co.',
    featured: true,
  },
  {
    id: 'prod-011',
    name: 'Hand-Crank Emergency Radio',
    description: 'Solar + hand-crank powered radio with flashlight. No batteries needed.',
    price: 120,
    priceInETH: '0.004',
    category: 'energy',
    image: '/store/radio.jpg',
    stock: 45,
    carbonOffset: 20,
    sustainabilityScore: 9,
    tags: ['emergency', 'solar', 'hand-crank'],
    vendor: 'PrepEco',
  },
  
  // Garden
  {
    id: 'prod-012',
    name: 'Heirloom Seed Starter Kit',
    description: '50 varieties of organic heirloom vegetable seeds with biodegradable pots.',
    price: 85,
    priceInETH: '0.003',
    category: 'garden',
    image: '/store/containerswithseed.jpg',
    stock: 60,
    carbonOffset: 30,
    sustainabilityScore: 10,
    tags: ['organic', 'seeds', 'gardening'],
    vendor: 'SeedSavers',
  },
  {
    id: 'prod-013',
    name: 'Countertop Compost Bin',
    description: 'Odor-free countertop compost bin with charcoal filter. 1.3 gallon capacity.',
    price: 95,
    priceInETH: '0.0032',
    category: 'garden',
    image: '/store/dustbin.jpg',
    stock: 80,
    carbonOffset: 40,
    sustainabilityScore: 9,
    tags: ['composting', 'kitchen', 'zero-waste'],
    vendor: 'CompostKing',
    featured: true,
  },
  
  // Personal Care
  {
    id: 'prod-014',
    name: 'Bamboo Toothbrush (4-pack)',
    description: 'Biodegradable bamboo toothbrushes with charcoal-infused bristles.',
    price: 35,
    priceInETH: '0.0012',
    category: 'personal-care',
    image: '/store/brush.jpg',
    stock: 250,
    carbonOffset: 4,
    sustainabilityScore: 9,
    tags: ['bamboo', 'dental', 'biodegradable'],
    vendor: 'BambooSmile',
  },
  {
    id: 'prod-015',
    name: 'Zero-Waste Shampoo Bar',
    description: 'Solid shampoo bar equivalent to 3 bottles. Natural ingredients, no plastic.',
    price: 40,
    priceInETH: '0.0014',
    category: 'personal-care',
    image: '/store/soap.jpg',
    stock: 180,
    carbonOffset: 6,
    sustainabilityScore: 10,
    tags: ['zero-waste', 'natural', 'haircare'],
    vendor: 'BarNone',
  },
  {
    id: 'prod-016',
    name: 'Safety Razor Kit',
    description: 'Classic stainless steel safety razor with 20 blades. Lifetime razor, no plastic.',
    price: 140,
    priceInETH: '0.0048',
    category: 'personal-care',
    image: '/store/shaving.jpg',
    stock: 55,
    carbonOffset: 15,
    sustainabilityScore: 10,
    tags: ['zero-waste', 'stainless-steel', 'shaving'],
    vendor: 'RazorClassic',
    featured: true,
  },
  
  // Food
  {
    id: 'prod-017',
    name: 'Organic Tea Collection',
    description: 'Fair trade organic loose-leaf tea set. 6 varieties in reusable tins.',
    price: 75,
    priceInETH: '0.0025',
    category: 'food',
    image: '/store/tea.jpg',
    stock: 90,
    carbonOffset: 8,
    sustainabilityScore: 9,
    tags: ['organic', 'fair-trade', 'tea'],
    vendor: 'LeafLovers',
  },
  {
    id: 'prod-018',
    name: 'Reusable Coffee Filter',
    description: 'Stainless steel pour-over coffee filter. No paper waste, perfect brew.',
    price: 55,
    priceInETH: '0.0018',
    category: 'food',
    image: '/store/filters.jpg',
    stock: 110,
    carbonOffset: 12,
    sustainabilityScore: 9,
    tags: ['coffee', 'zero-waste', 'stainless-steel'],
    vendor: 'BrewGreen',
  },
];

export const getFeaturedProducts = () => ECO_PRODUCTS.filter(p => p.featured);
export const getProductsByCategory = (category: ProductCategory) => 
  ECO_PRODUCTS.filter(p => p.category === category);
export const getProductById = (id: string) => ECO_PRODUCTS.find(p => p.id === id);

// Poké Ripz — Era, Set, and Product Data

export interface RipzEra {
  id: string;
  name: string;
  years: string;
  color: string;
  icon: string;
  sets: RipzSet[];
}

export interface RipzSet {
  id: string;
  name: string;
  releaseYear: number;
  symbol: string;
  totalCards: number;
  products: RipzProduct[];
}

export interface RipzProduct {
  type: ProductType;
  label: string;
  packCount: number;
  coinCost: number;
  cardsPerPack: number;
}

export type ProductType = 'booster_pack' | 'booster_bundle' | 'etb' | 'booster_box' | 'collection_box' | 'upc' | 'spc';

export const PRODUCT_LABELS: Record<ProductType, string> = {
  booster_pack: 'Booster Pack',
  booster_bundle: 'Booster Bundle',
  etb: 'Elite Trainer Box',
  booster_box: 'Booster Box',
  collection_box: 'Collection Box',
  upc: 'Ultra Premium Collection',
  spc: 'Special Collection',
};

export const PRODUCT_ICONS: Record<ProductType, string> = {
  booster_pack: '🃏',
  booster_bundle: '📦',
  etb: '🎁',
  booster_box: '📬',
  collection_box: '🗃️',
  upc: '👑',
  spc: '⭐',
};

// Cost multipliers by era (older = more expensive)
const ERA_MULTIPLIER: Record<string, number> = {
  vintage: 8,
  ex: 5,
  dp_platinum: 3.5,
  bw_xy: 2.5,
  sun_moon: 1.5,
  modern: 1,
};

function makeProducts(era: string): RipzProduct[] {
  const m = ERA_MULTIPLIER[era] || 1;
  return [
    { type: 'booster_pack', label: 'Booster Pack', packCount: 1, coinCost: Math.round(100 * m), cardsPerPack: 10 },
    { type: 'booster_bundle', label: 'Booster Bundle', packCount: 6, coinCost: Math.round(550 * m), cardsPerPack: 10 },
    { type: 'etb', label: 'Elite Trainer Box', packCount: 8, coinCost: Math.round(800 * m), cardsPerPack: 10 },
    { type: 'booster_box', label: 'Booster Box', packCount: 36, coinCost: Math.round(3200 * m), cardsPerPack: 10 },
    { type: 'collection_box', label: 'Collection Box', packCount: 4, coinCost: Math.round(450 * m), cardsPerPack: 10 },
    { type: 'upc', label: 'Ultra Premium Collection', packCount: 16, coinCost: Math.round(2400 * m), cardsPerPack: 10 },
    { type: 'spc', label: 'Special Collection', packCount: 10, coinCost: Math.round(1500 * m), cardsPerPack: 10 },
  ];
}

export const RIPZ_ERAS: RipzEra[] = [
  {
    id: 'modern',
    name: 'Modern (Scarlet & Violet)',
    years: '2023–Present',
    color: 'hsl(280, 80%, 55%)',
    icon: '🔮',
    sets: [
      { id: 'sv8', name: 'Surging Sparks', releaseYear: 2024, symbol: '⚡', totalCards: 191, products: makeProducts('modern') },
      { id: 'sv7', name: 'Stellar Crown', releaseYear: 2024, symbol: '👑', totalCards: 175, products: makeProducts('modern') },
      { id: 'sv6pt5', name: 'Prismatic Evolutions', releaseYear: 2025, symbol: '🌈', totalCards: 186, products: makeProducts('modern') },
      { id: 'sv6', name: 'Twilight Masquerade', releaseYear: 2024, symbol: '🎭', totalCards: 167, products: makeProducts('modern') },
      { id: 'sv5', name: 'Temporal Forces', releaseYear: 2024, symbol: '⏳', totalCards: 162, products: makeProducts('modern') },
      { id: 'sv4pt5', name: 'Paldean Fates', releaseYear: 2024, symbol: '🌟', totalCards: 245, products: makeProducts('modern') },
      { id: 'sv4', name: 'Paradox Rift', releaseYear: 2023, symbol: '🌀', totalCards: 182, products: makeProducts('modern') },
      { id: 'sv3pt5', name: '151', releaseYear: 2023, symbol: '1️⃣', totalCards: 207, products: makeProducts('modern') },
      { id: 'sv3', name: 'Obsidian Flames', releaseYear: 2023, symbol: '🔥', totalCards: 197, products: makeProducts('modern') },
      { id: 'sv2', name: 'Paldea Evolved', releaseYear: 2023, symbol: '🧬', totalCards: 193, products: makeProducts('modern') },
      { id: 'sv1', name: 'Scarlet & Violet', releaseYear: 2023, symbol: '💎', totalCards: 198, products: makeProducts('modern') },
    ],
  },
  {
    id: 'sun_moon',
    name: 'Sun & Moon / Sword & Shield',
    years: '2017–2023',
    color: 'hsl(40, 100%, 50%)',
    icon: '☀️',
    sets: [
      { id: 'swsh12pt5', name: 'Crown Zenith', releaseYear: 2023, symbol: '👑', totalCards: 230, products: makeProducts('sun_moon') },
      { id: 'swsh12', name: 'Silver Tempest', releaseYear: 2022, symbol: '🌪️', totalCards: 215, products: makeProducts('sun_moon') },
      { id: 'swsh11', name: 'Lost Origin', releaseYear: 2022, symbol: '🔮', totalCards: 217, products: makeProducts('sun_moon') },
      { id: 'swsh9', name: 'Brilliant Stars', releaseYear: 2022, symbol: '⭐', totalCards: 186, products: makeProducts('sun_moon') },
      { id: 'swsh7', name: 'Evolving Skies', releaseYear: 2021, symbol: '🌈', totalCards: 237, products: makeProducts('sun_moon') },
      { id: 'swsh45', name: 'Shining Fates', releaseYear: 2021, symbol: '✨', totalCards: 195, products: makeProducts('sun_moon') },
      { id: 'swsh35', name: 'Champion\'s Path', releaseYear: 2020, symbol: '🏆', totalCards: 80, products: makeProducts('sun_moon') },
    ],
  },
  {
    id: 'bw_xy',
    name: 'Black & White / XY',
    years: '2011–2017',
    color: 'hsl(210, 100%, 56%)',
    icon: '⚫',
    sets: [
      { id: 'xy12', name: 'Evolutions', releaseYear: 2016, symbol: '🔄', totalCards: 113, products: makeProducts('bw_xy') },
      { id: 'xy11', name: 'Steam Siege', releaseYear: 2016, symbol: '🏰', totalCards: 116, products: makeProducts('bw_xy') },
      { id: 'xy7', name: 'Ancient Origins', releaseYear: 2015, symbol: '🏛️', totalCards: 100, products: makeProducts('bw_xy') },
      { id: 'xy2', name: 'Flashfire', releaseYear: 2014, symbol: '🔥', totalCards: 109, products: makeProducts('bw_xy') },
      { id: 'bw11', name: 'Legendary Treasures', releaseYear: 2013, symbol: '💰', totalCards: 140, products: makeProducts('bw_xy') },
    ],
  },
  {
    id: 'dp_platinum',
    name: 'Diamond & Pearl / Platinum',
    years: '2007–2011',
    color: 'hsl(200, 70%, 50%)',
    icon: '💠',
    sets: [
      { id: 'pl4', name: 'Arceus', releaseYear: 2009, symbol: '🌟', totalCards: 111, products: makeProducts('dp_platinum') },
      { id: 'pl1', name: 'Platinum', releaseYear: 2009, symbol: '💎', totalCards: 133, products: makeProducts('dp_platinum') },
      { id: 'dp7', name: 'Stormfront', releaseYear: 2008, symbol: '⛈️', totalCards: 106, products: makeProducts('dp_platinum') },
      { id: 'dp1', name: 'Diamond & Pearl', releaseYear: 2007, symbol: '💠', totalCards: 130, products: makeProducts('dp_platinum') },
    ],
  },
  {
    id: 'ex',
    name: 'EX Era (Ruby & Sapphire)',
    years: '2003–2007',
    color: 'hsl(0, 85%, 55%)',
    icon: '🔴',
    sets: [
      { id: 'ex16', name: 'Power Keepers', releaseYear: 2007, symbol: '⚡', totalCards: 108, products: makeProducts('ex') },
      { id: 'ex14', name: 'Crystal Guardians', releaseYear: 2006, symbol: '🔮', totalCards: 100, products: makeProducts('ex') },
      { id: 'ex12', name: 'Legend Maker', releaseYear: 2006, symbol: '📜', totalCards: 93, products: makeProducts('ex') },
      { id: 'ex7', name: 'Team Rocket Returns', releaseYear: 2004, symbol: '🚀', totalCards: 111, products: makeProducts('ex') },
      { id: 'ex1', name: 'Ruby & Sapphire', releaseYear: 2003, symbol: '💎', totalCards: 109, products: makeProducts('ex') },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage (WOTC)',
    years: '1999–2003',
    color: 'hsl(145, 100%, 35%)',
    icon: '🏆',
    sets: [
      { id: 'base1', name: 'Base Set', releaseYear: 1999, symbol: '⭐', totalCards: 102, products: makeProducts('vintage') },
      { id: 'base2', name: 'Jungle', releaseYear: 1999, symbol: '🌴', totalCards: 64, products: makeProducts('vintage') },
      { id: 'base3', name: 'Fossil', releaseYear: 1999, symbol: '🦴', totalCards: 62, products: makeProducts('vintage') },
      { id: 'base4', name: 'Base Set 2', releaseYear: 2000, symbol: '2️⃣', totalCards: 130, products: makeProducts('vintage') },
      { id: 'base5', name: 'Team Rocket', releaseYear: 2000, symbol: '🚀', totalCards: 83, products: makeProducts('vintage') },
      { id: 'gym1', name: 'Gym Heroes', releaseYear: 2000, symbol: '🏟️', totalCards: 132, products: makeProducts('vintage') },
      { id: 'neo1', name: 'Neo Genesis', releaseYear: 2000, symbol: '🌟', totalCards: 111, products: makeProducts('vintage') },
      { id: 'neo2', name: 'Neo Discovery', releaseYear: 2001, symbol: '🔍', totalCards: 75, products: makeProducts('vintage') },
      { id: 'ecard1', name: 'Expedition', releaseYear: 2002, symbol: '🗺️', totalCards: 165, products: makeProducts('vintage') },
      { id: 'ecard2', name: 'Aquapolis', releaseYear: 2003, symbol: '🌊', totalCards: 186, products: makeProducts('vintage') },
    ],
  },
];

// Rarity weights for rip simulation
export const RARITY_WEIGHTS = {
  common: 45,
  uncommon: 30,
  rare: 15,
  holo_rare: 6,
  ultra_rare: 3,
  secret_rare: 0.8,
  illustration_rare: 0.15,
  hyper_rare: 0.05,
};

export const RARITY_VALUES: Record<string, { min: number; max: number }> = {
  common: { min: 5, max: 20 },
  uncommon: { min: 10, max: 50 },
  rare: { min: 25, max: 150 },
  holo_rare: { min: 50, max: 500 },
  ultra_rare: { min: 200, max: 2000 },
  secret_rare: { min: 500, max: 5000 },
  illustration_rare: { min: 1000, max: 15000 },
  hyper_rare: { min: 2000, max: 50000 },
};

export const RARITY_LABELS: Record<string, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  holo_rare: 'Holo Rare',
  ultra_rare: 'Ultra Rare',
  secret_rare: 'Secret Rare',
  illustration_rare: 'Illustration Rare',
  hyper_rare: 'Hyper Rare',
};

export const RARITY_COLORS: Record<string, string> = {
  common: 'text-muted-foreground',
  uncommon: 'text-terminal-green',
  rare: 'text-terminal-blue',
  holo_rare: 'text-terminal-amber',
  ultra_rare: 'text-purple-400',
  secret_rare: 'text-pink-400',
  illustration_rare: 'text-rose-400',
  hyper_rare: 'text-yellow-300',
};

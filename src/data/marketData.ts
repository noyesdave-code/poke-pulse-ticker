export interface CardData {
  name: string;
  set: string;
  setCode?: string;
  number: string;
  market: number;
  low: number;
  mid: number;
  change: number;
  volume?: number;
  grade?: string;
  _apiId?: string;
  _image?: string;
  _variant?: string;
}

export interface SealedProduct {
  name: string;
  type: string;
  market: number;
  change: number;
  low: number;
}

export const rawCards: CardData[] = [
  { name: "Espeon ★", set: "POP Series 5", number: "16", market: 1900.00, low: 5500.00, mid: 5500.00, change: 2.34 },
  { name: "Lugia", set: "Neo Genesis", number: "9", market: 1299.96, low: 1899.98, mid: 2300.00, change: -1.12 },
  { name: "Dark Charizard", set: "Team Rocket", number: "4", market: 680.37, low: 521.75, mid: 559.99, change: 3.87 },
  { name: "Umbreon", set: "Skyridge", number: "H30", market: 659.99, low: 1100.00, mid: 1100.00, change: 0.42 },
  { name: "Dark Gengar", set: "Neo Destiny", number: "6", market: 615.20, low: 449.99, mid: 774.99, change: -0.89 },
  { name: "Charizard", set: "Expedition Base Set", number: "6", market: 583.33, low: 500.00, mid: 501.98, change: 1.55 },
  { name: "Gengar", set: "Expedition Base Set", number: "13", market: 555.00, low: 750.00, mid: 750.00, change: 0.00 },
  { name: "Charizard δ", set: "Crystal Guardians", number: "4", market: 536.99, low: 499.99, mid: 575.00, change: -2.10 },
  { name: "Mewtwo", set: "Legendary Collection", number: "29", market: 517.02, low: 499.99, mid: 550.00, change: 0.78 },
  { name: "Pikachu", set: "Pokémon Rumble", number: "7", market: 505.00, low: 485.00, mid: 520.00, change: 1.22 },
  { name: "Mewtwo", set: "Expedition Base Set", number: "20", market: 500.98, low: 450.00, mid: 499.99, change: 0.33 },
  { name: "Blaine's Charizard", set: "Gym Challenge", number: "2", market: 499.52, low: 425.00, mid: 475.00, change: -0.65 },
  { name: "Charizard", set: "Base Set", number: "4", market: 494.23, low: 350.00, mid: 475.00, change: 4.12 },
  { name: "Charizard", set: "Base Set 2", number: "4", market: 486.99, low: 399.99, mid: 450.00, change: 0.88 },
  { name: "Dragonite", set: "Fossil", number: "4", market: 460.73, low: 350.00, mid: 425.00, change: -1.44 },
  { name: "Rocket's Mewtwo", set: "Gym Challenge", number: "14", market: 450.96, low: 399.99, mid: 440.00, change: 0.56 },
  { name: "Umbreon", set: "Neo Discovery", number: "13", market: 439.96, low: 375.00, mid: 410.00, change: 2.01 },
  { name: "Blastoise", set: "Base Set", number: "2", market: 400.00, low: 299.99, mid: 375.00, change: -0.22 },
];

export const gradedCards: CardData[] = [
  { name: "Charizard", set: "Base Set 1st Ed", number: "4", market: 42000.00, low: 38000.00, mid: 41000.00, change: 1.85, grade: "PSA 10" },
  { name: "Pikachu Illustrator", set: "Promo", number: "—", market: 28500.00, low: 25000.00, mid: 27500.00, change: 0.92, grade: "PSA 9" },
  { name: "Lugia", set: "Neo Genesis 1st Ed", number: "9", market: 18750.00, low: 16000.00, mid: 18000.00, change: -0.44, grade: "PSA 10" },
  { name: "Espeon ★", set: "POP Series 5", number: "16", market: 12800.00, low: 10500.00, mid: 12000.00, change: 3.21, grade: "PSA 10" },
  { name: "Shadowless Charizard", set: "Base Set", number: "4", market: 9850.00, low: 8500.00, mid: 9500.00, change: 0.65, grade: "CGC 9.5" },
  { name: "Dark Charizard", set: "Team Rocket 1st Ed", number: "4", market: 7200.00, low: 6000.00, mid: 7000.00, change: -1.22, grade: "PSA 10" },
  { name: "Umbreon", set: "Skyridge", number: "H30", market: 5450.00, low: 4800.00, mid: 5200.00, change: 2.10, grade: "BGS 9.5" },
  { name: "Gold Star Rayquaza", set: "Deoxys", number: "107", market: 4800.00, low: 4200.00, mid: 4600.00, change: 0.33, grade: "PSA 9" },
  { name: "Shining Charizard", set: "Neo Destiny 1st Ed", number: "107", market: 4200.00, low: 3500.00, mid: 4000.00, change: -0.78, grade: "PSA 9" },
  { name: "Crystal Charizard", set: "Skyridge", number: "146", market: 3900.00, low: 3200.00, mid: 3700.00, change: 1.45, grade: "CGC 9" },
];

export const sealedProducts: SealedProduct[] = [
  { name: "Base Set Booster Box", type: "Booster Box", market: 45000.00, change: 0.55, low: 40000.00 },
  { name: "Neo Genesis Booster Box", type: "Booster Box", market: 18500.00, change: -0.32, low: 16000.00 },
  { name: "Skyridge Booster Box", type: "Booster Box", market: 32000.00, change: 1.88, low: 28000.00 },
  { name: "Team Rocket Booster Box", type: "Booster Box", market: 14200.00, change: 0.42, low: 12000.00 },
  { name: "Fossil Booster Box", type: "Booster Box", market: 10500.00, change: -0.18, low: 9000.00 },
  { name: "Jungle Booster Box", type: "Booster Box", market: 11800.00, change: 0.75, low: 10000.00 },
  { name: "Base Set Booster Pack (Heavy)", type: "Booster Pack", market: 2800.00, change: 2.10, low: 2200.00 },
  { name: "Neo Destiny Booster Pack", type: "Booster Pack", market: 950.00, change: 0.33, low: 800.00 },
  { name: "EX Dragon Frontiers Booster Box", type: "Booster Box", market: 8500.00, change: -1.05, low: 7200.00 },
  { name: "Legendary Collection Booster Box", type: "Booster Box", market: 15000.00, change: 0.88, low: 13000.00 },
];

export const getIndexValue = (items: Array<{ market: number }>) => {
  const total = items.reduce((sum, c) => sum + c.market, 0);
  return total / items.length;
};

export const getIndexChange = (items: Array<{ change: number }>) => {
  const total = items.reduce((sum, c) => sum + c.change, 0);
  return total / items.length;
};

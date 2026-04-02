import type { FranchiseConfig, MarketItem } from "@/components/PulseTerminalDemo";

const mlbRaw: MarketItem[] = [
  { name: "Mickey Mantle", set: "1952 Topps", price: 12500, change: 2.34 },
  { name: "Mike Trout RC", set: "2011 Topps Update", price: 4200, change: 1.88 },
  { name: "Ken Griffey Jr RC", set: "1989 Upper Deck", price: 850, change: -0.45 },
  { name: "Derek Jeter RC", set: "1993 SP", price: 3200, change: 0.92 },
  { name: "Shohei Ohtani RC", set: "2018 Topps", price: 1850, change: 3.12 },
  { name: "Hank Aaron RC", set: "1954 Topps", price: 8500, change: 1.05 },
  { name: "Willie Mays", set: "1952 Topps", price: 9200, change: 0.78 },
  { name: "Babe Ruth", set: "1933 Goudey", price: 45000, change: 0.55 },
];
const mlbGraded: MarketItem[] = [
  { name: "Mickey Mantle", set: "1952 Topps", price: 525000, change: 1.22, grade: "PSA 9" },
  { name: "Mike Trout RC", set: "2011 Topps Update", price: 85000, change: 2.55, grade: "PSA 10" },
  { name: "Shohei Ohtani RC", set: "2018 Topps Chrome", price: 12500, change: 4.10, grade: "PSA 10" },
  { name: "Derek Jeter RC", set: "1993 SP", price: 42000, change: 0.88, grade: "BGS 9.5" },
  { name: "Ken Griffey Jr RC", set: "1989 Upper Deck", price: 8500, change: -0.12, grade: "PSA 10" },
];
const mlbSealed: MarketItem[] = [
  { name: "1952 Topps Wax Pack", set: "Vintage", price: 125000, change: 0.33 },
  { name: "2011 Topps Update Hobby Box", set: "Modern", price: 18500, change: 5.20 },
  { name: "2018 Topps Chrome Hobby Box", set: "Modern", price: 4200, change: 3.80 },
  { name: "1986 Fleer Basketball Wax Box", set: "Vintage", price: 95000, change: 0.12 },
];

const nflRaw: MarketItem[] = [
  { name: "Tom Brady RC", set: "2000 Playoff Contenders", price: 8500, change: -1.22 },
  { name: "Patrick Mahomes RC", set: "2017 Panini Prizm", price: 4800, change: 2.88 },
  { name: "Joe Burrow RC", set: "2020 Panini Prizm", price: 1200, change: 1.55 },
  { name: "Josh Allen RC", set: "2018 Panini Prizm", price: 2800, change: 0.92 },
  { name: "Caleb Williams RC", set: "2024 Panini Prizm", price: 650, change: 8.50 },
  { name: "Justin Jefferson RC", set: "2020 Panini Prizm", price: 980, change: 1.12 },
  { name: "Peyton Manning RC", set: "1998 Playoff Contenders", price: 3200, change: 0.45 },
  { name: "Joe Montana RC", set: "1981 Topps", price: 5500, change: 0.22 },
];
const nflGraded: MarketItem[] = [
  { name: "Tom Brady RC", set: "2000 Playoff Contenders", price: 425000, change: 0.55, grade: "PSA 10" },
  { name: "Patrick Mahomes RC", set: "2017 Panini Prizm Silver", price: 95000, change: 3.20, grade: "PSA 10" },
  { name: "Caleb Williams RC", set: "2024 Panini Prizm Gold", price: 8500, change: 12.50, grade: "PSA 10" },
  { name: "Josh Allen RC", set: "2018 Panini Prizm Silver", price: 28000, change: 1.88, grade: "BGS 9.5" },
];
const nflSealed: MarketItem[] = [
  { name: "2017 Panini Prizm Hobby Box", set: "Modern", price: 22000, change: 2.40 },
  { name: "2000 Playoff Contenders Box", set: "Vintage", price: 85000, change: 0.88 },
  { name: "2020 Panini Prizm Hobby Box", set: "Modern", price: 5500, change: 1.55 },
];

const nbaRaw: MarketItem[] = [
  { name: "LeBron James RC", set: "2003 Topps Chrome", price: 6500, change: 1.45 },
  { name: "Michael Jordan RC", set: "1986 Fleer", price: 18500, change: 0.88 },
  { name: "Luka Dončić RC", set: "2018 Panini Prizm", price: 3200, change: 2.10 },
  { name: "Victor Wembanyama RC", set: "2023 Panini Prizm", price: 1800, change: 5.50 },
  { name: "Stephen Curry RC", set: "2009 Topps Chrome", price: 4200, change: 0.65 },
  { name: "Kobe Bryant RC", set: "1996 Topps Chrome", price: 5800, change: 1.22 },
  { name: "Giannis RC", set: "2013 Panini Prizm", price: 2400, change: 0.92 },
  { name: "Larry Bird RC", set: "1980 Topps", price: 3800, change: 0.33 },
];
const nbaGraded: MarketItem[] = [
  { name: "Michael Jordan RC", set: "1986 Fleer", price: 385000, change: 0.42, grade: "PSA 10" },
  { name: "LeBron James RC", set: "2003 Topps Chrome", price: 125000, change: 1.88, grade: "PSA 10" },
  { name: "Victor Wembanyama RC", set: "2023 Prizm Silver", price: 15000, change: 8.20, grade: "PSA 10" },
  { name: "Luka Dončić RC", set: "2018 Prizm Silver", price: 45000, change: 2.55, grade: "BGS 9.5" },
];
const nbaSealed: MarketItem[] = [
  { name: "1986 Fleer Wax Box", set: "Vintage", price: 185000, change: 0.22 },
  { name: "2003 Topps Chrome Hobby Box", set: "Modern", price: 65000, change: 1.10 },
  { name: "2018 Panini Prizm Hobby Box", set: "Modern", price: 18500, change: 3.40 },
];

const nhlRaw: MarketItem[] = [
  { name: "Wayne Gretzky RC", set: "1979 O-Pee-Chee", price: 12000, change: 0.88 },
  { name: "Connor McDavid RC", set: "2015 Upper Deck YG", price: 2800, change: 2.10 },
  { name: "Sidney Crosby RC", set: "2005 Upper Deck YG", price: 1500, change: 0.45 },
  { name: "Mario Lemieux RC", set: "1985 O-Pee-Chee", price: 3200, change: 0.22 },
  { name: "Connor Bedard RC", set: "2023 Upper Deck YG", price: 850, change: 6.80 },
  { name: "Bobby Orr RC", set: "1966 Topps", price: 8500, change: 0.55 },
  { name: "Patrick Roy RC", set: "1986 O-Pee-Chee", price: 1200, change: 0.33 },
  { name: "Auston Matthews RC", set: "2016 Upper Deck YG", price: 950, change: 1.12 },
];
const nhlGraded: MarketItem[] = [
  { name: "Wayne Gretzky RC", set: "1979 O-Pee-Chee", price: 350000, change: 0.55, grade: "PSA 10" },
  { name: "Connor McDavid RC", set: "2015 UD YG", price: 42000, change: 3.20, grade: "PSA 10" },
  { name: "Connor Bedard RC", set: "2023 UD YG", price: 5500, change: 9.50, grade: "PSA 10" },
];
const nhlSealed: MarketItem[] = [
  { name: "2015 Upper Deck Hobby Box", set: "Modern", price: 12500, change: 4.20 },
  { name: "2005 Upper Deck Hobby Box", set: "Modern", price: 8500, change: 1.80 },
  { name: "1979 O-Pee-Chee Wax Box", set: "Vintage", price: 95000, change: 0.12 },
];

const fifaRaw: MarketItem[] = [
  { name: "Pelé", set: "1958 Alifabolaget", price: 45000, change: 0.55 },
  { name: "Lionel Messi RC", set: "2004 Panini Mega Cracks", price: 8500, change: 3.20 },
  { name: "Cristiano Ronaldo RC", set: "2003 Panini Mega Cracks", price: 6200, change: 1.88 },
  { name: "Kylian Mbappé RC", set: "2018 Panini Prizm WC", price: 2800, change: 2.45 },
  { name: "Erling Haaland RC", set: "2020 Topps Chrome UCL", price: 1500, change: 4.10 },
  { name: "Maradona", set: "1986 Panini WC Sticker", price: 12000, change: 0.88 },
  { name: "Jude Bellingham RC", set: "2020 Topps Chrome BL", price: 950, change: 5.50 },
  { name: "Zinedine Zidane", set: "1996 Panini Foot", price: 3200, change: 0.45 },
];
const fifaGraded: MarketItem[] = [
  { name: "Pelé", set: "1958 Alifabolaget", price: 280000, change: 0.22, grade: "PSA 7" },
  { name: "Lionel Messi RC", set: "2004 Mega Cracks", price: 125000, change: 4.50, grade: "PSA 10" },
  { name: "Kylian Mbappé RC", set: "2018 Prizm WC Silver", price: 35000, change: 3.80, grade: "PSA 10" },
];
const fifaSealed: MarketItem[] = [
  { name: "2018 Panini Prizm WC Hobby Box", set: "Modern", price: 28000, change: 5.50 },
  { name: "2014 Panini Prizm WC Hobby Box", set: "Modern", price: 15000, change: 2.20 },
  { name: "2022 Panini Prizm WC Hobby Box", set: "Modern", price: 4500, change: 1.80 },
];

const mtgRaw: MarketItem[] = [
  { name: "Black Lotus", set: "Alpha", price: 125000, change: 0.88 },
  { name: "Mox Sapphire", set: "Beta", price: 18500, change: 0.55 },
  { name: "Ancestral Recall", set: "Alpha", price: 32000, change: 1.22 },
  { name: "Time Walk", set: "Alpha", price: 28000, change: 0.92 },
  { name: "Underground Sea", set: "Revised", price: 850, change: -0.45 },
  { name: "Force of Will", set: "Alliances", price: 320, change: 2.10 },
  { name: "Jace, the Mind Sculptor", set: "Worldwake", price: 145, change: 1.55 },
  { name: "Ragavan", set: "MH2", price: 65, change: 3.20 },
];
const mtgGraded: MarketItem[] = [
  { name: "Black Lotus", set: "Alpha", price: 850000, change: 0.33, grade: "PSA 9" },
  { name: "Mox Sapphire", set: "Alpha", price: 125000, change: 0.88, grade: "PSA 10" },
  { name: "Time Walk", set: "Beta", price: 85000, change: 1.10, grade: "BGS 9.5" },
  { name: "Ancestral Recall", set: "Alpha", price: 95000, change: 0.55, grade: "PSA 9" },
];
const mtgSealed: MarketItem[] = [
  { name: "Alpha Booster Pack", set: "Vintage", price: 95000, change: 0.22 },
  { name: "Beta Booster Box", set: "Vintage", price: 450000, change: 0.45 },
  { name: "Legends Booster Box", set: "Vintage", price: 85000, change: 1.80 },
  { name: "Modern Horizons 2 Collector Box", set: "Modern", price: 850, change: 2.40 },
];

const yugiohRaw: MarketItem[] = [
  { name: "Blue-Eyes White Dragon", set: "LOB 1st Ed", price: 8500, change: 1.55 },
  { name: "Dark Magician", set: "LOB 1st Ed", price: 4200, change: 0.88 },
  { name: "Exodia Head", set: "LOB 1st Ed", price: 5500, change: 2.10 },
  { name: "Black Luster Soldier", set: "IOC 1st Ed", price: 12000, change: 0.45 },
  { name: "Pot of Greed", set: "LOB 1st Ed", price: 850, change: -0.22 },
  { name: "Red-Eyes B. Dragon", set: "LOB 1st Ed", price: 2800, change: 1.22 },
  { name: "Change of Heart", set: "LOB 1st Ed", price: 650, change: 0.55 },
  { name: "Cyber Dragon", set: "CRV 1st Ed", price: 320, change: 3.40 },
];
const yugiohGraded: MarketItem[] = [
  { name: "Blue-Eyes White Dragon", set: "LOB 1st Ed", price: 125000, change: 1.88, grade: "PSA 10" },
  { name: "Dark Magician", set: "LOB 1st Ed", price: 65000, change: 0.92, grade: "PSA 10" },
  { name: "Black Luster Soldier", set: "IOC 1st Ed", price: 185000, change: 0.55, grade: "PSA 10" },
];
const yugiohSealed: MarketItem[] = [
  { name: "LOB 1st Ed Booster Box", set: "Vintage", price: 125000, change: 0.88 },
  { name: "MRD 1st Ed Booster Box", set: "Vintage", price: 45000, change: 1.20 },
  { name: "IOC 1st Ed Booster Box", set: "Vintage", price: 85000, change: 0.55 },
];

const dbzRaw: MarketItem[] = [
  { name: "Goku Lv5", set: "Saiyan Saga", price: 2800, change: 3.20 },
  { name: "Vegeta Lv4", set: "Frieza Saga", price: 1500, change: 2.10 },
  { name: "SSJ Gohan", set: "Cell Saga", price: 1200, change: 1.55 },
  { name: "Golden Frieza", set: "Resurrection F", price: 850, change: 4.80 },
  { name: "Broly", set: "Movie Collection", price: 650, change: 2.45 },
  { name: "Perfect Cell", set: "Cell Games", price: 420, change: 1.22 },
  { name: "Beerus", set: "Battle of Gods", price: 380, change: 3.50 },
  { name: "Ultra Instinct Goku", set: "Tournament of Power", price: 550, change: 6.20 },
];
const dbzGraded: MarketItem[] = [
  { name: "Goku Lv5", set: "Saiyan Saga", price: 28000, change: 4.50, grade: "PSA 10" },
  { name: "Vegeta Lv4", set: "Frieza Saga", price: 15000, change: 3.20, grade: "PSA 10" },
  { name: "SSJ Gohan", set: "Cell Saga", price: 12000, change: 2.80, grade: "BGS 9.5" },
];
const dbzSealed: MarketItem[] = [
  { name: "Saiyan Saga Booster Box", set: "Vintage", price: 18500, change: 2.20 },
  { name: "Frieza Saga Booster Box", set: "Vintage", price: 12000, change: 1.55 },
  { name: "Panini DBS Set 1 Box", set: "Modern", price: 2800, change: 3.80 },
];

const lorcanaRaw: MarketItem[] = [
  { name: "Elsa - Spirit of Winter", set: "The First Chapter", price: 85, change: -1.22 },
  { name: "Mickey Mouse - Brave Little Tailor", set: "Rise of the Floodborn", price: 120, change: 2.55 },
  { name: "Stitch - Rock Star", set: "Into the Inklands", price: 45, change: 3.80 },
  { name: "Maleficent - Monstrous Dragon", set: "The First Chapter", price: 65, change: 0.88 },
  { name: "Robin Hood - Unrivaled Archer", set: "The First Chapter", price: 55, change: 1.45 },
  { name: "Ursula - Power Hungry", set: "Rise of the Floodborn", price: 38, change: 2.10 },
  { name: "Simba - Returned King", set: "Into the Inklands", price: 42, change: 4.20 },
  { name: "Belle - Strange but Special", set: "The First Chapter", price: 28, change: 0.55 },
];
const lorcanaGraded: MarketItem[] = [
  { name: "Elsa - Spirit of Winter Enchanted", set: "TFC", price: 1200, change: 3.40, grade: "PSA 10" },
  { name: "Mickey Mouse Enchanted", set: "ROTF", price: 850, change: 5.20, grade: "PSA 10" },
  { name: "Stitch Enchanted", set: "ITI", price: 650, change: 4.80, grade: "CGC 9.5" },
];
const lorcanaSealed: MarketItem[] = [
  { name: "The First Chapter Booster Box", set: "Set 1", price: 185, change: 1.20 },
  { name: "Rise of the Floodborn Booster Box", set: "Set 2", price: 145, change: 0.88 },
  { name: "Into the Inklands Booster Box", set: "Set 3", price: 125, change: 2.40 },
];

const starwarsRaw: MarketItem[] = [
  { name: "Darth Vader", set: "1977 Topps", price: 4500, change: 0.88 },
  { name: "Luke Skywalker RC", set: "1977 Topps", price: 2800, change: 0.55 },
  { name: "Boba Fett", set: "1980 Topps ESB", price: 1500, change: 1.22 },
  { name: "Yoda", set: "1980 Topps ESB", price: 1200, change: 0.45 },
  { name: "Han Solo", set: "1977 Topps", price: 950, change: 0.33 },
  { name: "Grogu RC", set: "2020 Topps Chrome", price: 320, change: 5.50 },
  { name: "Ahsoka Tano", set: "2022 Topps Chrome", price: 185, change: 3.20 },
  { name: "Princess Leia", set: "1977 Topps", price: 850, change: 0.65 },
];
const starwarsGraded: MarketItem[] = [
  { name: "Darth Vader", set: "1977 Topps #196", price: 45000, change: 0.55, grade: "PSA 10" },
  { name: "Luke Skywalker", set: "1977 Topps #1", price: 32000, change: 0.88, grade: "PSA 10" },
  { name: "Boba Fett", set: "1980 Topps ESB", price: 18500, change: 1.45, grade: "PSA 10" },
];
const starwarsSealed: MarketItem[] = [
  { name: "1977 Topps Wax Box", set: "Vintage", price: 65000, change: 0.22 },
  { name: "1980 Topps ESB Wax Box", set: "Vintage", price: 28000, change: 0.55 },
  { name: "2020 Topps Chrome Hobby Box", set: "Modern", price: 1500, change: 4.20 },
];

export const franchiseConfigs: Record<string, FranchiseConfig> = {
  mlb: {
    id: "mlb", name: "MLB Pulse Market Terminal", tagline: "Professional-grade market intelligence for baseball card collectors and investors. Track Topps, Bowman, and vintage to modern rookie cards.",
    primaryColor: "#E31937", accentColor: "#002D72", bgGradient: "linear-gradient(135deg, #002D72 0%, #E31937 100%)",
    tickerPrefix: "MLB", indexName: "DIAMOND", currency: "$",
    rawItems: mlbRaw, gradedItems: mlbGraded, sealedItems: mlbSealed,
    categories: ["Topps", "Bowman", "Panini", "Upper Deck", "Vintage", "Modern RC"],
    logoEmoji: "⚾", tam: "$5.4B", description: "The baseball card market remains the largest and most established collectible card market in North America.",
  },
  nfl: {
    id: "nfl", name: "NFL Pulse Market Terminal", tagline: "Real-time football card market data for Panini Prizm, Contenders, and vintage gridiron assets.",
    primaryColor: "#013369", accentColor: "#D50A0A", bgGradient: "linear-gradient(135deg, #013369 0%, #D50A0A 100%)",
    tickerPrefix: "NFL", indexName: "GRIDIRON", currency: "$",
    rawItems: nflRaw, gradedItems: nflGraded, sealedItems: nflSealed,
    categories: ["Panini Prizm", "Contenders", "Mosaic", "Select", "Topps", "Rookie Cards"],
    logoEmoji: "🏈", tam: "$4.8B", description: "Football cards represent the fastest-growing segment of the sports card market with massive rookie card speculation.",
  },
  nba: {
    id: "nba", name: "NBA Pulse Market Terminal", tagline: "Track basketball card markets from vintage Fleer to modern Panini Prizm with institutional-grade analytics.",
    primaryColor: "#1D428A", accentColor: "#C8102E", bgGradient: "linear-gradient(135deg, #1D428A 0%, #C8102E 100%)",
    tickerPrefix: "NBA", indexName: "HARDWOOD", currency: "$",
    rawItems: nbaRaw, gradedItems: nbaGraded, sealedItems: nbaSealed,
    categories: ["Panini Prizm", "Topps Chrome", "Fleer", "Upper Deck", "Hoops", "Select"],
    logoEmoji: "🏀", tam: "$6.2B", description: "Basketball cards dominate modern sports card investing with explosive rookie card markets.",
  },
  nhl: {
    id: "nhl", name: "NHL Pulse Market Terminal", tagline: "Hockey card market intelligence — Young Guns, O-Pee-Chee, and vintage puck assets tracked in real time.",
    primaryColor: "#000000", accentColor: "#A2AAAD", bgGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    tickerPrefix: "NHL", indexName: "ICE", currency: "$",
    rawItems: nhlRaw, gradedItems: nhlGraded, sealedItems: nhlSealed,
    categories: ["Upper Deck YG", "O-Pee-Chee", "SP Authentic", "Topps", "Vintage"],
    logoEmoji: "🏒", tam: "$1.8B", description: "The hockey card market offers significant value opportunities with Young Guns and vintage O-Pee-Chee.",
  },
  fifa: {
    id: "fifa", name: "FIFA Soccer Pulse Market Terminal", tagline: "Global football (soccer) card market — World Cup Prizm, Topps Chrome UCL, and sticker markets worldwide.",
    primaryColor: "#326295", accentColor: "#FFCC00", bgGradient: "linear-gradient(135deg, #326295 0%, #1a472a 50%, #FFCC00 100%)",
    tickerPrefix: "FIFA", indexName: "PITCH", currency: "$",
    rawItems: fifaRaw, gradedItems: fifaGraded, sealedItems: fifaSealed,
    categories: ["Panini Prizm WC", "Topps Chrome UCL", "Panini Stickers", "Mega Cracks", "Bowman"],
    logoEmoji: "⚽", tam: "$8.5B", description: "Soccer is the world's most popular sport — the collectible card market is rapidly globalizing with World Cup and Champions League products.",
  },
  mtg: {
    id: "mtg", name: "Magic: The Gathering Pulse Market Terminal", tagline: "Track Power Nine, Reserved List, and modern staples across all MTG formats with precision analytics.",
    primaryColor: "#8B5CF6", accentColor: "#F59E0B", bgGradient: "linear-gradient(135deg, #1a1033 0%, #3b0764 50%, #6d28d9 100%)",
    tickerPrefix: "MTG", indexName: "MANA", currency: "$",
    rawItems: mtgRaw, gradedItems: mtgGraded, sealedItems: mtgSealed,
    categories: ["Power Nine", "Reserved List", "Modern Staples", "Commander", "Vintage", "Legacy"],
    logoEmoji: "🧙", tam: "$12.5B", description: "Magic: The Gathering is the original TCG with a 30-year history and the most established secondary market in gaming.",
  },
  yugioh: {
    id: "yugioh", name: "Yu-Gi-Oh! Pulse Market Terminal", tagline: "Monitor LOB 1st Edition, Ghost Rares, and tournament staples across the Yu-Gi-Oh! TCG ecosystem.",
    primaryColor: "#D4AF37", accentColor: "#8B0000", bgGradient: "linear-gradient(135deg, #1a0a00 0%, #4a1500 50%, #D4AF37 100%)",
    tickerPrefix: "YGO", indexName: "DUEL", currency: "$",
    rawItems: yugiohRaw, gradedItems: yugiohGraded, sealedItems: yugiohSealed,
    categories: ["LOB 1st Ed", "Ghost Rares", "Starlight Rares", "Tournament", "Vintage", "Modern"],
    logoEmoji: "🃏", tam: "$4.2B", description: "Yu-Gi-Oh! has a massive global player base with explosive sealed product and vintage card markets.",
  },
  dbz: {
    id: "dbz", name: "Dragon Ball Z Pulse Market Terminal", tagline: "Track Saiyan Saga to Tournament of Power — Dragon Ball Super and vintage DBZ card markets in one terminal.",
    primaryColor: "#FF6B00", accentColor: "#FFD700", bgGradient: "linear-gradient(135deg, #1a0500 0%, #8B2500 50%, #FF6B00 100%)",
    tickerPrefix: "DBZ", indexName: "POWER", currency: "$",
    rawItems: dbzRaw, gradedItems: dbzGraded, sealedItems: dbzSealed,
    categories: ["Saiyan Saga", "Frieza Saga", "Cell Saga", "DBS", "Movie Collection", "Panini"],
    logoEmoji: "🐉", tam: "$2.8B", description: "Dragon Ball Z cards are experiencing a renaissance with nostalgic collectors driving vintage prices and new DBS sets launching.",
  },
  lorcana: {
    id: "lorcana", name: "Lorcana Pulse Market Terminal", tagline: "Disney Lorcana TCG market intelligence — Enchanted rares, sealed product, and meta staples tracked live.",
    primaryColor: "#0EA5E9", accentColor: "#A855F7", bgGradient: "linear-gradient(135deg, #0c0a2a 0%, #1e1b4b 50%, #0EA5E9 100%)",
    tickerPrefix: "LOR", indexName: "INK", currency: "$",
    rawItems: lorcanaRaw, gradedItems: lorcanaGraded, sealedItems: lorcanaSealed,
    categories: ["Enchanted", "Legendary", "Super Rare", "The First Chapter", "Floodborn", "Inklands"],
    logoEmoji: "✨", tam: "$1.5B", description: "Disney Lorcana is the newest major TCG backed by the world's most valuable IP portfolio, with explosive early growth.",
  },
  starwars: {
    id: "starwars", name: "Star Wars Pulse Market Terminal", tagline: "Vintage 1977 Topps to modern Chrome — the definitive Star Wars card market data terminal.",
    primaryColor: "#FFE81F", accentColor: "#C0C0C0", bgGradient: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #2d2d44 100%)",
    tickerPrefix: "SW", indexName: "FORCE", currency: "$",
    rawItems: starwarsRaw, gradedItems: starwarsGraded, sealedItems: starwarsSealed,
    categories: ["1977 Topps", "ESB", "Chrome", "Masterwork", "Sketch Cards", "Modern"],
    logoEmoji: "⭐", tam: "$3.2B", description: "Star Wars collectible cards span nearly 50 years of production with a passionate global fanbase and Disney-backed IP.",
  },
};

export const franchiseList = Object.values(franchiseConfigs);

// PokémonKids Adventure game data

export interface StarterPokemon {
  name: string;
  type: string;
  image: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
}

export const STARTER_POKEMON: StarterPokemon[] = [
  {
    name: "Pikachu",
    type: "Electric",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    description: "The iconic Electric-type! Shocks opponents with thunderbolts.",
    hp: 80, attack: 75, defense: 60,
  },
  {
    name: "Charizard",
    type: "Fire",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    description: "A fearsome Fire/Flying dragon. Burns everything in its path.",
    hp: 90, attack: 90, defense: 70,
  },
  {
    name: "Blastoise",
    type: "Water",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    description: "Powerful Water-type with twin cannons. Washes away competition.",
    hp: 95, attack: 70, defense: 90,
  },
  {
    name: "Venusaur",
    type: "Grass",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    description: "Mighty Grass/Poison-type. Draws power from the sun.",
    hp: 90, attack: 75, defense: 85,
  },
  {
    name: "Gengar",
    type: "Ghost",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    description: "Mischievous Ghost/Poison-type. Hides in shadows to strike.",
    hp: 70, attack: 85, defense: 55,
  },
  {
    name: "Mewtwo",
    type: "Psychic",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    description: "Legendary Psychic-type. The most powerful Pokémon ever created.",
    hp: 100, attack: 95, defense: 65,
  },
  // --- NEW STARTERS ---
  {
    name: "Eevee",
    type: "Normal",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    description: "Versatile evolution Pokémon. Adapts to any challenge with heart.",
    hp: 75, attack: 65, defense: 65,
  },
  {
    name: "Dragonite",
    type: "Dragon",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    description: "Kind-hearted Dragon-type. Circles the globe at Mach speed.",
    hp: 95, attack: 92, defense: 80,
  },
  {
    name: "Snorlax",
    type: "Normal",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
    description: "The sleeping giant! Nearly indestructible once it wakes up.",
    hp: 120, attack: 70, defense: 95,
  },
  {
    name: "Alakazam",
    type: "Psychic",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
    description: "Genius IQ of 5,000. Bends spoons and minds alike.",
    hp: 65, attack: 88, defense: 50,
  },
  {
    name: "Gyarados",
    type: "Water",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
    description: "From weak Magikarp to raging sea serpent. Pure fury unleashed.",
    hp: 95, attack: 90, defense: 75,
  },
  {
    name: "Arcanine",
    type: "Fire",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png",
    description: "Legendary fire hound. Runs 6,200 miles in a single day.",
    hp: 90, attack: 85, defense: 80,
  },
  {
    name: "Lapras",
    type: "Ice",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png",
    description: "Gentle sea traveler. Ferries people across oceans with song.",
    hp: 105, attack: 70, defense: 85,
  },
  {
    name: "Machamp",
    type: "Fighting",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png",
    description: "Four-armed fighting machine. Throws 1,000 punches in 2 seconds.",
    hp: 90, attack: 95, defense: 70,
  },
  {
    name: "Jolteon",
    type: "Electric",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
    description: "Lightning-fast Eevee evolution. Each hair is a charged needle.",
    hp: 70, attack: 80, defense: 55,
  },
  {
    name: "Mew",
    type: "Psychic",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
    description: "Mythical ancestor of all Pokémon. Can learn any move in existence.",
    hp: 85, attack: 85, defense: 85,
  },
];

// All collectible Pokémon in the game (expanded Gen 1)
export const ALL_POKEMON = [
  { name: "Bulbasaur", type: "Grass", id: 1 },
  { name: "Ivysaur", type: "Grass", id: 2 },
  { name: "Venusaur", type: "Grass", id: 3 },
  { name: "Charmander", type: "Fire", id: 4 },
  { name: "Charmeleon", type: "Fire", id: 5 },
  { name: "Charizard", type: "Fire", id: 6 },
  { name: "Squirtle", type: "Water", id: 7 },
  { name: "Wartortle", type: "Water", id: 8 },
  { name: "Blastoise", type: "Water", id: 9 },
  { name: "Caterpie", type: "Bug", id: 10 },
  { name: "Butterfree", type: "Bug", id: 12 },
  { name: "Weedle", type: "Bug", id: 13 },
  { name: "Beedrill", type: "Bug", id: 15 },
  { name: "Pidgey", type: "Flying", id: 16 },
  { name: "Pidgeot", type: "Flying", id: 18 },
  { name: "Rattata", type: "Normal", id: 19 },
  { name: "Pikachu", type: "Electric", id: 25 },
  { name: "Raichu", type: "Electric", id: 26 },
  { name: "Sandshrew", type: "Ground", id: 27 },
  { name: "Nidoking", type: "Poison", id: 34 },
  { name: "Nidoqueen", type: "Poison", id: 31 },
  { name: "Clefairy", type: "Normal", id: 35 },
  { name: "Vulpix", type: "Fire", id: 37 },
  { name: "Ninetales", type: "Fire", id: 38 },
  { name: "Jigglypuff", type: "Normal", id: 39 },
  { name: "Zubat", type: "Poison", id: 41 },
  { name: "Golbat", type: "Poison", id: 42 },
  { name: "Oddish", type: "Grass", id: 43 },
  { name: "Vileplume", type: "Grass", id: 45 },
  { name: "Growlithe", type: "Fire", id: 58 },
  { name: "Arcanine", type: "Fire", id: 59 },
  { name: "Poliwag", type: "Water", id: 60 },
  { name: "Alakazam", type: "Psychic", id: 65 },
  { name: "Machamp", type: "Fighting", id: 68 },
  { name: "Geodude", type: "Rock", id: 74 },
  { name: "Golem", type: "Rock", id: 76 },
  { name: "Ponyta", type: "Fire", id: 77 },
  { name: "Rapidash", type: "Fire", id: 78 },
  { name: "Slowpoke", type: "Water", id: 79 },
  { name: "Magnemite", type: "Electric", id: 81 },
  { name: "Farfetch'd", type: "Flying", id: 83 },
  { name: "Dodrio", type: "Flying", id: 85 },
  { name: "Seel", type: "Water", id: 86 },
  { name: "Dewgong", type: "Ice", id: 87 },
  { name: "Grimer", type: "Poison", id: 88 },
  { name: "Muk", type: "Poison", id: 89 },
  { name: "Shellder", type: "Water", id: 90 },
  { name: "Gastly", type: "Ghost", id: 92 },
  { name: "Haunter", type: "Ghost", id: 93 },
  { name: "Gengar", type: "Ghost", id: 94 },
  { name: "Onix", type: "Rock", id: 95 },
  { name: "Drowzee", type: "Psychic", id: 96 },
  { name: "Hypno", type: "Psychic", id: 97 },
  { name: "Krabby", type: "Water", id: 98 },
  { name: "Voltorb", type: "Electric", id: 100 },
  { name: "Electrode", type: "Electric", id: 101 },
  { name: "Exeggcute", type: "Grass", id: 102 },
  { name: "Cubone", type: "Ground", id: 104 },
  { name: "Hitmonlee", type: "Fighting", id: 106 },
  { name: "Hitmonchan", type: "Fighting", id: 107 },
  { name: "Lickitung", type: "Normal", id: 108 },
  { name: "Koffing", type: "Poison", id: 109 },
  { name: "Rhyhorn", type: "Rock", id: 111 },
  { name: "Chansey", type: "Normal", id: 113 },
  { name: "Tangela", type: "Grass", id: 114 },
  { name: "Kangaskhan", type: "Normal", id: 115 },
  { name: "Horsea", type: "Water", id: 116 },
  { name: "Goldeen", type: "Water", id: 118 },
  { name: "Staryu", type: "Water", id: 120 },
  { name: "Starmie", type: "Water", id: 121 },
  { name: "Mr. Mime", type: "Psychic", id: 122 },
  { name: "Scyther", type: "Bug", id: 123 },
  { name: "Jynx", type: "Ice", id: 124 },
  { name: "Electabuzz", type: "Electric", id: 125 },
  { name: "Magmar", type: "Fire", id: 126 },
  { name: "Pinsir", type: "Bug", id: 127 },
  { name: "Tauros", type: "Normal", id: 128 },
  { name: "Magikarp", type: "Water", id: 129 },
  { name: "Gyarados", type: "Water", id: 130 },
  { name: "Lapras", type: "Ice", id: 131 },
  { name: "Ditto", type: "Normal", id: 132 },
  { name: "Eevee", type: "Normal", id: 133 },
  { name: "Vaporeon", type: "Water", id: 134 },
  { name: "Jolteon", type: "Electric", id: 135 },
  { name: "Flareon", type: "Fire", id: 136 },
  { name: "Porygon", type: "Normal", id: 137 },
  { name: "Omanyte", type: "Rock", id: 138 },
  { name: "Kabuto", type: "Rock", id: 140 },
  { name: "Aerodactyl", type: "Rock", id: 142 },
  { name: "Snorlax", type: "Normal", id: 143 },
  { name: "Articuno", type: "Ice", id: 144 },
  { name: "Zapdos", type: "Electric", id: 145 },
  { name: "Moltres", type: "Fire", id: 146 },
  { name: "Dratini", type: "Dragon", id: 147 },
  { name: "Dragonair", type: "Dragon", id: 148 },
  { name: "Dragonite", type: "Dragon", id: 149 },
  { name: "Mewtwo", type: "Psychic", id: 150 },
  { name: "Mew", type: "Psychic", id: 151 },
];

export const getPokemonImage = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Type matchup chart (simplified)
export const TYPE_ADVANTAGES: Record<string, string[]> = {
  Fire: ["Grass", "Bug", "Ice"],
  Water: ["Fire", "Rock", "Ground"],
  Grass: ["Water", "Rock", "Ground"],
  Electric: ["Water", "Flying"],
  Psychic: ["Fighting", "Poison"],
  Ghost: ["Psychic", "Ghost"],
  Fighting: ["Normal", "Rock", "Ice"],
  Dragon: ["Dragon"],
  Normal: [],
  Bug: ["Grass", "Psychic"],
  Rock: ["Fire", "Bug", "Flying"],
  Ground: ["Fire", "Electric", "Rock"],
  Ice: ["Grass", "Dragon", "Flying"],
  Flying: ["Grass", "Bug", "Fighting"],
  Poison: ["Grass"],
};

// Adventure Zones — each with unique encounters and rewards
export interface AdventureZone {
  name: string;
  minLevel: number;
  icon: string;
  color: string;
  description: string;
  encounterRate: number; // 0-1 chance to find Pokémon
  xpReward: number;
  coinReward: number;
  pokemonPool: number[]; // Pokémon IDs that spawn here
  bossBot?: BotOpponent;
}

export const ADVENTURE_ZONES: AdventureZone[] = [
  {
    name: "Pallet Town",
    minLevel: 1,
    icon: "🏠",
    color: "bg-green-500/20 border-green-500/30",
    description: "Home sweet home. Practice battles and meet your neighbors' Pokémon.",
    encounterRate: 0.5,
    xpReward: 10,
    coinReward: 20,
    pokemonPool: [19, 16, 10, 39, 133], // Rattata, Pidgey, Caterpie, Jigglypuff, Eevee
  },
  {
    name: "Viridian Forest",
    minLevel: 2,
    icon: "🌲",
    color: "bg-emerald-500/20 border-emerald-500/30",
    description: "Dense Bug-type haven. Watch for Pikachu hiding in the trees!",
    encounterRate: 0.55,
    xpReward: 15,
    coinReward: 30,
    pokemonPool: [10, 13, 12, 15, 25, 43], // Caterpie, Weedle, Butterfree, Beedrill, Pikachu, Oddish
  },
  {
    name: "Pewter Gym",
    minLevel: 3,
    icon: "🏛️",
    color: "bg-stone-500/20 border-stone-500/30",
    description: "Brock's Rock-type gym. Defeat him to earn the Boulder Badge!",
    encounterRate: 0.35,
    xpReward: 25,
    coinReward: 50,
    pokemonPool: [74, 95, 111, 27], // Geodude, Onix, Rhyhorn, Sandshrew
    bossBot: { name: "Gym Leader Brock", pokemon: "Onix", pokemonType: "Rock", pokemonId: 95, difficulty: "medium", knowledgeLevel: 55 },
  },
  {
    name: "Mt. Moon",
    minLevel: 5,
    icon: "🌙",
    color: "bg-purple-500/20 border-purple-500/30",
    description: "Moonlit cave filled with rare fossils and Clefairy dancing under the stars.",
    encounterRate: 0.45,
    xpReward: 20,
    coinReward: 40,
    pokemonPool: [35, 41, 42, 74, 138, 140], // Clefairy, Zubat, Golbat, Geodude, Omanyte, Kabuto
  },
  {
    name: "Cerulean City",
    minLevel: 7,
    icon: "💧",
    color: "bg-blue-500/20 border-blue-500/30",
    description: "Misty's Water-type gym and home to the mysterious Cerulean Cave.",
    encounterRate: 0.45,
    xpReward: 25,
    coinReward: 50,
    pokemonPool: [7, 54, 60, 86, 90, 116, 118, 120], // Squirtle, Psyduck, Poliwag, Seel, Shellder, Horsea, Goldeen, Staryu
    bossBot: { name: "Gym Leader Misty", pokemon: "Starmie", pokemonType: "Water", pokemonId: 121, difficulty: "medium", knowledgeLevel: 60 },
  },
  {
    name: "S.S. Anne",
    minLevel: 9,
    icon: "🚢",
    color: "bg-cyan-500/20 border-cyan-500/30",
    description: "Luxury cruise ship docked in Vermilion. Battle wealthy trainers aboard!",
    encounterRate: 0.40,
    xpReward: 30,
    coinReward: 75,
    pokemonPool: [79, 83, 108, 128, 129], // Slowpoke, Farfetch'd, Lickitung, Tauros, Magikarp
  },
  {
    name: "Vermilion Gym",
    minLevel: 10,
    icon: "⚡",
    color: "bg-yellow-500/20 border-yellow-500/30",
    description: "Lt. Surge's Electric fortress. Solve the switch puzzle to reach him!",
    encounterRate: 0.35,
    xpReward: 30,
    coinReward: 60,
    pokemonPool: [25, 26, 81, 100, 101, 125], // Pikachu, Raichu, Magnemite, Voltorb, Electrode, Electabuzz
    bossBot: { name: "Gym Leader Lt. Surge", pokemon: "Raichu", pokemonType: "Electric", pokemonId: 26, difficulty: "medium", knowledgeLevel: 65 },
  },
  {
    name: "Pokémon Tower",
    minLevel: 12,
    icon: "👻",
    color: "bg-violet-500/20 border-violet-500/30",
    description: "Haunted resting place in Lavender Town. Ghost-types lurk on every floor.",
    encounterRate: 0.50,
    xpReward: 35,
    coinReward: 70,
    pokemonPool: [92, 93, 94, 96, 97, 104], // Gastly, Haunter, Gengar, Drowzee, Hypno, Cubone
  },
  {
    name: "Celadon Gym",
    minLevel: 14,
    icon: "🌸",
    color: "bg-lime-500/20 border-lime-500/30",
    description: "Erika's fragrant Grass-type paradise. Nature fights on her side.",
    encounterRate: 0.45,
    xpReward: 35,
    coinReward: 80,
    pokemonPool: [1, 2, 43, 45, 102, 114], // Bulbasaur, Ivysaur, Oddish, Vileplume, Exeggcute, Tangela
    bossBot: { name: "Gym Leader Erika", pokemon: "Vileplume", pokemonType: "Grass", pokemonId: 45, difficulty: "medium", knowledgeLevel: 68 },
  },
  {
    name: "Safari Zone",
    minLevel: 15,
    icon: "🦏",
    color: "bg-orange-500/20 border-orange-500/30",
    description: "Wild preserve with rare Pokémon! Throw Safari Balls and hope for the best.",
    encounterRate: 0.60,
    xpReward: 30,
    coinReward: 60,
    pokemonPool: [111, 115, 113, 123, 127, 128, 132, 37], // Rhyhorn, Kangaskhan, Chansey, Scyther, Pinsir, Tauros, Ditto, Vulpix
  },
  {
    name: "Silph Co.",
    minLevel: 17,
    icon: "🏢",
    color: "bg-slate-500/20 border-slate-500/30",
    description: "Team Rocket's takeover! Fight through 11 floors to save Silph Co.",
    encounterRate: 0.40,
    xpReward: 40,
    coinReward: 100,
    pokemonPool: [88, 89, 109, 34, 31, 137], // Grimer, Muk, Koffing, Nidoking, Nidoqueen, Porygon
    bossBot: { name: "Team Rocket Giovanni", pokemon: "Nidoking", pokemonType: "Poison", pokemonId: 34, difficulty: "hard", knowledgeLevel: 78 },
  },
  {
    name: "Cinnabar Lab",
    minLevel: 19,
    icon: "🔬",
    color: "bg-red-500/20 border-red-500/30",
    description: "Volcanic island research lab. Revive fossils and battle Blaine's Fire-types!",
    encounterRate: 0.45,
    xpReward: 40,
    coinReward: 90,
    pokemonPool: [4, 5, 58, 59, 77, 78, 126, 146, 142], // Charmander, Charmeleon, Growlithe, Arcanine, Ponyta, Rapidash, Magmar, Moltres, Aerodactyl
    bossBot: { name: "Gym Leader Blaine", pokemon: "Arcanine", pokemonType: "Fire", pokemonId: 59, difficulty: "hard", knowledgeLevel: 75 },
  },
  {
    name: "Seafoam Islands",
    minLevel: 20,
    icon: "🧊",
    color: "bg-sky-500/20 border-sky-500/30",
    description: "Frozen caverns where the legendary Articuno roosts. Bring warm Pokémon!",
    encounterRate: 0.45,
    xpReward: 45,
    coinReward: 100,
    pokemonPool: [86, 87, 90, 124, 131, 144], // Seel, Dewgong, Shellder, Jynx, Lapras, Articuno
  },
  {
    name: "Power Plant",
    minLevel: 22,
    icon: "🔋",
    color: "bg-amber-500/20 border-amber-500/30",
    description: "Abandoned power station crackling with Electric energy. Zapdos awaits!",
    encounterRate: 0.40,
    xpReward: 45,
    coinReward: 100,
    pokemonPool: [81, 100, 101, 125, 135, 145], // Magnemite, Voltorb, Electrode, Electabuzz, Jolteon, Zapdos
  },
  {
    name: "Victory Road",
    minLevel: 25,
    icon: "⛰️",
    color: "bg-rose-500/20 border-rose-500/30",
    description: "Treacherous path to the Elite Four. Only the strongest survive.",
    encounterRate: 0.35,
    xpReward: 50,
    coinReward: 120,
    pokemonPool: [68, 76, 95, 106, 107, 142], // Machamp, Golem, Onix, Hitmonlee, Hitmonchan, Aerodactyl
  },
  {
    name: "Indigo Plateau",
    minLevel: 28,
    icon: "🏆",
    color: "bg-amber-500/20 border-amber-500/30",
    description: "The Elite Four and Champion await! Become the Pokémon League Champion!",
    encounterRate: 0.30,
    xpReward: 60,
    coinReward: 150,
    pokemonPool: [130, 149, 143, 65, 38, 134], // Gyarados, Dragonite, Snorlax, Alakazam, Ninetales, Vaporeon
    bossBot: { name: "Champion Blue", pokemon: "Dragonite", pokemonType: "Dragon", pokemonId: 149, difficulty: "hard", knowledgeLevel: 90 },
  },
  {
    name: "Cerulean Cave",
    minLevel: 30,
    icon: "🌀",
    color: "bg-fuchsia-500/20 border-fuchsia-500/30",
    description: "The ultimate challenge. Mewtwo hides in the deepest chamber.",
    encounterRate: 0.35,
    xpReward: 75,
    coinReward: 200,
    pokemonPool: [65, 130, 143, 132, 148, 149, 150, 151], // Alakazam, Gyarados, Snorlax, Ditto, Dragonair, Dragonite, Mewtwo, Mew
    bossBot: { name: "Mewtwo", pokemon: "Mewtwo", pokemonType: "Psychic", pokemonId: 150, difficulty: "hard", knowledgeLevel: 95 },
  },
];

// Knowledge quiz questions (expanded)
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { question: "What type is Pikachu?", options: ["Fire", "Electric", "Water", "Grass"], correctIndex: 1 },
  { question: "Who is Ash's first Pokémon?", options: ["Charmander", "Bulbasaur", "Pikachu", "Squirtle"], correctIndex: 2 },
  { question: "What does Eevee evolve into with a Water Stone?", options: ["Jolteon", "Flareon", "Vaporeon", "Espeon"], correctIndex: 2 },
  { question: "How many original Pokémon are there (Gen 1)?", options: ["100", "150", "151", "200"], correctIndex: 2 },
  { question: "What type is super effective against Water?", options: ["Fire", "Grass", "Rock", "Fighting"], correctIndex: 1 },
  { question: "Which Pokémon is #001 in the Pokédex?", options: ["Pikachu", "Charmander", "Bulbasaur", "Mew"], correctIndex: 2 },
  { question: "What is Mewtwo's type?", options: ["Ghost", "Dark", "Psychic", "Dragon"], correctIndex: 2 },
  { question: "Which stone evolves Pikachu?", options: ["Fire Stone", "Water Stone", "Thunder Stone", "Moon Stone"], correctIndex: 2 },
  { question: "Who created Mewtwo?", options: ["Ash", "Team Rocket", "Scientists", "Professor Oak"], correctIndex: 2 },
  { question: "What type is Gengar?", options: ["Dark", "Ghost/Poison", "Psychic", "Shadow"], correctIndex: 1 },
  { question: "How many Gym Badges does Ash need in Kanto?", options: ["6", "7", "8", "10"], correctIndex: 2 },
  { question: "What is Charizard's secondary type?", options: ["Dragon", "Fire", "Flying", "Normal"], correctIndex: 2 },
  { question: "Which Pokémon can learn Surf?", options: ["Pikachu", "Blastoise", "Charizard", "Both A & B"], correctIndex: 3 },
  { question: "What does PSA stand for in card grading?", options: ["Professional Sports Authenticator", "Pokémon Standards Authority", "Premium Sports Assessment", "Professional Stamp Association"], correctIndex: 0 },
  { question: "What is the rarest card in Base Set?", options: ["Pikachu", "Charizard Holo", "Mewtwo", "Blastoise"], correctIndex: 1 },
  // New questions
  { question: "What Pokémon is known as the 'Sleeping Pokémon'?", options: ["Slowpoke", "Snorlax", "Drowzee", "Jigglypuff"], correctIndex: 1 },
  { question: "Which legendary bird is Ice-type?", options: ["Moltres", "Zapdos", "Articuno", "Ho-Oh"], correctIndex: 2 },
  { question: "What type is Dragonite?", options: ["Fire/Flying", "Dragon/Flying", "Water/Dragon", "Dragon/Normal"], correctIndex: 1 },
  { question: "What Pokémon evolves from Magikarp?", options: ["Dragonite", "Lapras", "Gyarados", "Milotic"], correctIndex: 2 },
  { question: "Where do you find Mewtwo in the games?", options: ["Victory Road", "Pokémon Tower", "Cerulean Cave", "Silph Co."], correctIndex: 2 },
  { question: "Which Gym Leader uses Electric-types?", options: ["Brock", "Misty", "Lt. Surge", "Erika"], correctIndex: 2 },
  { question: "What item revives a fainted Pokémon?", options: ["Potion", "Antidote", "Revive", "Elixir"], correctIndex: 2 },
  { question: "How many Eevee evolutions exist in Gen 1?", options: ["2", "3", "4", "5"], correctIndex: 1 },
  { question: "What fossil becomes Aerodactyl?", options: ["Helix Fossil", "Dome Fossil", "Old Amber", "Root Fossil"], correctIndex: 2 },
  { question: "What type does NOT exist in Gen 1?", options: ["Dragon", "Ghost", "Dark", "Psychic"], correctIndex: 2 },
];

// Bot opponents (expanded)
export interface BotOpponent {
  name: string;
  pokemon: string;
  pokemonType: string;
  pokemonId: number;
  difficulty: "easy" | "medium" | "hard";
  knowledgeLevel: number;
}

export const BOT_OPPONENTS: BotOpponent[] = [
  { name: "Youngster Joey", pokemon: "Rattata", pokemonType: "Normal", pokemonId: 19, difficulty: "easy", knowledgeLevel: 30 },
  { name: "Bug Catcher Tim", pokemon: "Caterpie", pokemonType: "Bug", pokemonId: 10, difficulty: "easy", knowledgeLevel: 35 },
  { name: "Lass Jenny", pokemon: "Jigglypuff", pokemonType: "Normal", pokemonId: 39, difficulty: "easy", knowledgeLevel: 40 },
  { name: "Bird Keeper Abe", pokemon: "Pidgeot", pokemonType: "Flying", pokemonId: 18, difficulty: "easy", knowledgeLevel: 42 },
  { name: "Hiker Mike", pokemon: "Onix", pokemonType: "Rock", pokemonId: 95, difficulty: "medium", knowledgeLevel: 55 },
  { name: "Swimmer Sarah", pokemon: "Psyduck", pokemonType: "Water", pokemonId: 54, difficulty: "medium", knowledgeLevel: 60 },
  { name: "Blackbelt Ken", pokemon: "Machamp", pokemonType: "Fighting", pokemonId: 68, difficulty: "medium", knowledgeLevel: 65 },
  { name: "Channeler Luna", pokemon: "Haunter", pokemonType: "Ghost", pokemonId: 93, difficulty: "medium", knowledgeLevel: 62 },
  { name: "Scientist Dale", pokemon: "Electrode", pokemonType: "Electric", pokemonId: 101, difficulty: "medium", knowledgeLevel: 63 },
  { name: "Rocket Grunt", pokemon: "Koffing", pokemonType: "Poison", pokemonId: 109, difficulty: "medium", knowledgeLevel: 58 },
  { name: "Cooltrainer Alexa", pokemon: "Ninetales", pokemonType: "Fire", pokemonId: 38, difficulty: "medium", knowledgeLevel: 67 },
  { name: "Ace Trainer Red", pokemon: "Dragonite", pokemonType: "Dragon", pokemonId: 149, difficulty: "hard", knowledgeLevel: 80 },
  { name: "Elite Four Lance", pokemon: "Charizard", pokemonType: "Fire", pokemonId: 6, difficulty: "hard", knowledgeLevel: 90 },
  { name: "Elite Four Lorelei", pokemon: "Lapras", pokemonType: "Ice", pokemonId: 131, difficulty: "hard", knowledgeLevel: 85 },
  { name: "Elite Four Bruno", pokemon: "Machamp", pokemonType: "Fighting", pokemonId: 68, difficulty: "hard", knowledgeLevel: 83 },
  { name: "Champion Blue", pokemon: "Blastoise", pokemonType: "Water", pokemonId: 9, difficulty: "hard", knowledgeLevel: 92 },
];

// Achievement Badges
export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalWins: number;
  totalLosses: number;
  collectedPokemon: number;
  collectedCards: number;
  level: number;
  loginStreak: number;
  totalBattles: number;
  coinsEarned: number;
  zonesUnlocked: number;
  pvpWins: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_win", name: "First Victory", description: "Win your first battle", icon: "⚔️", check: s => s.totalWins >= 1 },
  { id: "5_wins", name: "Battle Veteran", description: "Win 5 battles", icon: "🎖️", check: s => s.totalWins >= 5 },
  { id: "25_wins", name: "Battle Master", description: "Win 25 battles", icon: "🏅", check: s => s.totalWins >= 25 },
  { id: "100_wins", name: "Legendary Warrior", description: "Win 100 battles", icon: "👑", check: s => s.totalWins >= 100 },
  { id: "5_pokemon", name: "Pokémon Collector", description: "Collect 5 Pokémon", icon: "📦", check: s => s.collectedPokemon >= 5 },
  { id: "25_pokemon", name: "Pokédex Explorer", description: "Collect 25 Pokémon", icon: "📚", check: s => s.collectedPokemon >= 25 },
  { id: "50_pokemon", name: "Pokédex Scholar", description: "Collect 50 Pokémon", icon: "🔬", check: s => s.collectedPokemon >= 50 },
  { id: "all_pokemon", name: "Pokémon Master", description: "Collect all Pokémon", icon: "🏆", check: s => s.collectedPokemon >= ALL_POKEMON.length },
  { id: "level_5", name: "Rising Trainer", description: "Reach level 5", icon: "⭐", check: s => s.level >= 5 },
  { id: "level_10", name: "Skilled Trainer", description: "Reach level 10", icon: "🌟", check: s => s.level >= 10 },
  { id: "level_20", name: "Elite Trainer", description: "Reach level 20", icon: "💫", check: s => s.level >= 20 },
  { id: "level_30", name: "Champion Tier", description: "Reach level 30", icon: "🔥", check: s => s.level >= 30 },
  { id: "streak_3", name: "Dedicated Trainer", description: "3-day login streak", icon: "📅", check: s => s.loginStreak >= 3 },
  { id: "streak_7", name: "Weekly Warrior", description: "7-day login streak", icon: "🗓️", check: s => s.loginStreak >= 7 },
  { id: "streak_30", name: "Monthly Master", description: "30-day login streak", icon: "🎯", check: s => s.loginStreak >= 30 },
  { id: "first_pvp", name: "PvP Debut", description: "Win your first PvP battle", icon: "🤺", check: s => s.pvpWins >= 1 },
  { id: "pvp_10", name: "PvP Champion", description: "Win 10 PvP battles", icon: "🥊", check: s => s.pvpWins >= 10 },
  { id: "10_cards", name: "Card Starter", description: "Collect 10 cards", icon: "🃏", check: s => s.collectedCards >= 10 },
  { id: "50_cards", name: "Card Hoarder", description: "Collect 50 cards", icon: "🗃️", check: s => s.collectedCards >= 50 },
  { id: "zones_5", name: "Adventurer", description: "Unlock 5 zones", icon: "🗺️", check: s => s.zonesUnlocked >= 5 },
  { id: "zones_all", name: "World Explorer", description: "Unlock all zones", icon: "🌍", check: s => s.zonesUnlocked >= ADVENTURE_ZONES.length },
];

// Daily login reward tiers
export const DAILY_REWARDS = [
  { day: 1, coins: 50, xp: 10, label: "Day 1" },
  { day: 2, coins: 75, xp: 15, label: "Day 2" },
  { day: 3, coins: 100, xp: 25, label: "Day 3" },
  { day: 4, coins: 125, xp: 30, label: "Day 4" },
  { day: 5, coins: 200, xp: 50, label: "Day 5" },
  { day: 6, coins: 250, xp: 60, label: "Day 6" },
  { day: 7, coins: 500, xp: 100, label: "Day 7 🎉" },
];

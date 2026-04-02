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
];

// All collectible Pokémon in the game (151 Gen 1)
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
  { name: "Pikachu", type: "Electric", id: 25 },
  { name: "Raichu", type: "Electric", id: 26 },
  { name: "Jigglypuff", type: "Normal", id: 39 },
  { name: "Psyduck", type: "Water", id: 54 },
  { name: "Machamp", type: "Fighting", id: 68 },
  { name: "Gengar", type: "Ghost", id: 94 },
  { name: "Onix", type: "Rock", id: 95 },
  { name: "Hitmonlee", type: "Fighting", id: 106 },
  { name: "Eevee", type: "Normal", id: 133 },
  { name: "Vaporeon", type: "Water", id: 134 },
  { name: "Jolteon", type: "Electric", id: 135 },
  { name: "Flareon", type: "Fire", id: 136 },
  { name: "Snorlax", type: "Normal", id: 143 },
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

// Knowledge quiz questions
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
];

// Bot opponents
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
  { name: "Hiker Mike", pokemon: "Onix", pokemonType: "Rock", pokemonId: 95, difficulty: "medium", knowledgeLevel: 55 },
  { name: "Swimmer Sarah", pokemon: "Psyduck", pokemonType: "Water", pokemonId: 54, difficulty: "medium", knowledgeLevel: 60 },
  { name: "Blackbelt Ken", pokemon: "Machamp", pokemonType: "Fighting", pokemonId: 68, difficulty: "medium", knowledgeLevel: 65 },
  { name: "Ace Trainer Red", pokemon: "Dragonite", pokemonType: "Dragon", pokemonId: 149, difficulty: "hard", knowledgeLevel: 80 },
  { name: "Elite Four Lance", pokemon: "Charizard", pokemonType: "Fire", pokemonId: 6, difficulty: "hard", knowledgeLevel: 90 },
];

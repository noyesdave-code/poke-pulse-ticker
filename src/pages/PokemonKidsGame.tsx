import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import TerminalHeader from "@/components/TerminalHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  STARTER_POKEMON, ALL_POKEMON, getPokemonImage, TYPE_ADVANTAGES,
  QUIZ_QUESTIONS, BOT_OPPONENTS, ADVENTURE_ZONES,
  type StarterPokemon, type BotOpponent, type QuizQuestion, type AdventureZone
} from "@/lib/pokemonKidsData";
import {
  Sword, Shield, Heart, Zap, Trophy, Coins, Map, Swords,
  Star, Lock, Unlock, Crown, Sparkles, BookOpen, Target, Users, ShoppingCart, MapPin, ChevronRight
} from "lucide-react";

// --- Game sub-components ---

const CharacterSelect = ({ onSelect }: { onSelect: (p: StarterPokemon) => void }) => {
  const [selected, setSelected] = useState<StarterPokemon | null>(null);
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Choose Your Starter Pokémon
        </h2>
        <p className="text-sm text-muted-foreground">Pick your partner and begin your adventure!</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STARTER_POKEMON.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelected(p)}
            className={`terminal-card p-4 text-center transition-all hover:scale-[1.03] ${
              selected?.name === p.name ? "ring-2 ring-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]" : ""
            }`}
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
              loading="lazy"
            />
            <h3 className="font-bold text-foreground mt-2">{p.name}</h3>
            <Badge variant="outline" className="text-[10px] mt-1">{p.type}</Badge>
            <p className="text-[10px] text-muted-foreground mt-1">{p.description}</p>
            <div className="mt-2 space-y-1 text-[10px]">
              <div className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> HP: {p.hp}</div>
              <div className="flex items-center gap-1"><Sword className="w-3 h-3 text-orange-400" /> ATK: {p.attack}</div>
              <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> DEF: {p.defense}</div>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="text-center">
          <Button onClick={() => onSelect(selected)} size="lg" className="text-lg px-8">
            I Choose You, {selected.name}! ⚡
          </Button>
        </div>
      )}
    </div>
  );
};

const AdventureMap = ({
  collectedCount, totalPokemon, level, onBattle, onExploreZone, hasPaid, freeBattles, activeZone, onSelectZone
}: {
  collectedCount: number; totalPokemon: number; level: number;
  onBattle: (zone?: AdventureZone) => void; onExploreZone: (zone: AdventureZone) => void;
  hasPaid: boolean; freeBattles: number; activeZone: AdventureZone | null;
  onSelectZone: (zone: AdventureZone | null) => void;
}) => {
  if (activeZone) {
    const locked = level < activeZone.minLevel;
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <button onClick={() => onSelectZone(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Back to World Map
        </button>
        <div className={`terminal-card p-5 ${activeZone.color} border`}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-4xl">{activeZone.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{activeZone.name}</h3>
              <p className="text-sm text-muted-foreground">{activeZone.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>Lv. {activeZone.minLevel}+</span>
                <span>+{activeZone.xpReward} XP</span>
                <span>+{activeZone.coinReward} 🪙</span>
                <span>{Math.round(activeZone.encounterRate * 100)}% encounter</span>
              </div>
            </div>
          </div>
          {activeZone.bossBot && (
            <div className="terminal-card p-3 mb-3 border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-2">
                <img src={getPokemonImage(activeZone.bossBot.pokemonId)} alt={activeZone.bossBot.pokemon} className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-sm font-bold text-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> {activeZone.bossBot.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{activeZone.bossBot.difficulty.toUpperCase()} · {activeZone.bossBot.pokemon}</p>
                </div>
                <Button size="sm" variant="destructive" className="ml-auto" disabled={locked} onClick={() => onBattle(activeZone)}>
                  Challenge Boss
                </Button>
              </div>
            </div>
          )}
          <div className="mb-3">
            <p className="text-xs font-semibold text-foreground mb-2">Pokémon in this zone:</p>
            <div className="flex flex-wrap gap-1">
              {activeZone.pokemonPool.slice(0, 8).map(id => {
                const mon = ALL_POKEMON.find(p => p.id === id);
                return (
                  <div key={id} className="terminal-card p-1 flex items-center gap-1">
                    <img src={getPokemonImage(id)} alt={mon?.name} className="w-6 h-6 object-contain" loading="lazy" />
                    <span className="text-[9px] text-foreground">{mon?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => onExploreZone(activeZone)} className="flex-1" disabled={locked}>
              <Map className="w-4 h-4 mr-2" /> Explore Zone
            </Button>
            <Button onClick={() => onBattle(activeZone)} variant="default" className="flex-1" disabled={locked}>
              <Swords className="w-4 h-4 mr-2" /> Battle Here
              {!hasPaid && <span className="ml-1 text-[10px]">({freeBattles})</span>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" /> World Map
        </h3>
        <div className="text-xs text-muted-foreground">
          {collectedCount} / {totalPokemon} Pokémon · {ADVENTURE_ZONES.filter(z => level >= z.minLevel).length}/{ADVENTURE_ZONES.length} zones unlocked
        </div>
      </div>
      <Progress value={(collectedCount / totalPokemon) * 100} className="h-3" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ADVENTURE_ZONES.map((zone) => {
          const locked = level < zone.minLevel;
          return (
            <button
              key={zone.name}
              disabled={locked}
              onClick={() => onSelectZone(zone)}
              className={`terminal-card p-3 text-left transition-all ${zone.color} border ${
                locked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{zone.icon}</span>
                {zone.bossBot && !locked && <Crown className="w-3 h-3 text-amber-400" />}
              </div>
              <p className="text-xs font-semibold text-foreground mt-1">{zone.name}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {locked ? <><Lock className="w-3 h-3 inline" /> Lv. {zone.minLevel}</> : zone.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BattleArena = ({
  playerPokemon, opponent, wager, onWagerChange, onAnswer, onClose,
  quiz, phase, result, knowledgeScore, matchupScore, cardScore
}: {
  playerPokemon: string; opponent: BotOpponent; wager: number;
  onWagerChange: (n: number) => void; onAnswer: (i: number) => void;
  onClose: () => void; quiz: QuizQuestion | null;
  phase: "wager" | "knowledge" | "battle" | "result";
  result: "win" | "lose" | "draw" | null;
  knowledgeScore: number; matchupScore: number; cardScore: number;
}) => {
  const oppImg = getPokemonImage(opponent.pokemonId);
  const playerStarter = STARTER_POKEMON.find(p => p.name === playerPokemon);
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground">⚔️ Battle vs {opponent.name}</h3>
        <Badge variant="outline">{opponent.difficulty.toUpperCase()}</Badge>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <img src={playerStarter?.image} alt={playerPokemon} className="w-20 h-20 mx-auto object-contain" />
          <p className="text-sm font-bold text-foreground">{playerPokemon}</p>
          <Badge className="text-[10px]">YOU</Badge>
        </div>
        <Swords className="w-8 h-8 text-primary shrink-0" />
        <div className="text-center flex-1">
          <img src={oppImg} alt={opponent.pokemon} className="w-20 h-20 mx-auto object-contain" />
          <p className="text-sm font-bold text-foreground">{opponent.pokemon}</p>
          <Badge variant="outline" className="text-[10px]">{opponent.name}</Badge>
        </div>
      </div>

      {phase === "wager" && (
        <div className="terminal-card p-4 space-y-3">
          <h4 className="font-semibold text-foreground">Wager Cards</h4>
          <p className="text-xs text-muted-foreground">How many cards do you want to risk?</p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 5].map(n => (
              <button
                key={n}
                onClick={() => onWagerChange(n)}
                className={`px-4 py-2 rounded font-mono text-sm font-bold transition-all ${
                  wager === n ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {n} {n === 1 ? "card" : "cards"}
              </button>
            ))}
          </div>
          <Button onClick={() => onAnswer(-1)} className="w-full">Start Battle!</Button>
        </div>
      )}

      {phase === "knowledge" && quiz && (
        <div className="terminal-card p-4 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Knowledge Round
          </h4>
          <p className="text-sm text-foreground">{quiz.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {quiz.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                className="px-3 py-2 rounded text-sm font-semibold bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="terminal-card p-4 space-y-3 text-center">
          <div className="text-4xl">{result === "win" ? "🎉" : result === "lose" ? "😢" : "🤝"}</div>
          <h4 className={`text-xl font-bold ${result === "win" ? "text-primary" : result === "lose" ? "text-destructive" : "text-muted-foreground"}`}>
            {result === "win" ? `YOU WIN! +${wager} cards!` : result === "lose" ? `You lost ${wager} cards...` : "It's a draw!"}
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="terminal-card p-2">
              <BookOpen className="w-4 h-4 mx-auto text-blue-400" />
              <p className="font-semibold text-foreground mt-1">Knowledge</p>
              <p className="text-muted-foreground">{knowledgeScore}/100</p>
            </div>
            <div className="terminal-card p-2">
              <Target className="w-4 h-4 mx-auto text-amber-400" />
              <p className="font-semibold text-foreground mt-1">Matchup</p>
              <p className="text-muted-foreground">{matchupScore}/100</p>
            </div>
            <div className="terminal-card p-2">
              <Zap className="w-4 h-4 mx-auto text-primary" />
              <p className="font-semibold text-foreground mt-1">Card Power</p>
              <p className="text-muted-foreground">{cardScore}/100</p>
            </div>
          </div>
          <Button onClick={onClose} className="w-full">Continue Adventure</Button>
        </div>
      )}
    </div>
  );
};

// --- Main Page ---

const PokemonKidsGame = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuth, setShowAuth] = useState(false);

  // Game state
  const [gamePhase, setGamePhase] = useState<"loading" | "select" | "playing">("loading");
  const [playerData, setPlayerData] = useState<any>(null);
  const [collectedPokemon, setCollectedPokemon] = useState<string[]>([]);
  const [collectedCards, setCollectedCards] = useState<any[]>([]);
  const [tab, setTab] = useState("adventure");
  const [activeZone, setActiveZone] = useState<AdventureZone | null>(null);

  // Battle state
  const [inBattle, setInBattle] = useState(false);
  const [battlePhase, setBattlePhase] = useState<"wager" | "knowledge" | "battle" | "result">("wager");
  const [currentOpponent, setCurrentOpponent] = useState<BotOpponent | null>(null);
  const [wager, setWager] = useState(1);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [matchupScore, setMatchupScore] = useState(0);
  const [cardScore, setCardScore] = useState(0);
  const [battleResult, setBattleResult] = useState<"win" | "lose" | "draw" | null>(null);

  // Handle purchase callback
  useEffect(() => {
    const purchase = searchParams.get("purchase");
    if (purchase === "success") {
      toast({ title: "🎮 Game Unlocked!", description: "You now have unlimited battles and adventures!" });
      setSearchParams({}, { replace: true });
      loadPlayerData();
    } else if (purchase === "canceled") {
      toast({ title: "Purchase canceled", variant: "destructive" });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const loadPlayerData = useCallback(async () => {
    if (!user) { setGamePhase("select"); return; }
    const { data } = await supabase
      .from("game_players")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setPlayerData(data);
      setGamePhase("playing");
      // Load collections
      const { data: pokemon } = await supabase
        .from("game_collected_pokemon")
        .select("pokemon_name")
        .eq("player_id", data.id);
      setCollectedPokemon(pokemon?.map((p: any) => p.pokemon_name) || []);
      const { data: cards } = await supabase
        .from("game_collected_cards")
        .select("*")
        .eq("player_id", data.id);
      setCollectedCards(cards || []);
    } else {
      setGamePhase("select");
    }
  }, [user]);

  useEffect(() => { loadPlayerData(); }, [loadPlayerData]);

  const handleSelectStarter = async (starter: StarterPokemon) => {
    if (!user) { setShowAuth(true); return; }
    const { data, error } = await supabase
      .from("game_players")
      .insert({
        user_id: user.id,
        starter_pokemon: starter.name,
        starter_pokemon_image: starter.image,
        display_name: user.email?.split("@")[0],
      })
      .select()
      .single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    // Add starter to collection
    await supabase.from("game_collected_pokemon").insert({
      player_id: data.id,
      pokemon_name: starter.name,
      pokemon_image: starter.image,
      pokemon_type: starter.type,
    });
    setPlayerData(data);
    setCollectedPokemon([starter.name]);
    setGamePhase("playing");
    toast({ title: `${starter.name} joins your team!`, description: "Your adventure begins!" });
  };

  const handleBuyGameAccess = async () => {
    if (!user) { setShowAuth(true); return; }
    try {
      const { data, error } = await supabase.functions.invoke("buy-game-access");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleBuyCoins = async () => {
    if (!user) { setShowAuth(true); return; }
    // Use existing PokéCoin purchase flow
    try {
      const { data, error } = await supabase.functions.invoke("buy-pokecoins", {
        body: { priceId: "price_1TH9emPRXT5iryzGhI5uLkzL" },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startBattle = () => {
    if (!playerData) return;
    if (!playerData.has_paid && playerData.free_battles_remaining <= 0) {
      toast({
        title: "Free battles used up!",
        description: "Unlock unlimited battles for just $0.99",
        variant: "destructive",
      });
      return;
    }
    // Pick opponent based on level
    const eligible = BOT_OPPONENTS.filter(b => {
      if (playerData.level <= 3) return b.difficulty === "easy";
      if (playerData.level <= 8) return b.difficulty !== "hard";
      return true;
    });
    const opp = eligible[Math.floor(Math.random() * eligible.length)];
    setCurrentOpponent(opp);
    setWager(1);
    setBattlePhase("wager");
    setInBattle(true);
    setBattleResult(null);
    setKnowledgeScore(0);
    setMatchupScore(0);
    setCardScore(0);
  };

  const handleExplore = async () => {
    if (!playerData) return;
    // Find a random uncollected Pokémon
    const uncollected = ALL_POKEMON.filter(p => !collectedPokemon.includes(p.name));
    if (uncollected.length === 0) {
      toast({ title: "🏆 All Pokémon collected!", description: "You've caught them all!" });
      return;
    }
    // 40% chance to find a Pokémon
    if (Math.random() < 0.4) {
      const found = uncollected[Math.floor(Math.random() * uncollected.length)];
      await supabase.from("game_collected_pokemon").insert({
        player_id: playerData.id,
        pokemon_name: found.name,
        pokemon_image: getPokemonImage(found.id),
        pokemon_type: found.type,
      });
      setCollectedPokemon(prev => [...prev, found.name]);
      // Award XP
      const newXp = (playerData.xp || 0) + 15;
      const newLevel = Math.floor(newXp / 100) + 1;
      await supabase.from("game_players").update({ xp: newXp, level: newLevel }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, xp: newXp, level: newLevel }));
      toast({ title: `Wild ${found.name} appeared!`, description: `${found.name} (${found.type}) joined your collection! +15 XP` });
    } else {
      toast({ title: "Nothing found...", description: "Keep exploring! Try again." });
    }
  };

  const handleBattleAnswer = async (answerIndex: number) => {
    if (!currentOpponent || !playerData) return;

    if (battlePhase === "wager") {
      // Move to knowledge round
      const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      setQuiz(q);
      setBattlePhase("knowledge");
      return;
    }

    if (battlePhase === "knowledge" && quiz) {
      const correct = answerIndex === quiz.correctIndex;
      const kScore = correct ? 100 : 20;
      setKnowledgeScore(kScore);

      // Calculate matchup score
      const playerType = STARTER_POKEMON.find(p => p.name === playerData.starter_pokemon)?.type || "Normal";
      const advantages = TYPE_ADVANTAGES[playerType] || [];
      const mScore = advantages.includes(currentOpponent.pokemonType) ? 100 : 
        (TYPE_ADVANTAGES[currentOpponent.pokemonType]?.includes(playerType) ? 20 : 50);
      setMatchupScore(mScore);

      // Card score based on collection size
      const cScore = Math.min(100, 30 + collectedCards.length * 5);
      setCardScore(cScore);

      // Total score vs opponent
      const totalPlayer = kScore + mScore + cScore;
      const totalOpp = currentOpponent.knowledgeLevel + 50 + Math.floor(Math.random() * 40);
      const res = totalPlayer > totalOpp ? "win" : totalPlayer === totalOpp ? "draw" : "lose";
      setBattleResult(res);
      setBattlePhase("result");

      // Record battle and update stats
      const xpEarned = res === "win" ? 25 : res === "draw" ? 10 : 5;
      const cardsWon = res === "win" ? wager : 0;
      await supabase.from("game_battles").insert({
        player_id: playerData.id,
        opponent_type: "bot",
        opponent_pokemon: currentOpponent.pokemon,
        player_pokemon: playerData.starter_pokemon,
        cards_wagered: wager,
        cards_won: cardsWon,
        knowledge_score: kScore,
        matchup_score: mScore,
        card_score: cScore,
        result: res,
        xp_earned: xpEarned,
      });

      // Update player
      const newXp = (playerData.xp || 0) + xpEarned;
      const newLevel = Math.floor(newXp / 100) + 1;
      const updates: any = { xp: newXp, level: newLevel };
      if (!playerData.has_paid) {
        updates.free_battles_remaining = Math.max(0, (playerData.free_battles_remaining || 0) - 1);
      }
      if (res === "win") {
        updates.coins_balance = (playerData.coins_balance || 0) + wager * 50;
      }
      await supabase.from("game_players").update(updates).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, ...updates }));

      // If won, add opponent's Pokémon to collection
      if (res === "win" && !collectedPokemon.includes(currentOpponent.pokemon)) {
        await supabase.from("game_collected_pokemon").insert({
          player_id: playerData.id,
          pokemon_name: currentOpponent.pokemon,
          pokemon_image: getPokemonImage(currentOpponent.pokemonId),
          pokemon_type: currentOpponent.pokemonType,
        });
        setCollectedPokemon(prev => [...prev, currentOpponent.pokemon]);
      }
    }
  };

  const closeBattle = () => {
    setInBattle(false);
    setCurrentOpponent(null);
  };

  const completionPct = (collectedPokemon.length / ALL_POKEMON.length) * 100;
  const isGameComplete = collectedPokemon.length >= ALL_POKEMON.length;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            🎮 PokémonKids <span className="text-primary">Adventure</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose your Pokémon, collect cards, battle trainers, and complete your Pokédex!
            Free to try · $0.99 to unlock · Use PokéCoins for power-ups
          </p>
          {!user && (
            <Button onClick={() => setShowAuth(true)} size="lg" className="text-lg">
              Sign In to Play ⚡
            </Button>
          )}
        </div>

        {/* Player Stats Bar */}
        {playerData && (
          <div className="terminal-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={playerData.starter_pokemon_image}
                  alt={playerData.starter_pokemon}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="font-bold text-foreground">{playerData.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Lv. {playerData.level} · {playerData.starter_pokemon} Trainer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-foreground">{playerData.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-foreground">{playerData.coins_balance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{collectedPokemon.length}/{ALL_POKEMON.length}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!playerData.has_paid && (
                  <Button onClick={handleBuyGameAccess} size="sm" variant="default">
                    <Unlock className="w-3 h-3 mr-1" /> Unlock Full Game $0.99
                  </Button>
                )}
                <Button onClick={handleBuyCoins} size="sm" variant="outline">
                  <Coins className="w-3 h-3 mr-1" /> Buy Coins
                </Button>
              </div>
            </div>
            <Progress value={completionPct} className="h-2 mt-3" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {completionPct.toFixed(0)}% Pokédex complete — collect all {ALL_POKEMON.length} to win!
            </p>
          </div>
        )}

        {/* Game Winner Banner */}
        {isGameComplete && (
          <div className="terminal-card p-6 text-center border-2 border-primary bg-primary/5">
            <Crown className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-2xl font-black text-foreground">🎉 POKÉMON MASTER! 🎉</h2>
            <p className="text-sm text-muted-foreground">You collected every Pokémon! You are a true champion!</p>
          </div>
        )}

        {/* Character Selection */}
        {gamePhase === "select" && <CharacterSelect onSelect={handleSelectStarter} />}

        {/* Main Game Area */}
        {gamePhase === "playing" && !inBattle && (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="adventure"><Map className="w-3 h-3 mr-1" /> Adventure</TabsTrigger>
              <TabsTrigger value="pokemon"><Users className="w-3 h-3 mr-1" /> Pokédex</TabsTrigger>
              <TabsTrigger value="cards"><BookOpen className="w-3 h-3 mr-1" /> Cards</TabsTrigger>
              <TabsTrigger value="shop"><ShoppingCart className="w-3 h-3 mr-1" /> Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="adventure">
              <AdventureMap
                collectedCount={collectedPokemon.length}
                totalPokemon={ALL_POKEMON.length}
                level={playerData?.level || 1}
                onBattle={startBattle}
                onExplore={handleExplore}
                hasPaid={playerData?.has_paid}
                freeBattles={playerData?.free_battles_remaining || 0}
              />
            </TabsContent>

            <TabsContent value="pokemon">
              <div className="space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Your Pokédex ({collectedPokemon.length}/{ALL_POKEMON.length})
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {ALL_POKEMON.map((p) => {
                    const collected = collectedPokemon.includes(p.name);
                    return (
                      <div
                        key={p.id}
                        className={`terminal-card p-2 text-center ${collected ? "" : "opacity-30 grayscale"}`}
                      >
                        <img
                          src={getPokemonImage(p.id)}
                          alt={p.name}
                          className="w-10 h-10 mx-auto object-contain"
                          loading="lazy"
                        />
                        <p className="text-[9px] font-semibold text-foreground truncate">{p.name}</p>
                        <Badge variant="outline" className="text-[8px]">{p.type}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Card Collection ({collectedCards.length})
                </h3>
                {collectedCards.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Win battles to collect cards! Cards add to your portfolio.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {collectedCards.map((card: any) => (
                      <div key={card.id} className="terminal-card p-2 text-center">
                        {card.card_image ? (
                          <img src={card.card_image} alt={card.card_name} className="w-full rounded" loading="lazy" />
                        ) : (
                          <div className="w-full h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            {card.card_name}
                          </div>
                        )}
                        <p className="text-[9px] font-semibold text-foreground truncate mt-1">{card.card_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shop">
              <div className="space-y-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" /> PokéShop
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!playerData?.has_paid && (
                    <Card className="border-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Unlock className="w-5 h-5 text-primary" /> Full Game Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Unlimited battles, adventures, and card collection!
                        </p>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-black text-foreground">$0.99</span>
                          <span className="text-sm text-muted-foreground">one-time</span>
                        </div>
                        <Button onClick={handleBuyGameAccess} className="w-full">Unlock Now ⚡</Button>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-400" /> PokéCoin Packs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Buy coins for power-ups, extra lives, and rare items.
                      </p>
                      <div className="space-y-2">
                        {[
                          { name: "Starter Pack", coins: "1,500", price: "$0.99" },
                          { name: "Trainer Bundle", coins: "10,000", price: "$4.99" },
                          { name: "Champion Chest", coins: "25,000", price: "$9.99" },
                        ].map(pack => (
                          <button
                            key={pack.name}
                            onClick={handleBuyCoins}
                            className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80 transition-all"
                          >
                            <span className="text-sm font-semibold text-foreground">{pack.name}</span>
                            <span className="text-xs text-muted-foreground">{pack.coins} PC — {pack.price}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" /> Coin Power-Ups
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <button className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80"
                        onClick={() => {
                          if ((playerData?.coins_balance || 0) < 200) {
                            toast({ title: "Not enough coins!", variant: "destructive" }); return;
                          }
                          supabase.from("game_players").update({
                            coins_balance: playerData.coins_balance - 200,
                            free_battles_remaining: (playerData.free_battles_remaining || 0) + 3,
                          }).eq("id", playerData.id).then(() => {
                            setPlayerData((p: any) => ({
                              ...p,
                              coins_balance: p.coins_balance - 200,
                              free_battles_remaining: (p.free_battles_remaining || 0) + 3,
                            }));
                            toast({ title: "+3 Battles!", description: "200 coins spent" });
                          });
                        }}
                      >
                        <span className="text-sm font-semibold text-foreground">+3 Extra Battles</span>
                        <span className="text-xs text-muted-foreground">200 🪙</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80"
                        onClick={() => {
                          if ((playerData?.coins_balance || 0) < 500) {
                            toast({ title: "Not enough coins!", variant: "destructive" }); return;
                          }
                          const newXp = (playerData?.xp || 0) + 100;
                          const newLevel = Math.floor(newXp / 100) + 1;
                          supabase.from("game_players").update({
                            coins_balance: playerData.coins_balance - 500,
                            xp: newXp,
                            level: newLevel,
                          }).eq("id", playerData.id).then(() => {
                            setPlayerData((p: any) => ({
                              ...p, coins_balance: p.coins_balance - 500, xp: newXp, level: newLevel,
                            }));
                            toast({ title: "+100 XP Boost!", description: "500 coins spent" });
                          });
                        }}
                      >
                        <span className="text-sm font-semibold text-foreground">+100 XP Boost</span>
                        <span className="text-xs text-muted-foreground">500 🪙</span>
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Battle View */}
        {inBattle && currentOpponent && (
          <BattleArena
            playerPokemon={playerData?.starter_pokemon || "Pikachu"}
            opponent={currentOpponent}
            wager={wager}
            onWagerChange={setWager}
            onAnswer={handleBattleAnswer}
            onClose={closeBattle}
            quiz={quiz}
            phase={battlePhase}
            result={battleResult}
            knowledgeScore={knowledgeScore}
            matchupScore={matchupScore}
            cardScore={cardScore}
          />
        )}

        {/* Free-to-try info */}
        {!playerData && user && gamePhase === "select" && (
          <div className="terminal-card p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              🆓 <strong>3 free battles</strong> included · Unlock unlimited for just <strong>$0.99</strong>
            </p>
          </div>
        )}
      </main>
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); loadPlayerData(); }} />}
    </div>
  );
};

export default PokemonKidsGame;

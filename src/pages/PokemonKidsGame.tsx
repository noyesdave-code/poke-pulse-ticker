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
  QUIZ_QUESTIONS, BOT_OPPONENTS, ADVENTURE_ZONES, ACHIEVEMENTS, DAILY_REWARDS,
  type StarterPokemon, type BotOpponent, type QuizQuestion, type AdventureZone,
  type AchievementStats,
} from "@/lib/pokemonKidsData";
import {
  Sword, Shield, Heart, Zap, Trophy, Coins, Map, Swords,
  Star, Lock, Unlock, Crown, Sparkles, BookOpen, Target, Users, ShoppingCart,
  MapPin, ChevronRight, Award, Gift, CalendarCheck, UserPlus, Check
} from "lucide-react";

// --- Sub-components ---

const CharacterSelect = ({ onSelect }: { onSelect: (p: StarterPokemon) => void }) => {
  const [selected, setSelected] = useState<StarterPokemon | null>(null);
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Choose Your Starter Poké
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
            <img src={p.image} alt={p.name} className="w-24 h-24 mx-auto object-contain drop-shadow-lg" loading="lazy" />
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
                  <p className="text-[10px] text-muted-foreground">{activeZone.bossBot.difficulty.toUpperCase()}</p>
                </div>
                <Button size="sm" variant="destructive" className="ml-auto" disabled={locked} onClick={() => onBattle(activeZone)}>
                  Challenge Boss
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={() => onExploreZone(activeZone)} className="flex-1" disabled={locked}>
              <Map className="w-4 h-4 mr-2" /> Explore
            </Button>
            <Button onClick={() => onBattle(activeZone)} variant="default" className="flex-1" disabled={locked}>
              <Swords className="w-4 h-4 mr-2" /> Battle
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
          {collectedCount}/{totalPokemon} Poké · {ADVENTURE_ZONES.filter(z => level >= z.minLevel).length}/{ADVENTURE_ZONES.length} zones
        </div>
      </div>
      <Progress value={(collectedCount / totalPokemon) * 100} className="h-3" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ADVENTURE_ZONES.map((zone) => {
          const locked = level < zone.minLevel;
          return (
            <button key={zone.name} disabled={locked} onClick={() => onSelectZone(zone)}
              className={`terminal-card p-3 text-left transition-all ${zone.color} border ${
                locked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"
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
  quiz, phase, result, knowledgeScore, matchupScore, cardScore, isPvP
}: {
  playerPokemon: string; opponent: BotOpponent; wager: number;
  onWagerChange: (n: number) => void; onAnswer: (i: number) => void;
  onClose: () => void; quiz: QuizQuestion | null;
  phase: "wager" | "knowledge" | "battle" | "result";
  result: "win" | "lose" | "draw" | null;
  knowledgeScore: number; matchupScore: number; cardScore: number;
  isPvP?: boolean;
}) => {
  const playerStarter = STARTER_POKEMON.find(p => p.name === playerPokemon);
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground">⚔️ {isPvP ? "PvP" : ""} Battle vs {opponent.name}</h3>
        <Badge variant={isPvP ? "default" : "outline"}>{isPvP ? "PVP" : opponent.difficulty.toUpperCase()}</Badge>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <img src={playerStarter?.image} alt={playerPokemon} className="w-20 h-20 mx-auto object-contain" />
          <p className="text-sm font-bold text-foreground">{playerPokemon}</p>
          <Badge className="text-[10px]">YOU</Badge>
        </div>
        <Swords className="w-8 h-8 text-primary shrink-0" />
        <div className="text-center flex-1">
          <img src={getPokemonImage(opponent.pokemonId)} alt={opponent.pokemon} className="w-20 h-20 mx-auto object-contain" />
          <p className="text-sm font-bold text-foreground">{opponent.pokemon}</p>
          <Badge variant="outline" className="text-[10px]">{opponent.name}</Badge>
        </div>
      </div>

      {phase === "wager" && (
        <div className="terminal-card p-4 space-y-3">
          <h4 className="font-semibold text-foreground">Wager Cards</h4>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 5].map(n => (
              <button key={n} onClick={() => onWagerChange(n)}
                className={`px-4 py-2 rounded font-mono text-sm font-bold transition-all ${
                  wager === n ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >{n}</button>
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
              <button key={i} onClick={() => onAnswer(i)}
                className="px-3 py-2 rounded text-sm font-semibold bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >{opt}</button>
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
            <div className="terminal-card p-2"><BookOpen className="w-4 h-4 mx-auto text-blue-400" /><p className="font-semibold text-foreground mt-1">Knowledge</p><p className="text-muted-foreground">{knowledgeScore}/100</p></div>
            <div className="terminal-card p-2"><Target className="w-4 h-4 mx-auto text-amber-400" /><p className="font-semibold text-foreground mt-1">Matchup</p><p className="text-muted-foreground">{matchupScore}/100</p></div>
            <div className="terminal-card p-2"><Zap className="w-4 h-4 mx-auto text-primary" /><p className="font-semibold text-foreground mt-1">Card Power</p><p className="text-muted-foreground">{cardScore}/100</p></div>
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
  const [isPvPBattle, setIsPvPBattle] = useState(false);

  // Achievements & rewards
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [pvpChallenges, setPvpChallenges] = useState<any[]>([]);
  const [pvpWins, setPvpWins] = useState(0);
  const [pvpLeaderboard, setPvpLeaderboard] = useState<any[]>([]);

  // Purchase callback
  useEffect(() => {
    const purchase = searchParams.get("purchase");
    if (purchase === "success") {
      toast({ title: "🎮 Game Unlocked!", description: "Unlimited battles!" });
      setSearchParams({}, { replace: true });
      loadPlayerData();
    } else if (purchase === "canceled") {
      toast({ title: "Purchase canceled", variant: "destructive" });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const loadPlayerData = useCallback(async () => {
    if (!user) { setGamePhase("select"); return; }
    const { data } = await supabase.from("game_players").select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      setPlayerData(data);
      setGamePhase("playing");

      // Load collections
      const [pokemonRes, cardsRes, achievRes, battlesRes] = await Promise.all([
        supabase.from("game_collected_pokemon").select("pokemon_name").eq("player_id", data.id),
        supabase.from("game_collected_cards").select("*").eq("player_id", data.id),
        supabase.from("game_achievements").select("achievement_id").eq("player_id", data.id),
        supabase.from("game_battles").select("result").eq("player_id", data.id).eq("opponent_type", "pvp"),
      ]);
      setCollectedPokemon(pokemonRes.data?.map((p: any) => p.pokemon_name) || []);
      setCollectedCards(cardsRes.data || []);
      setUnlockedAchievements(achievRes.data?.map((a: any) => a.achievement_id) || []);
      setPvpWins(battlesRes.data?.filter((b: any) => b.result === "win").length || 0);

      // Daily login check
      const today = new Date().toISOString().split("T")[0];
      if (data.last_login_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const newStreak = data.last_login_date === yesterday ? (data.login_streak || 0) + 1 : 1;
        await supabase.from("game_players").update({ last_login_date: today, login_streak: newStreak }).eq("id", data.id);
        setPlayerData((p: any) => ({ ...p, last_login_date: today, login_streak: newStreak }));
        setDailyRewardClaimed(false);
      } else {
        setDailyRewardClaimed(true); // already logged in today
      }

      // Load open PvP challenges
      loadPvpChallenges(data.id);
    } else {
      setGamePhase("select");
    }
  }, [user]);

  const loadPvpChallenges = async (playerId: string) => {
    const { data } = await supabase
      .from("game_pvp_challenges")
      .select("*")
      .or(`status.eq.open,challenger_id.eq.${playerId},opponent_id.eq.${playerId}`)
      .order("created_at", { ascending: false })
      .limit(20);
    setPvpChallenges(data || []);
  };

  useEffect(() => { loadPlayerData(); }, [loadPlayerData]);

  // Load PvP leaderboard
  const loadPvpLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("game_players")
      .select("id, display_name, starter_pokemon, starter_pokemon_image, level, total_wins, total_losses")
      .order("total_wins", { ascending: false })
      .limit(20);
    setPvpLeaderboard(data || []);
  }, []);

  useEffect(() => { loadPvpLeaderboard(); }, [loadPvpLeaderboard]);

  // Realtime PvP subscription with notifications
  useEffect(() => {
    if (!playerData?.id) return;
    const channel = supabase
      .channel("pvp-challenges")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "game_pvp_challenges" }, (payload: any) => {
        const updated = payload.new;
        // Notify challenger when their challenge is accepted
        if (updated.status === "resolved" && updated.challenger_id === playerData.id) {
          const won = updated.winner_id === playerData.id;
          toast({
            title: won ? "⚔️ PvP Result: Victory!" : updated.winner_id ? "⚔️ PvP Result: Defeat" : "⚔️ PvP Result: Draw",
            description: `${updated.opponent_pokemon || "Someone"} accepted your challenge!`,
          });
          loadPlayerData();
        }
        loadPvpChallenges(playerData.id);
        loadPvpLeaderboard();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "game_pvp_challenges" }, () => {
        loadPvpChallenges(playerData.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [playerData?.id]);

  // Achievement checker
  const checkAndUnlockAchievements = useCallback(async () => {
    if (!playerData) return;
    const stats: AchievementStats = {
      totalWins: playerData.total_wins || 0,
      totalLosses: playerData.total_losses || 0,
      collectedPokemon: collectedPokemon.length,
      collectedCards: collectedCards.length,
      level: playerData.level || 1,
      loginStreak: playerData.login_streak || 1,
      totalBattles: (playerData.total_wins || 0) + (playerData.total_losses || 0),
      coinsEarned: playerData.coins_balance || 0,
      zonesUnlocked: ADVENTURE_ZONES.filter(z => (playerData.level || 1) >= z.minLevel).length,
      pvpWins,
    };
    const newUnlocks: string[] = [];
    for (const ach of ACHIEVEMENTS) {
      if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
        newUnlocks.push(ach.id);
      }
    }
    if (newUnlocks.length > 0) {
      const inserts = newUnlocks.map(id => ({ player_id: playerData.id, achievement_id: id }));
      await supabase.from("game_achievements").insert(inserts);
      setUnlockedAchievements(prev => [...prev, ...newUnlocks]);
      const first = ACHIEVEMENTS.find(a => a.id === newUnlocks[0]);
      toast({ title: `${first?.icon} Achievement Unlocked!`, description: first?.name });
    }
  }, [playerData, collectedPokemon.length, collectedCards.length, unlockedAchievements, pvpWins]);

  useEffect(() => {
    if (gamePhase === "playing") checkAndUnlockAchievements();
  }, [gamePhase, playerData?.total_wins, playerData?.level, collectedPokemon.length, pvpWins]);

  const handleSelectStarter = async (starter: StarterPokemon) => {
    if (!user) { setShowAuth(true); return; }
    const { data, error } = await supabase.from("game_players").insert({
      user_id: user.id, starter_pokemon: starter.name, starter_pokemon_image: starter.image,
      display_name: user.email?.split("@")[0],
    }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await supabase.from("game_collected_pokemon").insert({
      player_id: data.id, pokemon_name: starter.name, pokemon_image: starter.image, pokemon_type: starter.type,
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
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const handleBuyCoins = async () => {
    if (!user) { setShowAuth(true); return; }
    try {
      const { data, error } = await supabase.functions.invoke("buy-pokecoins", { body: { priceId: "price_1TH9emPRXT5iryzGhI5uLkzL" } });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const claimDailyReward = async () => {
    if (!playerData || dailyRewardClaimed) return;
    const streakDay = Math.min(playerData.login_streak || 1, 7);
    const reward = DAILY_REWARDS[streakDay - 1];
    const newCoins = (playerData.coins_balance || 0) + reward.coins;
    const newXp = (playerData.xp || 0) + reward.xp;
    const newLevel = Math.floor(newXp / 100) + 1;
    await supabase.from("game_players").update({ coins_balance: newCoins, xp: newXp, level: newLevel }).eq("id", playerData.id);
    setPlayerData((p: any) => ({ ...p, coins_balance: newCoins, xp: newXp, level: newLevel }));
    setDailyRewardClaimed(true);
    toast({ title: `🎁 ${reward.label} Reward!`, description: `+${reward.coins} 🪙 +${reward.xp} XP` });
  };

  const startBattle = (zone?: AdventureZone) => {
    if (!playerData) return;
    if (!playerData.has_paid && playerData.free_battles_remaining <= 0) {
      toast({ title: "Free battles used up!", description: "Unlock for $0.99", variant: "destructive" });
      return;
    }
    setIsPvPBattle(false);
    if (zone?.bossBot) {
      setCurrentOpponent(zone.bossBot);
    } else {
      const eligible = BOT_OPPONENTS.filter(b => {
        if (playerData.level <= 3) return b.difficulty === "easy";
        if (playerData.level <= 8) return b.difficulty !== "hard";
        return true;
      });
      setCurrentOpponent(eligible[Math.floor(Math.random() * eligible.length)]);
    }
    setWager(1); setBattlePhase("wager"); setInBattle(true);
    setBattleResult(null); setKnowledgeScore(0); setMatchupScore(0); setCardScore(0);
  };

  const handleExploreZone = async (zone: AdventureZone) => {
    if (!playerData) return;
    const zonePool = zone.pokemonPool
      .map(id => ALL_POKEMON.find(p => p.id === id))
      .filter((p): p is typeof ALL_POKEMON[number] => !!p && !collectedPokemon.includes(p.name));

    if (zonePool.length === 0) {
      const coinBonus = Math.round(zone.coinReward * 0.5);
      const newCoins = (playerData.coins_balance || 0) + coinBonus;
      await supabase.from("game_players").update({ coins_balance: newCoins }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, coins_balance: newCoins }));
      toast({ title: `${zone.name} fully explored!`, description: `+${coinBonus} 🪙` });
      return;
    }

    if (Math.random() < zone.encounterRate) {
      const found = zonePool[Math.floor(Math.random() * zonePool.length)];
      await supabase.from("game_collected_pokemon").insert({
        player_id: playerData.id, pokemon_name: found.name,
        pokemon_image: getPokemonImage(found.id), pokemon_type: found.type,
      });
      setCollectedPokemon(prev => [...prev, found.name]);
      const newXp = (playerData.xp || 0) + zone.xpReward;
      const newLevel = Math.floor(newXp / 100) + 1;
      const newCoins = (playerData.coins_balance || 0) + zone.coinReward;
      await supabase.from("game_players").update({ xp: newXp, level: newLevel, coins_balance: newCoins }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, xp: newXp, level: newLevel, coins_balance: newCoins }));
      toast({ title: `Wild ${found.name}!`, description: `+${zone.xpReward} XP, +${zone.coinReward} 🪙` });
    } else {
      const coinBonus = Math.round(zone.coinReward * 0.3);
      const newCoins = (playerData.coins_balance || 0) + coinBonus;
      await supabase.from("game_players").update({ coins_balance: newCoins }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, coins_balance: newCoins }));
      toast({ title: `${zone.name} is quiet...`, description: `+${coinBonus} 🪙` });
    }
  };

  const handleBattleAnswer = async (answerIndex: number) => {
    if (!currentOpponent || !playerData) return;
    if (battlePhase === "wager") {
      const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      setQuiz(q); setBattlePhase("knowledge"); return;
    }
    if (battlePhase === "knowledge" && quiz) {
      const correct = answerIndex === quiz.correctIndex;
      const kScore = correct ? 100 : 20;
      setKnowledgeScore(kScore);
      const playerType = STARTER_POKEMON.find(p => p.name === playerData.starter_pokemon)?.type || "Normal";
      const advantages = TYPE_ADVANTAGES[playerType] || [];
      const mScore = advantages.includes(currentOpponent.pokemonType) ? 100 :
        (TYPE_ADVANTAGES[currentOpponent.pokemonType]?.includes(playerType) ? 20 : 50);
      setMatchupScore(mScore);
      const cScore = Math.min(100, 30 + collectedCards.length * 5);
      setCardScore(cScore);
      const totalPlayer = kScore + mScore + cScore;
      const totalOpp = currentOpponent.knowledgeLevel + 50 + Math.floor(Math.random() * 40);
      const res = totalPlayer > totalOpp ? "win" : totalPlayer === totalOpp ? "draw" : "lose";
      setBattleResult(res); setBattlePhase("result");

      const xpEarned = res === "win" ? 25 : res === "draw" ? 10 : 5;
      const cardsWon = res === "win" ? wager : 0;
      await supabase.from("game_battles").insert({
        player_id: playerData.id, opponent_type: isPvPBattle ? "pvp" : "bot",
        opponent_pokemon: currentOpponent.pokemon, player_pokemon: playerData.starter_pokemon,
        cards_wagered: wager, cards_won: cardsWon,
        knowledge_score: kScore, matchup_score: mScore, card_score: cScore,
        result: res, xp_earned: xpEarned,
      });

      const newXp = (playerData.xp || 0) + xpEarned;
      const newLevel = Math.floor(newXp / 100) + 1;
      const updates: any = {
        xp: newXp, level: newLevel,
        total_wins: (playerData.total_wins || 0) + (res === "win" ? 1 : 0),
        total_losses: (playerData.total_losses || 0) + (res === "lose" ? 1 : 0),
      };
      if (!playerData.has_paid) updates.free_battles_remaining = Math.max(0, (playerData.free_battles_remaining || 0) - 1);
      if (res === "win") updates.coins_balance = (playerData.coins_balance || 0) + wager * 50;
      await supabase.from("game_players").update(updates).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, ...updates }));

      if (res === "win" && !collectedPokemon.includes(currentOpponent.pokemon)) {
        await supabase.from("game_collected_pokemon").insert({
          player_id: playerData.id, pokemon_name: currentOpponent.pokemon,
          pokemon_image: getPokemonImage(currentOpponent.pokemonId), pokemon_type: currentOpponent.pokemonType,
        });
        setCollectedPokemon(prev => [...prev, currentOpponent.pokemon]);
      }
      if (isPvPBattle && res === "win") setPvpWins(prev => prev + 1);
    }
  };

  const closeBattle = () => { setInBattle(false); setCurrentOpponent(null); };

  // PvP functions
  const createPvPChallenge = async () => {
    if (!playerData) return;
    const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
    await supabase.from("game_pvp_challenges").insert({
      challenger_id: playerData.id,
      challenger_pokemon: playerData.starter_pokemon,
      quiz_question: q.question,
      quiz_correct_index: q.correctIndex,
      wager: 1,
    });
    toast({ title: "⚔️ Challenge Posted!", description: "Waiting for an opponent..." });
    loadPvpChallenges(playerData.id);
  };

  const acceptPvPChallenge = async (challenge: any) => {
    if (!playerData || challenge.challenger_id === playerData.id) return;
    // Accept and auto-resolve
    const q = QUIZ_QUESTIONS.find(qq => qq.question === challenge.quiz_question);
    const correctIdx = challenge.quiz_correct_index;
    // Simulate both answers (opponent answers randomly-ish based on level)
    const challengerCorrect = Math.random() < 0.5; // 50/50 for challenger
    const opponentCorrect = Math.random() < 0.6; // slight advantage for acceptor

    const challengerType = STARTER_POKEMON.find(p => p.name === challenge.challenger_pokemon)?.type || "Normal";
    const opponentType = STARTER_POKEMON.find(p => p.name === playerData.starter_pokemon)?.type || "Normal";

    const cAdv = TYPE_ADVANTAGES[challengerType]?.includes(opponentType) ? 100 : 50;
    const oAdv = TYPE_ADVANTAGES[opponentType]?.includes(challengerType) ? 100 : 50;

    const challengerScore = (challengerCorrect ? 100 : 20) + cAdv + Math.floor(Math.random() * 60);
    const opponentScore = (opponentCorrect ? 100 : 20) + oAdv + Math.floor(Math.random() * 60);

    const winnerId = challengerScore > opponentScore ? challenge.challenger_id :
      opponentScore > challengerScore ? playerData.id : null;

    await supabase.from("game_pvp_challenges").update({
      opponent_id: playerData.id,
      opponent_pokemon: playerData.starter_pokemon,
      status: "resolved",
      winner_id: winnerId,
      resolved_at: new Date().toISOString(),
    }).eq("id", challenge.id);

    // Update both players' stats
    if (winnerId === playerData.id) {
      const newWins = (playerData.total_wins || 0) + 1;
      const newCoins = (playerData.coins_balance || 0) + challenge.wager * 100;
      await supabase.from("game_players").update({ total_wins: newWins, coins_balance: newCoins }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, total_wins: newWins, coins_balance: newCoins }));
      setPvpWins(prev => prev + 1);
      toast({ title: "🎉 PvP Victory!", description: `+${challenge.wager * 100} 🪙` });
    } else if (winnerId === challenge.challenger_id) {
      const newLosses = (playerData.total_losses || 0) + 1;
      await supabase.from("game_players").update({ total_losses: newLosses }).eq("id", playerData.id);
      setPlayerData((p: any) => ({ ...p, total_losses: newLosses }));
      toast({ title: "😢 PvP Defeat", description: "Better luck next time!" });
    } else {
      toast({ title: "🤝 PvP Draw!" });
    }

    await supabase.from("game_battles").insert({
      player_id: playerData.id, opponent_type: "pvp",
      opponent_pokemon: challenge.challenger_pokemon, player_pokemon: playerData.starter_pokemon,
      cards_wagered: challenge.wager, cards_won: winnerId === playerData.id ? challenge.wager : 0,
      knowledge_score: opponentCorrect ? 100 : 20, matchup_score: oAdv, card_score: 50,
      result: winnerId === playerData.id ? "win" : winnerId ? "lose" : "draw", xp_earned: 15,
    });

    loadPvpChallenges(playerData.id);
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
            🎮 Poké Adventure <span className="text-primary">Land</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose your Poké, collect cards, battle trainers & real players, earn achievements!
          </p>
          {!user && <Button onClick={() => setShowAuth(true)} size="lg" className="text-lg">Sign In to Play ⚡</Button>}
        </div>

        {/* Daily Reward Banner */}
        {playerData && !dailyRewardClaimed && (
          <div className="terminal-card p-4 border-2 border-primary bg-primary/5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-foreground">🎁 Daily Login Reward!</p>
                  <p className="text-xs text-muted-foreground">
                    Day {Math.min(playerData.login_streak || 1, 7)} streak — 
                    +{DAILY_REWARDS[Math.min((playerData.login_streak || 1) - 1, 6)].coins} 🪙 
                    +{DAILY_REWARDS[Math.min((playerData.login_streak || 1) - 1, 6)].xp} XP
                  </p>
                </div>
              </div>
              <Button onClick={claimDailyReward} size="sm">Claim!</Button>
            </div>
          </div>
        )}

        {/* Player Stats Bar */}
        {playerData && (
          <div className="terminal-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={playerData.starter_pokemon_image} alt={playerData.starter_pokemon} className="w-12 h-12 object-contain" />
                <div>
                  <p className="font-bold text-foreground">{playerData.display_name}</p>
                  <p className="text-xs text-muted-foreground">Lv. {playerData.level} · {playerData.starter_pokemon} · 🔥{playerData.login_streak || 1}d streak</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /><span className="text-foreground">{playerData.xp} XP</span></div>
                <div className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-400" /><span className="text-foreground">{playerData.coins_balance}</span></div>
                <div className="flex items-center gap-1"><Trophy className="w-4 h-4 text-primary" /><span className="text-foreground">{playerData.total_wins || 0}W</span></div>
              </div>
              <div className="flex gap-2">
                {!playerData.has_paid && (
                  <Button onClick={handleBuyGameAccess} size="sm"><Unlock className="w-3 h-3 mr-1" /> $0.99</Button>
                )}
                <Button onClick={handleBuyCoins} size="sm" variant="outline"><Coins className="w-3 h-3 mr-1" /> Coins</Button>
              </div>
            </div>
            <Progress value={completionPct} className="h-2 mt-3" />
            <p className="text-[10px] text-muted-foreground mt-1">{completionPct.toFixed(0)}% Poké Dex · {collectedPokemon.length}/{ALL_POKEMON.length}</p>
          </div>
        )}

        {isGameComplete && (
          <div className="terminal-card p-6 text-center border-2 border-primary bg-primary/5">
            <Crown className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-2xl font-black text-foreground">🎉 POKÉ MASTER! 🎉</h2>
          </div>
        )}

        {gamePhase === "select" && <CharacterSelect onSelect={handleSelectStarter} />}

        {/* Main Game Tabs */}
        {gamePhase === "playing" && !inBattle && (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full grid grid-cols-6">
              <TabsTrigger value="adventure" className="text-[11px]"><Map className="w-3 h-3 mr-0.5" /> Map</TabsTrigger>
              <TabsTrigger value="pvp" className="text-[11px]"><Swords className="w-3 h-3 mr-0.5" /> PvP</TabsTrigger>
              <TabsTrigger value="achievements" className="text-[11px]"><Award className="w-3 h-3 mr-0.5" /> Badges</TabsTrigger>
              <TabsTrigger value="pokemon" className="text-[11px]"><Users className="w-3 h-3 mr-0.5" /> Dex</TabsTrigger>
              <TabsTrigger value="cards" className="text-[11px]"><BookOpen className="w-3 h-3 mr-0.5" /> Cards</TabsTrigger>
              <TabsTrigger value="shop" className="text-[11px]"><ShoppingCart className="w-3 h-3 mr-0.5" /> Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="adventure">
              <AdventureMap
                collectedCount={collectedPokemon.length} totalPokemon={ALL_POKEMON.length}
                level={playerData?.level || 1} onBattle={startBattle} onExploreZone={handleExploreZone}
                hasPaid={playerData?.has_paid} freeBattles={playerData?.free_battles_remaining || 0}
                activeZone={activeZone} onSelectZone={setActiveZone}
              />
            </TabsContent>

            {/* PvP Tab */}
            <TabsContent value="pvp">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Swords className="w-5 h-5 text-primary" /> PvP Arena
                  </h3>
                  <Button onClick={createPvPChallenge} size="sm">
                    <UserPlus className="w-4 h-4 mr-1" /> Post Challenge
                  </Button>
                </div>
                <div className="terminal-card p-4 text-center bg-primary/5 border-primary/20">
                  <p className="text-sm text-foreground font-semibold">Your PvP Record</p>
                  <p className="text-2xl font-black text-primary">{pvpWins}W</p>
                  <p className="text-[10px] text-muted-foreground">Challenge trainers worldwide!</p>
                </div>

                {/* Open challenges */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Open Challenges</h4>
                  {pvpChallenges.filter(c => c.status === "open" && c.challenger_id !== playerData?.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No open challenges. Post one above!</p>
                  ) : (
                    pvpChallenges.filter(c => c.status === "open" && c.challenger_id !== playerData?.id).map(c => (
                      <div key={c.id} className="terminal-card p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={STARTER_POKEMON.find(p => p.name === c.challenger_pokemon)?.image} alt="" className="w-8 h-8 object-contain" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{c.challenger_pokemon} Trainer</p>
                            <p className="text-[10px] text-muted-foreground">Wager: {c.wager} cards</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => acceptPvPChallenge(c)}>
                          <Swords className="w-3 h-3 mr-1" /> Accept
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Your challenges */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Your Challenges</h4>
                  {pvpChallenges.filter(c => c.challenger_id === playerData?.id).map(c => (
                    <div key={c.id} className="terminal-card p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {c.status === "open" ? "⏳ Waiting..." : c.winner_id === playerData?.id ? "🎉 You Won!" : c.winner_id ? "😢 Lost" : "🤝 Draw"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{c.challenger_pokemon} vs {c.opponent_pokemon || "?"}</p>
                      </div>
                      <Badge variant={c.status === "open" ? "outline" : c.winner_id === playerData?.id ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Recent resolved */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Recent Battles</h4>
                  {pvpChallenges.filter(c => c.status === "resolved" && c.opponent_id === playerData?.id).slice(0, 5).map(c => (
                    <div key={c.id} className="terminal-card p-2 flex items-center justify-between text-xs">
                      <span className="text-foreground">{c.challenger_pokemon} vs {c.opponent_pokemon}</span>
                      <Badge variant={c.winner_id === playerData?.id ? "default" : "secondary"}>
                        {c.winner_id === playerData?.id ? "WIN" : c.winner_id ? "LOSS" : "DRAW"}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* PvP Leaderboard */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" /> Global Leaderboard
                  </h4>
                  {pvpLeaderboard.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No trainers yet. Be the first!</p>
                  ) : (
                    <div className="space-y-1">
                      {pvpLeaderboard.map((player, idx) => (
                        <div key={player.id} className={`terminal-card p-2 flex items-center gap-3 ${
                          player.id === playerData?.id ? "ring-1 ring-primary bg-primary/5" : ""
                        }`}>
                          <span className={`font-black text-lg w-8 text-center ${
                            idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-orange-400" : "text-muted-foreground"
                          }`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                          </span>
                          {player.starter_pokemon_image && (
                            <img src={player.starter_pokemon_image} alt="" className="w-8 h-8 object-contain" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {player.display_name || "Trainer"} {player.id === playerData?.id && <span className="text-primary">(You)</span>}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Lv.{player.level} · {player.starter_pokemon}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{player.total_wins}W</p>
                            <p className="text-[10px] text-muted-foreground">{player.total_losses}L</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Achievement Badges
                  </h3>
                  <Badge variant="outline">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</Badge>
                </div>
                <Progress value={(unlockedAchievements.length / ACHIEVEMENTS.length) * 100} className="h-2" />

                {/* Daily Rewards Calendar */}
                <div className="terminal-card p-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <CalendarCheck className="w-4 h-4 text-primary" /> Daily Login Streak
                  </h4>
                  <div className="grid grid-cols-7 gap-2">
                    {DAILY_REWARDS.map((r, i) => {
                      const currentDay = Math.min(playerData?.login_streak || 1, 7);
                      const claimed = i < currentDay && dailyRewardClaimed;
                      const isToday = i === currentDay - 1;
                      return (
                        <div key={i} className={`terminal-card p-2 text-center ${
                          claimed ? "bg-primary/10 border-primary/30" : isToday ? "ring-2 ring-primary" : "opacity-50"
                        }`}>
                          <p className="text-[10px] font-bold text-foreground">{r.label}</p>
                          <p className="text-lg">{claimed ? "✅" : isToday ? "🎁" : "🔒"}</p>
                          <p className="text-[9px] text-muted-foreground">+{r.coins}🪙</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    🔥 {playerData?.login_streak || 1}-day streak! Log in daily for bigger rewards.
                  </p>
                </div>

                {/* Achievement Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACHIEVEMENTS.map(ach => {
                    const unlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div key={ach.id} className={`terminal-card p-3 text-center transition-all ${
                        unlocked ? "border-primary/40 bg-primary/5" : "opacity-40 grayscale"
                      }`}>
                        <span className="text-3xl">{ach.icon}</span>
                        <p className="text-xs font-bold text-foreground mt-1">{ach.name}</p>
                        <p className="text-[10px] text-muted-foreground">{ach.description}</p>
                        {unlocked && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pokemon">
              <div className="space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Poké Dex ({collectedPokemon.length}/{ALL_POKEMON.length})
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {ALL_POKEMON.map((p) => {
                    const collected = collectedPokemon.includes(p.name);
                    return (
                      <div key={p.id} className={`terminal-card p-2 text-center ${collected ? "" : "opacity-30 grayscale"}`}>
                        <img src={getPokemonImage(p.id)} alt={p.name} className="w-10 h-10 mx-auto object-contain" loading="lazy" />
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
                  <BookOpen className="w-5 h-5 text-primary" /> Cards ({collectedCards.length})
                </h3>
                {collectedCards.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Win battles to collect cards!</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {collectedCards.map((card: any) => (
                      <div key={card.id} className="terminal-card p-2 text-center">
                        {card.card_image ? (
                          <img src={card.card_image} alt={card.card_name} className="w-full rounded" loading="lazy" />
                        ) : (
                          <div className="w-full h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">{card.card_name}</div>
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
                      <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Unlock className="w-5 h-5 text-primary" /> Full Game</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">Unlimited battles & adventures!</p>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-black text-foreground">$0.99</span>
                          <span className="text-sm text-muted-foreground">one-time</span>
                        </div>
                        <Button onClick={handleBuyGameAccess} className="w-full">Unlock ⚡</Button>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" /> PokéCoins</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[{ name: "Starter", coins: "1,500", price: "$0.99" }, { name: "Trainer", coins: "10,000", price: "$4.99" }, { name: "Champion", coins: "25,000", price: "$9.99" }].map(pack => (
                          <button key={pack.name} onClick={handleBuyCoins} className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80">
                            <span className="text-sm font-semibold text-foreground">{pack.name}</span>
                            <span className="text-xs text-muted-foreground">{pack.coins} — {pack.price}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Power-Ups</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <button className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80"
                        onClick={() => {
                          if ((playerData?.coins_balance || 0) < 200) { toast({ title: "Not enough coins!", variant: "destructive" }); return; }
                          supabase.from("game_players").update({
                            coins_balance: playerData.coins_balance - 200,
                            free_battles_remaining: (playerData.free_battles_remaining || 0) + 3,
                          }).eq("id", playerData.id).then(() => {
                            setPlayerData((p: any) => ({ ...p, coins_balance: p.coins_balance - 200, free_battles_remaining: (p.free_battles_remaining || 0) + 3 }));
                            toast({ title: "+3 Battles!", description: "200 coins spent" });
                          });
                        }}
                      >
                        <span className="text-sm font-semibold text-foreground">+3 Battles</span>
                        <span className="text-xs text-muted-foreground">200 🪙</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-2 rounded bg-muted hover:bg-muted/80"
                        onClick={() => {
                          if ((playerData?.coins_balance || 0) < 500) { toast({ title: "Not enough coins!", variant: "destructive" }); return; }
                          const newXp = (playerData?.xp || 0) + 100;
                          const newLevel = Math.floor(newXp / 100) + 1;
                          supabase.from("game_players").update({ coins_balance: playerData.coins_balance - 500, xp: newXp, level: newLevel }).eq("id", playerData.id).then(() => {
                            setPlayerData((p: any) => ({ ...p, coins_balance: p.coins_balance - 500, xp: newXp, level: newLevel }));
                            toast({ title: "+100 XP Boost!", description: "500 coins spent" });
                          });
                        }}
                      >
                        <span className="text-sm font-semibold text-foreground">+100 XP</span>
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
            opponent={currentOpponent} wager={wager} onWagerChange={setWager}
            onAnswer={handleBattleAnswer} onClose={closeBattle} quiz={quiz}
            phase={battlePhase} result={battleResult}
            knowledgeScore={knowledgeScore} matchupScore={matchupScore} cardScore={cardScore}
            isPvP={isPvPBattle}
          />
        )}

        {!playerData && user && gamePhase === "select" && (
          <div className="terminal-card p-4 text-center">
            <p className="text-sm text-muted-foreground">🆓 3 free battles · Unlock unlimited for <strong>$0.99</strong></p>
          </div>
        )}
      </main>
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); loadPlayerData(); }} />}
    </div>
  );
};

export default PokemonKidsGame;

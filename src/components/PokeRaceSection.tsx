import { useState, useEffect, useMemo } from "react";
import { usePokeRace, type Racer, type RaceState, type CycleState } from "@/hooks/usePokeRace";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import pokeRaceLogo from "@/assets/poke-race-logo.png";
import {
  Trophy, Timer, TrendingUp, Package, Coins, Flame,
  ChevronRight, Zap, Crown, Medal, Star, Clock
} from "lucide-react";

/* ─── Countdown Display ─── */
const CountdownTimer = ({ ms, label, variant = "default" }: {
  ms: number;
  label: string;
  variant?: "default" | "warning" | "accent";
}) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const colorClass = variant === "warning" ? "text-amber-400" :
    variant === "accent" ? "text-primary" : "text-foreground";

  return (
    <div className="text-center">
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-mono font-bold ${colorClass} tabular-nums`}>
        {min}:{sec.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

/* ─── Phase Banner ─── */
const PhaseBanner = ({ cycle, phaseTimeRemaining }: {
  cycle: CycleState;
  phaseTimeRemaining: number;
}) => {
  const isRacing = cycle.phase === "racing";
  const trackLabel = cycle.activeTrack === "price" ? "PRICE" : "INVENTORY";
  const nextTrack = cycle.activeTrack === "price" ? "INVENTORY" : "PRICE";

  return (
    <div className={`rounded-lg border p-2 sm:p-3 flex items-center justify-between gap-3 ${
      isRacing
        ? "border-primary/50 bg-primary/5"
        : "border-amber-500/50 bg-amber-500/5"
    }`}>
      <div className="flex items-center gap-2">
        {isRacing ? (
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        ) : (
          <Clock className="w-4 h-4 text-amber-400" />
        )}
        <div>
          <p className="text-xs font-bold text-foreground">
            {isRacing
              ? `🏁 ${trackLabel} RACE — LIVE`
              : `⏳ BETTING OPEN — ${nextTrack} RACE NEXT`}
          </p>
          <p className="text-[9px] text-muted-foreground">
            {isRacing
              ? "Cards racing for position • Watch & cheer!"
              : "Place your bets before the next race starts!"}
          </p>
        </div>
      </div>
      <CountdownTimer
        ms={phaseTimeRemaining}
        label={isRacing ? "Race ends" : "Race starts"}
        variant={isRacing ? "accent" : "warning"}
      />
    </div>
  );
};

/* ─── Race Track ─── */
const RaceTrack = ({ race, onBet, userBets, isActive, isBettingPhase }: {
  race: RaceState | null;
  onBet: (racer: Racer) => void;
  userBets: string[];
  isActive: boolean;
  isBettingPhase: boolean;
}) => {
  if (!race) return null;

  const sorted = [...race.racers].sort((a, b) => b.position - a.position);
  const canBet = isBettingPhase;

  return (
    <div className="space-y-1.5">
      {race.racers.map((racer, i) => {
        const rank = sorted.findIndex(r => r.id === racer.id) + 1;
        const hasBet = userBets.includes(racer.id);
        const isWinner = race.status === "finished" && race.winner?.id === racer.id;
        const laneColors = [
          "from-primary/40 to-primary/10",
          "from-amber-500/40 to-amber-500/10",
          "from-blue-500/40 to-blue-500/10",
          "from-rose-500/40 to-rose-500/10",
          "from-purple-500/40 to-purple-500/10",
        ];

        return (
          <div key={racer.id} className={`relative rounded-lg border overflow-hidden transition-all duration-300 ${
            isWinner ? "border-primary ring-1 ring-primary/50 bg-primary/5" :
            hasBet ? "border-amber-500/50 bg-amber-500/5" :
            isActive ? "border-border/50 bg-card/50" : "border-border/30 bg-card/30 opacity-70"
          }`}>
            {/* Lane background — animated during racing */}
            <div className="absolute inset-0 opacity-20">
              <div className={`h-full bg-gradient-to-r ${laneColors[i]} rounded-lg`}
                style={{ width: `${racer.position}%`, transition: isActive ? "width 0.5s ease-out" : "none" }} />
            </div>

            <div className="relative flex items-center gap-2 p-2 sm:p-3">
              {/* Rank */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                rank === 1 ? "bg-primary/20 text-primary" :
                rank === 2 ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"
              }`}>
                {rank === 1 && isWinner ? <Crown className="w-3.5 h-3.5" /> : rank}
              </div>

              {/* Card image */}
              {racer.image ? (
                <img src={racer.image} alt={racer.name} className="w-8 h-11 object-cover rounded flex-shrink-0"
                  loading="lazy" />
              ) : (
                <div className="w-8 h-11 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{racer.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {racer.category.toUpperCase()}
                  </Badge>
                  <span className={`text-[10px] font-mono ${racer.changePct >= 0 ? "text-primary" : "text-destructive"}`}>
                    {racer.changePct >= 0 ? "+" : ""}{racer.changePct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Odds */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] text-muted-foreground">ODDS</p>
                <p className="text-sm font-bold text-foreground font-mono">{racer.odds}x</p>
              </div>

              {/* Bet button — only during betting phase */}
              {canBet && (
                <Button
                  size="sm"
                  variant={hasBet ? "secondary" : "default"}
                  className="flex-shrink-0 h-7 text-[10px] px-2"
                  onClick={() => onBet(racer)}
                  disabled={hasBet}
                >
                  {hasBet ? "BET ✓" : "BET"}
                </Button>
              )}

              {/* Winner indicator */}
              {isWinner && (
                <div className="flex-shrink-0">
                  <Trophy className="w-5 h-5 text-primary animate-pulse" />
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-muted">
              <div className={`h-full transition-all duration-500 ease-out ${
                isWinner ? "bg-primary" : "bg-foreground/30"
              }`} style={{ width: `${racer.position}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Top Movers Board ─── */
const MoversBoard = ({ title, icon, items }: {
  title: string;
  icon: React.ReactNode;
  items: { name: string; image: string | null; change: number; category: string }[];
}) => (
  <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
    <CardHeader className="pb-2 pt-3 px-3">
      <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3 space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 py-1 border-b border-border/30 last:border-0">
          <span className={`text-[10px] font-bold w-4 ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
            {i + 1}
          </span>
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-6 h-8 object-cover rounded" loading="lazy" />
          ) : (
            <div className="w-6 h-8 bg-muted rounded" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold truncate">{item.name}</p>
            <Badge variant="outline" className="text-[8px] px-1 py-0">{item.category}</Badge>
          </div>
          <span className={`text-xs font-mono font-bold ${item.change >= 0 ? "text-primary" : "text-destructive"}`}>
            {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
          </span>
        </div>
      ))}
    </CardContent>
  </Card>
);

/* ─── Main Section ─── */
const PokeRaceSection = () => {
  const { priceRace, inventoryRace, cycle, phaseTimeRemaining } = usePokeRace();
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState({ balance: 1000, lifetime_won: 0 });
  const [betWager, setBetWager] = useState(100);
  const [userBets, setUserBets] = useState<string[]>([]);
  const [now, setNow] = useState(Date.now());

  // Tick every second for countdown displays
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const phaseMs = Math.max(0, cycle.phaseEndsAt - now);

  // Load wallet
  useEffect(() => {
    if (!user) return;
    const loadWallet = async () => {
      const { data } = await supabase
        .from("race_wallets")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setWallet({ balance: data.balance, lifetime_won: data.lifetime_won });
      } else {
        await supabase.from("race_wallets").insert({ user_id: user.id });
        setWallet({ balance: 1000, lifetime_won: 0 });
      }
    };
    loadWallet();
  }, [user]);

  // Clear bets on new race cycle
  useEffect(() => {
    setUserBets([]);
  }, [cycle.raceNumber]);

  const handleBet = async (racer: Racer) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Create an account to bet on Poké Race!", variant: "destructive" });
      return;
    }
    if (wallet.balance < betWager) {
      toast({ title: "Insufficient coins", description: `Need ${betWager} coins but you have ${wallet.balance}`, variant: "destructive" });
      return;
    }
    if (userBets.includes(racer.id)) return;

    const newBalance = wallet.balance - betWager;
    setWallet(w => ({ ...w, balance: newBalance }));
    setUserBets(prev => [...prev, racer.id]);

    await supabase.from("race_wallets").update({
      balance: newBalance,
      lifetime_wagered: wallet.balance - newBalance,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);

    toast({
      title: `🏁 Bet placed on ${racer.name}!`,
      description: `${betWager} coins at ${racer.odds}x odds — potential payout: ${Math.floor(betWager * racer.odds)} coins`,
    });
  };

  // Top movers from race data
  const topPriceMovers = useMemo(() => {
    if (!priceRace) return [];
    return [...priceRace.racers]
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 5)
      .map(r => ({ name: r.name, image: r.image, change: r.changePct, category: r.category }));
  }, [priceRace]);

  const topInventoryMovers = useMemo(() => {
    if (!inventoryRace) return [];
    return [...inventoryRace.racers]
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 5)
      .map(r => ({ name: r.name, image: r.image, change: r.changePct, category: r.category }));
  }, [inventoryRace]);

  const currentRace = cycle.activeTrack === "price" ? priceRace : inventoryRace;
  const isRacing = cycle.phase === "racing";
  const isBetting = cycle.phase === "betting";

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={pokeRaceLogo} alt="Poké Race" className="w-10 h-10" loading="lazy" width={40} height={40} />
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-foreground tracking-tight flex items-center gap-2">
              POKÉ RACE™
              <Badge variant="default" className={`text-[9px] px-1.5 ${isRacing ? "animate-pulse bg-primary/90" : "bg-amber-500/90"}`}>
                {isRacing ? "LIVE" : "BETS OPEN"}
              </Badge>
            </h2>
            <p className="text-[10px] text-muted-foreground">
              2-min races • 1-min betting breaks • Inventory ↔ Price
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CountdownTimer ms={phaseMs} label={isRacing ? "Race ends" : "Next race"} variant={isRacing ? "accent" : "warning"} />
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Coins</p>
            <p className="text-lg font-mono font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> {wallet.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Phase Banner */}
      <PhaseBanner cycle={cycle} phaseTimeRemaining={phaseMs} />

      {/* Wager selector — highlighted during betting phase */}
      <div className={`flex items-center gap-2 flex-wrap rounded-lg p-2 transition-all ${
        isBetting ? "bg-amber-500/10 border border-amber-500/30" : ""
      }`}>
        <span className="text-[10px] text-muted-foreground font-semibold">WAGER:</span>
        {[50, 100, 250, 500].map(amount => (
          <Button
            key={amount}
            size="sm"
            variant={betWager === amount ? "default" : "outline"}
            className="h-6 text-[10px] px-2"
            onClick={() => setBetWager(amount)}
          >
            {amount} <Coins className="w-2.5 h-2.5 ml-0.5" />
          </Button>
        ))}
        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 ml-auto border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
          <Coins className="w-2.5 h-2.5 mr-1" /> Buy Coins — $0.99
        </Button>
      </div>

      {/* Active Race Track */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {cycle.activeTrack === "price" ? (
            <TrendingUp className="w-4 h-4 text-primary" />
          ) : (
            <Package className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-xs font-bold text-foreground uppercase">
            {cycle.activeTrack === "price" ? "Price Movement Race" : "Inventory Movement Race"}
          </span>
          {isRacing && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
        </div>
        <RaceTrack
          race={currentRace}
          onBet={handleBet}
          userBets={userBets}
          isActive={isRacing}
          isBettingPhase={isBetting}
        />
      </div>

      {/* Top Movers Boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MoversBoard
          title="TOP 5 PRICE MOVERS"
          icon={<TrendingUp className="w-3.5 h-3.5 text-primary" />}
          items={topPriceMovers}
        />
        <MoversBoard
          title="TOP 5 INVENTORY MOVERS"
          icon={<Package className="w-3.5 h-3.5 text-amber-400" />}
          items={topInventoryMovers}
        />
      </div>

      {/* Prizes & Info */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-amber-500/5">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <Medal className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[10px] font-bold text-foreground">1st Place</p>
              <p className="text-[9px] text-muted-foreground">7 days Pro Trial</p>
            </div>
            <div>
              <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-foreground">Top 3</p>
              <p className="text-[9px] text-muted-foreground">Exclusive Badge</p>
            </div>
            <div>
              <Crown className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-foreground">Daily Champion</p>
              <p className="text-[9px] text-muted-foreground">14 days Pro Trial</p>
            </div>
            <div>
              <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-[10px] font-bold text-foreground">Monthly King</p>
              <p className="text-[9px] text-muted-foreground">1 Month Pro Free</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <p className="text-[8px] text-muted-foreground/60 text-center leading-relaxed">
        Poké Race™ is a simulated entertainment experience. No real money is wagered on outcomes. Virtual coins have no cash value.
        Prizes are digital platform perks. © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
        Protected under U.S. intellectual property law.
      </p>
    </section>
  );
};

export default PokeRaceSection;

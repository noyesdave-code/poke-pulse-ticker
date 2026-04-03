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
const laneColors = [
  { trail: "from-primary via-primary/60 to-transparent", glow: "shadow-primary/40", border: "border-primary/30" },
  { trail: "from-amber-500 via-amber-500/60 to-transparent", glow: "shadow-amber-500/40", border: "border-amber-500/30" },
  { trail: "from-blue-500 via-blue-500/60 to-transparent", glow: "shadow-blue-500/40", border: "border-blue-500/30" },
  { trail: "from-rose-500 via-rose-500/60 to-transparent", glow: "shadow-rose-500/40", border: "border-rose-500/30" },
  { trail: "from-purple-500 via-purple-500/60 to-transparent", glow: "shadow-purple-500/40", border: "border-purple-500/30" },
];

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
    <div className="space-y-1 relative overflow-hidden rounded-lg border border-border/40 bg-card/30 p-1.5">
      {/* Finish line */}
      <div className="absolute right-6 top-0 bottom-0 w-px border-r border-dashed border-muted-foreground/30 z-10" />
      <div className="absolute right-5 top-0 text-[7px] text-muted-foreground/50 font-mono z-10">🏁</div>

      {race.racers.map((racer, i) => {
        const rank = sorted.findIndex(r => r.id === racer.id) + 1;
        const hasBet = userBets.includes(racer.id);
        const isWinner = race.status === "finished" && race.winner?.id === racer.id;
        const colors = laneColors[i % laneColors.length];

        return (
          <div key={racer.id} className={`relative h-10 rounded border overflow-hidden transition-colors ${
            isWinner ? "border-primary/60 bg-primary/5" :
            hasBet ? `${colors.border} bg-muted/30` :
            "border-border/20 bg-card/20"
          }`}>
            {/* Lane stripe */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)" }} />

            {/* Racing trail — colored streak behind the card */}
            <div
              className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${colors.trail} transition-all ${isActive ? "duration-700" : "duration-300"} ease-out`}
              style={{ width: `${Math.max(racer.position * 0.85, 2)}%`, opacity: isActive ? 0.35 : 0.15 }}
            />

            {/* Particle dots along trail */}
            {isActive && racer.position > 10 && (
              <>
                <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gradient-to-r ${colors.trail} opacity-60 animate-pulse`}
                  style={{ left: `${racer.position * 0.85 - 8}%` }} />
                <div className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-gradient-to-r ${colors.trail} opacity-40`}
                  style={{ left: `${racer.position * 0.85 - 14}%` }} />
              </>
            )}

            {/* Racer (card image + info) — positioned along track */}
            <div
              className={`absolute top-0 bottom-0 flex items-center gap-1 transition-all ${isActive ? "duration-700" : "duration-300"} ease-out z-20`}
              style={{ left: `${Math.min(racer.position * 0.85, 82)}%` }}
            >
              {/* Card thumbnail */}
              {racer.image ? (
                <img src={racer.image} alt={racer.name}
                  className={`w-6 h-8 object-cover rounded-sm flex-shrink-0 ring-1 ${
                    isWinner ? "ring-primary shadow-lg " + colors.glow : "ring-border/50"
                  }`}
                  loading="lazy" />
              ) : (
                <div className={`w-6 h-8 bg-muted rounded-sm flex-shrink-0 flex items-center justify-center ring-1 ring-border/50`}>
                  <Package className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              {/* Compact info */}
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-bold text-foreground truncate max-w-[60px] leading-tight">{racer.name}</span>
                <span className={`text-[8px] font-mono font-bold leading-tight ${racer.changePct >= 0 ? "text-primary" : "text-destructive"}`}>
                  {racer.changePct >= 0 ? "+" : ""}{racer.changePct.toFixed(1)}%
                </span>
              </div>

              {isWinner && <Crown className="w-3 h-3 text-primary animate-pulse flex-shrink-0" />}
            </div>

            {/* Left sidebar: rank + odds + bet */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center gap-1 px-1 z-30 bg-gradient-to-r from-card via-card/90 to-transparent w-20">
              <span className={`text-[9px] font-bold w-3 text-center ${
                rank === 1 ? "text-primary" : rank === 2 ? "text-amber-400" : "text-muted-foreground"
              }`}>{rank}</span>
              <span className="text-[8px] font-mono text-muted-foreground">{racer.odds}x</span>
              {canBet && (
                <Button
                  size="sm"
                  variant={hasBet ? "secondary" : "default"}
                  className="h-5 text-[8px] px-1.5 ml-auto"
                  onClick={() => onBet(racer)}
                  disabled={hasBet}
                >
                  {hasBet ? "✓" : "BET"}
                </Button>
              )}
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

      {/* Prizes — compact */}
      <div className="flex items-center justify-center gap-4 text-center py-1.5 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Medal className="w-3 h-3 text-primary" />
          <span className="text-[8px] text-muted-foreground">1st: 7d Pro</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400" />
          <span className="text-[8px] text-muted-foreground">Top 3: Badge</span>
        </div>
        <div className="flex items-center gap-1">
          <Crown className="w-3 h-3 text-purple-400" />
          <span className="text-[8px] text-muted-foreground">Daily: 14d Pro</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-destructive" />
          <span className="text-[8px] text-muted-foreground">Monthly: 1mo Pro</span>
        </div>
      </div>

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

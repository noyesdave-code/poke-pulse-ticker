import { useState, useEffect, useMemo } from "react";
import { usePokeRace, type Racer, type RaceState, type CycleState } from "@/hooks/usePokeRace";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import pokeRaceLogo from "@/assets/poke-race-brand.png";
import {
  Trophy, Timer, TrendingUp, Package, Coins, Flame,
  ChevronRight, Zap, Crown, Medal, Star, Clock
} from "lucide-react";

type MoverItem = { name: string; image: string; change: number; category: string; price: number };
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
  const isFrozen = cycle.phase === "freeze";
  const trackLabel = cycle.activeTrack === "price" ? "PRICE" : "INVENTORY";
  const nextTrack = cycle.activeTrack === "price" ? "INVENTORY" : "PRICE";

  return (
    <div className={`rounded-lg border p-2 sm:p-3 flex items-center justify-between gap-3 ${
      isRacing ? "border-primary/50 bg-primary/5"
        : isFrozen ? "border-emerald-500/50 bg-emerald-500/5"
        : "border-amber-500/50 bg-amber-500/5"
    }`}>
      <div className="flex items-center gap-2">
        {isRacing ? (
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        ) : isFrozen ? (
          <Trophy className="w-4 h-4 text-emerald-400" />
        ) : (
          <Clock className="w-4 h-4 text-amber-400" />
        )}
        <div>
          <p className="text-xs font-bold text-foreground">
            {isRacing
              ? `🏁 ${trackLabel} RACE — LIVE`
              : isFrozen
              ? `🏆 ${trackLabel} RACE — RESULTS`
              : `⏳ BETTING OPEN — ${nextTrack} RACE NEXT`}
          </p>
          <p className="text-[9px] text-muted-foreground">
            {isRacing
              ? "Cards racing for position • Watch & cheer!"
              : isFrozen
              ? "Race complete! Review the final standings."
              : "Place your bets before the next race starts!"}
          </p>
        </div>
      </div>
      <CountdownTimer
        ms={phaseTimeRemaining}
        label={isRacing ? "Race ends" : isFrozen ? "Results" : "Race starts"}
        variant={isRacing ? "accent" : "warning"}
      />
    </div>
  );
};

/* ─── Race Track ─── */
const laneColors = [
  { trail: "from-emerald-400 via-emerald-400/80 to-emerald-400/20", glow: "shadow-emerald-400/60", border: "border-emerald-400/50", solid: "bg-emerald-400" },
  { trail: "from-amber-400 via-amber-400/80 to-amber-400/20", glow: "shadow-amber-400/60", border: "border-amber-400/50", solid: "bg-amber-400" },
  { trail: "from-cyan-400 via-cyan-400/80 to-cyan-400/20", glow: "shadow-cyan-400/60", border: "border-cyan-400/50", solid: "bg-cyan-400" },
  { trail: "from-rose-400 via-rose-400/80 to-rose-400/20", glow: "shadow-rose-400/60", border: "border-rose-400/50", solid: "bg-rose-400" },
  { trail: "from-violet-400 via-violet-400/80 to-violet-400/20", glow: "shadow-violet-400/60", border: "border-violet-400/50", solid: "bg-violet-400" },
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

            {/* Racing trail — bright colored streak behind the card */}
            <div
              className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${colors.trail} transition-all ${isActive ? "duration-700" : "duration-300"} ease-out rounded-r`}
              style={{ width: `${Math.max(racer.position * 0.85, 2)}%`, opacity: isActive ? 0.7 : (race.status === "finished" ? 0.6 : 0.2) }}
            />
            {/* Bright core line */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 h-1 left-0 rounded-r ${colors.solid} transition-all ${isActive ? "duration-700" : "duration-300"} ease-out`}
              style={{ width: `${Math.max(racer.position * 0.85, 1)}%`, opacity: isActive ? 0.9 : (race.status === "finished" ? 0.7 : 0.1) }}
            />

            {/* Particle dots along trail */}
            {(isActive || race.status === "finished") && racer.position > 10 && (
              <>
                <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${colors.solid} opacity-80 ${isActive ? "animate-pulse" : ""}`}
                  style={{ left: `${racer.position * 0.85 - 6}%` }} />
                <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${colors.solid} opacity-50`}
                  style={{ left: `${racer.position * 0.85 - 12}%` }} />
              </>
            )}

            {/* Racer (card image + info) — positioned along track */}
            <div
              className={`absolute top-0 bottom-0 flex items-center gap-1 transition-all ${isActive ? "duration-700" : "duration-300"} ease-out z-20`}
              style={{ left: `${Math.min(racer.position * 0.85, 82)}%` }}
            >
              {/* Card thumbnail */}
              <img src={racer.image || "/icon-192.png"} alt={racer.name}
                className={`w-6 h-8 ${racer.image ? "object-cover" : "object-contain p-0.5 bg-muted"} rounded-sm flex-shrink-0 ring-1 ${
                  isWinner ? "ring-primary shadow-lg " + colors.glow : "ring-border/50"
                }`}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = '/icon-192.png'; (e.target as HTMLImageElement).style.objectFit = 'contain'; (e.target as HTMLImageElement).style.padding = '2px'; }} />

              {/* Compact info */}
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-bold text-foreground truncate max-w-[60px] leading-tight">{racer.name}</span>
                {race.status === "finished" ? (
                  <>
                    <span className="text-[8px] font-mono font-bold text-foreground leading-tight">
                      ${racer.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[7px] font-mono font-bold leading-tight ${racer.changePct >= 0 ? "text-primary" : "text-destructive"}`}>
                      {racer.changePct >= 0 ? "+" : ""}{racer.changePct.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <span className="text-[7px] font-mono text-muted-foreground leading-tight">racing…</span>
                )}
              </div>

              {isWinner && <Crown className="w-3 h-3 text-primary animate-pulse flex-shrink-0" />}
            </div>

            {/* Left sidebar: rank badge + odds + bet */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center gap-1 px-1 z-30 bg-gradient-to-r from-card via-card/90 to-transparent w-24">
              {/* Position badge — high visibility */}
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black flex-shrink-0 ring-2 ${
                rank === 1 ? `bg-yellow-400 text-yellow-950 ring-yellow-300 shadow-lg shadow-yellow-400/50` :
                rank === 2 ? "bg-slate-300 text-slate-900 ring-slate-200 shadow-md shadow-slate-300/40" :
                rank === 3 ? "bg-amber-600 text-amber-50 ring-amber-500 shadow-md shadow-amber-600/40" :
                "bg-muted/80 text-muted-foreground ring-border/50"
              }`}>
                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
              </span>
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
  items: { name: string; image: string | null; change: number; category: string; price: number }[];
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
          <img src={item.image || "/icon-192.png"} alt={item.name} className={`w-6 h-8 ${item.image ? "object-cover" : "object-contain p-0.5 bg-muted"} rounded`} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/icon-192.png'; }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold truncate">{item.name}</p>
            <Badge variant="outline" className="text-[8px] px-1 py-0">{item.category}</Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[10px] font-mono font-bold text-foreground block">
              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] font-mono font-bold ${item.change >= 0 ? "text-primary" : "text-destructive"}`}>
              {item.change >= 0 ? "▲+" : "▼"}{Math.abs(item.change).toFixed(1)}%
            </span>
          </div>
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

  const [moversSnapshot, setMoversSnapshot] = useState<{ price: MoverItem[]; inventory: MoverItem[] }>({ price: [], inventory: [] });

  const topPriceMoversRaw = useMemo<MoverItem[]>(() => {
    if (!priceRace) return [];
    return [...priceRace.racers]
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 5)
      .map(r => ({ name: r.name, image: r.image, change: r.changePct, category: r.category, price: r.currentValue }));
  }, [priceRace]);

  const topInventoryMoversRaw = useMemo<MoverItem[]>(() => {
    if (!inventoryRace) return [];
    return [...inventoryRace.racers]
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 5)
      .map(r => ({ name: r.name, image: r.image, change: r.changePct, category: r.category, price: r.currentValue }));
  }, [inventoryRace]);

  useEffect(() => {
    if (moversSnapshot.price.length === 0 && topPriceMoversRaw.length > 0) {
      setMoversSnapshot({ price: topPriceMoversRaw, inventory: topInventoryMoversRaw });
    }
    const interval = setInterval(() => {
      setMoversSnapshot({ price: topPriceMoversRaw, inventory: topInventoryMoversRaw });
    }, 60_000);
    return () => clearInterval(interval);
  }, [topPriceMoversRaw, topInventoryMoversRaw]);

  const topPriceMovers = moversSnapshot.price;
  const topInventoryMovers = moversSnapshot.inventory;

  const currentRace = cycle.activeTrack === "price" ? priceRace : inventoryRace;
  const isRacing = cycle.phase === "racing";
  const isFrozen = cycle.phase === "freeze";
  const isBetting = cycle.phase === "betting";

  return (
    <section className="space-y-2.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
      {/* Header — branded & compact */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={pokeRaceLogo} alt="Poké Race" className="h-8 sm:h-10 w-auto" loading="lazy" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-display font-black text-foreground tracking-tight">POKÉ RACE™</h2>
              <Badge variant="default" className={`text-[8px] px-1.5 h-4 ${isRacing ? "animate-pulse bg-primary/90" : isFrozen ? "bg-amber-500/90 animate-pulse" : "bg-amber-500/90"}`}>
                {isRacing ? "LIVE" : isFrozen ? "RESULTS" : "BETS OPEN"}
              </Badge>
            </div>
            <p className="text-[9px] text-muted-foreground leading-tight">
              2-min races • 1-min betting • Inventory ↔ Price
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <CountdownTimer ms={phaseMs} label={isRacing ? "Race ends" : isFrozen ? "Results" : "Next race"} variant={isRacing ? "accent" : "warning"} />
          <div className="text-right hidden sm:block">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Coins</p>
            <p className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> {wallet.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Phase Banner */}
      <PhaseBanner cycle={cycle} phaseTimeRemaining={phaseMs} />

      {/* Wager selector — compact row */}
      <div className={`flex items-center gap-1.5 flex-wrap rounded-lg px-2 py-1.5 transition-all ${
        isBetting ? "bg-amber-500/10 border border-amber-500/30" : "border border-transparent"
      }`}>
        <span className="text-[9px] text-muted-foreground font-semibold">WAGER:</span>
        {[50, 100, 250, 500].map(amount => (
          <Button
            key={amount}
            size="sm"
            variant={betWager === amount ? "default" : "outline"}
            className="h-5 text-[9px] px-1.5"
            onClick={() => setBetWager(amount)}
          >
            {amount} <Coins className="w-2 h-2 ml-0.5" />
          </Button>
        ))}
        <span className="sm:hidden text-[9px] font-mono text-amber-400 ml-auto flex items-center gap-0.5">
          <Coins className="w-2.5 h-2.5" /> {wallet.balance.toLocaleString()}
        </span>
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
          {isFrozen && <span className="text-[9px] text-emerald-400 font-bold">🏆 FINISHED</span>}
        </div>
        <RaceTrack
          race={currentRace}
          onBet={handleBet}
          userBets={userBets}
          isActive={isRacing || isFrozen}
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

      {/* Prizes — single compact line */}
      <div className="flex items-center justify-center gap-4 py-1.5 border-t border-border/30 text-[8px] text-muted-foreground">
        <span className="flex items-center gap-0.5"><Medal className="w-2.5 h-2.5 text-primary" /> 1st: 7d Pro</span>
        <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-amber-400" /> Top 3: Badge</span>
        <span className="flex items-center gap-0.5"><Crown className="w-2.5 h-2.5 text-purple-400" /> Daily: 14d Pro</span>
      </div>

      <p className="text-[7px] text-muted-foreground/50 text-center leading-relaxed">
        Poké Race™ — simulated entertainment. No real money wagered. Virtual coins have no cash value.
        © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
      </p>
    </section>
  );
};

export default PokeRaceSection;

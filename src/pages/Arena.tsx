import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useArena } from "@/hooks/useArena";
import TerminalHeader from "@/components/TerminalHeader";
import AuthModal from "@/components/AuthModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, TrendingUp, TrendingDown, Package, Trophy, Shield, AlertTriangle, Sparkles, Zap, Crown, Timer, Medal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArenaLeaderboard from "@/components/ArenaLeaderboard";

// Admin emails allowed to see GO LIVE switch
const ADMIN_EMAILS = ["david@poke-pulse-ticker.com", "demo@poke-pulse-ticker.com", "davidnoyes@me.com"];

const RARITY_COLORS: Record<string, string> = {
  common: "text-muted-foreground",
  uncommon: "text-blue-400",
  rare: "text-purple-400",
  ultra_rare: "text-amber-400",
  secret_rare: "text-pink-400",
  legendary: "text-primary",
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  ultra_rare: "Ultra Rare",
  secret_rare: "Secret Rare",
  legendary: "✨ LEGENDARY ✨",
};

const Arena = () => {
  const { user } = useAuth();
  const { wallet, bets, packHistory, tournaments, loading, tradableCards, placeBet, openPack, PACK_TYPES } = useArena();
  const [showAuth, setShowAuth] = useState(false);
  const [goLive, setGoLive] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [betPrediction, setBetPrediction] = useState<"up" | "down">("up");
  const [betWager, setBetWager] = useState(100);
  const [betDuration, setBetDuration] = useState<"1h" | "4h" | "24h">("1h");
  const [packResult, setPackResult] = useState<any[] | null>(null);
  const [openingPack, setOpeningPack] = useState(false);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const activeBets = useMemo(() => bets.filter(b => b.status === "active"), [bets]);
  const resolvedBets = useMemo(() => bets.filter(b => b.status !== "active"), [bets]);

  const handlePlaceBet = async () => {
    const card = tradableCards.find(c => (c._apiId ?? `${c.set}-${c.number}`) === selectedCard);
    if (!card) return;
    await placeBet(card, betPrediction, betWager, betDuration);
  };

  const handleOpenPack = async (packType: "standard" | "premium" | "ultra") => {
    setOpeningPack(true);
    setPackResult(null);
    // Fake suspense
    await new Promise(r => setTimeout(r, 1200));
    const result = await openPack(packType);
    setPackResult(result);
    setOpeningPack(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">POKE-PULSE ARENA™</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            The Pokémon TCG Casino
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Bet on card price movements, open virtual packs, and compete in prediction tournaments — all powered by live market data from our 3 indexes.
          </p>
          <Button onClick={() => setShowAuth(true)} size="lg" className="font-bold">
            Sign In to Play
          </Button>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header + Wallet */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">POKE-PULSE ARENA™</h1>
              <Badge variant="outline" className="text-primary border-primary/40">BETA</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Virtual currency gaming • Not real money • For entertainment only</p>
          </div>

          <Card className="bg-card border-primary/30 w-full sm:w-auto">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-xs text-muted-foreground">PokéCoins</p>
                  <p className="text-xl font-black text-foreground">{wallet?.balance.toLocaleString() ?? "—"}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Won: <span className="text-primary font-bold">{wallet?.lifetime_won.toLocaleString()}</span></p>
                <p>Wagered: <span className="text-foreground font-bold">{wallet?.lifetime_wagered.toLocaleString()}</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GO LIVE switch — admin only */}
        {isAdmin && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-bold text-destructive">REAL MONEY MODE</p>
                  <p className="text-xs text-muted-foreground">Admin only • Requires 3rd-party prize partner & legal review</p>
                </div>
              </div>
              <button
                onClick={() => setGoLive(!goLive)}
                className={`relative w-14 h-7 rounded-full transition-colors ${goLive ? "bg-destructive" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${goLive ? "translate-x-7" : "translate-x-0.5"}`} />
              </button>
            </CardContent>
          </Card>
        )}

        {goLive && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-xs text-destructive space-y-1">
              <p className="font-bold">⚠️ REAL MONEY MODE ENABLED (DEMO ONLY)</p>
              <p>This mode is for investor demonstrations only. Real-money gambling requires state/federal gaming licenses, KYC/AML compliance, and a licensed 3rd-party prize partner. Contact legal@poke-pulse-ticker.com before activating in production.</p>
            </div>
          </div>
        )}

        {/* Legal disclaimer */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2">
          <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>LEGAL NOTICE:</strong> Poke-Pulse Arena™ uses virtual PokéCoins with no real-world monetary value. All prizes are internal app features (subscription credits, badges, early access). This is a skill-based prediction game, not regulated gambling. Must be 13+ to play. Void where prohibited. © {new Date().getFullYear()} PGVA Ventures, LLC. Patent pending.
          </p>
        </div>

        {/* Game Tabs */}
        <Tabs defaultValue="predictions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="predictions" className="flex items-center gap-2 text-xs font-bold">
              <TrendingUp className="w-4 h-4" /> Price Bets
            </TabsTrigger>
            <TabsTrigger value="packs" className="flex items-center gap-2 text-xs font-bold">
              <Package className="w-4 h-4" /> Pack Lottery
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="flex items-center gap-2 text-xs font-bold">
              <Trophy className="w-4 h-4" /> Tournaments
            </TabsTrigger>
          </TabsList>

          {/* ===== PRICE PREDICTIONS ===== */}
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Place a Price Prediction Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Select Card</label>
                    <Select value={selectedCard} onValueChange={setSelectedCard}>
                      <SelectTrigger><SelectValue placeholder="Choose a card..." /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {tradableCards.map(c => {
                          const id = c._apiId ?? `${c.set}-${c.number}`;
                          return (
                            <SelectItem key={id} value={id}>
                              {c.name} — ${c.market.toFixed(2)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Prediction</label>
                    <div className="flex gap-2">
                      <Button
                        variant={betPrediction === "up" ? "default" : "outline"}
                        onClick={() => setBetPrediction("up")}
                        className="flex-1 gap-1"
                      >
                        <TrendingUp className="w-4 h-4" /> UP
                      </Button>
                      <Button
                        variant={betPrediction === "down" ? "destructive" : "outline"}
                        onClick={() => setBetPrediction("down")}
                        className="flex-1 gap-1"
                      >
                        <TrendingDown className="w-4 h-4" /> DOWN
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Wager (PokéCoins)</label>
                    <div className="flex gap-1">
                      {[100, 500, 1000, 5000].map(amt => (
                        <Button
                          key={amt}
                          variant={betWager === amt ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBetWager(amt)}
                          className="flex-1 text-xs"
                        >
                          {amt >= 1000 ? `${amt/1000}K` : amt}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Duration</label>
                    <div className="flex gap-1">
                      {(["1h", "4h", "24h"] as const).map(d => (
                        <Button
                          key={d}
                          variant={betDuration === d ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBetDuration(d)}
                          className="flex-1 text-xs"
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handlePlaceBet}
                      disabled={!selectedCard || betWager > (wallet?.balance ?? 0)}
                      className="w-full font-bold gap-2"
                    >
                      <Coins className="w-4 h-4" />
                      Place Bet ({betWager.toLocaleString()})
                    </Button>
                  </div>
                </div>

                {selectedCard && (
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2">
                    Odds: <span className="text-primary font-bold">{betDuration === "1h" ? "1.95x" : betDuration === "4h" ? "2.5x" : "3.5x"}</span>
                    {" • "}Potential win: <span className="text-primary font-bold">{Math.round(betWager * (betDuration === "1h" ? 1.95 : betDuration === "4h" ? 2.5 : 3.5)).toLocaleString()} PokéCoins</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Bets */}
            {activeBets.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm">🔴 Active Bets ({activeBets.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {activeBets.map(bet => (
                    <div key={bet.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-3">
                        {bet.card_image && <img src={bet.card_image} alt="" className="w-8 h-11 rounded object-cover" />}
                        <div>
                          <p className="text-xs font-bold">{bet.card_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {bet.prediction === "up" ? "📈 UP" : "📉 DOWN"} • {bet.wager.toLocaleString()} PC • {bet.odds}x
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                          <Timer className="w-3 h-3 mr-1" />
                          {new Date(bet.resolves_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Resolved Bets */}
            {resolvedBets.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm">📋 Bet History</CardTitle></CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {resolvedBets.slice(0, 20).map(bet => (
                    <div key={bet.id} className={`flex items-center justify-between p-2 rounded-lg border ${bet.status === "won" ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
                      <div className="text-xs">
                        <span className="font-bold">{bet.card_name}</span>
                        <span className="text-muted-foreground"> • {bet.prediction === "up" ? "UP" : "DOWN"} • {bet.wager.toLocaleString()}</span>
                      </div>
                      <Badge variant={bet.status === "won" ? "default" : "destructive"} className="text-[10px]">
                        {bet.status === "won" ? `+${bet.payout?.toLocaleString()}` : "LOST"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== PACK LOTTERY ===== */}
          <TabsContent value="packs" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.entries(PACK_TYPES) as [string, { cost: number; cards: number; label: string }][]).map(([key, pack]) => (
                <Card key={key} className={`cursor-pointer transition-all hover:border-primary/50 ${key === "ultra" ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-5 text-center space-y-3">
                    <div className="text-3xl">
                      {key === "standard" ? "📦" : key === "premium" ? "🎁" : "👑"}
                    </div>
                    <h3 className="text-sm font-black uppercase">{pack.label}</h3>
                    <p className="text-xs text-muted-foreground">{pack.cards} cards per pack</p>
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span className="text-lg font-black">{pack.cost.toLocaleString()}</span>
                    </div>
                    <Button
                      onClick={() => handleOpenPack(key as any)}
                      disabled={openingPack || (wallet?.balance ?? 0) < pack.cost}
                      className="w-full font-bold"
                      variant={key === "ultra" ? "default" : "outline"}
                    >
                      {openingPack ? "Opening..." : "Open Pack"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pack opening animation */}
            <AnimatePresence>
              {openingPack && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-6xl"
                  >
                    📦
                  </motion.div>
                  <p className="text-sm font-bold text-primary mt-4 animate-pulse">Opening pack...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pack result */}
            <AnimatePresence>
              {packResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Pack Results!
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {packResult.map((card, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, rotateY: 180 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.4 }}
                            className="text-center space-y-1"
                          >
                            {card.image ? (
                              <img src={card.image} alt={card.name} className="w-full rounded-lg shadow-lg" />
                            ) : (
                              <div className="w-full aspect-[2.5/3.5] bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                                {card.name}
                              </div>
                            )}
                            <p className={`text-[10px] font-bold ${RARITY_COLORS[card.rarity] || "text-foreground"}`}>
                              {RARITY_LABELS[card.rarity] || card.rarity}
                            </p>
                            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                              <Coins className="w-3 h-3 text-amber-400" /> {card.value.toLocaleString()}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm font-bold text-foreground">
                          Total Value: <span className="text-primary">{packResult.reduce((s: number, c: any) => s + c.value, 0).toLocaleString()} PokéCoins</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pack history */}
            {packHistory.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm">📋 Pack History</CardTitle></CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                  {packHistory.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-xs">
                      <span className="font-bold capitalize">{p.pack_type} Pack</span>
                      <span className="text-muted-foreground">-{p.cost.toLocaleString()} → <span className={p.total_value > p.cost ? "text-primary" : "text-destructive"}>+{p.total_value.toLocaleString()}</span></span>
                      {p.rarity_hit && <Badge variant="outline" className="text-[9px]">{RARITY_LABELS[p.rarity_hit]}</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== TOURNAMENTS ===== */}
          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Prediction Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournaments.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No tournaments available yet</p>
                    <p className="text-xs text-muted-foreground">Check back soon — weekly tournaments launching this season!</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-bold text-foreground">🏆 Weekly Prediction Cup</p>
                          <p className="text-xs text-muted-foreground mt-1">Best prediction accuracy wins</p>
                          <p className="text-xs text-primary mt-2 font-bold">Prize: 1 Month Pro Subscription</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-bold text-foreground">📈 Bull Market Challenge</p>
                          <p className="text-xs text-muted-foreground mt-1">Most profitable predictions</p>
                          <p className="text-xs text-primary mt-2 font-bold">Prize: Premium Badge + 50K PC</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-bold text-foreground">🎯 Sniper Season</p>
                          <p className="text-xs text-muted-foreground mt-1">Predict exact price targets</p>
                          <p className="text-xs text-primary mt-2 font-bold">Prize: 3 Month Premium Access</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  tournaments.map(t => (
                    <div key={t.id} className="p-4 rounded-lg border border-border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">{t.name}</h4>
                        <Badge variant={t.status === "active" ? "default" : "outline"}>{t.status}</Badge>
                      </div>
                      {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Entry: {t.entry_cost.toLocaleString()} PC</span>
                        <span>Prize Pool: {t.prize_pool.toLocaleString()} PC</span>
                        <span>Players: {t.current_entries}/{t.max_entries}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Prize info */}
            <Card className="border-primary/20">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Prize Tiers (Internal Rewards)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="text-primary font-bold w-8">🥇</span>
                      <span>Free Premium subscription (1-3 months)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="text-primary font-bold w-8">🥈</span>
                      <span>Free Pro subscription (1 month)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="text-primary font-bold w-8">🥉</span>
                      <span>50,000 bonus PokéCoins</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="w-8">🏅</span>
                      <span>Exclusive profile badges & titles</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="w-8">🔓</span>
                      <span>Early access to new features</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <span className="w-8">📊</span>
                      <span>Leaderboard Hall of Fame placement</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  * Physical Pokémon card prizes will be available when a licensed 3rd-party prize partner is onboarded.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer disclaimer */}
        <div className="border-t border-border pt-6 pb-4 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <strong>RESPONSIBLE GAMING:</strong> Poke-Pulse Arena™ is an entertainment feature using virtual currency (PokéCoins) with no real-world value. PokéCoins cannot be redeemed, transferred, or exchanged for real currency. All odds are transparent and provably fair. If you feel you have a gambling problem, please visit <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ncpgambling.org</a> or call 1-800-522-4700.
          </p>
          <p className="text-[9px] text-muted-foreground">
            © {new Date().getFullYear()} PGVA Ventures, LLC / Noyes Family Trust. Patent pending. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Arena;

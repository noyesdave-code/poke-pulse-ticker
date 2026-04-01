import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Swords, TrendingUp, TrendingDown, Coins, Timer, Crown, Users, Zap, Shield, MessageCircle, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ArenaChat from "./ArenaChat";
import DuelVideoChat from "./DuelVideoChat";

interface TradableCard {
  name: string;
  set: string;
  number: string;
  market: number;
  _apiId?: string;
  imageSmall?: string;
}

interface Duel {
  id: string;
  challenger_id: string;
  opponent_id: string | null;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_image: string | null;
  challenger_prediction: string;
  snapshot_price: number;
  wager: number;
  status: string;
  resolves_at: string;
  resolved_price: number | null;
  winner_id: string | null;
  created_at: string;
  accepted_at: string | null;
  resolved_at: string | null;
}

interface Props {
  tradableCards: TradableCard[];
  walletBalance: number;
  onBalanceChange?: () => void;
}

const WAGER_OPTIONS = [250, 500, 1000, 2500, 5000];
const DURATION_OPTIONS = [
  { label: "1h", value: 1 },
  { label: "4h", value: 4 },
  { label: "24h", value: 24 },
];

export default function PredictionDuels({ tradableCards, walletBalance, onBalanceChange }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [chatDuelId, setChatDuelId] = useState<string | null>(null);
  const [videoDuelId, setVideoDuelId] = useState<string | null>(null);

  // Create form state
  const [selectedCard, setSelectedCard] = useState("");
  const [prediction, setPrediction] = useState<"up" | "down">("up");
  const [wager, setWager] = useState(500);
  const [duration, setDuration] = useState(1);

  const fetchDuels = async () => {
    const { data } = await supabase
      .from("prediction_duels" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setDuels(data as unknown as Duel[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDuels();
    const channel = supabase
      .channel("duels-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "prediction_duels" }, () => {
        fetchDuels();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const createDuel = async () => {
    if (!user || !selectedCard) return;
    const card = tradableCards.find(c => (c._apiId ?? `${c.set}-${c.number}`) === selectedCard);
    if (!card) return;
    if (wager > walletBalance) {
      toast({ title: "Insufficient PokéCoins", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      // Deduct wager from wallet
      const { error: walletErr } = await supabase
        .from("arena_wallets")
        .update({
          balance: walletBalance - wager,
          lifetime_wagered: (walletBalance + wager), // approximate
        })
        .eq("user_id", user.id);
      if (walletErr) throw walletErr;

      const resolves = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from("prediction_duels" as any).insert({
        challenger_id: user.id,
        card_api_id: card._apiId ?? `${card.set}-${card.number}`,
        card_name: card.name,
        card_set: card.set,
        card_image: card.imageSmall || null,
        challenger_prediction: prediction,
        snapshot_price: card.market,
        wager,
        resolves_at: resolves,
      } as any);
      if (error) throw error;
      toast({ title: "⚔️ Duel created!", description: "Waiting for an opponent..." });
      setSelectedCard("");
      onBalanceChange?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const acceptDuel = async (duel: Duel) => {
    if (!user) return;
    if (duel.challenger_id === user.id) {
      toast({ title: "Can't accept your own duel", variant: "destructive" });
      return;
    }
    if (duel.wager > walletBalance) {
      toast({ title: "Insufficient PokéCoins", variant: "destructive" });
      return;
    }
    try {
      // Deduct wager
      await supabase
        .from("arena_wallets")
        .update({ balance: walletBalance - duel.wager })
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("prediction_duels" as any)
        .update({
          opponent_id: user.id,
          status: "active",
          accepted_at: new Date().toISOString(),
        } as any)
        .eq("id", duel.id);
      if (error) throw error;
      toast({ title: "⚔️ Duel accepted!", description: "May the best predictor win!" });
      onBalanceChange?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openDuels = duels.filter(d => d.status === "open" && d.challenger_id !== user?.id);
  const myDuels = duels.filter(d => d.challenger_id === user?.id || d.opponent_id === user?.id);
  const activeDuels = myDuels.filter(d => d.status === "active" || d.status === "open");
  const resolvedDuels = myDuels.filter(d => d.status === "resolved");

  return (
    <div className="space-y-4">
      {/* Duel Encouragement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <Swords className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-foreground">⚔️ Challenge a Rival Collector!</p>
            <p className="text-xs text-muted-foreground">
              Pick a card, predict its price movement, and put your PokéCoins on the line.
              Winner takes the full 2x pot. The more you duel, the faster you climb the ranks!
            </p>
          </div>
          <Badge variant="default" className="text-[10px] font-bold animate-pulse shrink-0">
            2x PAYOUT
          </Badge>
        </div>
      </motion.div>

      {/* Create Duel */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" />
            Create a 1v1 Prediction Duel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Card to Predict</label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger><SelectValue placeholder="Choose a card..." /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {tradableCards.map(c => {
                    const id = c._apiId ?? `${c.set}-${c.number}`;
                    return <SelectItem key={id} value={id}>{c.name} — ${c.market.toFixed(2)}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Your Prediction</label>
              <div className="flex gap-2">
                <Button variant={prediction === "up" ? "default" : "outline"} onClick={() => setPrediction("up")} className="flex-1 gap-1">
                  <TrendingUp className="w-4 h-4" /> UP
                </Button>
                <Button variant={prediction === "down" ? "destructive" : "outline"} onClick={() => setPrediction("down")} className="flex-1 gap-1">
                  <TrendingDown className="w-4 h-4" /> DOWN
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Wager (PokéCoins)</label>
              <div className="flex flex-wrap gap-1">
                {WAGER_OPTIONS.map(w => (
                  <Button key={w} variant={wager === w ? "default" : "outline"} size="sm" onClick={() => setWager(w)} className="text-xs">
                    {w >= 1000 ? `${w/1000}K` : w}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Duration</label>
              <div className="flex gap-1">
                {DURATION_OPTIONS.map(d => (
                  <Button key={d.value} variant={duration === d.value ? "default" : "outline"} size="sm" onClick={() => setDuration(d.value)} className="flex-1 text-xs">
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={createDuel} disabled={!selectedCard || wager > walletBalance || creating} className="w-full font-bold gap-2">
                <Swords className="w-4 h-4" /> Challenge ({wager.toLocaleString()} PC)
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2 flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Winner takes the full pot (2x wager). Opponent picks the opposite prediction. If price stays flat (±0.5%), both get refunded.
          </div>
        </CardContent>
      </Card>

      {/* Open Duels Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Open Challenges ({openDuels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {openDuels.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No open duels — create one above!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {openDuels.map(duel => (
                  <motion.div
                    key={duel.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      {duel.card_image && <img src={duel.card_image} alt="" className="w-8 h-11 rounded object-cover" />}
                      <div>
                        <p className="text-xs font-bold text-foreground">{duel.card_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {duel.challenger_prediction === "up" ? "📈 Challenger says UP" : "📉 Challenger says DOWN"}
                          {" • "}{duel.wager.toLocaleString()} PC each
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="default" className="text-xs font-bold gap-1" onClick={() => acceptDuel(duel)}>
                      <Swords className="w-3 h-3" /> Accept
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Active Duels */}
      {activeDuels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              My Active Duels ({activeDuels.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeDuels.map(duel => (
              <div key={duel.id} className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/20">
                  <div className="flex items-center gap-3">
                    {duel.card_image && <img src={duel.card_image} alt="" className="w-8 h-11 rounded object-cover" />}
                    <div>
                      <p className="text-xs font-bold">{duel.card_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {duel.challenger_id === user?.id ? "You" : "Opponent"}: {duel.challenger_prediction === "up" ? "📈 UP" : "📉 DOWN"}
                        {" • "}{duel.wager.toLocaleString()} PC each
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={duel.status === "open" ? "secondary" : "outline"} className="text-[10px]">
                      {duel.status === "open" ? "⏳ Waiting" : (
                        <><Timer className="w-3 h-3 mr-1 inline" />{new Date(duel.resolves_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
                      )}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground">Pot: {(duel.wager * 2).toLocaleString()} PC</p>
                    {duel.status === "active" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[10px] gap-1 h-6"
                          onClick={() => setChatDuelId(chatDuelId === duel.id ? null : duel.id)}
                        >
                          <MessageCircle className="w-3 h-3" />
                          {chatDuelId === duel.id ? "Hide" : "Chat"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[10px] gap-1 h-6"
                          onClick={() => setVideoDuelId(videoDuelId === duel.id ? null : duel.id)}
                        >
                          <Video className="w-3 h-3" />
                          {videoDuelId === duel.id ? "Hide" : "Video"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {chatDuelId === duel.id && (
                  <ArenaChat channel={`duel-${duel.id}`} title="Duel Chat" />
                )}
                {videoDuelId === duel.id && (
                  <DuelVideoChat duelId={duel.id} onClose={() => setVideoDuelId(null)} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resolved Duels */}
      {resolvedDuels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⚔️ Duel History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {resolvedDuels.slice(0, 10).map(duel => {
              const won = duel.winner_id === user?.id;
              return (
                <div key={duel.id} className={`flex items-center justify-between p-2 rounded-lg border ${won ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
                  <div className="flex items-center gap-2">
                    {won && <Crown className="w-4 h-4 text-amber-400" />}
                    <div>
                      <p className="text-xs font-bold">{duel.card_name}</p>
                      <p className="text-[10px] text-muted-foreground">${duel.snapshot_price.toFixed(2)} → ${duel.resolved_price?.toFixed(2)}</p>
                    </div>
                  </div>
                  <Badge variant={won ? "default" : "destructive"} className="text-[10px]">
                    {won ? `+${duel.wager.toLocaleString()} PC` : `-${duel.wager.toLocaleString()} PC`}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

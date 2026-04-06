import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Crown, Trophy, Users } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  lifetime_won: number;
  lifetime_wagered: number;
  display_name: string | null;
}

interface LiveTrader {
  user_id: string;
  display_name: string | null;
  total_portfolio_value: number;
  starting_balance: number;
  pnlPct: number;
}

const RANK_ICONS = ["👑", "🥈", "🥉"];
const RANK_COLORS = ["text-amber-400", "text-slate-300", "text-amber-600"];

const ArenaLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [liveTraders, setLiveTraders] = useState<LiveTrader[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"arena" | "live">("arena");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      // Fetch arena wallet leaderboard
      const { data: wallets } = await (supabase.from("unified_wallets") as any)
        .select("user_id, lifetime_won, lifetime_wagered")
        .order("lifetime_won", { ascending: false })
        .limit(50);

      if (wallets && wallets.length > 0) {
        const userIds = wallets.map((w: any) => w.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds);

        const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p.display_name]));

        setEntries(wallets.map((w: any) => ({
          ...w,
          display_name: profileMap.get(w.user_id) || null,
        })));
      }

      // Fetch live SimTrader portfolios
      const { data: portfolios } = await supabase
        .from("trader_portfolios")
        .select("user_id, total_portfolio_value, starting_balance")
        .eq("is_active", true)
        .order("total_portfolio_value", { ascending: false })
        .limit(50);

      if (portfolios && portfolios.length > 0) {
        const traderIds = portfolios.map((p: any) => p.user_id);
        const { data: traderProfiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", traderIds);

        const traderProfileMap = new Map((traderProfiles ?? []).map((p: any) => [p.id, p.display_name]));

        setLiveTraders(portfolios.map((p: any) => ({
          ...p,
          display_name: traderProfileMap.get(p.user_id) || null,
          pnlPct: ((p.total_portfolio_value - p.starting_balance) / p.starting_balance) * 100,
        })));
      }

      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const formatName = (entry: LeaderboardEntry | LiveTrader) => {
    if (entry.display_name) return entry.display_name;
    return `Player ${entry.user_id.slice(0, 6)}`;
  };

  const winRate = (entry: LeaderboardEntry) => {
    if (entry.lifetime_wagered === 0) return 0;
    return Math.round((entry.lifetime_won / entry.lifetime_wagered) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setTab("arena")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === "arena" ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            <Coins className="w-3 h-3" /> Arena Rankings
          </button>
          <button
            onClick={() => setTab("live")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === "live" ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            <Users className="w-3 h-3" /> Live PvP
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-live" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : tab === "arena" ? (
          // Arena wallet leaderboard
          entries.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Trophy className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No arena players yet — be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    i === 0 ? "border-primary/40 bg-primary/5" :
                    i === 1 ? "border-muted-foreground/30 bg-muted/20" :
                    i === 2 ? "border-accent/30 bg-accent/5" :
                    "border-border bg-muted/20"
                  }`}
                >
                  <div className="w-8 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-lg">{RANK_ICONS[i]}</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${i < 3 ? RANK_COLORS[i] : "text-foreground"}`}>
                      {formatName(entry)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Win rate: {winRate(entry)}% • Wagered: {entry.lifetime_wagered.toLocaleString()} PC
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Coins className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-black text-foreground">
                        {entry.lifetime_won.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">total won</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Live PvP leaderboard
          liveTraders.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Users className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No live traders yet — start trading in SimTrader World!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="h-2 w-2 rounded-full bg-primary pulse-live" />
                <span className="text-[10px] font-bold text-primary">LIVE RANKINGS</span>
                <span className="text-[10px] text-muted-foreground">• {liveTraders.length} active traders</span>
              </div>
              {liveTraders.map((trader, i) => (
                <div
                  key={trader.user_id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    i === 0 ? "border-primary/40 bg-primary/5" :
                    i === 1 ? "border-muted-foreground/30 bg-muted/20" :
                    i === 2 ? "border-accent/30 bg-accent/5" :
                    "border-border bg-muted/20"
                  }`}
                >
                  <div className="w-8 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-lg">{RANK_ICONS[i]}</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-sm font-bold truncate ${i < 3 ? RANK_COLORS[i] : "text-foreground"}`}>
                        {formatName(trader)}
                      </p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400">LIVE</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Portfolio: ${trader.total_portfolio_value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-black ${trader.pnlPct >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {trader.pnlPct >= 0 ? "+" : ""}{trader.pnlPct.toFixed(2)}%
                    </span>
                    <p className="text-[10px] text-muted-foreground">P&L</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ArenaLeaderboard;

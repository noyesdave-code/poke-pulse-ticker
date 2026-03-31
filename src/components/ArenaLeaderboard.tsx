import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Crown, Medal, Trophy } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  lifetime_won: number;
  lifetime_wagered: number;
  display_name: string | null;
  avatar_url: string | null;
}

const RANK_ICONS = ["👑", "🥈", "🥉"];
const RANK_COLORS = ["text-amber-400", "text-slate-300", "text-amber-600"];

const ArenaLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"lifetime_won" | "balance">("lifetime_won");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      // Get wallets
      const { data: wallets } = await (supabase.from("arena_wallets") as any)
        .select("user_id, balance, lifetime_won, lifetime_wagered")
        .order(sortBy, { ascending: false })
        .limit(50);

      if (!wallets || wallets.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Get display names from profiles
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
      setLoading(false);
    };
    fetch();
  }, [sortBy]);

  const formatName = (entry: LeaderboardEntry) => {
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Arena Leaderboard
          </CardTitle>
          <div className="flex gap-1">
            <button
              onClick={() => setSortBy("lifetime_won")}
              className={`text-[10px] px-2 py-1 rounded font-bold transition-colors ${sortBy === "lifetime_won" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              Total Won
            </button>
            <button
              onClick={() => setSortBy("balance")}
              className={`text-[10px] px-2 py-1 rounded font-bold transition-colors ${sortBy === "balance" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              Balance
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Trophy className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No players yet — be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  i === 0 ? "border-amber-400/40 bg-amber-400/5" :
                  i === 1 ? "border-slate-400/30 bg-slate-400/5" :
                  i === 2 ? "border-amber-600/30 bg-amber-600/5" :
                  "border-border bg-muted/20"
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-lg">{RANK_ICONS[i]}</span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${i < 3 ? RANK_COLORS[i] : "text-foreground"}`}>
                    {formatName(entry)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Win rate: {winRate(entry)}% • Wagered: {entry.lifetime_wagered.toLocaleString()} PC
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-sm font-black text-foreground">
                      {sortBy === "lifetime_won"
                        ? entry.lifetime_won.toLocaleString()
                        : entry.balance.toLocaleString()
                      }
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {sortBy === "lifetime_won" ? "total won" : "balance"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArenaLeaderboard;

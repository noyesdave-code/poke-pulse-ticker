import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointerClick, DollarSign, TrendingUp, ExternalLink } from "lucide-react";
import { useMemo } from "react";

const CPC_RATES: Record<string, number> = { tcgplayer: 0.08, ebay: 0.12 };
const PARTNER_LABELS: Record<string, string> = { tcgplayer: "TCGPlayer", ebay: "eBay" };

interface ClickRow {
  partner: string;
  card_name: string | null;
  card_set: string | null;
  clicked_at: string;
}

const AffiliateAnalytics = () => {
  const { data: clicks, isLoading } = useQuery({
    queryKey: ["affiliate-clicks-analytics"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data, error } = await supabase
        .from("affiliate_clicks")
        .select("partner, card_name, card_set, clicked_at")
        .gte("clicked_at", thirtyDaysAgo)
        .order("clicked_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data || []) as ClickRow[];
    },
    refetchInterval: 30000,
  });

  const stats = useMemo(() => {
    if (!clicks) return null;

    const byPartner: Record<string, number> = {};
    const byCard: Record<string, { name: string; set: string | null; count: number }> = {};
    const byDay: Record<string, number> = {};

    clicks.forEach((c) => {
      byPartner[c.partner] = (byPartner[c.partner] || 0) + 1;

      if (c.card_name) {
        const key = c.card_name;
        if (!byCard[key]) byCard[key] = { name: c.card_name, set: c.card_set, count: 0 };
        byCard[key].count++;
      }

      const day = c.clicked_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    const totalClicks = clicks.length;
    const estimatedRevenue = Object.entries(byPartner).reduce(
      (sum, [partner, count]) => sum + count * (CPC_RATES[partner] || 0.05), 0
    );

    const topCards = Object.values(byCard).sort((a, b) => b.count - a.count).slice(0, 10);

    const last7 = Object.entries(byDay)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7)
      .reverse();

    return { totalClicks, estimatedRevenue, byPartner, topCards, last7 };
  }, [clicks]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats || stats.totalClicks === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6 text-center">
          <MousePointerClick className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-mono text-sm text-muted-foreground">No affiliate clicks in the last 30 days</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            Clicks are tracked when users visit TCGPlayer or eBay via card links
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxBarValue = Math.max(...stats.last7.map(([, v]) => v), 1);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Total Clicks (30d)</span>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">{stats.totalClicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-terminal-green" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Est. Revenue (30d)</span>
            </div>
            <p className="font-mono text-2xl font-bold text-terminal-green">${stats.estimatedRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Avg CPC</span>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">
              ${(stats.estimatedRevenue / stats.totalClicks).toFixed(3)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partner Breakdown + Daily Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Partner */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              Clicks by Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.byPartner)
              .sort(([, a], [, b]) => b - a)
              .map(([partner, count]) => {
                const pct = (count / stats.totalClicks) * 100;
                const rev = count * (CPC_RATES[partner] || 0.05);
                return (
                  <div key={partner}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-semibold">{PARTNER_LABELS[partner] || partner}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{count} clicks</span>
                        <Badge className="font-mono text-[9px] bg-terminal-green/20 text-terminal-green border-terminal-green/30">
                          ${rev.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Daily Trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Daily Clicks (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {stats.last7.map(([day, count]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-muted-foreground">{count}</span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all min-h-[4px]"
                    style={{ height: `${(count / maxBarValue) * 100}%` }}
                  />
                  <span className="font-mono text-[8px] text-muted-foreground">
                    {new Date(day + "T12:00:00Z").toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clicked Cards */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
            <MousePointerClick className="h-3.5 w-3.5 text-primary" />
            Top Clicked Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topCards.map((card, i) => (
              <div key={card.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/30">
                <span className="font-mono text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold truncate">{card.name}</p>
                  {card.set && (
                    <p className="font-mono text-[9px] text-muted-foreground truncate">{card.set}</p>
                  )}
                </div>
                <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                  {card.count} click{card.count !== 1 ? "s" : ""}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateAnalytics;

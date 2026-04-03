import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TerminalHeader from "@/components/TerminalHeader";
import ShareButton from "@/components/ShareButton";
import {
  DollarSign, Target, TrendingUp, Zap, Trophy, ShoppingCart,
  Users, MousePointerClick, Gamepad2, Swords, CheckCircle2, Clock,
  ArrowUpRight, Flame
} from "lucide-react";

interface DayPlan {
  day: number;
  title: string;
  target: number;
  streams: { name: string; target: number; icon: React.ReactNode; actions: string[] }[];
}

const CAMPAIGN_GOAL = 25000;

const DAYS: DayPlan[] = [
  {
    day: 1, title: "Launch & Conversion Blitz", target: 4200,
    streams: [
      { name: "Subscriptions", target: 2000, icon: <Users className="w-4 h-4" />, actions: [
        "Email blast to trial users expiring in 48hrs — 40% off Pro ($2.99)",
        "Push notification to all users about limited-time pricing",
        "Deploy ValueUnlockPreview on dashboard showing blurred Alpha Signals",
      ]},
      { name: "Affiliates", target: 800, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "Publish '10 Most Undervalued Cards' blog with TCGPlayer/eBay links",
        "Share across Reddit r/PokemonTCG, r/pokemoncards — target 8K+ clicks",
      ]},
      { name: "PokéCoins", target: 800, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Launch 2X PokéCoin Bonus — all packs double for 48hrs",
        "Push banner on landing page + in-app notification",
      ]},
      { name: "SimTrader", target: 400, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Announce Capital Sprint Tournament — $500 prize pool, $4.99 entry",
        "FOMO counter: '48 spots remaining'",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "Open 'High Stakes Week' with boosted odds and doubled payouts",
      ]},
    ],
  },
  {
    day: 2, title: "Content & Affiliate Push", target: 3800,
    streams: [
      { name: "Affiliates", target: 1500, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "YouTube: 'I Found $500 Cards for $50' — affiliate links in description",
        "Cross-post clips to TikTok/Instagram @pokegarageva — target 15K+ clicks",
      ]},
      { name: "Subscriptions", target: 1200, icon: <Users className="w-4 h-4" />, actions: [
        "Alpha Signals Preview — 3 free signals with blurred premium data",
        "Exit-intent popup: Pro trial extension for immediate upgrade",
      ]},
      { name: "PokéCoins", target: 600, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Mystery Pack — $9.99 bundle with guaranteed rare pull, limited to 100",
      ]},
      { name: "SimTrader", target: 300, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Leaderboard update email showing ranking + Pro feature benefits",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "'Predict the Market' daily challenge with PokéCoin prizes",
      ]},
    ],
  },
  {
    day: 3, title: "Whale Targeting & Upsell", target: 4500,
    streams: [
      { name: "Subscriptions", target: 2500, icon: <Users className="w-4 h-4" />, actions: [
        "Direct outreach to power users (>50 cards, >10 trades/week)",
        "Personalized email with unrealized portfolio gains — target Whale tier",
      ]},
      { name: "Affiliates", target: 800, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "Prismatic Evolutions Price Guide with affiliate links on every card",
      ]},
      { name: "PokéCoins", target: 700, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Flash sale: 75K PokéCoin Whale Pack at $39.99 (normally $49.99)",
      ]},
      { name: "SimTrader", target: 300, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Unlock 'After-Hours Trading' exclusively for Pro+ subscribers",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "Double tournament prize pools — require Arena Access ($0.99) minimum",
      ]},
    ],
  },
  {
    day: 4, title: "Social Media Blitz", target: 3200,
    streams: [
      { name: "Affiliates", target: 1200, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "Buffer multi-platform launch: YouTube, TikTok, Instagram, Reddit",
        "Grand Launch × Social Highlight video with UTM-tagged links",
      ]},
      { name: "Subscriptions", target: 1000, icon: <Users className="w-4 h-4" />, actions: [
        "48-Hour Flash Sale — annual Pro at $29.90 (40% off)",
        "Countdown timer on pricing page + social proof bar",
      ]},
      { name: "PokéCoins", target: 500, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Influencer PokéCoin giveaway — $200 in coins = $500+ in new purchasers",
      ]},
      { name: "SimTrader", target: 300, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Mid-week standings + top trader strategies (Pro-gated analysis)",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "Social Media Challenge — predict which video card gains most value",
      ]},
    ],
  },
  {
    day: 5, title: "Retention & Expansion", target: 3000,
    streams: [
      { name: "Subscriptions", target: 1200, icon: <Users className="w-4 h-4" />, actions: [
        "'You're Missing Out' report to free-tier users with one-click upgrade CTA",
      ]},
      { name: "Affiliates", target: 700, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "'Best Grading Arbitrage Opportunities' with buy links on TCGPlayer",
      ]},
      { name: "PokéCoins", target: 600, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Collector's Bundle — 25K PokéCoins + exclusive avatar for $24.99 (limited 50)",
      ]},
      { name: "SimTrader", target: 300, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "'You're X trades away from the prize' push notifications",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "Streak Bonus — 3 correct predictions = 5X PokéCoin multiplier",
      ]},
    ],
  },
  {
    day: 6, title: "Urgency & Scarcity", target: 3500,
    streams: [
      { name: "Subscriptions", target: 1500, icon: <Users className="w-4 h-4" />, actions: [
        "'Last Chance' email — 40% off expires tomorrow with countdown timer",
        "Exit-intent popup with personalized expiry timer",
      ]},
      { name: "Affiliates", target: 800, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "'24-Hour Deal Alert' roundup — time-sensitive urgency clicks (8K+ target)",
      ]},
      { name: "PokéCoins", target: 700, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "Final day of 2X bonus — push + sticky banner: 'Ends at midnight'",
      ]},
      { name: "SimTrader", target: 300, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Final Trading Day before contest closes — push to all participants",
      ]},
      { name: "Arena", target: 200, icon: <Swords className="w-4 h-4" />, actions: [
        "Double-or-nothing special arena event",
      ]},
    ],
  },
  {
    day: 7, title: "Close & Maximize", target: 2800,
    streams: [
      { name: "Subscriptions", target: 1100, icon: <Users className="w-4 h-4" />, actions: [
        "Personal 'thank you' email with permanent 20% off for today-only upgrade",
        "Deploy InlineUpgradeNudge on every page",
      ]},
      { name: "Affiliates", target: 500, icon: <MousePointerClick className="w-4 h-4" />, actions: [
        "'Week in Review' blog recap with affiliate links — share on all socials",
      ]},
      { name: "PokéCoins", target: 500, icon: <ShoppingCart className="w-4 h-4" />, actions: [
        "'Thank You' bundle — bonus 20% PokéCoins on any purchase",
      ]},
      { name: "SimTrader", target: 400, icon: <Gamepad2 className="w-4 h-4" />, actions: [
        "Contest results + prizes. Announce next tournament (sub required to pre-register)",
      ]},
      { name: "Arena", target: 300, icon: <Swords className="w-4 h-4" />, actions: [
        "Week-end jackpot event — all wagers feed into single high-payout round",
      ]},
    ],
  },
];

const STORAGE_KEY = "capital-campaign-progress";

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function saveProgress(p: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function CapitalCampaign() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);
  const [selectedDay, setSelectedDay] = useState("1");

  const toggleAction = (key: string) => {
    const next = { ...progress, [key]: !progress[key] };
    setProgress(next);
    saveProgress(next);
  };

  const completedRevenue = useMemo(() => {
    let total = 0;
    DAYS.forEach(day => {
      day.streams.forEach(stream => {
        const allDone = stream.actions.every((_, ai) => progress[`${day.day}-${stream.name}-${ai}`]);
        if (allDone) total += stream.target;
      });
    });
    return total;
  }, [progress]);

  const completedActions = useMemo(() => {
    return Object.values(progress).filter(Boolean).length;
  }, [progress]);

  const totalActions = DAYS.reduce((sum, d) => sum + d.streams.reduce((s, st) => s + st.actions.length, 0), 0);

  const streamTotals = useMemo(() => {
    const totals: Record<string, { target: number; completed: number }> = {};
    DAYS.forEach(day => {
      day.streams.forEach(stream => {
        if (!totals[stream.name]) totals[stream.name] = { target: 0, completed: 0 };
        totals[stream.name].target += stream.target;
        const allDone = stream.actions.every((_, ai) => progress[`${day.day}-${stream.name}-${ai}`]);
        if (allDone) totals[stream.name].completed += stream.target;
      });
    });
    return totals;
  }, [progress]);

  const progressPct = (completedRevenue / CAMPAIGN_GOAL) * 100;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-6 h-6 text-destructive animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">7-DAY CAPITAL CAMPAIGN</h1>
            <Flame className="w-6 h-6 text-destructive animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">$25,000 Realized Revenue Sprint — PGVA Ventures, LLC</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="text-2xl font-bold text-primary">${completedRevenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Revenue Tracked</div>
            </CardContent>
          </Card>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4 text-center">
              <Target className="w-5 h-5 mx-auto text-accent-foreground mb-1" />
              <div className="text-2xl font-bold text-foreground">${CAMPAIGN_GOAL.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Campaign Goal</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <div className="text-2xl font-bold text-foreground">{completedActions}/{totalActions}</div>
              <div className="text-xs text-muted-foreground">Actions Done</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
              <div className="text-2xl font-bold text-foreground">{progressPct.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">To Goal</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Campaign Progress</span>
              <span className="font-mono font-bold text-primary">${completedRevenue.toLocaleString()} / $25,000</span>
            </div>
            <Progress value={progressPct} className="h-3" />
          </CardContent>
        </Card>

        {/* Revenue Stream Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Revenue Stream Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(streamTotals).map(([name, { target, completed }]) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ${completed.toLocaleString()} / ${target.toLocaleString()}
                  </span>
                </div>
                <Progress value={(completed / target) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Day Tabs */}
        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="w-full flex overflow-x-auto">
            {DAYS.map(d => {
              const dayDone = d.streams.every(st => st.actions.every((_, ai) => progress[`${d.day}-${st.name}-${ai}`]));
              return (
                <TabsTrigger key={d.day} value={String(d.day)} className="flex-1 min-w-0 text-xs">
                  {dayDone && <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />}
                  D{d.day}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {DAYS.map(day => (
            <TabsContent key={day.day} value={String(day.day)} className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Day {day.day}: {day.title}</h2>
                  <p className="text-sm text-muted-foreground">Daily target: <span className="text-primary font-bold">${day.target.toLocaleString()}</span></p>
                </div>
                <Badge variant="outline" className="font-mono">
                  ${day.target.toLocaleString()}
                </Badge>
              </div>

              {day.streams.map(stream => {
                const streamComplete = stream.actions.every((_, ai) => progress[`${day.day}-${stream.name}-${ai}`]);
                return (
                  <Card key={stream.name} className={streamComplete ? "border-green-500/50 bg-green-500/5" : ""}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {stream.icon}
                          {stream.name}
                          {streamComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          ${stream.target.toLocaleString()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {stream.actions.map((action, ai) => {
                        const key = `${day.day}-${stream.name}-${ai}`;
                        const checked = !!progress[key];
                        return (
                          <label
                            key={ai}
                            className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                              checked ? "bg-green-500/10 line-through text-muted-foreground" : "hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleAction(key)}
                              className="mt-0.5"
                            />
                            <span className="text-xs leading-relaxed">{action}</span>
                          </label>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

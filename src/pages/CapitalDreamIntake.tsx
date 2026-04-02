import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TerminalHeader from "@/components/TerminalHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, Target, TrendingUp, Zap, Shield, Lock, Users,
  MousePointerClick, Gamepad2, Swords, ShoppingCart, BarChart3,
  AlertTriangle, CheckCircle2, ArrowUpRight, Flame, Calendar,
  CreditCard, RefreshCw, Bell, Ban, Clock, Activity, Gauge
} from "lucide-react";

const ANNUAL_TARGET = 25_000_000;
const DAILY_TARGET = Math.round(ANNUAL_TARGET / 365);
const HOURLY_TARGET = Math.round(DAILY_TARGET / 24);
const MONTHLY_TARGET = Math.round(ANNUAL_TARGET / 12);

const OPERATING_COSTS = {
  infrastructure: 2500,
  apiServices: 1200,
  stripeProcessing: 0.029,
  marketing: 5000,
  legal: 1500,
  insurance: 800,
  team: 15000,
  misc: 2000,
};
const MONTHLY_FIXED_COSTS = Object.entries(OPERATING_COSTS)
  .filter(([k]) => k !== 'stripeProcessing')
  .reduce((s, [, v]) => s + v, 0);
const DAILY_FIXED_COSTS = Math.round(MONTHLY_FIXED_COSTS / 30);
const HOURLY_FIXED_COSTS = Math.round(DAILY_FIXED_COSTS / 24);

interface RevenueStream {
  name: string;
  icon: React.ReactNode;
  annualTarget: number;
  monthlyTarget: number;
  dailyTarget: number;
  hourlyTarget: number;
  strategies: string[];
  gapClosers: string[];
  color: string;
  aggressiveActions: string[];
}

const STREAMS: RevenueStream[] = [
  {
    name: "Subscriptions",
    icon: <Users className="w-5 h-5" />,
    annualTarget: 12_000_000,
    monthlyTarget: 1_000_000,
    dailyTarget: 32_877,
    hourlyTarget: Math.round(32_877 / 24),
    strategies: [
      "Scale to 200K+ Pro subscribers at $4.99/mo avg",
      "Enterprise/Institutional tier at $99/mo — target 500 LGS & hedge funds",
      "Annual billing lock-in with 20% discount (reduce churn to <3%)",
      "Whale tier at $49.99/mo — target 2,000 power users",
      "Team plans for LGS at $19.99/mo × 5 seats — target 1,000 stores",
    ],
    gapClosers: [
      "Dunning emails: 3-touch sequence on failed payments (recover 40%)",
      "Grace period elimination: suspend access immediately on payment failure",
      "Annual prepay incentive: lock customers into 12-month commitments",
      "Auto-retry failed charges at 1hr, 24hr, 72hr intervals",
      "Cancel-save flow: offer 50% off for 3 months before allowing cancellation",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Monitor new signups — push upgrade CTA within 30 min of signup",
      "🔴 HOURLY: Auto-trigger dunning on ANY failed payment within 60 seconds",
      "🔴 HOURLY: Flash upgrade banners during peak trading hours (9am-11am, 2pm-4pm EST)",
      "🔴 DAILY: A/B test pricing page CTAs — optimize conversion hourly",
    ],
    color: "text-primary",
  },
  {
    name: "Affiliate Revenue",
    icon: <MousePointerClick className="w-5 h-5" />,
    annualTarget: 5_000_000,
    monthlyTarget: 416_667,
    dailyTarget: 13_699,
    hourlyTarget: Math.round(13_699 / 24),
    strategies: [
      "TCGPlayer affiliate at $0.08/click × 50M+ annual clicks",
      "eBay Partner Network at $0.12/click × 20M+ annual clicks",
      "Direct card purchase integration with 5% commission",
      "Sponsored card listings from major sellers at $500/mo",
      "Premium placement partnerships with top 50 sellers",
    ],
    gapClosers: [
      "Attribution pixel tracking to eliminate untracked conversions",
      "Deep-link every card mention to affiliate purchase page",
      "Exit-intent redirect to affiliate partner on card pages",
      "Weekly affiliate revenue reconciliation audit",
      "Minimum guaranteed CPC contracts with partners",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Track click-through rates — surface underperforming affiliate links",
      "🔴 HOURLY: Auto-inject 'Buy Now' CTAs on trending card pages",
      "🔴 DAILY: Push highest-margin affiliate links to homepage spotlight",
    ],
    color: "text-blue-500",
  },
  {
    name: "PokéCoin Store",
    icon: <ShoppingCart className="w-5 h-5" />,
    annualTarget: 3_000_000,
    monthlyTarget: 250_000,
    dailyTarget: 8_219,
    hourlyTarget: Math.round(8_219 / 24),
    strategies: [
      "75K Whale Pack at $49.99 — target 5,000 purchases/month",
      "25K Standard Pack at $24.99 — target 8,000 purchases/month",
      "Seasonal limited editions (holiday packs, set release packs)",
      "Subscription PokéCoin drip: auto-purchase monthly bundles",
      "PokéCoin gifting between users (10% platform fee)",
    ],
    gapClosers: [
      "Abandoned cart recovery: push notification + email within 1 hour",
      "Low-balance nudge: alert when PokéCoins drop below 1,000",
      "Auto-replenish option: charge card when balance hits threshold",
      "Bundle upsell at checkout: 'Add 5K more for $4.99'",
      "Expire PokéCoins after 180 days of inactivity (drives usage)",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Push flash sale notifications during Arena peak hours",
      "🔴 HOURLY: Low-balance alerts — trigger buy CTA at <500 PC",
      "🔴 DAILY: Surface 'limited time' bundles with countdown timers",
    ],
    color: "text-yellow-500",
  },
  {
    name: "SimTrader & Contests",
    icon: <Gamepad2 className="w-5 h-5" />,
    annualTarget: 2_500_000,
    monthlyTarget: 208_333,
    dailyTarget: 6_849,
    hourlyTarget: Math.round(6_849 / 24),
    strategies: [
      "Weekly tournaments at $4.99-$49.99 entry — target 10K entries/week",
      "Season passes at $29.99/quarter for unlimited tournament access",
      "Corporate-sponsored tournaments with prize pools funded by partners",
      "SimTrader Pro features gated to paid tier",
      "Leaderboard badges and NFT-style trophies as premium cosmetics",
    ],
    gapClosers: [
      "Auto-enroll active traders into paid tournaments (opt-out model)",
      "Streak bonuses that require paid re-entry to maintain",
      "Tournament entry as part of subscription upgrade upsell",
      "Non-refundable entry fees — no exceptions",
      "Minimum 3 trades required to withdraw winnings",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Surface next tournament countdown on every page",
      "🔴 HOURLY: Push 'seats filling up' FOMO notifications",
      "🔴 DAILY: Auto-create micro-contests ($0.99 entry) every 4 hours",
    ],
    color: "text-purple-500",
  },
  {
    name: "Arena Economy",
    icon: <Swords className="w-5 h-5" />,
    annualTarget: 1_500_000,
    monthlyTarget: 125_000,
    dailyTarget: 4_110,
    hourlyTarget: Math.round(4_110 / 24),
    strategies: [
      "Arena Access subscription at $0.99/mo — target 100K users",
      "High-stakes prediction rooms with 5% house rake",
      "Daily challenge events with PokéCoin entry fees",
      "Prediction insurance (pay 10% to guarantee partial return)",
      "VIP Arena rooms with premium features for Whale subscribers",
    ],
    gapClosers: [
      "Mandatory Arena Access for any prediction over 500 PC",
      "House edge built into all odds (minimum 5% margin)",
      "Withdrawal minimum of 10,000 PC to prevent micro-cashouts",
      "Cool-down period on large winnings (encourages re-wagering)",
      "Anti-bot measures to prevent automated prediction farming",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Push daily challenge reminders to all Arena users",
      "🔴 HOURLY: Surface 'hot prediction' alerts on market movers",
      "🔴 DAILY: Create time-limited high-stakes rooms (2hr windows)",
    ],
    color: "text-red-500",
  },
  {
    name: "Data Licensing & API",
    icon: <BarChart3 className="w-5 h-5" />,
    annualTarget: 1_000_000,
    monthlyTarget: 83_333,
    dailyTarget: 2_740,
    hourlyTarget: Math.round(2_740 / 24),
    strategies: [
      "API access tiers: Basic ($99/mo), Pro ($499/mo), Enterprise ($2,499/mo)",
      "Raw index data licensing to hedge funds and financial analysts",
      "White-label market data feeds for LGS POS systems",
      "Academic research partnerships at $999/year",
      "Real-time webhook subscriptions for price alerts ($199/mo)",
    ],
    gapClosers: [
      "Metered API billing: overage charges at $0.001/request beyond quota",
      "No free API tier — all programmatic access requires paid plan",
      "Annual contracts with 30-day cancellation notice requirement",
      "IP-locked API keys to prevent credential sharing",
      "Usage audit trail with automatic billing for overages",
    ],
    aggressiveActions: [
      "🔴 HOURLY: Monitor API usage — push upgrade CTAs at 80% quota",
      "🔴 DAILY: Auto-generate leads from heavy free-tier API users",
      "🔴 DAILY: Surface enterprise partnership opportunities",
    ],
    color: "text-emerald-500",
  },
];

const TOTAL_DAILY_REVENUE_TARGET = STREAMS.reduce((s, st) => s + st.dailyTarget, 0);
const TOTAL_HOURLY_REVENUE_TARGET = STREAMS.reduce((s, st) => s + st.hourlyTarget, 0);

const formatCurrency = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

const formatExact = (n: number) => `$${n.toLocaleString()}`;

export default function CapitalDreamIntake() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [liveMetrics, setLiveMetrics] = useState({
    todaySignups: 0,
    todayClicks: 0,
    todayPokecoinPurchases: 0,
    todayArenaWagers: 0,
    activeTrials: 0,
  });

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live metrics
  useEffect(() => {
    const fetchLiveMetrics = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISO = todayStart.toISOString();

      const [clicksRes, trialsRes, wagersRes] = await Promise.all([
        supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true }).gte('clicked_at', todayISO),
        supabase.from('user_trials').select('id', { count: 'exact', head: true }).eq('is_active', true).gte('ends_at', new Date().toISOString()),
        supabase.from('arena_wallets').select('lifetime_wagered'),
      ]);

      setLiveMetrics({
        todaySignups: 0,
        todayClicks: clicksRes.count || 0,
        todayPokecoinPurchases: 0,
        todayArenaWagers: (wagersRes.data || []).reduce((s, w) => s + (w.lifetime_wagered || 0), 0),
        activeTrials: trialsRes.count || 0,
      });
    };

    fetchLiveMetrics();
    const interval = setInterval(fetchLiveMetrics, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, []);

  const ytdTarget = dayOfYear * DAILY_TARGET;
  const ytdNetTarget = dayOfYear * (DAILY_TARGET - DAILY_FIXED_COSTS);
  const hourlyProgress = ((currentHour / 24) * 100);
  const todayTargetSoFar = currentHour * HOURLY_TARGET;
  const todayCostsSoFar = currentHour * HOURLY_FIXED_COSTS;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-7 h-7 text-destructive animate-pulse" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
              AGGRESSIVE CAPITAL DREAM INTAKE
            </h1>
            <Flame className="w-7 h-7 text-destructive animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            <span className="text-primary font-bold">$25,000,000</span> Revenue Target — PGVA Ventures, LLC
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">
              Day {dayOfYear} of 365 • {((dayOfYear / 365) * 100).toFixed(1)}% elapsed
            </Badge>
            <Badge variant="destructive" className="text-xs font-mono animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Hour {currentHour}/24 • {formatExact(HOURLY_TARGET)}/hr target
            </Badge>
          </div>
        </div>

        {/* LIVE HOURLY TRACKER */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <Activity className="w-4 h-4 animate-pulse" />
              LIVE HOURLY CAPITAL TRACKER — Business Day {dayOfYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-background border text-center">
                <div className="text-[10px] text-muted-foreground font-bold">HOURLY GROSS TARGET</div>
                <div className="text-lg font-mono font-bold text-primary">{formatExact(HOURLY_TARGET)}</div>
                <div className="text-[9px] text-muted-foreground">{formatExact(TOTAL_HOURLY_REVENUE_TARGET)} all streams</div>
              </div>
              <div className="p-3 rounded-lg bg-background border text-center">
                <div className="text-[10px] text-muted-foreground font-bold">HOURLY NET TARGET</div>
                <div className="text-lg font-mono font-bold text-green-500">{formatExact(HOURLY_TARGET - HOURLY_FIXED_COSTS)}</div>
                <div className="text-[9px] text-muted-foreground">After {formatExact(HOURLY_FIXED_COSTS)}/hr costs</div>
              </div>
              <div className="p-3 rounded-lg bg-background border text-center">
                <div className="text-[10px] text-muted-foreground font-bold">TODAY TARGET SO FAR</div>
                <div className="text-lg font-mono font-bold text-foreground">{formatExact(todayTargetSoFar)}</div>
                <div className="text-[9px] text-muted-foreground">Hour {currentHour} of 24</div>
              </div>
              <div className="p-3 rounded-lg bg-background border text-center">
                <div className="text-[10px] text-muted-foreground font-bold">TODAY NET SO FAR</div>
                <div className="text-lg font-mono font-bold text-green-500">{formatExact(todayTargetSoFar - todayCostsSoFar)}</div>
                <div className="text-[9px] text-muted-foreground">Costs: -{formatExact(todayCostsSoFar)}</div>
              </div>
            </div>
            <Progress value={hourlyProgress} className="h-3" />
            <div className="text-[10px] text-center text-muted-foreground">
              Day progress: {hourlyProgress.toFixed(0)}% • {24 - currentHour} hours remaining to hit {formatExact(DAILY_TARGET)}
            </div>
          </CardContent>
        </Card>

        {/* LIVE METRICS FROM DB */}
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              LIVE PLATFORM METRICS (Auto-Refresh 5min)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                <div className="text-[10px] text-muted-foreground font-bold">TODAY AFFILIATE CLICKS</div>
                <div className="text-xl font-mono font-bold text-blue-500">{liveMetrics.todayClicks}</div>
                <div className="text-[9px] text-muted-foreground">Est. rev: {formatExact(liveMetrics.todayClicks * 0.10)}</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-center">
                <div className="text-[10px] text-muted-foreground font-bold">ACTIVE TRIALS</div>
                <div className="text-xl font-mono font-bold text-yellow-500">{liveMetrics.activeTrials}</div>
                <div className="text-[9px] text-muted-foreground">Potential MRR: {formatExact(liveMetrics.activeTrials * 4.99)}</div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
                <div className="text-[10px] text-muted-foreground font-bold">ARENA PC WAGERED</div>
                <div className="text-xl font-mono font-bold text-red-500">{liveMetrics.todayArenaWagers.toLocaleString()}</div>
                <div className="text-[9px] text-muted-foreground">5% house rake captured</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
                <div className="text-[10px] text-muted-foreground font-bold">BUSINESS DAY</div>
                <div className="text-xl font-mono font-bold text-green-500">#{dayOfYear}</div>
                <div className="text-[9px] text-muted-foreground">{365 - dayOfYear} days remain</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top-level KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3 text-center">
              <Target className="w-4 h-4 mx-auto text-primary mb-1" />
              <div className="text-lg md:text-xl font-bold text-primary">{formatCurrency(ANNUAL_TARGET)}</div>
              <div className="text-[10px] text-muted-foreground">Annual Target</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-3 text-center">
              <Calendar className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
              <div className="text-lg md:text-xl font-bold text-foreground">{formatExact(DAILY_TARGET)}</div>
              <div className="text-[10px] text-muted-foreground">Daily Target</div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 text-center">
              <Clock className="w-4 h-4 mx-auto text-destructive mb-1" />
              <div className="text-lg md:text-xl font-bold text-destructive">{formatExact(HOURLY_TARGET)}</div>
              <div className="text-[10px] text-muted-foreground">Hourly Target</div>
            </CardContent>
          </Card>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-3 text-center">
              <AlertTriangle className="w-4 h-4 mx-auto text-red-500 mb-1" />
              <div className="text-lg md:text-xl font-bold text-red-500">-{formatExact(DAILY_FIXED_COSTS)}</div>
              <div className="text-[10px] text-muted-foreground">Daily Costs</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto text-green-500 mb-1" />
              <div className="text-lg md:text-xl font-bold text-green-500">{formatExact(DAILY_TARGET - DAILY_FIXED_COSTS)}</div>
              <div className="text-[10px] text-muted-foreground">Daily Net</div>
            </CardContent>
          </Card>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-4 h-4 mx-auto text-accent-foreground mb-1" />
              <div className="text-lg md:text-xl font-bold text-foreground">{formatCurrency(ytdTarget)}</div>
              <div className="text-[10px] text-muted-foreground">YTD Target</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue equation */}
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Aggressive Revenue Equation (Hourly Granularity)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-sm font-medium">Gross Hourly</span>
                <span className="font-mono font-bold text-primary">{formatExact(TOTAL_HOURLY_REVENUE_TARGET)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <span className="text-sm font-medium">Hourly Costs</span>
                <span className="font-mono font-bold text-red-500">-{formatExact(HOURLY_FIXED_COSTS)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-sm font-medium">Net Hourly</span>
                <span className="font-mono font-bold text-green-500">{formatExact(TOTAL_HOURLY_REVENUE_TARGET - HOURLY_FIXED_COSTS)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border-2 border-green-500/30">
              <span className="text-sm font-bold text-green-600">NET DAILY CAPITAL</span>
              <span className="font-mono text-xl font-bold text-green-500">{formatExact(TOTAL_DAILY_REVENUE_TARGET - DAILY_FIXED_COSTS)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-x-auto">
            <TabsTrigger value="overview" className="flex-1 text-xs">Revenue Streams</TabsTrigger>
            <TabsTrigger value="hourly" className="flex-1 text-xs">Hourly Actions</TabsTrigger>
            <TabsTrigger value="gaps" className="flex-1 text-xs">Gap Closers</TabsTrigger>
            <TabsTrigger value="lockdown" className="flex-1 text-xs">Revenue Lock-In</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {STREAMS.map(stream => (
              <Card key={stream.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className={`flex items-center gap-2 ${stream.color}`}>
                      {stream.icon}
                      {stream.name}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {formatCurrency(stream.annualTarget)}/yr
                      </Badge>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {formatExact(stream.dailyTarget)}/day
                      </Badge>
                      <Badge variant="destructive" className="font-mono text-[10px]">
                        {formatExact(stream.hourlyTarget)}/hr
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={(stream.annualTarget / ANNUAL_TARGET) * 100} className="h-2" />
                  <div className="text-[10px] text-muted-foreground text-right">
                    {((stream.annualTarget / ANNUAL_TARGET) * 100).toFixed(1)}% of total target
                  </div>
                  <div className="space-y-1">
                    {stream.strategies.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 p-1.5 rounded bg-muted/20">
                        <ArrowUpRight className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* NEW: Hourly Aggressive Actions Tab */}
          <TabsContent value="hourly" className="space-y-4 mt-4">
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Aggressive Hourly Revenue Actions — Execute NOW
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  These actions are designed to produce tangible, measurable capital results every hour.
                  Each action is tied to a revenue stream and can be verified in real-time.
                </p>
              </CardContent>
            </Card>
            {STREAMS.map(stream => (
              <Card key={stream.name} className="border-destructive/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className={`flex items-center gap-2 ${stream.color}`}>
                      {stream.icon}
                      {stream.name}
                    </span>
                    <Badge variant="destructive" className="font-mono text-[10px]">
                      {formatExact(stream.hourlyTarget)}/hr needed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {stream.aggressiveActions.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded bg-destructive/5 border border-destructive/10">
                      <Zap className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
                      <span className="text-xs leading-relaxed font-medium">{a}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4 mt-4">
            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-500">
                  <Ban className="w-4 h-4" />
                  Payment Gap Closers — Zero Tolerance Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Every dollar of potential revenue is tracked and recovered. No customer can wiggle out of payment obligations.
                </p>
              </CardContent>
            </Card>
            {STREAMS.map(stream => (
              <Card key={stream.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lock className={`w-4 h-4 ${stream.color}`} />
                    {stream.name} — Gap Closers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {stream.gapClosers.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded bg-red-500/5 border border-red-500/10">
                      <Shield className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-xs leading-relaxed">{g}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="lockdown" className="space-y-4 mt-4">
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Revenue Lock-In Mechanisms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: <CreditCard className="w-4 h-4" />, title: "Dunning Management", desc: "3-touch email sequence (1hr, 24hr, 72hr) on failed payments. Auto-retry charges. Suspend access on final failure. Target: recover 40% of involuntary churn." },
                  { icon: <RefreshCw className="w-4 h-4" />, title: "Annual Prepay Lock-In", desc: "20% discount for annual billing. Non-refundable after 14-day window. Auto-renew enabled by default. Cancel requires 30-day notice." },
                  { icon: <Shield className="w-4 h-4" />, title: "Cancel-Save Flow", desc: "4-step cancellation process: 1) Show usage stats, 2) Offer 50% off for 3 months, 3) Offer free month, 4) Process cancellation with exit survey." },
                  { icon: <Bell className="w-4 h-4" />, title: "Payment Method Auto-Update", desc: "Stripe's automatic card updater + real-time webhook monitoring. Pre-emptive notifications 30 days before card expiry." },
                  { icon: <Lock className="w-4 h-4" />, title: "Enterprise Contract Terms", desc: "Minimum 12-month commitments for Team/Whale/Institutional tiers. Early termination fee of 50% remaining contract value." },
                  { icon: <Ban className="w-4 h-4" />, title: "Anti-Sharing Enforcement", desc: "Device fingerprinting on Institutional tier. Max 3 concurrent sessions. IP-based anomaly detection. Account suspension on sharing detection." },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/10 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-primary">{item.icon}</span>
                      {item.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Operating Costs Detail */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-red-500" />
                  Monthly Operating Costs Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(OPERATING_COSTS).filter(([k]) => k !== 'stripeProcessing').map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center p-2 border-b border-border/50">
                      <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-xs font-bold">{formatExact(val)}/mo</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-2 border-b border-border/50">
                    <span className="text-xs">Stripe Processing (2.9%)</span>
                    <span className="font-mono text-xs font-bold text-muted-foreground">Variable</span>
                  </div>
                  <div className="flex justify-between items-center p-2 pt-3 border-t-2 border-primary/30">
                    <span className="text-sm font-bold">Total Fixed Monthly</span>
                    <span className="font-mono text-sm font-bold text-red-500">{formatExact(MONTHLY_FIXED_COSTS)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm font-bold">Annual Operating Costs</span>
                    <span className="font-mono text-sm font-bold text-red-500">{formatExact(MONTHLY_FIXED_COSTS * 12)}/yr</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-500/5 rounded-lg">
                    <span className="text-sm font-bold text-green-600">Net Annual Revenue Target</span>
                    <span className="font-mono text-sm font-bold text-green-500">{formatCurrency(ANNUAL_TARGET - MONTHLY_FIXED_COSTS * 12)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

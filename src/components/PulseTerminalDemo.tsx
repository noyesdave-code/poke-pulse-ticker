import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Activity, Shield, Star, Trophy, Zap, Users, ChevronRight, ExternalLink, Lock, AlertTriangle, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

export interface MarketItem {
  name: string;
  set: string;
  price: number;
  change: number;
  volume?: number;
  grade?: string;
  image?: string;
}

export interface FranchiseConfig {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  tickerPrefix: string;
  indexName: string;
  currency: string;
  rawItems: MarketItem[];
  gradedItems: MarketItem[];
  sealedItems: MarketItem[];
  categories: string[];
  logoEmoji: string;
  tam: string;
  description: string;
}

const PulseTerminalDemo = ({ config }: { config: FranchiseConfig }) => {
  const [tab, setTab] = useState("raw");
  const navigate = useNavigate();

  // Copy protection
  useEffect(() => {
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey && ['s','u','p','c','a'].includes(e.key.toLowerCase())) || e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i','j'].includes(e.key.toLowerCase()))) e.preventDefault();
    };
    const blockDrag = (e: DragEvent) => e.preventDefault();
    const blockPrint = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', blockCtx);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('dragstart', blockDrag);
    window.addEventListener('beforeprint', blockPrint);
    return () => {
      document.removeEventListener('contextmenu', blockCtx);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('dragstart', blockDrag);
      window.removeEventListener('beforeprint', blockPrint);
    };
  }, []);
    if (!items.length) return 0;
    return items.reduce((s, i) => s + i.price, 0) / items.length;
  };
  const getIndexChange = (items: MarketItem[]) => {
    if (!items.length) return 0;
    return items.reduce((s, i) => s + i.change, 0) / items.length;
  };

  const rawIdx = getIndexValue(config.rawItems);
  const rawChg = getIndexChange(config.rawItems);
  const gradedIdx = getIndexValue(config.gradedItems);
  const gradedChg = getIndexChange(config.gradedItems);
  const sealedIdx = getIndexValue(config.sealedItems);
  const sealedChg = getIndexChange(config.sealedItems);

  const renderChange = (v: number) => (
    <span className={`flex items-center gap-0.5 font-mono text-sm ${v >= 0 ? "text-green-400" : "text-red-400"}`}>
      {v >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(v).toFixed(2)}%
    </span>
  );

  const renderTable = (items: MarketItem[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground text-xs">
            <th className="text-left py-2 px-2">TICKER</th>
            <th className="text-left py-2 px-2">NAME</th>
            <th className="text-left py-2 px-2">SET</th>
            <th className="text-right py-2 px-2">PRICE</th>
            <th className="text-right py-2 px-2">CHG%</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
              <td className="py-2 px-2 font-mono text-xs" style={{ color: config.primaryColor }}>
                {config.tickerPrefix}-{item.name.slice(0, 4).toUpperCase()}{i}
              </td>
              <td className="py-2 px-2 font-medium text-foreground">{item.name}</td>
              <td className="py-2 px-2 text-muted-foreground text-xs">{item.set}</td>
              <td className="py-2 px-2 text-right font-mono text-foreground">
                ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2 px-2 text-right">{renderChange(item.change)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden border-b border-border/40"
        style={{ background: config.bgGradient }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{config.logoEmoji}</span>
            <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
              PULSE MARKET TERMINAL
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            {config.name}
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl mb-6">{config.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {config.categories.map((c) => (
              <Badge key={c} className="text-xs" style={{ backgroundColor: config.primaryColor + "22", color: config.primaryColor, borderColor: config.primaryColor + "44" }}>
                {c}
              </Badge>
            ))}
          </div>
        </div>
        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      {/* Index Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: `${config.indexName} RAW`, value: rawIdx, change: rawChg, icon: Activity },
            { label: `${config.indexName} GRADED`, value: gradedIdx, change: gradedChg, icon: Shield },
            { label: `${config.indexName} SEALED`, value: sealedIdx, change: sealedChg, icon: BarChart3 },
          ].map(({ label, value, change, icon: Icon }) => (
            <Card key={label} className="bg-card border-border/60">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-mono tracking-wider">{label}</span>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {renderChange(change)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Data Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50 mb-4">
            <TabsTrigger value="raw">Raw Market</TabsTrigger>
            <TabsTrigger value="graded">Graded Market</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Market</TabsTrigger>
          </TabsList>
          <Card className="bg-card border-border/60">
            <CardContent className="p-0">
              <TabsContent value="raw" className="m-0">{renderTable(config.rawItems)}</TabsContent>
              <TabsContent value="graded" className="m-0">{renderTable(config.gradedItems)}</TabsContent>
              <TabsContent value="sealed" className="m-0">{renderTable(config.sealedItems)}</TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4 text-foreground">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, title: "Live Market Data", desc: "Real-time pricing updated every 60-90 minutes across all indexes" },
            { icon: Zap, title: "AI Alpha Signals", desc: "Proprietary algorithms detect breakout patterns before the market moves" },
            { icon: Trophy, title: "SimTrader World™", desc: "Risk-free virtual trading with $100K starting balance and AI bot opponents" },
            { icon: Users, title: "Community Arena", desc: "PvP prediction duels, tournaments, and competitive leaderboards" },
            { icon: Shield, title: "Grading Arbitrage", desc: "Identify profitable raw-to-graded conversion opportunities instantly" },
            { icon: Star, title: "Portfolio Tracking", desc: "Track your entire collection value with historical snapshots and P&L" },
            { icon: BarChart3, title: "Market Intelligence", desc: "Whale reports, volume analysis, and sentiment tracking tools" },
            { icon: Activity, title: "Price Alerts", desc: "Customizable alerts when cards hit your target buy/sell prices" },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card border-border/40 hover:border-border/80 transition-colors">
              <CardContent className="pt-4 pb-3">
                <Icon className="w-5 h-5 mb-2" style={{ color: config.primaryColor }} />
                <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TAM / Investor Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="border-border/60" style={{ background: config.bgGradient }}>
          <CardContent className="py-8 text-center">
            <p className="text-white/60 text-xs font-mono tracking-widest mb-2">TOTAL ADDRESSABLE MARKET</p>
            <p className="text-4xl md:text-5xl font-bold text-white mb-2">{config.tam}</p>
            <p className="text-white/70 text-sm max-w-xl mx-auto mb-6">{config.description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate("/franchise")}
              >
                View Franchise Blueprint <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate("/pricing")}
              >
                See Pricing <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legal / Financial Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <FinancialDisclaimer />
      </div>

      {/* Footer with IP Protection */}
      <div className="max-w-7xl mx-auto px-4 pb-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3 text-primary" />
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} PGVA Ventures, LLC · Pulse Market Terminal™ · All Rights Reserved · Patent Pending
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-2.5 h-2.5 text-muted-foreground/60" />
          <p className="text-[9px] text-muted-foreground/50 font-mono tracking-wide">
            CONFIDENTIAL & PROPRIETARY · Protected under DMCA, CFAA & DTSA · Noyes Family Trust
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-2.5 h-2.5 text-muted-foreground/40" />
          <p className="text-[8px] text-muted-foreground/40 font-mono">
            Not financial advice. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>

      {/* Forensic Watermark */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none" aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Ctext x='50%25' y='30%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='10' fill='rgba(255,255,255,0.015)' transform='rotate(-30 200 125)'%3E© 2026 PGVA Ventures LLC%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='8' fill='rgba(255,255,255,0.012)' transform='rotate(-30 200 125)'%3EPulse Market Terminal · Patent Pending%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};

export default PulseTerminalDemo;

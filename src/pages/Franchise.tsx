import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import {
  TrendingUp, Globe, Shield, Zap, BarChart3, Users, Trophy, Gamepad2,
  Target, DollarSign, Layers, ArrowRight, Rocket, Lock, Brain
} from "lucide-react";
import { motion } from "framer-motion";

const demoRoutes: Record<string, string> = {
  "Pokémon TCG": "/",
  "Magic: The Gathering": "/demo/mtg",
  "Yu-Gi-Oh!": "/demo/yugioh",
  "Lorcana": "/demo/lorcana",
  "Major League Baseball": "/demo/mlb",
  "National Football League": "/demo/nfl",
  "National Basketball Association": "/demo/nba",
  "National Hockey League": "/demo/nhl",
  "DragonBall Z": "/demo/dbz",
  "Star Wars": "/demo/starwars",
  "FIFA Soccer": "/demo/fifa",
};

const terminals = [
  { name: "Pokémon TCG", terminal: "Poke-Pulse-Ticker", status: "live", tam: "$15.4B", emoji: "⚡", color: "from-yellow-500 to-amber-600" },
  { name: "Magic: The Gathering", terminal: "MTG Pulse Market Terminal", status: "demo", tam: "$8.2B", emoji: "🧙", color: "from-indigo-500 to-purple-600" },
  { name: "Yu-Gi-Oh!", terminal: "YuGiOh Pulse Market Terminal", status: "demo", tam: "$5.1B", emoji: "🃏", color: "from-red-500 to-orange-600" },
  { name: "Lorcana", terminal: "Lorcana Pulse Market Terminal", status: "demo", tam: "$1.8B", emoji: "✨", color: "from-sky-400 to-blue-600" },
  { name: "Major League Baseball", terminal: "MLB Pulse Market Terminal", status: "demo", tam: "$12.6B", emoji: "⚾", color: "from-red-600 to-red-800" },
  { name: "National Football League", terminal: "NFL Pulse Market Terminal", status: "demo", tam: "$18.3B", emoji: "🏈", color: "from-green-600 to-green-800" },
  { name: "National Basketball Association", terminal: "NBA Pulse Market Terminal", status: "demo", tam: "$14.7B", emoji: "🏀", color: "from-orange-500 to-red-600" },
  { name: "National Hockey League", terminal: "NHL Pulse Market Terminal", status: "demo", tam: "$4.2B", emoji: "🏒", color: "from-blue-600 to-blue-800" },
  { name: "DragonBall Z", terminal: "DBZ Pulse Market Terminal", status: "demo", tam: "$6.8B", emoji: "🐉", color: "from-orange-400 to-yellow-500" },
  { name: "Star Wars", terminal: "Star Wars Pulse Market Terminal", status: "demo", tam: "$9.5B", emoji: "⭐", color: "from-gray-600 to-gray-900" },
  { name: "FIFA Soccer", terminal: "FIFA Pulse Market Terminal", status: "demo", tam: "$7.3B", emoji: "⚽", color: "from-emerald-500 to-teal-600" },
];

const coreFeatures = [
  { icon: BarChart3, title: "Real-Time Price Indexes", desc: "Market data aggregation across all major marketplaces" },
  { icon: Brain, title: "AI Alpha Signals", desc: "Machine-learning buy/sell/hold indicators per vertical" },
  { icon: TrendingUp, title: "Portfolio Tracker", desc: "P&L analytics, snapshots, and performance metrics" },
  { icon: Gamepad2, title: "SimTrader World™", desc: "Gamified paper trading with leaderboards and contests" },
  { icon: Trophy, title: "PokéArena™ / Arena", desc: "Prediction markets and wagering with virtual currency" },
  { icon: Users, title: "Community Intelligence", desc: "Consensus pricing, sentiment polls, and social features" },
];

const projections = [
  { year: "2026", terminals: "3", users: "50,000", arr: "$2.1M", margin: "22%" },
  { year: "2027", terminals: "7", users: "250,000", arr: "$8.5M", margin: "35%" },
  { year: "2028", terminals: "12", users: "1,000,000", arr: "$25M+", margin: "45%" },
  { year: "2029", terminals: "12+", users: "3,000,000+", arr: "$75M+", margin: "55%" },
];

const Franchise = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary font-mono text-xs">
              <Lock className="w-3 h-3 mr-1" /> CONFIDENTIAL — INVESTOR MATERIALS
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              PULSE MARKET TERMINAL™
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              A patent-pending SaaS platform delivering real-time market intelligence across
              12 multi-billion-dollar collectibles and sports memorabilia verticals.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
              <Globe className="w-3 h-3 mr-1" /> 12 Verticals
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
              <DollarSign className="w-3 h-3 mr-1" /> $103B+ Combined TAM
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
              <Shield className="w-3 h-3 mr-1" /> Patent Pending
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Core Platform */}
      <section className="py-16 px-4 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Replicable Core Platform</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            One architecture. Twelve markets. Infinite scale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreFeatures.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}>
                <Card className="bg-card/60 border-border/40 hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-5 flex gap-3">
                    <f.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Terminals Grid */}
      <section className="py-16 px-4 bg-muted/30 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">12-Vertical Expansion</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            Each terminal targets a distinct multi-billion-dollar market
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {terminals.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}>
                <Card className="bg-card border-border/40 hover:border-primary/30 transition-all overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${t.color}`} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{t.emoji}</span>
                      <Badge variant={t.status === "live" ? "default" : t.status === "development" ? "secondary" : "outline"}
                        className="text-[10px] font-mono">
                        {t.status === "live" ? "🟢 LIVE" : t.status === "development" ? "🟡 IN DEV" : "📋 PLANNED"}
                      </Badge>
                    </div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.terminal}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">TAM</span>
                      <span className="font-mono font-bold text-primary text-sm">{t.tam}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-16 px-4 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Financial Projections</h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Year</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Terminals</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Users</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">ARR</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Net Margin</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p) => (
                  <tr key={p.year} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="py-3 px-4 font-bold">{p.year}</td>
                    <td className="py-3 px-4 text-center">{p.terminals}</td>
                    <td className="py-3 px-4 text-center">{p.users}</td>
                    <td className="py-3 px-4 text-right text-primary font-bold">{p.arr}</td>
                    <td className="py-3 px-4 text-right">{p.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-16 px-4 bg-muted/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">7 Revenue Streams Per Terminal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Layers, name: "Subscriptions", desc: "Free / Pro $9.99/mo / Team $29.99/mo", pct: "45%" },
              { icon: Gamepad2, name: "Game Monetization", desc: "$0.99 entry + coin packs", pct: "15%" },
              { icon: Target, name: "Affiliate Revenue", desc: "CPC/CPA marketplace partners", pct: "12%" },
              { icon: Trophy, name: "Arena Rake", desc: "5-10% house take on wagering", pct: "8%" },
              { icon: BarChart3, name: "Data Licensing", desc: "API & bulk data for institutions", pct: "10%" },
              { icon: Zap, name: "Advertising", desc: "Sponsored placements & banners", pct: "5%" },
              { icon: Globe, name: "White-Label", desc: "License the platform to third parties", pct: "5%" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/40">
                <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.desc}</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{s.pct}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Moat */}
      <section className="py-16 px-4 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Competitive Moat</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { t: "Patent-Pending Architecture", d: "Replicable vertical expansion methodology protected under U.S. patent law." },
              { t: "First-Mover Multi-Vertical Intelligence", d: "No competitor offers real-time market intelligence across 12+ collectibles verticals from a single platform." },
              { t: "Proprietary AI Signal Engine", d: "Market-specific training data producing unique buy/sell/hold indicators." },
              { t: "Gamification Flywheel", d: "SimTrader, Arena, and PvP games drive engagement, retention, and monetization." },
              { t: "Network Effects", d: "Community sentiment, consensus pricing, and leaderboards create compounding value." },
              { t: "Historical Data Moat", d: "Years of price data, pop report deltas, and grading arbitrage intelligence." },
            ].map((m, i) => (
              <AccordionItem key={i} value={`moat-${i}`} className="border border-border/40 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-semibold">{m.t}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{m.d}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Investment Ask */}
      <section className="py-16 px-4 bg-muted/30 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Rocket className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Investment Opportunity</h2>
          <p className="text-muted-foreground text-sm">
            PGVA Ventures, LLC is seeking a <strong className="text-foreground">$2.5M Series Seed</strong> to 
            fund simultaneous development of the first 5 Pulse Market Terminals.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10x</p>
              <p className="text-[10px] text-muted-foreground font-mono">TARGET ROI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">36mo</p>
              <p className="text-[10px] text-muted-foreground font-mono">TIME HORIZON</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">$75M+</p>
              <p className="text-[10px] text-muted-foreground font-mono">2029 ARR TARGET</p>
            </div>
          </div>
          <Button size="lg" className="mt-4" onClick={() => window.location.href = "/contact"}>
            Contact PGVA Ventures <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Legal Footer */}
      <section className="py-8 px-4 border-t border-border/40">
        <div className="max-w-4xl mx-auto space-y-4">
          <FinancialDisclaimer />
          <p className="font-mono text-[8px] text-muted-foreground/60 text-center">
            © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved. Patent pending.
            Protected under U.S. copyright, trademark, trade secret, and patent laws.
            Pulse Market Terminal™, SimTrader World™, PokéArena™, and Alpha Signals™ are trademarks of PGVA Ventures, LLC.
            This document is confidential and intended solely for the named recipient. Unauthorized distribution is prohibited.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Franchise;

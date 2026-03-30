import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { TRADING_BOTS, type TradingBot } from "@/data/tradingBots";
import { rawCards } from "@/data/marketData";

interface BotTrade {
  id: string;
  bot: TradingBot;
  cardName: string;
  cardSet: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  timestamp: Date;
}

/** Deterministic seeded random */
function seeded(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i);
    h = h & h;
  }
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

function generateTrade(tick: number): BotTrade {
  const seed = `trade_${tick}_${Date.now().toString().slice(0, -4)}`;
  const r1 = seeded(seed);
  const r2 = seeded(seed + "b");
  const r3 = seeded(seed + "c");
  const r4 = seeded(seed + "q");

  const bot = TRADING_BOTS[Math.floor(r1 * TRADING_BOTS.length)];
  const cards = rawCards.slice(0, 50);
  const card = cards[Math.floor(r2 * cards.length)];
  const side = r3 > 0.45 ? "buy" : "sell";
  const quantity = Math.max(1, Math.floor(r4 * 15));
  const jitter = 1 + (r3 - 0.5) * 0.04;

  return {
    id: `${tick}_${bot.id}`,
    bot,
    cardName: card.name,
    cardSet: card.set,
    side: side as "buy" | "sell",
    quantity,
    price: Math.max(0.01, card.market * jitter),
    timestamp: new Date(),
  };
}

const formatUSD = (v: number) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BotActivityFeed = () => {
  const [trades, setTrades] = useState<BotTrade[]>([]);
  const [tick, setTick] = useState(0);

  // Seed initial trades
  useEffect(() => {
    const initial: BotTrade[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(generateTrade(i));
    }
    setTrades(initial);
    setTick(5);
  }, []);

  // Add a new trade every 4-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => {
        const next = prev + 1;
        const newTrade = generateTrade(next);
        setTrades(prev => [newTrade, ...prev].slice(0, 20));
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Bot className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[10px] font-bold text-foreground tracking-wider">LIVE BOT ACTIVITY</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono text-[8px] text-green-400">LIVE</span>
        </div>
      </div>
      <div className="max-h-[280px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-2 border-b border-border/30 hover:bg-muted/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm flex-shrink-0">{trade.bot.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-foreground">{trade.bot.name}</span>
                    <span className={`font-mono text-[8px] font-bold px-1 rounded ${
                      trade.side === "buy" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {trade.side === "buy" ? "BUY" : "SELL"}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-muted-foreground truncate">
                    {trade.quantity}x {trade.cardName} · {trade.cardSet}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-[10px] font-semibold text-foreground">{formatUSD(trade.price)}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">
                    {formatUSD(trade.price * trade.quantity)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BotActivityFeed;

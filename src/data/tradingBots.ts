/**
 * AI Trading Bot Opponents for SimTrader™
 * 10 personality-based bots mapped to difficulty tiers
 * © PGVA Ventures, LLC. All rights reserved.
 */

export type BotDifficulty = "easy" | "medium" | "hard";
export type BotStrategy = "momentum" | "value" | "swing" | "random" | "contrarian";

export interface TradingBot {
  id: string;
  name: string;
  avatar: string;
  title: string;
  difficulty: BotDifficulty;
  strategy: BotStrategy;
  description: string;
  /** Daily PnL range as percentage — [min, max] */
  dailyPnlRange: [number, number];
  /** How volatile the bot's returns are (0-1) */
  volatility: number;
  /** Win rate — fraction of days with positive PnL */
  winRate: number;
}

export const TRADING_BOTS: TradingBot[] = [
  // === EASY TIER (3 bots) ===
  {
    id: "bot_casual_carl",
    name: "Casual Carl",
    avatar: "🧢",
    title: "The Dabbler",
    difficulty: "easy",
    strategy: "random",
    description: "Makes random trades with no real strategy. Easy to beat.",
    dailyPnlRange: [-3, 2],
    volatility: 0.4,
    winRate: 0.35,
  },
  {
    id: "bot_slow_susan",
    name: "Slow Susan",
    avatar: "🐢",
    title: "The Cautious Collector",
    difficulty: "easy",
    strategy: "value",
    description: "Only buys cheap cards and holds forever. Very conservative.",
    dailyPnlRange: [-1, 1.5],
    volatility: 0.2,
    winRate: 0.45,
  },
  {
    id: "bot_lucky_larry",
    name: "Lucky Larry",
    avatar: "🍀",
    title: "The Gambler",
    difficulty: "easy",
    strategy: "random",
    description: "Relies on luck over strategy. Sometimes hits big, mostly doesn't.",
    dailyPnlRange: [-4, 3],
    volatility: 0.6,
    winRate: 0.3,
  },

  // === MEDIUM TIER (4 bots) ===
  {
    id: "bot_momentum_mike",
    name: "Momentum Mike",
    avatar: "🚀",
    title: "The Trend Rider",
    difficulty: "medium",
    strategy: "momentum",
    description: "Follows price momentum and rides trends. Solid but predictable.",
    dailyPnlRange: [-2, 3.5],
    volatility: 0.5,
    winRate: 0.52,
  },
  {
    id: "bot_steady_sarah",
    name: "Steady Sarah",
    avatar: "📊",
    title: "The Analyst",
    difficulty: "medium",
    strategy: "value",
    description: "Uses fundamentals to find undervalued cards. Consistent returns.",
    dailyPnlRange: [-1.5, 2.5],
    volatility: 0.3,
    winRate: 0.55,
  },
  {
    id: "bot_swing_sam",
    name: "Swing Sam",
    avatar: "🎯",
    title: "The Day Trader",
    difficulty: "medium",
    strategy: "swing",
    description: "Times entries and exits on short-term swings. Active trader.",
    dailyPnlRange: [-3, 4],
    volatility: 0.55,
    winRate: 0.48,
  },
  {
    id: "bot_contrarian_chloe",
    name: "Contrarian Chloe",
    avatar: "🔄",
    title: "The Rebel",
    difficulty: "medium",
    strategy: "contrarian",
    description: "Buys when others sell, sells when others buy. Bold moves.",
    dailyPnlRange: [-3.5, 4.5],
    volatility: 0.65,
    winRate: 0.47,
  },

  // === HARD TIER (3 bots) ===
  {
    id: "bot_alpha_alex",
    name: "Alpha Alex",
    avatar: "🧠",
    title: "The Quant",
    difficulty: "hard",
    strategy: "momentum",
    description: "AI-driven quantitative analysis. Extremely hard to beat.",
    dailyPnlRange: [-1, 4],
    volatility: 0.35,
    winRate: 0.65,
  },
  {
    id: "bot_whale_wendy",
    name: "Whale Wendy",
    avatar: "🐋",
    title: "The Big Fish",
    difficulty: "hard",
    strategy: "value",
    description: "Makes massive, calculated moves. Deep market knowledge.",
    dailyPnlRange: [-1.5, 5],
    volatility: 0.4,
    winRate: 0.62,
  },
  {
    id: "bot_neural_nate",
    name: "Neural Nate",
    avatar: "⚡",
    title: "The Machine",
    difficulty: "hard",
    strategy: "swing",
    description: "Neural network trading engine. Adapts to market conditions.",
    dailyPnlRange: [-0.5, 3.5],
    volatility: 0.25,
    winRate: 0.68,
  },
];

/**
 * Deterministic seeded random for consistent bot performance per day/contest.
 * Uses a simple hash-based PRNG seeded by bot ID + date string.
 */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to 0-1 range
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

/**
 * Simulate a bot's portfolio value for a given contest/day.
 * Results are deterministic per (botId, contestSeed, dayIndex).
 */
export function simulateBotPerformance(
  bot: TradingBot,
  contestSeed: string,
  startingBalance: number,
  daysElapsed: number,
): { totalValue: number; pnlPct: number; dailyReturns: number[] } {
  let balance = startingBalance;
  const dailyReturns: number[] = [];

  for (let day = 0; day < daysElapsed; day++) {
    const seed = `${bot.id}_${contestSeed}_day${day}`;
    const r = seededRandom(seed);

    // Determine if positive or negative day
    const isWin = r < bot.winRate;

    // Generate daily return within range
    const [minPnl, maxPnl] = bot.dailyPnlRange;
    let dailyPct: number;
    if (isWin) {
      // Positive return: scale between 0 and maxPnl
      const r2 = seededRandom(seed + "_mag");
      dailyPct = r2 * maxPnl * bot.volatility + (maxPnl * (1 - bot.volatility) * 0.5);
    } else {
      // Negative return: scale between minPnl and 0
      const r2 = seededRandom(seed + "_mag");
      dailyPct = minPnl * (0.3 + r2 * 0.7) * bot.volatility + (minPnl * (1 - bot.volatility) * 0.3);
    }

    dailyReturns.push(dailyPct);
    balance *= (1 + dailyPct / 100);
  }

  const pnlPct = ((balance - startingBalance) / startingBalance) * 100;
  return { totalValue: balance, pnlPct, dailyReturns };
}

/**
 * Get leaderboard rankings for all bots + the user in a contest.
 */
export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  title: string;
  difficulty?: BotDifficulty;
  isBot: boolean;
  totalValue: number;
  pnlPct: number;
  rank: number;
}

export function getContestLeaderboard(
  contestSeed: string,
  startingBalance: number,
  daysElapsed: number,
  userEntry?: { name: string; totalValue: number; pnlPct: number },
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = TRADING_BOTS.map(bot => {
    const perf = simulateBotPerformance(bot, contestSeed, startingBalance, Math.max(1, daysElapsed));
    return {
      id: bot.id,
      name: bot.name,
      avatar: bot.avatar,
      title: bot.title,
      difficulty: bot.difficulty,
      isBot: true,
      totalValue: perf.totalValue,
      pnlPct: perf.pnlPct,
      rank: 0,
    };
  });

  if (userEntry) {
    entries.push({
      id: "user",
      name: userEntry.name,
      avatar: "👤",
      title: "You",
      isBot: false,
      totalValue: userEntry.totalValue,
      pnlPct: userEntry.pnlPct,
      rank: 0,
    });
  }

  // Sort by PnL% descending
  entries.sort((a, b) => b.pnlPct - a.pnlPct);
  entries.forEach((e, i) => (e.rank = i + 1));

  return entries;
}

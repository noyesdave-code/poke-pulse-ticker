import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

const ACCENT = "#00d26a";
const GOLD = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const PURPLE = "#a855f7";
const BG = "#060a10";

// ─── Primitives ───

const TextReveal: React.FC<{
  text: string; delay: number; fontSize?: number; color?: string; fontWeight?: number; letterSpacing?: number;
}> = ({ text, delay, fontSize = 56, color = "white", fontWeight = 800, letterSpacing = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [50, 0]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, fontSize, fontWeight, color, fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.15, letterSpacing }}>
      {text}
    </div>
  );
};

const StatBlock: React.FC<{ value: string; label: string; delay: number; color?: string }> = ({ value, label, delay, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: 72, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 18, color: "rgba(255,255,255,0.45)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; delay: number; accent?: string }> = ({ icon, title, desc, delay, accent = ACCENT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return (
    <div style={{
      padding: "28px 24px", borderRadius: 20,
      background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}30`,
      transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
      opacity: s, textAlign: "center", width: 280,
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
};

// ─── Persistent Background ───
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 137.5) % width,
    y: ((i * 97.3) % height) + Math.sin(frame * 0.04 + i) * 40,
    size: 2 + (i % 4) * 1.2,
    opacity: 0.08 + Math.sin(frame * 0.03 + i * 0.8) * 0.06,
    color: [ACCENT, BLUE, GOLD, PURPLE][i % 4],
  }));

  return (
    <>
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.012) * 15}, 55%, 7%) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(215, 50%, 5%) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, hsl(${260 + Math.sin(frame * 0.008) * 20}, 40%, 4%) 0%, transparent 60%),
          linear-gradient(180deg, ${BG} 0%, #0a1220 50%, ${BG} 100%)
        `,
      }} />
      <AbsoluteFill style={{ opacity: 0.035 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 12), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 8), top: 0, bottom: 0, width: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}
    </>
  );
};

// ─── Scene 1: Hook (0–180) ───
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOp = interpolate(frame, [0, 30], [0, 0.8], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowOp * 0.2}) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${pulse})` }}>
        <TextReveal text="YOUR POKÉMON CARDS" delay={5} fontSize={64} color="white" fontWeight={900} />
        <TextReveal text="ARE WORTH MORE" delay={18} fontSize={64} color={ACCENT} fontWeight={900} />
        <TextReveal text="THAN YOU THINK" delay={30} fontSize={64} color={GOLD} fontWeight={900} />
        <Sequence from={55}>
          <TextReveal text="Track. Trade. Dominate." delay={0} fontSize={30} color="rgba(255,255,255,0.5)" fontWeight={500} letterSpacing={6} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Live Market Data (180–360) ───
const SceneMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tickers = [
    { name: "CHARIZARD VMAX", price: "$412.00", change: "+8.2%", up: true },
    { name: "UMBREON VMAX ALT", price: "$289.50", change: "+12.4%", up: true },
    { name: "PIKACHU VSTAR", price: "$89.50", change: "+5.2%", up: true },
    { name: "MEWTWO EX", price: "$156.00", change: "-3.1%", up: false },
    { name: "LUGIA V ALT", price: "$198.00", change: "+7.8%", up: true },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="📊 LIVE MARKET DATA" delay={5} fontSize={52} color={ACCENT} />
        <TextReveal text="Real prices. Real-time updates." delay={15} fontSize={28} color="rgba(255,255,255,0.5)" />
        <div style={{ marginTop: 40 }}>
          {tickers.map((t, i) => {
            const s = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                transform: `translateX(${interpolate(s, [0, 1], [-100, 0])}px)`,
                opacity: s,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 24px", marginBottom: 10,
                background: "rgba(255,255,255,0.04)", borderRadius: 14,
                border: `1px solid ${t.up ? "rgba(0,210,106,0.15)" : "rgba(239,68,68,0.15)"}`,
              }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>{t.name}</div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 800, color: "white" }}>{t.price}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: t.up ? ACCENT : RED, minWidth: 80, textAlign: "right" }}>{t.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Portfolio Tracking (360–540) ───
const ScenePortfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const totalValue = interpolate(frame, [20, 70], [0, 14850], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnl = interpolate(frame, [20, 70], [0, 2340], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Spark line
  const data = [100, 105, 108, 115, 112, 120, 128, 135, 140, 148];
  const sparkW = 340;
  const sparkH = 80;
  const progress = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * sparkW;
    const y = sparkH - ((v - 95) / 55) * sparkH;
    return `${x},${y}`;
  });
  const visiblePts = pts.slice(0, Math.max(2, Math.floor(progress * pts.length)));
  const sparkPath = `M${visiblePts.join("L")}`;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <TextReveal text="💼 YOUR PORTFOLIO" delay={5} fontSize={52} color="white" />
        <TextReveal text="Always know what you own" delay={15} fontSize={26} color="rgba(255,255,255,0.45)" />

        <Sequence from={20}>
          {(() => {
            const cardPop = spring({ frame: frame - 20, fps, config: { damping: 14 } });
            return (
              <div style={{
                marginTop: 40, padding: "36px 44px", borderRadius: 24,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,210,106,0.2)",
                transform: `scale(${cardPop})`, opacity: cardPop,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.35)", letterSpacing: 4, marginBottom: 10 }}>TOTAL VALUE</div>
                <div style={{ fontFamily: "monospace", fontSize: 80, fontWeight: 900, color: "white" }}>
                  ${Math.floor(totalValue).toLocaleString()}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, marginTop: 14 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: ACCENT }}>
                    +${Math.floor(pnl).toLocaleString()} (+18.7%)
                  </span>
                  <svg width={sparkW} height={sparkH}>
                    <path d={sparkPath} fill="none" stroke={ACCENT} strokeWidth={4} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            );
          })()}
        </Sequence>

        <Sequence from={80}>
          <div style={{ marginTop: 30, display: "flex", gap: 30, justifyContent: "center" }}>
            <StatBlock value="47" label="CARDS" delay={82} />
            <StatBlock value="12" label="SETS" delay={90} color={GOLD} />
            <StatBlock value="3" label="ALERTS" delay={98} color={BLUE} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: AI Alpha Signals (540–720) ───
const SceneSignals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const signals = [
    { type: "🔥 BREAKOUT", card: "Charizard ex 223/197", strength: "STRONG", color: RED },
    { type: "📈 MOMENTUM", card: "Umbreon VMAX Alt Art", strength: "MEDIUM", color: GOLD },
    { type: "💎 UNDERVALUED", card: "Pikachu VSTAR TG29", strength: "STRONG", color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="🤖 AI ALPHA SIGNALS" delay={5} fontSize={52} color={PURPLE} />
        <TextReveal text="Spot opportunities before the market" delay={15} fontSize={26} color="rgba(255,255,255,0.45)" />

        <div style={{ marginTop: 40 }}>
          {signals.map((sig, i) => {
            const s = spring({ frame: frame - 30 - i * 12, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{
                transform: `scale(${s})`, opacity: s,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 28px", marginBottom: 14,
                background: `linear-gradient(135deg, rgba(255,255,255,0.04), ${sig.color}10)`,
                borderRadius: 16, border: `1px solid ${sig.color}30`,
              }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, color: sig.color, letterSpacing: 2, marginBottom: 4 }}>{sig.type}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>{sig.card}</div>
                </div>
                <div style={{
                  fontFamily: "monospace", fontSize: 14, color: sig.color,
                  background: `${sig.color}15`, padding: "6px 16px", borderRadius: 8,
                  letterSpacing: 2,
                }}>
                  {sig.strength}
                </div>
              </div>
            );
          })}
        </div>

        <Sequence from={80}>
          <TextReveal text="Daily Spotlight • Trend Detection • RSI Alerts" delay={0} fontSize={22} color={GOLD} fontWeight={600} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Price Prediction Game (720–900) ───
const ScenePredictions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const accuracy = interpolate(frame, [40, 80], [0, 78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const streak = interpolate(frame, [50, 80], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const picks = [
    { card: "Charizard ex", pick: "🐂 BULL", result: "✅", color: ACCENT },
    { card: "Pikachu VMAX", pick: "🐻 BEAR", result: "✅", color: ACCENT },
    { card: "Mewtwo V", pick: "🐂 BULL", result: "❌", color: RED },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="🎯 DAILY PREDICTIONS" delay={5} fontSize={52} color={GOLD} />
        <TextReveal text="Test your market instincts" delay={15} fontSize={26} color="rgba(255,255,255,0.45)" />

        <div style={{ marginTop: 30 }}>
          {picks.map((p, i) => {
            const s = spring({ frame: frame - 28 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 24px", marginBottom: 10,
                background: "rgba(255,255,255,0.04)", borderRadius: 14,
              }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>{p.card}</span>
                <span style={{ fontFamily: "monospace", fontSize: 18, color: p.color }}>{p.pick}</span>
                <span style={{ fontSize: 24 }}>{p.result}</span>
              </div>
            );
          })}
        </div>

        <Sequence from={60}>
          <div style={{ marginTop: 30, display: "flex", gap: 50, justifyContent: "center" }}>
            <StatBlock value={`${Math.floor(accuracy)}%`} label="ACCURACY" delay={62} color={ACCENT} />
            <StatBlock value={`${Math.floor(streak)}`} label="DAY STREAK" delay={70} color={GOLD} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: SimTrader World (900–1110) ───
const SceneSimTrader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const balance = interpolate(frame, [25, 80], [10000, 12745], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bots = [
    { name: "Neural Nate", rank: "#2", pnl: "+18.4%", color: ACCENT },
    { name: "Whale Wendy", rank: "#5", pnl: "+12.1%", color: BLUE },
    { name: "Swing Sara", rank: "#8", pnl: "+9.7%", color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="🎮 SIMTRADER WORLD™" delay={5} fontSize={52} color={ACCENT} fontWeight={900} />
        <TextReveal text="Trade virtual cards with real market data" delay={15} fontSize={24} color="rgba(255,255,255,0.45)" />

        <Sequence from={22}>
          {(() => {
            const s = spring({ frame: frame - 22, fps, config: { damping: 14 } });
            return (
              <div style={{
                marginTop: 30, padding: "28px 36px", borderRadius: 20,
                background: "rgba(0,210,106,0.06)", border: "1px solid rgba(0,210,106,0.2)",
                transform: `scale(${s})`, opacity: s,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.35)", letterSpacing: 3 }}>YOUR PORTFOLIO</div>
                <div style={{ fontFamily: "monospace", fontSize: 60, fontWeight: 900, color: "white", marginTop: 8 }}>
                  ${Math.floor(balance).toLocaleString()}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 26, color: ACCENT, marginTop: 4 }}>
                  +${Math.floor(balance - 10000).toLocaleString()} (+{((balance - 10000) / 100).toFixed(1)}%)
                </div>
              </div>
            );
          })()}
        </Sequence>

        <Sequence from={70}>
          <div style={{ marginTop: 24, fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.3)", letterSpacing: 3, textAlign: "left", marginBottom: 10 }}>
            AI BOT LEADERBOARD
          </div>
          {bots.map((b, i) => {
            const s = spring({ frame: frame - 75 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                opacity: s, transform: `translateX(${interpolate(s, [0, 1], [50, 0])}px)`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 20px", marginBottom: 8,
                background: "rgba(255,255,255,0.03)", borderRadius: 12,
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: b.color }}>{b.rank}</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 600, color: "white" }}>{b.name}</span>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: b.color }}>{b.pnl}</span>
              </div>
            );
          })}
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Pro Tools (1110–1290) ───
const SceneProTools: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%" }}>
        <TextReveal text="⚡ PRO INVESTOR TOOLS" delay={5} fontSize={48} color="white" />

        <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <FeatureCard icon="📊" title="Grading Arbitrage" desc="Find undervalued grading opportunities across PSA, BGS, CGC" delay={20} accent={ACCENT} />
          <FeatureCard icon="📦" title="Sealed Products" desc="Track booster box & ETB values with market trends" delay={32} accent={GOLD} />
          <FeatureCard icon="🐋" title="Whale Reports" desc="See what the biggest collectors are buying & selling" delay={44} accent={BLUE} />
        </div>

        <Sequence from={80}>
          <div style={{ marginTop: 30, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <FeatureCard icon="🔔" title="Price Alerts" desc="Get notified when cards hit your target price" delay={82} accent={RED} />
            <FeatureCard icon="📈" title="Delta Tracking" desc="Monitor price deviation from consensus" delay={94} accent={PURPLE} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: Pricing (1290–1470) ───
const ScenePricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", highlight: false, color: "rgba(255,255,255,0.3)", features: ["Live ticker", "Top movers", "Community"] },
    { name: "PRO", price: "$12/mo", highlight: true, color: ACCENT, features: ["AI signals", "Portfolio P&L", "Price alerts"] },
    { name: "PREMIUM", price: "$29/mo", highlight: false, color: GOLD, features: ["SimTrader™", "Whale reports", "Full API"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%" }}>
        <TextReveal text="START FREE" delay={5} fontSize={56} color="white" />
        <TextReveal text="UPGRADE WHEN YOU'RE READY" delay={15} fontSize={32} color="rgba(255,255,255,0.4)" />

        <div style={{ marginTop: 40, display: "flex", gap: 24, justifyContent: "center" }}>
          {tiers.map((t, i) => {
            const s = spring({ frame: frame - 25 - i * 12, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                width: 260, padding: "32px 24px", borderRadius: 20,
                background: t.highlight ? "rgba(0,210,106,0.08)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${t.highlight ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transform: `scale(${s}) ${t.highlight ? "translateY(-12px)" : ""}`,
                opacity: s,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, color: t.color, letterSpacing: 3, marginBottom: 14 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 44, fontWeight: 900, color: "white", marginBottom: 18 }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 17, color: "rgba(255,255,255,0.45)", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                    <span style={{ color: t.color }}>✓</span> {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 9: Social Proof (1470–1590) ───
const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [95, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <TextReveal text="TRUSTED BY COLLECTORS" delay={5} fontSize={48} color="rgba(255,255,255,0.5)" />
        <div style={{ marginTop: 50, display: "flex", gap: 60, justifyContent: "center" }}>
          <StatBlock value="95" label="AUDIT SCORE" delay={20} color={ACCENT} />
          <StatBlock value="500+" label="CARDS TRACKED" delay={30} color={GOLD} />
          <StatBlock value="24/7" label="LIVE DATA" delay={40} color={BLUE} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 10: CTA (1590–1770) ───
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const urlSpring = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const glowPulse = 0.3 + Math.sin(frame * 0.06) * 0.15;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`,
        filter: "blur(80px)",
      }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring * pulse})`, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: 900, color: "white", marginBottom: 8 }}>
          SIGN UP FREE
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: 900, color: ACCENT, marginBottom: 30 }}>
          TODAY
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 28, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
          50% off Pro for early adopters
        </div>
        <div style={{
          transform: `scale(${urlSpring})`,
          fontFamily: "monospace", fontSize: 28, color: ACCENT,
          background: "rgba(0, 210, 106, 0.1)",
          border: "2px solid rgba(0, 210, 106, 0.4)",
          padding: "20px 60px", borderRadius: 16, letterSpacing: 2,
        }}>
          poke-pulse-ticker.lovable.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───
export const FeatureShowcase: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={0} durationInFrames={180}><SceneHook /></Sequence>
      <Sequence from={180} durationInFrames={180}><SceneMarket /></Sequence>
      <Sequence from={360} durationInFrames={180}><ScenePortfolio /></Sequence>
      <Sequence from={540} durationInFrames={180}><SceneSignals /></Sequence>
      <Sequence from={720} durationInFrames={180}><ScenePredictions /></Sequence>
      <Sequence from={900} durationInFrames={210}><SceneSimTrader /></Sequence>
      <Sequence from={1110} durationInFrames={180}><SceneProTools /></Sequence>
      <Sequence from={1290} durationInFrames={180}><ScenePricing /></Sequence>
      <Sequence from={1470} durationInFrames={120}><SceneSocialProof /></Sequence>
      <Sequence from={1590} durationInFrames={180}><SceneCTA /></Sequence>

      {/* Branding watermark */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center",
        fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.12)", letterSpacing: 3,
      }}>
        PGVA, LLC. &amp; NOYES FAMILY TRUST
      </div>
    </AbsoluteFill>
  );
};

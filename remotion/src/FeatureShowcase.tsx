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

  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: (i * 137.5 + 40) % (width - 80),
    y: ((i * 157.3) % (height - 80)) + Math.sin(frame * 0.025 + i) * 30,
    size: 1.5 + (i % 3) * 0.8,
    opacity: 0.04 + Math.sin(frame * 0.02 + i * 0.8) * 0.03,
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
      <AbsoluteFill style={{ opacity: 0.015 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 6), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}
    </>
  );
};

// ─── Scene 1: Hook (0–150) ───
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOp = interpolate(frame, [0, 30], [0, 0.8], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowOp * 0.2}) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${pulse})` }}>
        <TextReveal text="YOUR POKÉMON CARDS" delay={5} fontSize={52} color="white" fontWeight={900} />
        <TextReveal text="ARE WORTH MORE" delay={18} fontSize={52} color={ACCENT} fontWeight={900} />
        <TextReveal text="THAN YOU THINK" delay={30} fontSize={52} color={GOLD} fontWeight={900} />
        <Sequence from={50}>
          <TextReveal text="Track. Trade. Compete." delay={0} fontSize={26} color="rgba(255,255,255,0.5)" fontWeight={500} letterSpacing={5} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Live Market Data (150–310) ───
const SceneMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        <TextReveal text="📊 LIVE MARKET DATA" delay={5} fontSize={42} color={ACCENT} />
        <TextReveal text="3 indexes · 500+ cards · Updated hourly" delay={15} fontSize={22} color="rgba(255,255,255,0.5)" />
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

// ─── Scene 3: Portfolio (310–470) ───
const ScenePortfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const totalValue = interpolate(frame, [20, 70], [0, 14850], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnl = interpolate(frame, [20, 70], [0, 2340], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const data = [100, 105, 108, 115, 112, 120, 128, 135, 140, 148];
  const sparkW = 340; const sparkH = 80;
  const progress = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * sparkW},${sparkH - ((v - 95) / 55) * sparkH}`);
  const visiblePts = pts.slice(0, Math.max(2, Math.floor(progress * pts.length)));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <TextReveal text="💼 PORTFOLIO TRACKER" delay={5} fontSize={42} color="white" />
        <TextReveal text="Know what you own & what it's worth" delay={15} fontSize={22} color="rgba(255,255,255,0.45)" />
        <Sequence from={20}>
          {(() => {
            const cardPop = spring({ frame: frame - 20, fps, config: { damping: 14 } });
            return (
              <div style={{ marginTop: 40, padding: "36px 44px", borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,210,106,0.2)", transform: `scale(${cardPop})`, opacity: cardPop }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.35)", letterSpacing: 4, marginBottom: 10 }}>TOTAL VALUE</div>
                <div style={{ fontFamily: "monospace", fontSize: 80, fontWeight: 900, color: "white" }}>${Math.floor(totalValue).toLocaleString()}</div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, marginTop: 14 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: ACCENT }}>+${Math.floor(pnl).toLocaleString()} (+18.7%)</span>
                  <svg width={sparkW} height={sparkH}><path d={`M${visiblePts.join("L")}`} fill="none" stroke={ACCENT} strokeWidth={4} strokeLinecap="round" /></svg>
                </div>
              </div>
            );
          })()}
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: AI Signals (470–630) ───
const SceneSignals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const signals = [
    { type: "🔥 BREAKOUT", card: "Charizard ex 223/197", strength: "STRONG", color: RED },
    { type: "📈 MOMENTUM", card: "Umbreon VMAX Alt Art", strength: "MEDIUM", color: GOLD },
    { type: "💎 UNDERVALUED", card: "Pikachu VSTAR TG29", strength: "STRONG", color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="🤖 AI ALPHA SIGNALS" delay={5} fontSize={42} color={PURPLE} />
        <TextReveal text="Spot opportunities before the market" delay={15} fontSize={22} color="rgba(255,255,255,0.45)" />
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
                <div style={{ fontFamily: "monospace", fontSize: 14, color: sig.color, background: `${sig.color}15`, padding: "6px 16px", borderRadius: 8, letterSpacing: 2 }}>{sig.strength}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: SimTrader World (630–810) ───
const SceneSimTrader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const balance = interpolate(frame, [25, 80], [10000, 12745], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bots = [
    { name: "Neural Nate", rank: "#2", pnl: "+18.4%", color: ACCENT },
    { name: "Whale Wendy", rank: "#5", pnl: "+12.1%", color: BLUE },
    { name: "Swing Sara", rank: "#8", pnl: "+9.7%", color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="🎮 SIMTRADER WORLD™" delay={5} fontSize={42} color={ACCENT} fontWeight={900} />
        <TextReveal text="Paper trade with real market prices" delay={15} fontSize={22} color="rgba(255,255,255,0.45)" />
        <Sequence from={22}>
          {(() => {
            const s = spring({ frame: frame - 22, fps, config: { damping: 14 } });
            return (
              <div style={{ marginTop: 30, padding: "28px 36px", borderRadius: 20, background: "rgba(0,210,106,0.06)", border: "1px solid rgba(0,210,106,0.2)", transform: `scale(${s})`, opacity: s }}>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.35)", letterSpacing: 3 }}>YOUR PORTFOLIO</div>
                <div style={{ fontFamily: "monospace", fontSize: 60, fontWeight: 900, color: "white", marginTop: 8 }}>${Math.floor(balance).toLocaleString()}</div>
                <div style={{ fontFamily: "monospace", fontSize: 26, color: ACCENT, marginTop: 4 }}>+${Math.floor(balance - 10000).toLocaleString()} (+{((balance - 10000) / 100).toFixed(1)}%)</div>
              </div>
            );
          })()}
        </Sequence>
        <Sequence from={70}>
          <div style={{ marginTop: 20, fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 3, textAlign: "left", marginBottom: 8 }}>AI BOT LEADERBOARD</div>
          {bots.map((b, i) => {
            const s = spring({ frame: frame - 75 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{ opacity: s, transform: `translateX(${interpolate(s, [0, 1], [50, 0])}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
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

// ─── Scene 6: Arena (810–990) — NEW ───
const SceneArena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const coinBalance = interpolate(frame, [30, 70], [0, 25000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const activities = [
    { label: "🎲 Price Bet", desc: "Charizard VMAX — BULL 🐂", result: "+1,950 PC", color: ACCENT },
    { label: "📦 Pack Open", desc: "Champion Chest — ✨ Ultra Rare!", result: "+3,200 PC", color: GOLD },
    { label: "🏆 Tournament", desc: "Daily Showdown — Rank #3", result: "+5,000 PC", color: PURPLE },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%" }}>
        <TextReveal text="⚡ POKE-PULSE ARENA™" delay={5} fontSize={40} color={GOLD} fontWeight={900} />
        <TextReveal text="Bet PokéCoins on real card prices" delay={15} fontSize={22} color="rgba(255,255,255,0.45)" />

        <Sequence from={25}>
          {(() => {
            const s = spring({ frame: frame - 25, fps, config: { damping: 14 } });
            return (
              <div style={{ marginTop: 28, padding: "24px 36px", borderRadius: 20, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", transform: `scale(${s})`, opacity: s, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                <span style={{ fontSize: 42 }}>🪙</span>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.35)", letterSpacing: 3 }}>POKECOINS</div>
                  <div style={{ fontFamily: "monospace", fontSize: 52, fontWeight: 900, color: GOLD }}>{Math.floor(coinBalance).toLocaleString()}</div>
                </div>
              </div>
            );
          })()}
        </Sequence>

        <div style={{ marginTop: 24 }}>
          {activities.map((a, i) => {
            const s = spring({ frame: frame - 55 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", marginBottom: 10, background: "rgba(255,255,255,0.04)", borderRadius: 14, border: `1px solid ${a.color}20` }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: a.color, letterSpacing: 1 }}>{a.label}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 600, color: "white" }}>{a.desc}</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: a.color }}>{a.result}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Pro Tools (990–1150) ───
const SceneProTools: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%" }}>
        <TextReveal text="⚡ PRO TOOLS" delay={5} fontSize={42} color="white" />
        <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <FeatureCard icon="📊" title="Grading Arbitrage" desc="Find undervalued grading opportunities" delay={20} accent={ACCENT} />
          <FeatureCard icon="🐋" title="Whale Reports" desc="See what top collectors are buying" delay={32} accent={BLUE} />
          <FeatureCard icon="🔔" title="Price Alerts" desc="Notified when cards hit targets" delay={44} accent={RED} />
        </div>
        <Sequence from={70}>
          <div style={{ marginTop: 24, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <FeatureCard icon="📈" title="Delta Tracking" desc="Price deviation monitoring" delay={72} accent={PURPLE} />
            <FeatureCard icon="📦" title="Sealed Tracker" desc="Booster box & ETB values" delay={84} accent={GOLD} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: Pricing (1150–1330) ───
const ScenePricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", highlight: false, color: "rgba(255,255,255,0.3)", features: ["Live ticker", "Top movers", "Community"] },
    { name: "ARENA", price: "$0.99", highlight: false, color: GOLD, features: ["Price bets", "Pack opens", "Tournaments"] },
    { name: "PRO", price: "$9/mo", highlight: true, color: ACCENT, features: ["AI signals", "Full board", "Price alerts"] },
    { name: "PREMIUM", price: "$39/mo", highlight: false, color: PURPLE, features: ["SimTrader™", "Whale reports", "API access"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "92%" }}>
        <TextReveal text="START AT $0.99" delay={5} fontSize={44} color="white" />
        <TextReveal text="LESS THAN A COFFEE ☕" delay={15} fontSize={24} color={GOLD} />
        <div style={{ marginTop: 36, display: "flex", gap: 16, justifyContent: "center" }}>
          {tiers.map((t, i) => {
            const s = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                width: 220, padding: "28px 18px", borderRadius: 18,
                background: t.highlight ? "rgba(0,210,106,0.08)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${t.highlight ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transform: `scale(${s}) ${t.highlight ? "translateY(-10px)" : ""}`, opacity: s,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: t.color, letterSpacing: 3, marginBottom: 10 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: 900, color: "white", marginBottom: 14 }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
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

// ─── Scene 9: Social Proof (1330–1460) ───
const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [105, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

// ─── Scene 10: CTA (1460–1620) ───
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
        <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: 900, color: "white", marginBottom: 8 }}>SIGN UP FREE</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: 900, color: ACCENT, marginBottom: 30 }}>TODAY</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 28, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>Arena access from just $0.99</div>
        <div style={{
          transform: `scale(${urlSpring})`,
          fontFamily: "monospace", fontSize: 28, color: ACCENT,
          background: "rgba(0, 210, 106, 0.1)",
          border: "2px solid rgba(0, 210, 106, 0.4)",
          padding: "20px 60px", borderRadius: 16, letterSpacing: 2,
        }}>
          poke-pulse-ticker.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition (59 seconds = 1770 frames @ 30fps) ───
export const FeatureShowcase: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={0} durationInFrames={150}><SceneHook /></Sequence>
      <Sequence from={150} durationInFrames={160}><SceneMarket /></Sequence>
      <Sequence from={310} durationInFrames={160}><ScenePortfolio /></Sequence>
      <Sequence from={470} durationInFrames={160}><SceneSignals /></Sequence>
      <Sequence from={630} durationInFrames={180}><SceneSimTrader /></Sequence>
      <Sequence from={810} durationInFrames={180}><SceneArena /></Sequence>
      <Sequence from={990} durationInFrames={160}><SceneProTools /></Sequence>
      <Sequence from={1150} durationInFrames={180}><ScenePricing /></Sequence>
      <Sequence from={1330} durationInFrames={130}><SceneSocialProof /></Sequence>
      <Sequence from={1460} durationInFrames={310}><SceneCTA /></Sequence>

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

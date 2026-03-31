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
const BG = "#060a10";

// ─── Reusable Primitives ───

const TextReveal: React.FC<{
  text: string; delay: number; fontSize?: number; color?: string; fontWeight?: number; letterSpacing?: number;
}> = ({ text, delay, fontSize = 48, color = "white", fontWeight = 800, letterSpacing = 0 }) => {
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
      <div style={{ fontFamily: "monospace", fontSize: 48, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", letterSpacing: 3, marginTop: 6, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// ─── Scene 1: Title (0–120) ───
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOp = interpolate(frame, [0, 30], [0, 0.7], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowOp * 0.2}) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <TextReveal text="POKE PULSE TICKER" delay={5} fontSize={64} color={ACCENT} fontWeight={900} letterSpacing={4} />
        <Sequence from={20}>
          <TextReveal text="INVESTOR PITCH" delay={0} fontSize={32} color="rgba(255,255,255,0.5)" fontWeight={600} letterSpacing={6} />
        </Sequence>
        <Sequence from={40}>
          <TextReveal text="Q1 2026" delay={0} fontSize={24} color={GOLD} fontWeight={700} letterSpacing={3} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Audit Score (120–300) ───
const SceneAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Animate score counting
  const scoreProgress = interpolate(frame, [15, 60], [0, 95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayScore = Math.floor(scoreProgress);

  // Ring animation
  const ringProgress = interpolate(frame, [15, 70], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 120;
  const strokeDash = circumference * ringProgress;

  const categories = [
    { name: "Aesthetics", score: 96 },
    { name: "Efficiency", score: 97 },
    { name: "Info Quality", score: 95 },
    { name: "Security", score: 93 },
    { name: "Legal", score: 96 },
    { name: "Capital Intake", score: 94 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 22, color: "rgba(255,255,255,0.4)", letterSpacing: 5, marginBottom: 30, textTransform: "uppercase" }}>
          Platform Audit Score
        </div>

        {/* Score ring */}
        <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto 30px" }}>
          <svg width={280} height={280} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={140} cy={140} r={120} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
            <circle cx={140} cy={140} r={120} fill="none" stroke={ACCENT} strokeWidth={10}
              strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 80, fontWeight: 900, color: "white" }}>{displayScore}</div>
            <div style={{ fontFamily: "monospace", fontSize: 20, color: "rgba(255,255,255,0.4)" }}>/100</div>
          </div>
        </div>

        {/* Category bars */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 500, margin: "0 auto" }}>
          {categories.map((cat, i) => {
            const barSpring = spring({ frame: frame - 70 - i * 8, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ width: 150, opacity: barSpring, transform: `translateY(${interpolate(barSpring, [0, 1], [20, 0])}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{cat.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: ACCENT }}>{cat.score}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cat.score}%`, background: ACCENT, borderRadius: 2, transform: `scaleX(${barSpring})`, transformOrigin: "left" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Subscription Tiers (300–490) ───
const SceneTiers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [170, 190], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", color: "rgba(255,255,255,0.3)", features: ["Market ticker", "Top movers", "Community"] },
    { name: "PRO", price: "$12/mo", color: ACCENT, features: ["Real-time data", "AI signals", "Portfolio P&L"] },
    { name: "PREMIUM", price: "$29/mo", color: GOLD, features: ["API access", "SimTrader™", "Tax reports"] },
    { name: "TEAM", price: "$79/mo", color: BLUE, features: ["3 seats", "LGS tools", "B2B dashboard"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%" }}>
        <TextReveal text="REVENUE MODEL" delay={5} fontSize={36} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <TextReveal text="4 SUBSCRIPTION TIERS" delay={12} fontSize={44} color="white" />

        <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {tiers.map((t, i) => {
            const cardSpring = spring({ frame: frame - 30 - i * 12, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{
                width: 200, padding: "20px 16px", borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: `1px solid ${i === 1 ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transform: `scale(${cardSpring}) ${i === 1 ? "translateY(-8px)" : ""}`,
                opacity: cardSpring,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: t.color, letterSpacing: 3, marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 900, color: "white", marginBottom: 12 }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: t.color, fontSize: 10 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <Sequence from={100}>
          <TextReveal text="ARR potential: $500K+ at 3,000 subs" delay={0} fontSize={22} color={GOLD} fontWeight={600} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Competitive Edge (490–680) ───
const SceneCompetitive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [170, 190], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rows = [
    { feature: "Real-time pricing", us: true, tcg: false, rare: false },
    { feature: "AI signal analysis", us: true, tcg: false, rare: false },
    { feature: "SimTrader™ game", us: true, tcg: false, rare: false },
    { feature: "Portfolio P&L", us: true, tcg: false, rare: true },
    { feature: "Grading arbitrage", us: true, tcg: false, rare: false },
    { feature: "Trading contests", us: true, tcg: false, rare: false },
    { feature: "Price alerts", us: true, tcg: true, rare: true },
    { feature: "Market indices", us: true, tcg: false, rare: false },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ width: "88%", textAlign: "center" }}>
        <TextReveal text="COMPETITIVE ADVANTAGE" delay={5} fontSize={36} color="white" />

        <div style={{ marginTop: 35 }}>
          {/* Header */}
          <div style={{ display: "flex", padding: "0 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Feature</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: ACCENT, textAlign: "center" }}>US</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>TCGPlayer</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>RareCandy</div>
          </div>

          {rows.map((row, i) => {
            const rowSpring = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{
                display: "flex", padding: "8px 12px", alignItems: "center",
                opacity: rowSpring, transform: `translateX(${interpolate(rowSpring, [0, 1], [-30, 0])}px)`,
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
                <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "left" }}>{row.feature}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 16 }}>{row.us ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 16 }}>{row.tcg ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 16 }}>{row.rare ? "✅" : "❌"}</div>
              </div>
            );
          })}
        </div>

        <Sequence from={110}>
          <TextReveal text="8 of 8 exclusive features" delay={0} fontSize={24} color={ACCENT} fontWeight={700} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Key Metrics (680–820) ───
const SceneMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.015;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", transform: `scale(${pulse})` }}>
        <TextReveal text="BY THE NUMBERS" delay={5} fontSize={34} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center", flexWrap: "wrap" }}>
          <StatBlock value="500+" label="Cards Tracked" delay={15} />
          <StatBlock value="95" label="Audit Score" delay={25} color={GOLD} />
          <StatBlock value="4" label="Revenue Tiers" delay={35} />
          <StatBlock value="24/7" label="Live Data" delay={45} color={BLUE} />
        </div>

        <Sequence from={70}>
          <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center" }}>
            <StatBlock value="$43B" label="TCG Market" delay={75} color={GOLD} />
            <StatBlock value="0" label="Direct Competitors" delay={85} color={ACCENT} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (820–900) ───
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const glowPulse = 0.3 + Math.sin(frame * 0.06) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(80px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring})`, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 52, fontWeight: 900, color: "white", marginBottom: 10 }}>LET'S BUILD</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 52, fontWeight: 900, color: ACCENT, marginBottom: 30 }}>TOGETHER</div>
        <div style={{ fontFamily: "monospace", fontSize: 20, color: "rgba(255,255,255,0.4)", letterSpacing: 4 }}>PGVA VENTURES, LLC.</div>
        <Sequence from={25}>
          <TextReveal text="noyes.dave@gmail.com" delay={0} fontSize={18} color={ACCENT} fontWeight={500} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───
export const InvestorPitch: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const y = baseY + Math.sin(frame * 0.03 + i) * 40;
    const size = 2 + (i % 3) * 1.5;
    const opacity = 0.08 + Math.sin(frame * 0.025 + i * 0.8) * 0.05;
    const colors = [ACCENT, BLUE, GOLD, RED];
    return { x, y, size, opacity, color: colors[i % 4] };
  });

  return (
    <AbsoluteFill>
      {/* Animated background */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.012) * 12}, 50%, 6%) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(215, 45%, 5%) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, hsl(${260 + Math.sin(frame * 0.008) * 15}, 35%, 4%) 0%, transparent 60%),
          linear-gradient(180deg, ${BG} 0%, #0a1220 50%, ${BG} 100%)
        `,
      }} />

      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.03 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 10), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 7), top: 0, bottom: 0, width: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}

      {/* Scenes */}
      <Sequence from={0} durationInFrames={130}><SceneTitle /></Sequence>
      <Sequence from={120} durationInFrames={190}><SceneAudit /></Sequence>
      <Sequence from={300} durationInFrames={200}><SceneTiers /></Sequence>
      <Sequence from={490} durationInFrames={200}><SceneCompetitive /></Sequence>
      <Sequence from={680} durationInFrames={150}><SceneMetrics /></Sequence>
      <Sequence from={820}><SceneCTA /></Sequence>

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: 25, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 3 }}>
        CONFIDENTIAL — INVESTOR USE ONLY
      </div>
    </AbsoluteFill>
  );
};

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

const ACCENT = "#00d26a";
const GOLD = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const BG = "#060a10";

// ─── Reusable Primitives ───

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

const StatBlock: React.FC<{ value: string; label: string; delay: number; color?: string; large?: boolean }> = ({ value, label, delay, color = ACCENT, large }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  const sz = large ? 72 : 56;
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: sz, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.45)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// ─── Scene 1: Title (0–183) ───
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOp = interpolate(frame, [0, 30], [0, 0.7], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 183], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowOp * 0.25}) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <TextReveal text="POKE PULSE TICKER" delay={5} fontSize={80} color={ACCENT} fontWeight={900} letterSpacing={6} />
        <Sequence from={20}>
          <TextReveal text="INVESTOR PITCH" delay={0} fontSize={40} color="rgba(255,255,255,0.5)" fontWeight={600} letterSpacing={8} />
        </Sequence>
        <Sequence from={40}>
          <TextReveal text="Q1 2026" delay={0} fontSize={32} color={GOLD} fontWeight={700} letterSpacing={4} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Audit Score (183–481) ───
const SceneAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [270, 298], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scoreProgress = interpolate(frame, [15, 70], [0, 95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayScore = Math.floor(scoreProgress);
  const ringProgress = interpolate(frame, [15, 80], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 160;
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
        <div style={{ fontFamily: "sans-serif", fontSize: 28, color: "rgba(255,255,255,0.4)", letterSpacing: 6, marginBottom: 35, textTransform: "uppercase" }}>
          Platform Audit Score
        </div>
        <div style={{ position: "relative", width: 360, height: 360, margin: "0 auto 40px" }}>
          <svg width={360} height={360} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={180} cy={180} r={160} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
            <circle cx={180} cy={180} r={160} fill="none" stroke={ACCENT} strokeWidth={12}
              strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 100, fontWeight: 900, color: "white" }}>{displayScore}</div>
            <div style={{ fontFamily: "monospace", fontSize: 24, color: "rgba(255,255,255,0.4)" }}>/100</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", maxWidth: 650, margin: "0 auto" }}>
          {categories.map((cat, i) => {
            const barSpring = spring({ frame: frame - 80 - i * 10, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ width: 190, opacity: barSpring, transform: `translateY(${interpolate(barSpring, [0, 1], [20, 0])}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{cat.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 14, color: ACCENT }}>{cat.score}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cat.score}%`, background: ACCENT, borderRadius: 3, transform: `scaleX(${barSpring})`, transformOrigin: "left" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Subscription Tiers (481–988) ───
const SceneTiers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [480, 507], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", color: "rgba(255,255,255,0.3)", features: ["Market ticker", "Top movers", "Community"] },
    { name: "PRO", price: "$12/mo", color: ACCENT, features: ["Real-time data", "AI signals", "Portfolio P&L"] },
    { name: "PREMIUM", price: "$29/mo", color: GOLD, features: ["API access", "SimTrader™", "Tax reports"] },
    { name: "TEAM", price: "$79/mo", color: BLUE, features: ["3 seats", "LGS tools", "B2B dashboard"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%" }}>
        <TextReveal text="REVENUE MODEL" delay={5} fontSize={40} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <TextReveal text="4 SUBSCRIPTION TIERS" delay={12} fontSize={52} color="white" />
        <div style={{ marginTop: 50, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          {tiers.map((t, i) => {
            const cardSpring = spring({ frame: frame - 30 - i * 15, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{
                width: 260, padding: "28px 22px", borderRadius: 18,
                background: "rgba(255,255,255,0.04)", border: `1px solid ${i === 1 ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transform: `scale(${cardSpring}) ${i === 1 ? "translateY(-12px)" : ""}`,
                opacity: cardSpring,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 14, color: t.color, letterSpacing: 4, marginBottom: 10 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: 900, color: "white", marginBottom: 16 }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: t.color, fontSize: 12 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <Sequence from={200}>
          <TextReveal text="ARR potential: $500K+ at 3,000 subs" delay={0} fontSize={28} color={GOLD} fontWeight={600} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Competitive Edge (988–1353) ───
const SceneCompetitive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [340, 365], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      <div style={{ width: "85%", textAlign: "center" }}>
        <TextReveal text="COMPETITIVE ADVANTAGE" delay={5} fontSize={44} color="white" />
        <div style={{ marginTop: 45 }}>
          <div style={{ display: "flex", padding: "0 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Feature</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 14, color: ACCENT, textAlign: "center" }}>US</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>TCGPlayer</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>RareCandy</div>
          </div>
          {rows.map((row, i) => {
            const rowSpring = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{
                display: "flex", padding: "12px 16px", alignItems: "center",
                opacity: rowSpring, transform: `translateX(${interpolate(rowSpring, [0, 1], [-30, 0])}px)`,
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
                <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 17, color: "rgba(255,255,255,0.7)", textAlign: "left" }}>{row.feature}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 20 }}>{row.us ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 20 }}>{row.tcg ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 20 }}>{row.rare ? "✅" : "❌"}</div>
              </div>
            );
          })}
        </div>
        <Sequence from={180}>
          <TextReveal text="8 of 8 exclusive features" delay={0} fontSize={30} color={ACCENT} fontWeight={700} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Key Metrics (1353–1626) ───
const SceneMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [245, 273], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.012;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", transform: `scale(${pulse})` }}>
        <TextReveal text="BY THE NUMBERS" delay={5} fontSize={42} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <div style={{ marginTop: 50, display: "flex", gap: 70, justifyContent: "center", flexWrap: "wrap" }}>
          <StatBlock value="500+" label="Cards Tracked" delay={15} large />
          <StatBlock value="95" label="Audit Score" delay={25} color={GOLD} large />
          <StatBlock value="4" label="Revenue Tiers" delay={35} large />
          <StatBlock value="24/7" label="Live Data" delay={45} color={BLUE} large />
        </div>
        <Sequence from={80}>
          <div style={{ marginTop: 50, display: "flex", gap: 70, justifyContent: "center" }}>
            <StatBlock value="$43B" label="TCG Market" delay={0} color={GOLD} large />
            <StatBlock value="0" label="Direct Competitors" delay={10} color={ACCENT} large />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (1626–1852) ───
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const glowPulse = 0.3 + Math.sin(frame * 0.06) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(80px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring})`, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 68, fontWeight: 900, color: "white", marginBottom: 12 }}>LET'S BUILD</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 68, fontWeight: 900, color: ACCENT, marginBottom: 35 }}>TOGETHER</div>
        <div style={{ fontFamily: "monospace", fontSize: 26, color: "rgba(255,255,255,0.4)", letterSpacing: 5 }}>PGVA VENTURES, LLC.</div>
        <Sequence from={25}>
          <TextReveal text="noyes.dave@gmail.com" delay={0} fontSize={22} color={ACCENT} fontWeight={500} />
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

  // Scene timings (frames): intro=183, audit=298, tiers=507, competitive=365, metrics=273, cta=226
  const S1 = 0, S1D = 183;
  const S2 = 183, S2D = 298;
  const S3 = 481, S3D = 507;
  const S4 = 988, S4D = 365;
  const S5 = 1353, S5D = 273;
  const S6 = 1626, S6D = 226;

  return (
    <AbsoluteFill>
      {/* Background */}
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

      {/* Voiceover Audio */}
      <Sequence from={S1}><Audio src={staticFile("audio/intro.mp3")} volume={1} /></Sequence>
      <Sequence from={S2}><Audio src={staticFile("audio/audit.mp3")} volume={1} /></Sequence>
      <Sequence from={S3}><Audio src={staticFile("audio/tiers.mp3")} volume={1} /></Sequence>
      <Sequence from={S4}><Audio src={staticFile("audio/competitive.mp3")} volume={1} /></Sequence>
      <Sequence from={S5}><Audio src={staticFile("audio/metrics.mp3")} volume={1} /></Sequence>
      <Sequence from={S6}><Audio src={staticFile("audio/cta.mp3")} volume={1} /></Sequence>

      {/* Scenes */}
      <Sequence from={S1} durationInFrames={S1D}><SceneTitle /></Sequence>
      <Sequence from={S2} durationInFrames={S2D}><SceneAudit /></Sequence>
      <Sequence from={S3} durationInFrames={S3D}><SceneTiers /></Sequence>
      <Sequence from={S4} durationInFrames={S4D}><SceneCompetitive /></Sequence>
      <Sequence from={S5} durationInFrames={S5D}><SceneMetrics /></Sequence>
      <Sequence from={S6} durationInFrames={S6D}><SceneCTA /></Sequence>

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.12)", letterSpacing: 4 }}>
        CONFIDENTIAL — INVESTOR USE ONLY
      </div>
    </AbsoluteFill>
  );
};

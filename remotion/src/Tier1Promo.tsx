import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#EAB308";
const GREEN = "#22C55E";
const CYAN = "#06B6D4";
const BG = "#050B15";
const NAVY = "#0A1628";

const FadeText: React.FC<{ text: string; delay: number; size?: number; color?: string; weight?: number; family?: string }> = 
  ({ text, delay, size = 48, color = "white", weight = 800, family = orbitron }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [30, 0]);
  return <div style={{ transform: `translateY(${y}px)`, opacity, fontSize: size, fontWeight: weight, color, fontFamily: family, textAlign: "center", lineHeight: 1.2 }}>{text}</div>;
};

const Glow: React.FC<{ color: string; x?: string; y?: string; size?: number }> = ({ color, x = "50%", y = "50%", size = 600 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: "blur(60px)", opacity: 0.15 }} />
);

const StatBlock: React.FC<{ value: string; label: string; delay: number; color?: string }> = ({ value, label, delay, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})`, minWidth: 160 }}>
      <div style={{ fontFamily: orbitron, fontSize: 52, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: inter, fontSize: 14, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginTop: 6, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// Scene 1: Hero (0-180)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.1 + 0.9;
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="PokéGarageVA™" delay={5} size={80} color={GOLD} weight={900} />
        <FadeText text="TIER 1 — HYBRID FRANCHISE" delay={15} size={32} color="white" weight={700} />
        <div style={{ height: 30 }} />
        <FadeText text="The Original Home-Based Franchise Model — Est. 2022" delay={30} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 20 }} />
        <div style={{ opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: inter, fontSize: 14, color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 20, padding: "8px 24px", background: `${GOLD}10` }}>⚡ LIVE NOW — 14-DAY FREE TRIAL</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", fontFamily: inter, fontSize: 11, color: "#475569" }}>© PGVA VENTURES, LLC</div>
    </AbsoluteFill>
  );
};

// Scene 2: Products Grid (180-390)
const SceneProducts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const products = [
    { name: "Live Market Indexes", icon: "📊", desc: "500+ cards tracked in real-time" },
    { name: "AI Alpha Signals™", icon: "🧠", desc: "ML-powered buy/sell/hold alerts" },
    { name: "SimTrader World™", icon: "🎮", desc: "Paper-trade risk-free" },
    { name: "Poké-Pulse Arena™", icon: "🏆", desc: "Prediction markets & PvP wagering" },
    { name: "PokéKids Adventure™", icon: "👾", desc: "Pokémon battle card game" },
    { name: "Portfolio Tracker", icon: "💼", desc: "P&L, snapshots, performance" },
    { name: "Grading Arbitrage", icon: "🔍", desc: "PSA/BGS spread analysis" },
    { name: "Whale Reports", icon: "🐋", desc: "Institutional-grade intel" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GREEN} x="30%" y="30%" size={500} />
      <Glow color={CYAN} x="70%" y="70%" size={500} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <FadeText text="8 POWERFUL ENGINES" delay={5} size={48} color={GOLD} weight={900} />
        <div style={{ height: 30 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 900, width: "100%" }}>
          {products.map((p, i) => {
            const s = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 18 } });
            return (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 18px", transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`, opacity: s }}>
                <span style={{ fontSize: 32 }}>{p.icon}</span>
                <div>
                  <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 700, color: "white" }}>{p.name}</div>
                  <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{p.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Games Focus (390-570)
const SceneGames: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.06) * 8;
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 40%, #1a0a2e, ${BG})` }}>
      <Glow color="#a855f7" x="50%" y="40%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="PLAY. COMPETE. WIN." delay={5} size={64} color="#a855f7" weight={900} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", gap: 40, marginTop: 10 }}>
          {[
            { name: "SimTrader World™", icon: "🎮", desc: "Virtual trading with leaderboards", color: GREEN },
            { name: "Poké-Pulse Arena™", icon: "🏆", desc: "PvP prediction markets", color: GOLD },
            { name: "PokéKids Adventure™", icon: "👾", desc: "Pokémon battle card game", color: CYAN },
          ].map((g, i) => {
            const s = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={g.name} style={{ textAlign: "center", transform: `scale(${s}) translateY(${i === 1 ? pulse : -pulse}px)`, width: 220 }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>{g.icon}</div>
                <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: g.color, marginBottom: 6 }}>{g.name}</div>
                <div style={{ fontFamily: inter, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{g.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Social Proof (570-750)
const SceneSocial: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GREEN} x="50%" y="50%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="THE NUMBERS DON'T LIE" delay={5} size={48} color="white" weight={900} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 60 }}>
          <StatBlock value="500+" label="Cards Tracked" delay={15} color={GOLD} />
          <StatBlock value="7" label="Subscription Tiers" delay={25} color={GREEN} />
          <StatBlock value="3" label="Games Built In" delay={35} color={CYAN} />
        </div>
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", gap: 60 }}>
          <StatBlock value="24/7" label="Live Data" delay={45} color="#a855f7" />
          <StatBlock value="FREE" label="14-Day Trial" delay={55} color={GOLD} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (750-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.08) * 0.05 + 1;
  const glowPulse = Math.sin(frame * 0.06) * 0.1 + 0.25;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="45%" size={900} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="YOUR EDGE STARTS NOW" delay={5} size={64} color={GOLD} weight={900} />
        <div style={{ height: 20 }} />
        <FadeText text="14-Day Free Trial — No Credit Card Required" delay={20} size={24} color="rgba(255,255,255,0.6)" weight={500} family={inter} />
        <div style={{ height: 40 }} />
        <div style={{ opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 28, fontWeight: 900, color: BG, background: `linear-gradient(135deg, ${GOLD}, #f59e0b)`, padding: "18px 60px", borderRadius: 12, boxShadow: `0 0 60px ${GOLD}40` }}>
            START FREE TRIAL ⚡
          </div>
        </div>
        <div style={{ height: 30 }} />
        <FadeText text="poke-pulse-ticker.lovable.app" delay={50} size={16} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 30, fontFamily: inter, fontSize: 10, color: "#475569", textAlign: "center" }}>
          © 2026 PGVA Ventures, LLC — All Rights Reserved — Patent Pending
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier1Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={180}><SceneHero /></Sequence>
    <Sequence from={180} durationInFrames={210}><SceneProducts /></Sequence>
    <Sequence from={390} durationInFrames={180}><SceneGames /></Sequence>
    <Sequence from={570} durationInFrames={180}><SceneSocial /></Sequence>
    <Sequence from={750} durationInFrames={150}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

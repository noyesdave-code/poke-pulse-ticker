import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#D4A843";
const GREEN = "#22C55E";
const CYAN = "#06B6D4";
const BG = "#050B15";
const NAVY = "#0A1628";
const PURPLE = "#a855f7";

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

// Scene 1: Investor Hero (0-180)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 14, color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 20, padding: "6px 20px", background: `${GOLD}08`, marginBottom: 20, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          🔒 CONFIDENTIAL — INVESTOR MATERIALS
        </div>
        <FadeText text="POKE-PULSE" delay={10} size={80} color={GOLD} weight={900} />
        <FadeText text="ENGINE™" delay={20} size={60} color="white" weight={700} />
        <div style={{ height: 24 }} />
        <FadeText text="Consumer-Facing Real-Time Analytics Terminal" delay={35} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 12 }} />
        <FadeText text="PGVA Ventures, LLC" delay={45} size={16} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: 12 Verticals (180-420)
const SceneVerticals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [215, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const verticals = [
    { name: "Poké TCG", emoji: "⚡", tam: "$15.4B", color: "#EAB308" },
    { name: "MTG", emoji: "🧙", tam: "$8.2B", color: "#8B5CF6" },
    { name: "Yu-Gi-Oh!", emoji: "🃏", tam: "$5.1B", color: "#EF4444" },
    { name: "Lorcana", emoji: "✨", tam: "$1.8B", color: "#38BDF8" },
    { name: "MLB", emoji: "⚾", tam: "$12.6B", color: "#DC2626" },
    { name: "NFL", emoji: "🏈", tam: "$18.3B", color: "#16A34A" },
    { name: "NBA", emoji: "🏀", tam: "$14.7B", color: "#F97316" },
    { name: "NHL", emoji: "🏒", tam: "$4.2B", color: "#2563EB" },
    { name: "DBZ", emoji: "🐉", tam: "$6.8B", color: "#F59E0B" },
    { name: "Star Wars", emoji: "⭐", tam: "$9.5B", color: "#6B7280" },
    { name: "FIFA", emoji: "⚽", tam: "$7.3B", color: "#10B981" },
    { name: "Blueprint", emoji: "🏗️", tam: "META", color: GOLD },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={PURPLE} x="30%" y="30%" />
      <Glow color={CYAN} x="70%" y="70%" />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <FadeText text="12 FRANCHISE ENGINES" delay={5} size={44} color={GOLD} weight={900} />
        <FadeText text="$103B+ Combined TAM" delay={15} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 800 }}>
          {verticals.map((v, i) => {
            const s = spring({ frame: frame - 25 - i * 4, fps, config: { damping: 15 } });
            return (
              <div key={v.name} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${v.color}30`, borderRadius: 10, padding: "12px 8px", textAlign: "center", transform: `scale(${s})`, opacity: s }}>
                <div style={{ fontSize: 28 }}>{v.emoji}</div>
                <div style={{ fontFamily: inter, fontSize: 12, fontWeight: 700, color: "white", marginTop: 4 }}>{v.name}</div>
                <div style={{ fontFamily: orbitron, fontSize: 11, color: v.color, marginTop: 2 }}>{v.tam}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Revenue Streams (420-600)
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const streams = [
    { name: "Subscriptions", pct: "45%", icon: "💳" },
    { name: "Game Monetization", pct: "15%", icon: "🎮" },
    { name: "Affiliate Revenue", pct: "12%", icon: "🔗" },
    { name: "Data Licensing", pct: "10%", icon: "📊" },
    { name: "Arena Rake", pct: "8%", icon: "🏆" },
    { name: "Advertising", pct: "5%", icon: "📢" },
    { name: "White-Label", pct: "5%", icon: "🏷️" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GREEN} x="50%" y="40%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 50 }}>
        <FadeText text="7 REVENUE STREAMS" delay={5} size={48} color={GREEN} weight={900} />
        <FadeText text="Per Terminal" delay={15} size={20} color="rgba(255,255,255,0.4)" weight={500} family={inter} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700, width: "100%" }}>
          {streams.map((s, i) => {
            const sp = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 20 } });
            const barWidth = interpolate(sp, [0, 1], [0, parseInt(s.pct)]);
            return (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, opacity: sp }}>
                <span style={{ fontSize: 24, width: 36, textAlign: "center" }}>{s.icon}</span>
                <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 600, color: "white", width: 160 }}>{s.name}</div>
                <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${barWidth}%`, height: "100%", background: `linear-gradient(90deg, ${GREEN}, ${CYAN})`, borderRadius: 6, minWidth: barWidth > 0 ? 40 : 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                    <span style={{ fontFamily: orbitron, fontSize: 11, fontWeight: 700, color: BG }}>{s.pct}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Financials (600-780)
const SceneFinancials: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="50%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="FINANCIAL TRAJECTORY" delay={5} size={44} color={GOLD} weight={900} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { value: "$1.89B", label: "Company Valuation", color: GOLD },
            { value: "$157.8M", label: "2030 ARR Target", color: GREEN },
            { value: "76%", label: "CAGR", color: CYAN },
          ].map((s, i) => {
            const pop = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={s.label} style={{ textAlign: "center", transform: `scale(${pop})` }}>
                <div style={{ fontFamily: orbitron, fontSize: 56, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: inter, fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 8, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 40 }} />
        <FadeText text="$38M IP Portfolio — Patent Pending" delay={55} size={18} color="rgba(255,255,255,0.4)" weight={500} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (780-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.08) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="45%" size={900} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="SERIES SEED" delay={5} size={48} color="rgba(255,255,255,0.3)" weight={700} />
        <FadeText text="$2.5M" delay={15} size={96} color={GOLD} weight={900} />
        <div style={{ height: 16 }} />
        <FadeText text="10x Target ROI — 36-Month Horizon" delay={30} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 40 }} />
        <div style={{ opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 22, fontWeight: 700, color: BG, background: `linear-gradient(135deg, ${GOLD}, #f59e0b)`, padding: "16px 50px", borderRadius: 10, boxShadow: `0 0 60px ${GOLD}40` }}>
            CONTACT PGVA VENTURES
          </div>
        </div>
        <div style={{ height: 20 }} />
        <FadeText text="contact@poke-pulse-ticker.com" delay={55} size={14} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 30, fontFamily: inter, fontSize: 10, color: "#475569", textAlign: "center" }}>
          © 2026 PGVA Ventures, LLC — Patent Pending — U.S. Copyright & Trademark Protected
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier2Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={180}><SceneHero /></Sequence>
    <Sequence from={180} durationInFrames={240}><SceneVerticals /></Sequence>
    <Sequence from={420} durationInFrames={180}><SceneRevenue /></Sequence>
    <Sequence from={600} durationInFrames={180}><SceneFinancials /></Sequence>
    <Sequence from={780} durationInFrames={120}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

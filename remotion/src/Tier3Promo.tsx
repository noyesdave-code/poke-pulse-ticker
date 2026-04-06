import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GREEN = "#22C55E";
const GOLD = "#D4A843";
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

// Scene 1: Hero (0-180)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, #0a1e0a, ${BG})` }}>
      <Glow color={GREEN} x="50%" y="40%" size={800} />
      <Glow color={CYAN} x="70%" y="60%" size={400} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 13, color: GREEN, letterSpacing: 5, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>TIER 3 — INSTITUTIONAL DATA ENGINE</div>
        <div style={{ height: 20 }} />
        <FadeText text="PERSONAL" delay={8} size={80} color={GREEN} weight={900} />
        <FadeText text="PULSE ENGINE™" delay={16} size={56} color="white" weight={700} />
        <div style={{ height: 24 }} />
        <FadeText text="Institutional-Grade Data Licensing Across 12 Verticals" delay={30} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: 12 Verticals Grid (180-420)
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
      <Glow color={GREEN} x="30%" y="30%" />
      <Glow color={CYAN} x="70%" y="70%" />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <FadeText text="12 WHITE-LABEL ENGINES" delay={5} size={44} color={GREEN} weight={900} />
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

// Scene 3: Licensing Features (420-600)
const SceneLicensing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { icon: "🔌", name: "Data API", desc: "Real-time price feeds for any vertical" },
    { icon: "🏷️", name: "White-Label", desc: "Your brand, our technology stack" },
    { icon: "📊", name: "Market Indexes", desc: "RAW, GRADED, SEALED per vertical" },
    { icon: "🧠", name: "AI Signals", desc: "Alpha detection & trend analysis" },
    { icon: "🏗️", name: "Franchise System", desc: "Turn-key deployment in 30 days" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 40% 40%, ${GREEN}10, ${BG})` }}>
      <Glow color={GREEN} x="30%" y="40%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 50 }}>
        <FadeText text="FRANCHISE CAPABILITIES" delay={5} size={36} color={GREEN} weight={900} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700, width: "100%" }}>
          {features.map((f, i) => {
            const s = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`, background: `${GREEN}08`, border: `1px solid ${GREEN}20`, borderRadius: 12, padding: "14px 24px" }}>
                <span style={{ fontSize: 32 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: "white" }}>{f.name}</div>
                  <div style={{ fontFamily: inter, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Revenue Model (600-780)
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="50%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="B2B LICENSING MODEL" delay={5} size={44} color={GOLD} weight={900} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { value: "$103B+", label: "Combined TAM", color: GOLD },
            { value: "12", label: "Verticals", color: GREEN },
            { value: "$2.5M", label: "Series Seed", color: CYAN },
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
        <div style={{ height: 30 }} />
        <FadeText text="White-Label Terminal Deployments & Data API" delay={50} size={18} color="rgba(255,255,255,0.4)" weight={500} family={inter} />
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
      <Glow color={GREEN} x="50%" y="45%" size={900} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="YOUR VERTICAL." delay={5} size={48} color="rgba(255,255,255,0.3)" weight={700} />
        <FadeText text="OUR ENGINE." delay={15} size={64} color={GREEN} weight={900} />
        <div style={{ height: 20 }} />
        <FadeText text="Franchise & Data Licensing Inquiries" delay={30} size={20} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 40 }} />
        <div style={{ opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 22, fontWeight: 700, color: BG, background: `linear-gradient(135deg, ${GREEN}, ${CYAN})`, padding: "16px 50px", borderRadius: 10, boxShadow: `0 0 60px ${GREEN}40` }}>
            CONTACT PGVA VENTURES
          </div>
        </div>
        <div style={{ height: 20 }} />
        <FadeText text="contact@poke-pulse-ticker.com | pokegarageva@gmail.com" delay={55} size={14} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 30, fontFamily: inter, fontSize: 10, color: "#475569", textAlign: "center" }}>
          © 2026 PGVA Ventures, LLC — Personal Pulse Engine™ — Patent Pending
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier3Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={180}><SceneHero /></Sequence>
    <Sequence from={180} durationInFrames={240}><SceneVerticals /></Sequence>
    <Sequence from={420} durationInFrames={180}><SceneLicensing /></Sequence>
    <Sequence from={600} durationInFrames={180}><SceneRevenue /></Sequence>
    <Sequence from={780} durationInFrames={120}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

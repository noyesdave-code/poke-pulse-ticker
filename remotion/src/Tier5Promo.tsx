import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const PURPLE = "#8B5CF6";
const GOLD = "#D4A843";
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

// Scene 1: Museum Vision (0-220)
const SceneVision: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [195, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={PURPLE} x="50%" y="35%" size={900} />
      <Glow color={GOLD} x="30%" y="60%" size={400} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 13, color: PURPLE, letterSpacing: 5, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>TIER 5 — THE PINNACLE</div>
        <div style={{ height: 20 }} />
        <FadeText text="PULSE" delay={8} size={90} color={PURPLE} weight={900} />
        <FadeText text="PHILANTHROPIC™" delay={16} size={52} color="white" weight={700} />
        <div style={{ height: 20 }} />
        <FadeText text="The National Museum of Trading Cards" delay={30} size={24} color="rgba(255,255,255,0.6)" weight={600} family={inter} />
        <FadeText text="& Collectibles — Washington, D.C." delay={38} size={24} color="rgba(255,255,255,0.6)" weight={600} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Mission (220-420)
const SceneMission: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [175, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillars = [
    { icon: "🏛️", text: "National Museum — Washington, D.C." },
    { icon: "🎟️", text: "FREE Public Admission — Forever" },
    { icon: "🖼️", text: "Physical & Digital Collections" },
    { icon: "💰", text: "Private & Government Funding" },
    { icon: "🤖", text: "AI Agent Army Sourcing Donations" },
    { icon: "🌍", text: "Cultural Heritage Preservation" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 40% 40%, ${PURPLE}10, ${BG})` }}>
      <Glow color={PURPLE} x="30%" y="40%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="THE MISSION" delay={5} size={36} color={PURPLE} weight={900} />
        <div style={{ height: 30 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 800 }}>
          {pillars.map((p, i) => {
            const s = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`, background: `${PURPLE}08`, border: `1px solid ${PURPLE}20`, borderRadius: 10, padding: "12px 20px" }}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ fontFamily: inter, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{p.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Funding Model (420-620)
const SceneFunding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [175, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sources = [
    { label: "Corporate Sponsors", pct: 35, color: PURPLE },
    { label: "Government Grants", pct: 25, color: "#6366F1" },
    { label: "Individual Donors", pct: 20, color: GOLD },
    { label: "PGVA Revenue Share", pct: 15, color: "#22C55E" },
    { label: "Collection Donations", pct: 5, color: "#F97316" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 60% 50%, ${PURPLE}10, ${BG})` }}>
      <Glow color={PURPLE} x="60%" y="40%" size={600} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="FUNDING MODEL" delay={5} size={36} color="white" weight={900} />
        <FadeText text="$50M Endowment Target" delay={12} size={20} color={GOLD} weight={600} family={inter} />
        <div style={{ height: 30 }} />
        <div style={{ width: 700, display: "flex", flexDirection: "column", gap: 12 }}>
          {sources.map((s, i) => {
            const sp = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 15 } });
            const barW = interpolate(sp, [0, 1], [0, s.pct]);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: inter, fontSize: 13, color: "rgba(255,255,255,0.6)", width: 160, textAlign: "right" }}>{s.label}</div>
                <div style={{ flex: 1, height: 28, background: `${s.color}15`, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${barW}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 6 }} />
                </div>
                <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: s.color, width: 40 }}>{s.pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Legacy (620-800)
const SceneLegacy: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={PURPLE} x="50%" y="35%" size={800} />
      <Glow color={GOLD} x="50%" y="65%" size={500} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
        <FadeText text="WHERE LEGACY" delay={5} size={48} color="white" weight={900} />
        <FadeText text="MEETS PURPOSE" delay={12} size={48} color={PURPLE} weight={900} />
        <div style={{ height: 30 }} />
        <FadeText text="Every card tells a story. Every collection" delay={25} size={20} color="rgba(255,255,255,0.6)" weight={500} family={inter} />
        <FadeText text="represents a lifetime of passion." delay={32} size={20} color="rgba(255,255,255,0.6)" weight={500} family={inter} />
        <FadeText text="We preserve them all — forever." delay={40} size={20} color={GOLD} weight={600} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (800-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.06) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={PURPLE} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="PULSE PHILANTHROPIC™" delay={5} size={48} color={PURPLE} weight={900} />
        <div style={{ height: 10 }} />
        <FadeText text="Free to the Public — Forever" delay={15} size={28} color={GOLD} weight={700} />
        <div style={{ height: 30 }} />
        <div style={{ opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: "white", background: `linear-gradient(135deg, ${PURPLE}, #6366F1)`, padding: "14px 40px", borderRadius: 10 }}>SUPPORT THE MUSEUM</div>
        </div>
        <div style={{ height: 16 }} />
        <FadeText text="A Noyes Family Trust Venture" delay={55} size={13} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 25, fontFamily: inter, fontSize: 9, color: "#475569", textAlign: "center" }}>© 2026 PGVA Ventures, LLC — Patent Pending</div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier5Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={220}><SceneVision /></Sequence>
    <Sequence from={220} durationInFrames={200}><SceneMission /></Sequence>
    <Sequence from={420} durationInFrames={200}><SceneFunding /></Sequence>
    <Sequence from={620} durationInFrames={180}><SceneLegacy /></Sequence>
    <Sequence from={800} durationInFrames={100}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Tier1Promo } from "./Tier1Promo";
import { Tier2Promo } from "./Tier2Promo";
import { Tier3Promo } from "./Tier3Promo";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#D4A843";
const GREEN = "#22C55E";
const RED = "#EF4444";
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

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="40%" y="40%" size={600} />
      <Glow color={GREEN} x="60%" y="60%" size={400} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 14, color: GOLD, letterSpacing: 4, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>PGVA VENTURES, LLC PRESENTS</div>
        <div style={{ height: 20 }} />
        <FadeText text="THE FULL STACK" delay={12} size={80} color="white" weight={900} />
        <div style={{ height: 8 }} />
        <FadeText text="3-TIER VERTICAL INTEGRATION" delay={22} size={32} color={GOLD} weight={700} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", gap: 24, opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {[
            { label: "DATA", color: GOLD, icon: "📊" },
            { label: "FRANCHISE", color: GREEN, icon: "🏗️" },
            { label: "MEDIA", color: RED, icon: "📺" },
          ].map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: inter, fontSize: 14, color: t.color, border: `1px solid ${t.color}30`, borderRadius: 20, padding: "8px 20px", background: `${t.color}08` }}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TierTransition: React.FC<{ tier: string; name: string; color: string; icon: string }> = ({ tier, name, color, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const exitOp = interpolate(frame, [55, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${color}15, ${BG})` }}>
      <Glow color={color} x="50%" y="50%" size={900} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 80, transform: `scale(${s})` }}>{icon}</div>
        <div style={{ fontFamily: inter, fontSize: 16, color: "rgba(255,255,255,0.3)", letterSpacing: 6, marginTop: 16, opacity: s }}>{tier}</div>
        <div style={{ fontFamily: orbitron, fontSize: 48, fontWeight: 900, color, marginTop: 8, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`, opacity: s }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.06) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="DATA. FRANCHISE. MEDIA." delay={5} size={56} color="white" weight={900} />
        <div style={{ height: 16 }} />
        <FadeText text="The World's First 3-Tier Vertical Integration" delay={18} size={24} color={GOLD} weight={600} family={inter} />
        <FadeText text="for the $103B Collectibles Economy" delay={25} size={24} color={GOLD} weight={600} family={inter} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { value: "$1.89B", label: "Valuation" },
            { value: "$157.8M", label: "2030 ARR" },
            { value: "12", label: "Verticals" },
          ].map((s, i) => {
            const pop = spring({ frame: frame - 35 - i * 10, fps: 30, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={s.label} style={{ textAlign: "center", transform: `scale(${pop})` }}>
                <div style={{ fontFamily: orbitron, fontSize: 44, fontWeight: 900, color: GOLD }}>{s.value}</div>
                <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 40 }} />
        <div style={{ opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 20, fontWeight: 700, color: BG, background: `linear-gradient(135deg, ${GOLD}, #f59e0b)`, padding: "14px 40px", borderRadius: 10 }}>
            INVEST IN THE FULL STACK
          </div>
        </div>
        <div style={{ height: 16 }} />
        <FadeText text="contact@poke-pulse-ticker.com" delay={75} size={14} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 25, fontFamily: inter, fontSize: 9, color: "#475569", textAlign: "center", lineHeight: 1.4 }}>
          © 2026 PGVA Ventures, LLC — David Noyes / Noyes Family Trust — Patent Pending<br/>
          Protected under U.S. Copyright, Trademark, Trade Secret, and Patent Laws
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CombinedDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={180}><IntroScene /></Sequence>
      <Sequence from={180} durationInFrames={90}><TierTransition tier="TIER 1 — DATA ENGINE" name="POKÉ PULSE" color={GOLD} icon="📊" /></Sequence>
      <Sequence from={270} durationInFrames={900}><Tier1Promo /></Sequence>
      <Sequence from={1170} durationInFrames={90}><TierTransition tier="TIER 2 — FRANCHISE" name="PULSE MARKET" color={GREEN} icon="🏗️" /></Sequence>
      <Sequence from={1260} durationInFrames={900}><Tier2Promo /></Sequence>
      <Sequence from={2160} durationInFrames={90}><TierTransition tier="TIER 3 — MEDIA" name="PGTV HUB" color={RED} icon="📺" /></Sequence>
      <Sequence from={2250} durationInFrames={900}><Tier3Promo /></Sequence>
      <Sequence from={3150} durationInFrames={250}><OutroScene /></Sequence>
    </AbsoluteFill>
  );
};

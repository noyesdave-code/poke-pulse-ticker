import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#EAB308";
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

// Lane racer component
const RaceLane: React.FC<{ name: string; color: string; delay: number; lane: number; speed: number }> = ({ name, color, delay, lane, speed }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 100 } });
  const progress = interpolate(frame - delay, [0, 120], [0, speed], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(progress, [0, 1], [40, width - 200]);
  const pulseScale = 1 + Math.sin((frame - delay) * 0.15) * 0.05;

  return (
    <div style={{ position: "absolute", top: 280 + lane * 100, left: 0, right: 0, height: 80, opacity: s }}>
      {/* Lane track */}
      <div style={{ position: "absolute", top: 35, left: 30, right: 30, height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 5 }} />
      <div style={{ position: "absolute", top: 35, left: 30, height: 10, width: Math.max(0, x - 30), background: `linear-gradient(90deg, transparent, ${color})`, borderRadius: 5, opacity: 0.5 }} />
      {/* Racer */}
      <div style={{ position: "absolute", left: x, top: 15, transform: `scale(${pulseScale})`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 50, height: 50, borderRadius: 8, background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${color}44` }}>
          <span style={{ fontSize: 20 }}>🃏</span>
        </div>
        <div>
          <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: "white" }}>{name}</div>
          <div style={{ fontFamily: inter, fontSize: 11, color: color, fontWeight: 600 }}>{(progress * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};

// Scene 1: Hero (0-180)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={GREEN} x="50%" y="35%" size={900} />
      <Glow color={GOLD} x="30%" y="60%" size={500} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="🏁 POKÉ RACE™" delay={5} size={96} color={GREEN} weight={900} />
        <FadeText text="BET ON LIVE CARD RACES" delay={20} size={40} color="white" weight={700} />
        <FadeText text="5-Minute Sprints • Hourly Championships" delay={35} size={24} color="rgba(255,255,255,0.6)" weight={400} family={inter} />
        <Sequence from={50}>
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
            {[
              { label: "RAW", color: GREEN },
              { label: "GRADED", color: GOLD },
              { label: "SEALED", color: "#3B82F6" },
            ].map((cat, i) => {
              const pop = spring({ frame: frame - 55 - i * 8, fps: 30, config: { damping: 12 } });
              return (
                <div key={cat.label} style={{ transform: `scale(${pop})`, padding: "12px 28px", borderRadius: 12, border: `2px solid ${cat.color}`, background: `${cat.color}15` }}>
                  <span style={{ fontFamily: orbitron, fontSize: 20, fontWeight: 900, color: cat.color }}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Race Animation (180-540)
const SceneRace: React.FC = () => {
  const frame = useCurrentFrame();
  const entryOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [335, 360], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp, background: `linear-gradient(180deg, ${BG}, ${NAVY})` }}>
      <Glow color={GREEN} x="80%" y="20%" size={600} />
      {/* Header */}
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <FadeText text="LIVE PRICE RACE" delay={5} size={52} color={GOLD} />
        <FadeText text="Watch cards compete in real-time" delay={15} size={20} color="rgba(255,255,255,0.5)" family={inter} weight={400} />
        {/* Timer */}
        <Sequence from={25}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <div style={{ padding: "8px 24px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: orbitron, fontSize: 28, fontWeight: 700, color: GREEN }}>
                {Math.max(0, 300 - Math.floor(frame * 1)).toString().padStart(2, "0")}:{(59 - (frame % 60)).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </Sequence>
      </div>
      {/* Lanes */}
      <RaceLane name="Charizard" color={RED} delay={30} lane={0} speed={0.95} />
      <RaceLane name="Pikachu" color={GOLD} delay={35} lane={1} speed={0.88} />
      <RaceLane name="Umbreon" color="#8B5CF6" delay={40} lane={2} speed={0.92} />
      <RaceLane name="Lugia" color="#3B82F6" delay={45} lane={3} speed={0.85} />
      <RaceLane name="Booster Box" color={GREEN} delay={50} lane={4} speed={0.78} />
      {/* Finish line */}
      <div style={{ position: "absolute", right: 80, top: 260, bottom: 140, width: 4, background: `repeating-linear-gradient(180deg, white 0px, white 10px, transparent 10px, transparent 20px)`, opacity: 0.3 }} />
    </AbsoluteFill>
  );
};

// Scene 3: Features (540-750)
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entryOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { icon: "🏁", title: "5-Min Sprint Races", desc: "Fast-paced card battles every 5 minutes" },
    { icon: "🏆", title: "Hourly Championships", desc: "Extended races with bigger prize pools" },
    { icon: "📊", title: "Live Odds & Charts", desc: "Real-time indicators and movement data" },
    { icon: "🎁", title: "Win Pro Trials & Badges", desc: "Digital prizes at zero cost to you" },
    { icon: "💰", title: "1,000 Free Coins", desc: "Generous starting bank from the house" },
    { icon: "🃏", title: "Raw × Graded × Sealed", desc: "All product types compete together" },
  ];

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="30%" size={800} />
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        <FadeText text="GAME FEATURES" delay={5} size={52} color={GREEN} />
      </div>
      <div style={{ position: "absolute", top: 180, left: 80, right: 80, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>
        {features.map((f, i) => {
          const pop = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 15 } });
          return (
            <div key={i} style={{ transform: `scale(${pop})`, textAlign: "center", padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 48 }}>{f.icon}</div>
              <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: "white", marginTop: 12 }}>{f.title}</div>
              <div style={{ fontFamily: inter, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA (750-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.08) * 4;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={GREEN} x="50%" y="40%" size={1000} />
      <Glow color={GOLD} x="50%" y="60%" size={600} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <FadeText text="🏁 JOIN THE RACE" delay={5} size={80} color={GREEN} weight={900} />
        <FadeText text="1,000 FREE COINS TO START" delay={18} size={42} color={GOLD} />
        <FadeText text="Bet on live card movement • Win Pro perks • $0.99 coin packs" delay={30} size={22} color="rgba(255,255,255,0.6)" weight={400} family={inter} />
        <Sequence from={45}>
          <div style={{
            transform: `translateY(${pulse}px)`,
            padding: "16px 48px",
            borderRadius: 16,
            background: `linear-gradient(135deg, ${GREEN}, ${GREEN}CC)`,
            boxShadow: `0 0 40px ${GREEN}44`,
          }}>
            <span style={{ fontFamily: orbitron, fontSize: 28, fontWeight: 900, color: BG }}>PLAY NOW — FREE</span>
          </div>
        </Sequence>
        <Sequence from={60}>
          <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 20, textAlign: "center", maxWidth: 600 }}>
            © 2026 PGVA Ventures, LLC. Poké Race™ is a simulated entertainment experience. No real money wagered. Virtual coins have no cash value.
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

export const PokeRacePromo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={180}><SceneHero /></Sequence>
    <Sequence from={180} durationInFrames={360}><SceneRace /></Sequence>
    <Sequence from={540} durationInFrames={210}><SceneFeatures /></Sequence>
    <Sequence from={750} durationInFrames={150}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

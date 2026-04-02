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
const CRIMSON = "#ef4444";
const CYAN = "#06b6d4";
const PURPLE = "#a855f7";
const PINK = "#ec4899";
const BG = "#040810";

const Bold: React.FC<{ text: string; delay: number; size?: number; color?: string; weight?: number }> = ({
  text, delay, size = 64, color = "white", weight = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [80, 0]);
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  return (
    <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, fontSize: size, fontWeight: weight, color, fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif", textAlign: "center", lineHeight: 1.15, textTransform: "uppercase", letterSpacing: size > 60 ? -2 : 1 }}>
      {text}
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string; delay: number; color?: string; size?: number }> = ({ value, label, delay, color = ACCENT, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: size, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const Glow: React.FC<{ color: string; size?: number; x?: string; y?: string; opacity?: number }> = ({ color, size = 400, x = "50%", y = "50%", opacity = 0.2 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: "blur(60px)", opacity, pointerEvents: "none" }} />
);

const FadeOut: React.FC<{ start: number; dur: number; children: React.ReactNode }> = ({ start, dur, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity: op }}>{children}</div>;
};

const PokemonSprite: React.FC<{ id: number; delay: number; x: number; y: number; size?: number }> = ({ id, delay, x, y, size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 200 } });
  const bob = Math.sin((frame - delay) * 0.06) * 5;
  return (
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: size,
        height: size,
        objectFit: "contain",
        transform: `scale(${s})`,
        opacity: interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    />
  );
};

// Scene 1: Title Reveal
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG} 0%, #0a1628 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={ACCENT} size={600} x="30%" y="40%" opacity={0.15} />
      <Glow color={PURPLE} size={500} x="70%" y="60%" opacity={0.12} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40 }}>
        <Bold text="Poke-Pulse-Ticker" delay={5} size={isVertical ? 52 : 72} color={ACCENT} />
        <Bold text="Market Terminal" delay={15} size={isVertical ? 36 : 48} color="white" />
        <FadeOut start={70} dur={20}>
          <Bold text="Everything you need. One platform." delay={30} size={isVertical ? 18 : 22} color="rgba(255,255,255,0.6)" weight={400} />
        </FadeOut>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: PokémonKids Game Feature
const SceneGame: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, #0a0f1a 0%, #1a0a2e 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={GOLD} size={500} x="50%" y="30%" opacity={0.2} />
      <Glow color={CRIMSON} size={400} x="20%" y="70%" opacity={0.15} />
      <PokemonSprite id={25} delay={5} x={isVertical ? 80 : 100} y={isVertical ? 120 : 80} size={isVertical ? 140 : 180} />
      <PokemonSprite id={6} delay={12} x={isVertical ? 500 : 700} y={isVertical ? 100 : 60} size={isVertical ? 140 : 180} />
      <PokemonSprite id={150} delay={18} x={isVertical ? 300 : 400} y={isVertical ? 600 : 400} size={isVertical ? 120 : 160} />
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
        <Bold text="🎮 PokémonKids" delay={3} size={isVertical ? 48 : 64} color={GOLD} />
        <Bold text="Adventure Game" delay={10} size={isVertical ? 36 : 48} color="white" />
        <Bold text="Choose. Battle. Collect." delay={20} size={isVertical ? 20 : 26} color={ACCENT} weight={600} />
        <Bold text="Free to try · $0.99 to unlock" delay={30} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Battle System
const SceneBattle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  const clash = spring({ frame: frame - 25, fps, config: { damping: 8, stiffness: 300 } });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #1a0505 0%, #0a0a1e 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={CRIMSON} size={600} x="30%" y="50%" opacity={0.2} />
      <Glow color={CYAN} size={500} x="70%" y="50%" opacity={0.15} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40 }}>
        <Bold text="⚔️ Battle System" delay={3} size={isVertical ? 44 : 56} color={CRIMSON} />
        <div style={{ display: "flex", gap: 40, alignItems: "center", transform: `scale(${clash})` }}>
          <PokemonSprite id={25} delay={8} x={0} y={0} size={isVertical ? 100 : 140} />
          <Bold text="VS" delay={15} size={isVertical ? 36 : 48} color={GOLD} />
          <PokemonSprite id={149} delay={10} x={0} y={0} size={isVertical ? 100 : 140} />
        </div>
        <Bold text="Knowledge · Matchup · Card Power" delay={20} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.6)" weight={500} />
        <Bold text="Wager cards · Win rewards" delay={30} size={isVertical ? 14 : 18} color={ACCENT} weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Market Data
const SceneMarket: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG} 0%, #0a1628 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={ACCENT} size={600} x="50%" y="30%" opacity={0.2} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: 40 }}>
        <Bold text="📊 Real-Time Market Data" delay={3} size={isVertical ? 40 : 52} color={ACCENT} />
        <div style={{ display: "flex", gap: isVertical ? 30 : 60, flexWrap: "wrap", justifyContent: "center" }}>
          <Stat value="500+" label="Raw Cards" delay={10} color={ACCENT} size={isVertical ? 40 : 56} />
          <Stat value="750+" label="Graded Cards" delay={16} color={GOLD} size={isVertical ? 40 : 56} />
          <Stat value="1000+" label="Sealed Products" delay={22} color={CYAN} size={isVertical ? 40 : 56} />
        </div>
        <Bold text="Live TCGPlayer pricing · AI signals" delay={30} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Portfolio & Tracking
const ScenePortfolio: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #0a0f1a 0%, #1a2040 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={PURPLE} size={500} x="40%" y="40%" opacity={0.2} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40 }}>
        <Bold text="💼 Portfolio Tracking" delay={3} size={isVertical ? 40 : 52} color={PURPLE} />
        <Bold text="Track P&L · Set Alerts" delay={12} size={isVertical ? 24 : 32} color="white" />
        <Bold text="Daily snapshots · Historical charts" delay={22} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: SimTrader & Arena
const SceneArena: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #1a0a0a 0%, #0a1a1a 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={GOLD} size={600} x="50%" y="30%" opacity={0.2} />
      <Glow color={ACCENT} size={400} x="30%" y="70%" opacity={0.15} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40 }}>
        <Bold text="🏟️ SimTrader World™" delay={3} size={isVertical ? 40 : 52} color={GOLD} />
        <Bold text="& Poké-Pulse Arena™" delay={12} size={isVertical ? 32 : 40} color={ACCENT} />
        <Bold text="Paper trade · Bet on prices · Win PokéCoins" delay={22} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: AI Signals
const SceneAI: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #0a0a1e 0%, #1a0a2e 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={CYAN} size={500} x="50%" y="40%" opacity={0.2} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40 }}>
        <Bold text="🧠 AI-Powered Signals" delay={3} size={isVertical ? 40 : 52} color={CYAN} />
        <Bold text="Pulse Score™ · Alpha Signals" delay={12} size={isVertical ? 24 : 32} color="white" />
        <Bold text="Correlation Matrix · Pop Report Δ" delay={22} size={isVertical ? 16 : 20} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: Pricing
const ScenePricing: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG} 0%, #0a1a0a 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={ACCENT} size={600} x="50%" y="50%" opacity={0.15} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: 40 }}>
        <Bold text="Start Free. Upgrade When Ready." delay={3} size={isVertical ? 36 : 48} color="white" />
        <div style={{ display: "flex", gap: isVertical ? 20 : 40, flexWrap: "wrap", justifyContent: "center" }}>
          <Stat value="$0" label="Free Tier" delay={10} color="rgba(255,255,255,0.7)" size={isVertical ? 36 : 48} />
          <Stat value="$0.99" label="Game / Arena" delay={16} color={ACCENT} size={isVertical ? 36 : 48} />
          <Stat value="$4.99" label="Pro (Most Popular)" delay={22} color={GOLD} size={isVertical ? 36 : 48} />
        </div>
        <Bold text="14-day free Pro trial · Cancel anytime" delay={30} size={isVertical ? 14 : 18} color="rgba(255,255,255,0.5)" weight={400} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 9: CTA
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = isVertical ? 0.9 : 1.15;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.03;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #0a1a0a 0%, ${BG} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sz})` }}>
      <Glow color={ACCENT} size={800} x="50%" y="50%" opacity={0.25} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 40, transform: `scale(${pulse})` }}>
        <Bold text="poke-pulse-ticker.com" delay={3} size={isVertical ? 36 : 48} color={ACCENT} />
        <Bold text="The Future of Pokémon TCG" delay={12} size={isVertical ? 28 : 36} color="white" />
        <Bold text="Data is Live." delay={22} size={isVertical ? 20 : 26} color={GOLD} weight={600} />
        <div style={{ marginTop: 16 }}>
          <Bold text="PGVA Ventures, LLC" delay={30} size={isVertical ? 12 : 14} color="rgba(255,255,255,0.4)" weight={400} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 9 scenes × ~240 frames = ~2160 frames (72 seconds at 30fps)
// We'll do ~3600 frames (2 minutes) with longer scene durations
export const PlatformHighlight: React.FC = () => {
  const sceneDur = 400; // ~13.3s per scene
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={sceneDur}><SceneTitle /></Sequence>
      <Sequence from={sceneDur} durationInFrames={sceneDur}><SceneGame /></Sequence>
      <Sequence from={sceneDur * 2} durationInFrames={sceneDur}><SceneBattle /></Sequence>
      <Sequence from={sceneDur * 3} durationInFrames={sceneDur}><SceneMarket /></Sequence>
      <Sequence from={sceneDur * 4} durationInFrames={sceneDur}><ScenePortfolio /></Sequence>
      <Sequence from={sceneDur * 5} durationInFrames={sceneDur}><SceneArena /></Sequence>
      <Sequence from={sceneDur * 6} durationInFrames={sceneDur}><SceneAI /></Sequence>
      <Sequence from={sceneDur * 7} durationInFrames={sceneDur}><ScenePricing /></Sequence>
      <Sequence from={sceneDur * 8} durationInFrames={sceneDur}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};

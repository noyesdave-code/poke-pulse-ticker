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
const ORANGE = "#f97316";
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
  const o = interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity: o }}>{children}</div>;
};

const PokeBall: React.FC<{ delay: number; x: number; y: number; size?: number }> = ({ delay, x, y, size = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200 } });
  const rotation = interpolate(frame - delay, [0, 30], [0, 360], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `scale(${s}) rotate(${rotation}deg)`,
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(180deg, ${CRIMSON} 0%, ${CRIMSON} 48%, #222 48%, #222 52%, white 52%, white 100%)`,
      border: "3px solid #333",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ width: size * 0.25, height: size * 0.25, borderRadius: "50%", background: "white", border: "3px solid #333" }} />
    </div>
  );
};

// Scene 1: Hero Intro — "PokémonKids Adventure"
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;
  const heroSize = isVertical ? 72 : 56;
  const subSize = isVertical ? 28 : 22;

  const pulse = Math.sin(frame * 0.08) * 5;
  const bgRotate = frame * 0.3;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #0a1628, ${BG})`, overflow: "hidden" }}>
      <Glow color={ACCENT} size={isVertical ? 600 : 500} x="50%" y="30%" opacity={0.15} />
      <Glow color={PURPLE} size={isVertical ? 400 : 350} x="20%" y="70%" opacity={0.1} />
      <Glow color={GOLD} size={isVertical ? 350 : 300} x="80%" y="60%" opacity={0.12} />

      {/* Floating pokeballs */}
      <PokeBall delay={10} x={width * 0.1} y={height * 0.2} size={isVertical ? 50 : 40} />
      <PokeBall delay={20} x={width * 0.85} y={height * 0.15} size={isVertical ? 40 : 35} />
      <PokeBall delay={30} x={width * 0.7} y={height * 0.75} size={isVertical ? 45 : 38} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 30 : 20, transform: `scale(${rootScale}) translateY(${pulse}px)` }}>
        <div style={{ fontSize: isVertical ? 100 : 80 }}>🎮</div>
        <Bold text="PokémonKids" delay={5} size={heroSize} color={ACCENT} />
        <Bold text="Adventure" delay={15} size={heroSize * 0.85} color={GOLD} />
        <FadeOut start={80} dur={15}>
          <Bold text="Choose · Battle · Collect" delay={25} size={subSize} color="rgba(255,255,255,0.6)" weight={400} />
        </FadeOut>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Starter Selection
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const starters = [
    { name: "Pikachu", type: "Electric", color: GOLD },
    { name: "Charizard", type: "Fire", color: CRIMSON },
    { name: "Blastoise", type: "Water", color: CYAN },
    { name: "Mewtwo", type: "Psychic", color: PURPLE },
    { name: "Gengar", type: "Ghost", color: PURPLE },
    { name: "Eevee", type: "Normal", color: ORANGE },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0c1a30, ${BG})`, overflow: "hidden" }}>
      <Glow color={GOLD} size={500} x="50%" y="30%" opacity={0.15} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 40 : 25, transform: `scale(${rootScale})` }}>
        <Bold text="16 Starters" delay={0} size={isVertical ? 52 : 42} color="white" />
        <Bold text="Choose Your Partner" delay={10} size={isVertical ? 30 : 24} color="rgba(255,255,255,0.5)" weight={400} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isVertical ? 20 : 15, maxWidth: isVertical ? "80%" : "70%", marginTop: 20 }}>
          {starters.map((s, i) => {
            const pop = spring({ frame: frame - 15 - i * 5, fps, config: { damping: 12, stiffness: 180 } });
            return (
              <div key={s.name} style={{
                transform: `scale(${pop})`,
                background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
                border: `2px solid ${s.color}55`,
                borderRadius: 16, padding: isVertical ? "16px 24px" : "12px 18px",
                textAlign: "center", minWidth: isVertical ? 120 : 100,
              }}>
                <div style={{ fontSize: isVertical ? 18 : 15, fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: s.color, fontFamily: "monospace", marginTop: 4 }}>{s.type}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Adventure Zones
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const zones = [
    { name: "Pallet Town", icon: "🏠", color: ACCENT },
    { name: "Viridian Forest", icon: "🌲", color: ACCENT },
    { name: "Mt. Moon", icon: "🌙", color: PURPLE },
    { name: "Cerulean Cave", icon: "💎", color: CYAN },
    { name: "Lavender Tower", icon: "👻", color: PURPLE },
    { name: "Power Plant", icon: "⚡", color: GOLD },
    { name: "Safari Zone", icon: "🦒", color: ORANGE },
    { name: "Victory Road", icon: "🏆", color: CRIMSON },
  ];

  const drift = Math.sin(frame * 0.04) * 10;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 60%, #0a2018, ${BG})`, overflow: "hidden" }}>
      <Glow color={ACCENT} size={400} x="30%" y="40%" opacity={0.12} />
      <Glow color={CRIMSON} size={300} x="70%" y="70%" opacity={0.1} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 30 : 20, transform: `scale(${rootScale})` }}>
        <Bold text="17 Adventure Zones" delay={0} size={isVertical ? 48 : 38} color="white" />
        <Bold text="Explore · Discover · Conquer" delay={10} size={isVertical ? 22 : 18} color="rgba(255,255,255,0.5)" weight={400} />

        <div style={{ display: "grid", gridTemplateColumns: isVertical ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isVertical ? 12 : 10, marginTop: 20, maxWidth: isVertical ? "85%" : "80%" }}>
          {zones.map((z, i) => {
            const pop = spring({ frame: frame - 15 - i * 4, fps, config: { damping: 15, stiffness: 160 } });
            return (
              <div key={z.name} style={{
                transform: `scale(${pop}) translateY(${drift}px)`,
                background: `linear-gradient(135deg, ${z.color}15, transparent)`,
                border: `1px solid ${z.color}33`,
                borderRadius: 12, padding: isVertical ? "14px 16px" : "10px 14px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: isVertical ? 28 : 22 }}>{z.icon}</span>
                <span style={{ fontSize: isVertical ? 14 : 12, fontWeight: 600, color: "white", fontFamily: "sans-serif" }}>{z.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: PvP Battle System
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const clash = spring({ frame: frame - 30, fps, config: { damping: 8, stiffness: 200 } });
  const shake = frame > 30 && frame < 45 ? Math.sin(frame * 3) * 4 : 0;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #1a0820, ${BG})`, overflow: "hidden" }}>
      <Glow color={CRIMSON} size={500} x="30%" y="40%" opacity={0.2} />
      <Glow color={CYAN} size={500} x="70%" y="40%" opacity={0.2} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 35 : 25, transform: `scale(${rootScale}) translateX(${shake}px)` }}>
        <Bold text="⚔️ PvP Battles" delay={0} size={isVertical ? 56 : 44} color={CRIMSON} />
        <Bold text="Challenge Real Trainers" delay={10} size={isVertical ? 28 : 22} color="rgba(255,255,255,0.6)" weight={400} />

        {/* VS visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: isVertical ? 40 : 30, marginTop: 20 }}>
          <div style={{ transform: `translateX(${interpolate(clash, [0, 1], [-100, 0])}px)`, textAlign: "center" }}>
            <div style={{ fontSize: isVertical ? 60 : 48 }}>⚡</div>
            <div style={{ fontSize: isVertical ? 18 : 15, fontWeight: 700, color: GOLD, fontFamily: "sans-serif", marginTop: 8 }}>Pikachu</div>
          </div>
          <div style={{ transform: `scale(${clash})`, fontSize: isVertical ? 52 : 40, fontWeight: 900, color: CRIMSON, fontFamily: "'Space Grotesk', sans-serif" }}>VS</div>
          <div style={{ transform: `translateX(${interpolate(clash, [0, 1], [100, 0])}px)`, textAlign: "center" }}>
            <div style={{ fontSize: isVertical ? 60 : 48 }}>🔥</div>
            <div style={{ fontSize: isVertical ? 18 : 15, fontWeight: 700, color: CRIMSON, fontFamily: "sans-serif", marginTop: 8 }}>Charizard</div>
          </div>
        </div>

        {/* Battle factors */}
        <div style={{ display: "flex", gap: isVertical ? 20 : 15, marginTop: isVertical ? 30 : 20 }}>
          {[{ icon: "🧠", label: "Knowledge", color: CYAN }, { icon: "⚔️", label: "Matchup", color: CRIMSON }, { icon: "🃏", label: "Cards", color: GOLD }].map((f, i) => {
            const pop = spring({ frame: frame - 40 - i * 8, fps, config: { damping: 12, stiffness: 160 } });
            return (
              <div key={f.label} style={{ transform: `scale(${pop})`, textAlign: "center", background: `${f.color}15`, border: `1px solid ${f.color}33`, borderRadius: 12, padding: isVertical ? "16px 20px" : "12px 16px" }}>
                <div style={{ fontSize: isVertical ? 32 : 26 }}>{f.icon}</div>
                <div style={{ fontSize: isVertical ? 13 : 11, color: f.color, fontWeight: 600, fontFamily: "sans-serif", marginTop: 6 }}>{f.label}</div>
              </div>
            );
          })}
        </div>

        <Bold text="Global Leaderboard Rankings" delay={60} size={isVertical ? 22 : 18} color={PURPLE} weight={600} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Achievements & Daily Rewards
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const badges = ["🏆", "⚔️", "🎯", "📚", "🌍", "👑", "💎", "🔥"];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #1a1400, ${BG})`, overflow: "hidden" }}>
      <Glow color={GOLD} size={500} x="50%" y="30%" opacity={0.15} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 30 : 20, transform: `scale(${rootScale})` }}>
        <Bold text="21 Achievement Badges" delay={0} size={isVertical ? 48 : 38} color={GOLD} />
        <Bold text="Daily Login Rewards" delay={10} size={isVertical ? 26 : 20} color="rgba(255,255,255,0.5)" weight={400} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isVertical ? 16 : 12, maxWidth: isVertical ? "80%" : "60%", marginTop: 20 }}>
          {badges.map((b, i) => {
            const pop = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 8, stiffness: 200 } });
            const glow = Math.sin((frame + i * 10) * 0.1) * 0.3 + 0.7;
            return (
              <div key={i} style={{
                transform: `scale(${pop})`, fontSize: isVertical ? 44 : 36,
                background: `${GOLD}15`, borderRadius: 16, width: isVertical ? 72 : 58, height: isVertical ? 72 : 58,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${GOLD}44`, opacity: glow,
              }}>{b}</div>
            );
          })}
        </div>

        {/* 7-day streak calendar */}
        <div style={{ display: "flex", gap: isVertical ? 8 : 6, marginTop: isVertical ? 25 : 15 }}>
          {Array.from({ length: 7 }, (_, i) => {
            const pop = spring({ frame: frame - 50 - i * 3, fps, config: { damping: 12, stiffness: 180 } });
            const claimed = i < 5;
            return (
              <div key={i} style={{
                transform: `scale(${pop})`, textAlign: "center",
                background: claimed ? `${ACCENT}20` : "rgba(255,255,255,0.05)",
                border: `1px solid ${claimed ? ACCENT : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10, padding: isVertical ? "10px 12px" : "8px 10px",
                minWidth: isVertical ? 50 : 40,
              }}>
                <div style={{ fontSize: isVertical ? 11 : 9, fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>Day {i + 1}</div>
                <div style={{ fontSize: isVertical ? 20 : 16, marginTop: 4 }}>{claimed ? "✅" : "🎁"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Shop & $0.99 Pricing
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const pulse = Math.sin(frame * 0.1) * 3;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0a1020, ${BG})`, overflow: "hidden" }}>
      <Glow color={ACCENT} size={600} x="50%" y="50%" opacity={0.15} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 30 : 20, transform: `scale(${rootScale})` }}>
        <Bold text="Free to Try" delay={0} size={isVertical ? 52 : 42} color={ACCENT} />
        <Stat value="$0.99" label="Unlimited Adventures" delay={12} color={GOLD} size={isVertical ? 80 : 64} />

        <div style={{ marginTop: isVertical ? 30 : 20, display: "flex", flexDirection: "column", gap: isVertical ? 12 : 8 }}>
          {["3 Free Battles to Start", "Collect All 98 Pokémon", "PvP Arena & Leaderboard", "21 Achievement Badges", "Daily Login Rewards"].map((f, i) => {
            const pop = spring({ frame: frame - 30 - i * 5, fps, config: { damping: 14, stiffness: 160 } });
            return (
              <div key={f} style={{
                transform: `scale(${pop}) translateY(${pulse}px)`,
                display: "flex", alignItems: "center", gap: 12,
                fontSize: isVertical ? 18 : 15, color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif",
              }}>
                <span style={{ color: ACCENT, fontSize: isVertical ? 20 : 16 }}>✓</span>
                {f}
              </div>
            );
          })}
        </div>

        <FadeOut start={85} dur={15}>
          <Bold text="poke-pulse-ticker.com/pokemon-kids" delay={60} size={isVertical ? 18 : 15} color="rgba(255,255,255,0.4)" weight={400} />
        </FadeOut>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: CTA / Outro
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const rootScale = isVertical ? 1 : 1.15;

  const pulse = Math.sin(frame * 0.12) * 4;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0a1a10, ${BG})`, overflow: "hidden" }}>
      <Glow color={ACCENT} size={700} x="50%" y="50%" opacity={0.2} />
      <Glow color={GOLD} size={400} x="30%" y="30%" opacity={0.1} />
      <Glow color={PURPLE} size={400} x="70%" y="70%" opacity={0.1} />

      <PokeBall delay={10} x={width * 0.15} y={height * 0.25} size={isVertical ? 45 : 38} />
      <PokeBall delay={20} x={width * 0.8} y={height * 0.3} size={isVertical ? 35 : 30} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isVertical ? 25 : 18, transform: `scale(${rootScale}) translateY(${pulse}px)` }}>
        <div style={{ fontSize: isVertical ? 80 : 64 }}>⚡</div>
        <Bold text="Start Your" delay={5} size={isVertical ? 48 : 38} color="rgba(255,255,255,0.8)" />
        <Bold text="Adventure Now" delay={12} size={isVertical ? 56 : 44} color={ACCENT} />
        <Bold text="poke-pulse-ticker.com" delay={25} size={isVertical ? 22 : 18} color={GOLD} weight={600} />
        <FadeOut start={80} dur={20}>
          <Bold text="© 2026 PGVA Ventures, LLC" delay={35} size={isVertical ? 14 : 12} color="rgba(255,255,255,0.3)" weight={400} />
        </FadeOut>
      </div>
    </AbsoluteFill>
  );
};

export const GameHighlight: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const isVertical = height > width;

  // Background gradient that shifts through scenes
  const bgHue = interpolate(frame, [0, 3600], [200, 320], { extrapolateRight: "clamp" });

  // Scene timing: 7 scenes across 120s = ~3600 frames at 30fps
  // Each scene ~510 frames with overlap via sequences
  const sceneDur = 510;
  const scenes = [
    { from: 0, comp: Scene1 },      // Hero intro
    { from: 480, comp: Scene2 },     // Starters
    { from: 960, comp: Scene3 },     // Adventure zones
    { from: 1440, comp: Scene4 },    // PvP battles
    { from: 1920, comp: Scene5 },    // Achievements
    { from: 2400, comp: Scene6 },    // Shop/pricing
    { from: 2880, comp: Scene7 },    // CTA
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Persistent subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: isVertical ? "40px 40px" : "50px 50px",
        transform: `translateY(${-frame * 0.3}px)`,
        opacity: 0.5,
      }} />

      {scenes.map(({ from, comp: Comp }, i) => (
        <Sequence key={i} from={from} durationInFrames={sceneDur}>
          <Comp />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

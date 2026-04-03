import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const RED = "#EF4444";
const GOLD = "#D4A843";
const GREEN = "#22C55E";
const CYAN = "#06B6D4";
const PURPLE = "#a855f7";
const PINK = "#EC4899";
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

// Scene 1: PGTV Hero (0-180)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = Math.sin(frame * 0.1) * 0.1 + 0.9;
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, #1a0520, ${BG})` }}>
      <Glow color={RED} x="50%" y="40%" size={800} />
      <Glow color={PINK} x="30%" y="60%" size={400} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 10, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>📺</div>
        <FadeText text="PGTV" delay={8} size={100} color={RED} weight={900} />
        <FadeText text="MEDIA HUB™" delay={18} size={48} color="white" weight={700} />
        <div style={{ height: 24 }} />
        <FadeText text="The Collectibles World Just Got Its Own TV Network" delay={32} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 16 }} />
        <div style={{ opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${flicker})` }}>
          <div style={{ fontFamily: inter, fontSize: 13, color: RED, border: `1px solid ${RED}40`, borderRadius: 20, padding: "6px 20px", background: `${RED}10`, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, boxShadow: `0 0 8px ${RED}` }} /> STREAMING LIVE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Features Grid (180-420)
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [215, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { name: "Live Streaming Studio", icon: "🎥", desc: "Pack openings & market analysis" },
    { name: "Video Library", icon: "📚", desc: "On-demand content catalog" },
    { name: "Community TV", icon: "📺", desc: "Vertical-specific channels" },
    { name: "Creator Network", icon: "🌟", desc: "Revenue-sharing partnerships" },
    { name: "AI Market Recaps", icon: "🤖", desc: "Auto-generated daily reports" },
    { name: "Watch Parties", icon: "🎉", desc: "Interactive synchronized viewing" },
    { name: "Masterclasses", icon: "🎓", desc: "Expert courses & guides" },
    { name: "Ad Platform", icon: "📢", desc: "Self-serve card shop advertising" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, #1a0520, ${BG})` }}>
      <Glow color={PURPLE} x="30%" y="30%" />
      <Glow color={PINK} x="70%" y="70%" />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <FadeText text="8 MEDIA ENGINES" delay={5} size={44} color={RED} weight={900} />
        <div style={{ height: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 850, width: "100%" }}>
          {features.map((f, i) => {
            const s = spring({ frame: frame - 15 - i * 5, fps, config: { damping: 18 } });
            return (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`, opacity: s }}>
                <span style={{ fontSize: 28 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily: inter, fontSize: 15, fontWeight: 700, color: "white" }}>{f.name}</div>
                  <div style={{ fontFamily: inter, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: For Everyone (420-600)
const SceneAudience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const audiences = [
    { role: "Streamers", icon: "🎬", desc: "Built-in studio, branded overlays, analytics", color: RED },
    { role: "Viewers", icon: "👀", desc: "Free content, watch parties, live chat", color: PINK },
    { role: "Investors", icon: "💰", desc: "Market recaps, trend analysis, data feeds", color: GOLD },
    { role: "Creators", icon: "🎨", desc: "Revenue sharing, creator tools, audience growth", color: PURPLE },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, #1a0520, ${BG})` }}>
      <Glow color={RED} x="50%" y="50%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="FOR EVERYONE" delay={5} size={52} color="white" weight={900} />
        <div style={{ height: 36 }} />
        <div style={{ display: "flex", gap: 24 }}>
          {audiences.map((a, i) => {
            const s = spring({ frame: frame - 15 - i * 10, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={a.role} style={{ textAlign: "center", width: 180, transform: `scale(${s})` }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>{a.icon}</div>
                <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: a.color }}>{a.role}</div>
                <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.4 }}>{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Integration (600-780)
const SceneIntegration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <Glow color={CYAN} x="50%" y="50%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="POWERED BY THE FULL STACK" delay={5} size={38} color="rgba(255,255,255,0.5)" weight={700} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {[
            { tier: "TIER 1", name: "Poké Pulse", desc: "Data Engine", color: GOLD, icon: "📊" },
            { tier: "TIER 2", name: "Pulse Market", desc: "12 Franchise Verticals", color: GREEN, icon: "🏗️" },
            { tier: "TIER 3", name: "PGTV Hub", desc: "Media & Entertainment", color: RED, icon: "📺" },
          ].map((t, i) => {
            const s = spring({ frame: frame - 15 - i * 15, fps, config: { damping: 12 } });
            return (
              <React.Fragment key={t.tier}>
                {i > 0 && <div style={{ fontFamily: orbitron, fontSize: 32, color: "rgba(255,255,255,0.15)", opacity: spring({ frame: frame - 30 - i * 10, fps }) }}>→</div>}
                <div style={{ textAlign: "center", width: 200, transform: `scale(${s})`, opacity: s }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontFamily: inter, fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 3 }}>{t.tier}</div>
                  <div style={{ fontFamily: orbitron, fontSize: 20, fontWeight: 700, color: t.color, marginTop: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{t.desc}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ height: 30 }} />
        <FadeText text="Data feeds content. Content drives engagement. Engagement drives revenue." delay={55} size={16} color="rgba(255,255,255,0.35)" weight={500} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (780-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.08) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1a0520, ${BG})` }}>
      <Glow color={RED} x="50%" y="45%" size={900} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="THE CAMERA IS ROLLING" delay={5} size={52} color={RED} weight={900} />
        <div style={{ height: 16 }} />
        <FadeText text="Join the Creator Network — Apply for Early Access" delay={20} size={22} color="rgba(255,255,255,0.5)" weight={500} family={inter} />
        <div style={{ height: 40 }} />
        <div style={{ opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 24, fontWeight: 900, color: "white", background: `linear-gradient(135deg, ${RED}, ${PINK})`, padding: "16px 50px", borderRadius: 12, boxShadow: `0 0 60px ${RED}40` }}>
            🎬 APPLY NOW
          </div>
        </div>
        <div style={{ height: 20 }} />
        <FadeText text="poke-pulse-ticker.lovable.app" delay={50} size={14} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 30, fontFamily: inter, fontSize: 10, color: "#475569", textAlign: "center" }}>
          © 2026 PGVA Ventures, LLC — PGTV Media Hub™ — All Rights Reserved
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier3Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={180}><SceneHero /></Sequence>
    <Sequence from={180} durationInFrames={240}><SceneFeatures /></Sequence>
    <Sequence from={420} durationInFrames={180}><SceneAudience /></Sequence>
    <Sequence from={600} durationInFrames={180}><SceneIntegration /></Sequence>
    <Sequence from={780} durationInFrames={120}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

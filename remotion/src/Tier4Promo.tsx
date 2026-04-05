import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const RED = "#EF4444";
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

// Scene 1: Hero Intro (0-200)
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [175, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={RED} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 13, color: RED, letterSpacing: 5, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>TIER 4 — THE CONTENT ENGINE</div>
        <div style={{ height: 20 }} />
        <FadeText text="PGTV" delay={8} size={100} color={RED} weight={900} />
        <FadeText text="MEDIA HUB™" delay={16} size={56} color="white" weight={700} />
        <div style={{ height: 20 }} />
        <FadeText text="Full-Scale Media Production & Streaming" delay={28} size={24} color="rgba(255,255,255,0.6)" weight={600} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Capabilities (200-420)
const SceneCapabilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [195, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { icon: "🎬", label: "AI Video Production", desc: "Remotion-powered automated promo generation" },
    { icon: "🎤", label: "AI Voiceover Engine", desc: "ElevenLabs-integrated professional narration" },
    { icon: "🎵", label: "Music Generation", desc: "Custom soundtrack creation per campaign" },
    { icon: "📺", label: "Branded Streaming", desc: "PGTV content library with on-demand playback" },
    { icon: "🌐", label: "Multi-Platform", desc: "YouTube, TikTok, Instagram, X distribution" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 30% 40%, ${RED}10, ${BG})` }}>
      <Glow color={RED} x="20%" y="30%" size={600} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="MEDIA CAPABILITIES" delay={5} size={36} color={RED} weight={900} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 800 }}>
          {features.map((f, i) => {
            const s = spring({ frame: frame - 15 - i * 10, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`, background: `${RED}08`, border: `1px solid ${RED}20`, borderRadius: 12, padding: "14px 24px" }}>
                <span style={{ fontSize: 32 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: "white" }}>{f.label}</div>
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

// Scene 3: Content Pipeline (420-640)
const ScenePipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [195, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const steps = ["Script", "Voiceover", "Music", "Render", "Distribute"];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 60% 50%, ${RED}10, ${BG})` }}>
      <Glow color={GOLD} x="60%" y="40%" size={700} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="AUTOMATED PIPELINE" delay={5} size={36} color="white" weight={900} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {steps.map((s, i) => {
            const sp = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ transform: `scale(${sp})`, background: `linear-gradient(135deg, ${RED}, ${GOLD})`, borderRadius: 12, padding: "16px 24px", textAlign: "center" }}>
                  <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: "white" }}>{s}</div>
                </div>
                {i < steps.length - 1 && <div style={{ fontFamily: inter, fontSize: 20, color: RED, opacity: sp }}>→</div>}
              </div>
            );
          })}
        </div>
        <div style={{ height: 30 }} />
        <FadeText text="From concept to published in under 10 minutes" delay={80} size={20} color="rgba(255,255,255,0.5)" weight={600} family={inter} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Revenue & Stats (640-820)
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stats = [
    { value: "$15M+", label: "Media ARR Target" },
    { value: "$25B", label: "Digital Media TAM" },
    { value: "5+", label: "Distribution Channels" },
  ];
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={RED} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="MEDIA REVENUE" delay={5} size={36} color={RED} weight={900} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 50 }}>
          {stats.map((s, i) => {
            const pop = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={i} style={{ textAlign: "center", transform: `scale(${pop})` }}>
                <div style={{ fontFamily: orbitron, fontSize: 48, fontWeight: 900, color: RED }}>{s.value}</div>
                <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (820-900)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.06) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={RED} x="50%" y="40%" size={800} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="PGTV MEDIA HUB™" delay={5} size={52} color={RED} weight={900} />
        <div style={{ height: 10 }} />
        <FadeText text="The Content Engine That Never Sleeps" delay={15} size={24} color="rgba(255,255,255,0.6)" weight={600} family={inter} />
        <div style={{ height: 30 }} />
        <div style={{ opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: BG, background: `linear-gradient(135deg, ${RED}, ${GOLD})`, padding: "14px 40px", borderRadius: 10 }}>TIER 4 — PGVA VENTURES</div>
        </div>
        <div style={{ height: 16 }} />
        <FadeText text="A Noyes Family Trust Venture" delay={50} size={13} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 25, fontFamily: inter, fontSize: 9, color: "#475569", textAlign: "center" }}>© 2026 PGVA Ventures, LLC — Patent Pending</div>
      </div>
    </AbsoluteFill>
  );
};

export const Tier4Promo: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={200}><SceneHero /></Sequence>
    <Sequence from={200} durationInFrames={220}><SceneCapabilities /></Sequence>
    <Sequence from={420} durationInFrames={220}><ScenePipeline /></Sequence>
    <Sequence from={640} durationInFrames={180}><SceneRevenue /></Sequence>
    <Sequence from={820} durationInFrames={80}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

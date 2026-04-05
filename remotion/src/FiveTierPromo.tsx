import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#D4A843";
const GREEN = "#22C55E";
const RED = "#EF4444";
const ORANGE = "#F97316";
const PURPLE = "#8B5CF6";
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
  const exitOp = interpolate(frame, [170, 195], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="35%" y="35%" size={700} />
      <Glow color={PURPLE} x="65%" y="65%" size={500} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ fontFamily: inter, fontSize: 13, color: GOLD, letterSpacing: 5, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>NOYES FAMILY TRUST — PGVA VENTURES, LLC</div>
        <div style={{ height: 24 }} />
        <FadeText text="5-TIER VERTICAL" delay={10} size={72} color="white" weight={900} />
        <FadeText text="INTEGRATION™" delay={18} size={72} color={GOLD} weight={900} />
        <div style={{ height: 20 }} />
        <FadeText text="From Garage to Museum" delay={30} size={28} color="rgba(255,255,255,0.6)" weight={600} family={inter} />
        <div style={{ height: 30 }} />
        <div style={{ display: "flex", gap: 16, opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "GARAGE", color: ORANGE, icon: "🏠" },
            { label: "DATA", color: GOLD, icon: "📊" },
            { label: "FRANCHISE", color: GREEN, icon: "🏗️" },
            { label: "MEDIA", color: RED, icon: "📺" },
            { label: "MUSEUM", color: PURPLE, icon: "🏛️" },
          ].map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: inter, fontSize: 13, color: t.color, border: `1px solid ${t.color}30`, borderRadius: 20, padding: "7px 16px", background: `${t.color}08` }}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TierScene: React.FC<{ tier: string; name: string; color: string; icon: string; desc: string; features: string[]; stat: string; statLabel: string }> =
  ({ tier, name, color, icon, desc, features, stat, statLabel }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enterS = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
    const exitOp = interpolate(frame, [265, 290], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
      <AbsoluteFill style={{ opacity: exitOp, background: `radial-gradient(ellipse at 40% 40%, ${color}12, ${BG})` }}>
        <Glow color={color} x="30%" y="40%" size={800} />
        <div style={{ position: "absolute", inset: 0, display: "flex", padding: 60, gap: 60 }}>
          {/* Left side */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: inter, fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 6, marginBottom: 8, opacity: enterS }}>{tier}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 60, transform: `scale(${enterS})` }}>{icon}</span>
              <div style={{ fontFamily: orbitron, fontSize: 40, fontWeight: 900, color, transform: `translateX(${interpolate(enterS, [0, 1], [40, 0])}px)`, opacity: enterS }}>{name}</div>
            </div>
            <div style={{ fontFamily: inter, fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), maxWidth: 600 }}>{desc}</div>
          </div>
          {/* Right side - features */}
          <div style={{ flex: 0.8, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
            {features.map((f, i) => {
              const fS = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 15 } });
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: fS, transform: `translateX(${interpolate(fS, [0, 1], [30, 0])}px)` }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: inter, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{f}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 20, textAlign: "center", opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 900, color }}>{stat}</div>
              <div style={{ fontFamily: inter, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginTop: 4 }}>{statLabel}</div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" }) }} />
      </AbsoluteFill>
    );
  };

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.06) * 0.05 + 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <Glow color={GOLD} x="50%" y="35%" size={800} />
      <Glow color={PURPLE} x="50%" y="65%" size={600} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <FadeText text="GARAGE. DATA. FRANCHISE." delay={5} size={44} color="white" weight={900} />
        <FadeText text="MEDIA. MUSEUM." delay={12} size={44} color="white" weight={900} />
        <div style={{ height: 16 }} />
        <FadeText text="The World's First 5-Tier Vertical Integration" delay={22} size={22} color={GOLD} weight={600} family={inter} />
        <FadeText text="for the $103B Collectibles Economy" delay={28} size={22} color={GOLD} weight={600} family={inter} />
        <div style={{ height: 36 }} />
        <div style={{ display: "flex", gap: 36 }}>
          {[
            { value: "$1.89B", label: "Valuation" },
            { value: "$157.8M", label: "2030 ARR" },
            { value: "5 TIERS", label: "Integrated" },
          ].map((s, i) => {
            const pop = spring({ frame: frame - 35 - i * 10, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={s.label} style={{ textAlign: "center", transform: `scale(${pop})` }}>
                <div style={{ fontFamily: orbitron, fontSize: 40, fontWeight: 900, color: GOLD }}>{s.value}</div>
                <div style={{ fontFamily: inter, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 36 }} />
        <div style={{ opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${pulse})` }}>
          <div style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: BG, background: `linear-gradient(135deg, ${GOLD}, #f59e0b)`, padding: "14px 40px", borderRadius: 10 }}>
            INVEST IN THE FULL STACK
          </div>
        </div>
        <div style={{ height: 16 }} />
        <FadeText text="A Noyes Family Trust Venture" delay={75} size={14} color="rgba(255,255,255,0.3)" weight={400} family={inter} />
        <div style={{ position: "absolute", bottom: 25, fontFamily: inter, fontSize: 9, color: "#475569", textAlign: "center", lineHeight: 1.4 }}>
          © 2026 PGVA Ventures, LLC — Patent Pending<br />
          Protected under U.S. Copyright, Trademark, Trade Secret, and Patent Laws
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FiveTierPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={200}><IntroScene /></Sequence>
      <Sequence from={200} durationInFrames={300}>
        <TierScene tier="TIER 1 — THE FOUNDATION" name="PokéGarageVA™" color={ORANGE} icon="🏠"
          desc="The grassroots foundation. Home-based franchise hybrid trading card garage sale and vending model operating since 2022. AI-guided sourcing and pricing intelligence."
          features={["Home-based franchise model", "AI-powered card sourcing", "Vending machine network", "Community trading events", "Integration with Poke-Pulse-Engine"]}
          stat="EST. 2022" statLabel="OPERATING" />
      </Sequence>
      <Sequence from={500} durationInFrames={300}>
        <TierScene tier="TIER 2 — DATA ENGINE" name="Poke-Pulse-Engine™" color={GOLD} icon="📊"
          desc="Consumer-facing real-time market data terminal. 500+ cards, AI Alpha Signals, SimTrader World, Arena wagering, and 7-tier subscriptions."
          features={["Real-time market indexes (RAW, GRADED, SEALED)", "AI Alpha Signals™", "SimTrader World™ paper trading", "Poké-Pulse Arena™ wagering", "7-tier subscription model"]}
          stat="$25M+" statLabel="2028 ARR TARGET" />
      </Sequence>
      <Sequence from={800} durationInFrames={300}>
        <TierScene tier="TIER 3 — FRANCHISE" name="Pulse Engine™" color={GREEN} icon="🏗️"
          desc="Institutional-grade franchise data licensing across 12 multi-billion-dollar verticals. White-label deployments and enterprise data API."
          features={["12 vertical markets", "$103B+ combined TAM", "White-label terminal licensing", "Institutional data API", "$157.8M 2030 ARR projection"]}
          stat="$103B+" statLabel="TOTAL ADDRESSABLE MARKET" />
      </Sequence>
      <Sequence from={1100} durationInFrames={300}>
        <TierScene tier="TIER 4 — MEDIA" name="PGTV Media Hub™" color={RED} icon="📺"
          desc="Full-scale media production, creator networks, and streaming content hub. AI-powered video production and multi-platform distribution."
          features={["Branded streaming content", "AI voiceover production", "Creator network partnerships", "Multi-platform distribution", "Campaign asset management"]}
          stat="$15M+" statLabel="MEDIA ARR TARGET" />
      </Sequence>
      <Sequence from={1400} durationInFrames={300}>
        <TierScene tier="TIER 5 — THE PINNACLE" name="Pulse Philanthropic™" color={PURPLE} icon="🏛️"
          desc="The National Museum of Trading Cards & Collectibles in Washington, D.C. Free to the public forever. Physical and digital collections. Private and government funding."
          features={["National Museum — Washington, D.C.", "FREE public admission forever", "Physical & digital collections", "Government & private funding", "AI agent army sourcing opportunities"]}
          stat="FOREVER" statLabel="FREE TO THE PUBLIC" />
      </Sequence>
      <Sequence from={1700} durationInFrames={200}><OutroScene /></Sequence>
    </AbsoluteFill>
  );
};

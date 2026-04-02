import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const NAVY = "#0A1628";
const GOLD = "#D4A843";
const GREEN = "#22C55E";
const CYAN = "#06B6D4";
const BG_DARK = "#050B15";

const terminals = [
  { name: "Pokémon TCG", emoji: "⚡", color: "#EAB308", tam: "$15.4B", status: "LIVE" },
  { name: "Magic: The Gathering", emoji: "🧙", color: "#8B5CF6", tam: "$8.2B", status: "IN DEV" },
  { name: "Yu-Gi-Oh!", emoji: "🃏", color: "#EF4444", tam: "$5.1B", status: "IN DEV" },
  { name: "MLB", emoji: "⚾", color: "#DC2626", tam: "$12.6B", status: "PLANNED" },
  { name: "NFL", emoji: "🏈", color: "#16A34A", tam: "$18.3B", status: "PLANNED" },
  { name: "NBA", emoji: "🏀", color: "#F97316", tam: "$14.7B", status: "PLANNED" },
  { name: "NHL", emoji: "🏒", color: "#2563EB", tam: "$4.2B", status: "PLANNED" },
  { name: "DragonBall Z", emoji: "🐉", color: "#F59E0B", tam: "$6.8B", status: "PLANNED" },
  { name: "Lorcana", emoji: "✨", color: "#38BDF8", tam: "$1.8B", status: "PLANNED" },
  { name: "Star Wars", emoji: "⭐", color: "#6B7280", tam: "$9.5B", status: "PLANNED" },
  { name: "FIFA Soccer", emoji: "⚽", color: "#10B981", tam: "$7.3B", status: "PLANNED" },
];

// Scene 1: Title (0-90)
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const subOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: frame - 45, fps, config: { damping: 20 } });
  const shimmer = Math.sin(frame * 0.08) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG_DARK})` }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, transparent 40%, ${GOLD}08 50%, transparent 60%)`, opacity: shimmer }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 80 }}>
        <div style={{ fontFamily: orbitron, fontSize: 72, fontWeight: 900, color: GOLD, textAlign: "center", lineHeight: 1.1,
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`, opacity: titleSpring }}>
          PULSE MARKET
          <br />
          TERMINAL™
        </div>
        <div style={{ fontFamily: inter, fontSize: 24, color: "#94A3B8", textAlign: "center", marginTop: 24, opacity: subOpacity, letterSpacing: 4 }}>
          ONE PLATFORM. TWELVE MARKETS. INFINITE SCALE.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 16, transform: `translateY(${interpolate(badgeSpring, [0, 1], [20, 0])}px)`, opacity: badgeSpring }}>
          {["Patent Pending", "$103B+ TAM", "12 Verticals"].map((t) => (
            <div key={t} style={{ fontFamily: inter, fontSize: 14, color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 20, padding: "8px 20px", background: `${GOLD}10` }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 40, fontFamily: inter, fontSize: 12, color: "#475569", letterSpacing: 2 }}>
          PGVA VENTURES, LLC — CONFIDENTIAL
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Terminal Grid (90-240)
const TerminalGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_DARK}, ${NAVY})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: "#F8FAFC", textAlign: "center", marginTop: 50,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        12 MARKET VERTICALS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "30px 60px", marginTop: 10 }}>
        {terminals.map((t, i) => {
          const delay = i * 4;
          const s = spring({ frame: frame - delay - 15, fps, config: { damping: 18 } });
          return (
            <div key={t.name} style={{
              background: `linear-gradient(135deg, ${t.color}15, ${t.color}08)`,
              border: `1px solid ${t.color}40`,
              borderRadius: 12, padding: 16, textAlign: "center",
              transform: `scale(${s})`, opacity: s,
            }}>
              <div style={{ fontSize: 36 }}>{t.emoji}</div>
              <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6 }}>{t.name}</div>
              <div style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: t.color, marginTop: 4 }}>{t.tam}</div>
              <div style={{ fontFamily: inter, fontSize: 10, color: t.status === "LIVE" ? GREEN : "#94A3B8", marginTop: 4, letterSpacing: 1 }}>
                {t.status}
              </div>
            </div>
          );
        })}
        {/* White-label card */}
        <div style={{
          background: `linear-gradient(135deg, ${GOLD}15, ${GOLD}08)`,
          border: `1px solid ${GOLD}40`,
          borderRadius: 12, padding: 16, textAlign: "center",
          transform: `scale(${spring({ frame: frame - 60, fps, config: { damping: 18 } })})`,
          opacity: spring({ frame: frame - 60, fps, config: { damping: 18 } }),
        }}>
          <div style={{ fontSize: 36 }}>🏗️</div>
          <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6 }}>White-Label</div>
          <div style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: GOLD, marginTop: 4 }}>∞</div>
          <div style={{ fontFamily: inter, fontSize: 10, color: GOLD, marginTop: 4, letterSpacing: 1 }}>LICENSING</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Core Features (240-390)
const CoreFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const features = [
    { icon: "📊", name: "Real-Time Indexes", desc: "Market data aggregation" },
    { icon: "🤖", name: "AI Alpha Signals", desc: "ML buy/sell/hold" },
    { icon: "📈", name: "Portfolio Tracker", desc: "P&L analytics" },
    { icon: "🎮", name: "SimTrader World™", desc: "Gamified trading" },
    { icon: "🏟️", name: "Arena™", desc: "Prediction markets" },
    { icon: "👥", name: "Community Intel", desc: "Consensus pricing" },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0F172A, ${BG_DARK})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: CYAN, textAlign: "center", marginTop: 60,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        REPLICABLE CORE
      </div>
      <div style={{ fontFamily: inter, fontSize: 18, color: "#94A3B8", textAlign: "center", marginTop: 8 }}>
        Every terminal ships with these features on day one
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: "40px 80px" }}>
        {features.map((f, i) => {
          const s = spring({ frame: frame - i * 6 - 20, fps, config: { damping: 15, stiffness: 100 } });
          return (
            <div key={f.name} style={{
              background: `${CYAN}08`, border: `1px solid ${CYAN}25`, borderRadius: 16, padding: 24,
              transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`, opacity: s,
            }}>
              <div style={{ fontSize: 40 }}>{f.icon}</div>
              <div style={{ fontFamily: inter, fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginTop: 12 }}>{f.name}</div>
              <div style={{ fontFamily: inter, fontSize: 14, color: "#94A3B8", marginTop: 4 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Revenue Model (390-510)
const RevenueModel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const streams = [
    { name: "Subscriptions", pct: 45, color: GREEN },
    { name: "Games", pct: 15, color: "#EAB308" },
    { name: "Affiliate", pct: 12, color: "#F97316" },
    { name: "Data", pct: 10, color: CYAN },
    { name: "Arena Rake", pct: 8, color: "#8B5CF6" },
    { name: "Ads", pct: 5, color: "#EC4899" },
    { name: "White-Label", pct: 5, color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK}, #0F172A)` }}>
      <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: GREEN, textAlign: "center", marginTop: 60,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        7 REVENUE STREAMS
      </div>
      <div style={{ fontFamily: inter, fontSize: 16, color: "#94A3B8", textAlign: "center", marginTop: 8 }}>
        Per terminal × 12 verticals = massive diversified revenue
      </div>
      <div style={{ padding: "40px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
        {streams.map((s, i) => {
          const delay = 20 + i * 6;
          const width = interpolate(frame, [delay, delay + 30], [0, s.pct], { extrapolateRight: "clamp" });
          return (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 600, color: "#CBD5E1", width: 120, textAlign: "right" }}>{s.name}</div>
              <div style={{ flex: 1, height: 32, background: "#1E293B", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ width: `${width}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                  {width > 5 && <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 700, color: "#FFF" }}>{s.pct}%</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Projections (510-660)
const Projections: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = [
    { year: "2026", arr: "$2.1M", users: "50K", margin: "22%" },
    { year: "2027", arr: "$8.5M", users: "250K", margin: "35%" },
    { year: "2028", arr: "$25M+", users: "1M", margin: "45%" },
    { year: "2029", arr: "$75M+", users: "3M+", margin: "55%" },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 70%, #0F172A, ${BG_DARK})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: GOLD, textAlign: "center", marginTop: 60,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        GROWTH TRAJECTORY
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 30, padding: "60px 80px" }}>
        {data.map((d, i) => {
          const s = spring({ frame: frame - i * 10 - 20, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={d.year} style={{
              flex: 1, background: `${GOLD}08`, border: `1px solid ${GOLD}30`, borderRadius: 16, padding: 30, textAlign: "center",
              transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`, opacity: s,
            }}>
              <div style={{ fontFamily: orbitron, fontSize: 28, fontWeight: 900, color: GOLD }}>{d.year}</div>
              <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 900, color: GREEN, marginTop: 16 }}>{d.arr}</div>
              <div style={{ fontFamily: inter, fontSize: 12, color: "#94A3B8", marginTop: 4 }}>ARR</div>
              <div style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginTop: 16 }}>{d.users}</div>
              <div style={{ fontFamily: inter, fontSize: 12, color: "#94A3B8" }}>Users</div>
              <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 600, color: CYAN, marginTop: 12 }}>{d.margin}</div>
              <div style={{ fontFamily: inter, fontSize: 10, color: "#94A3B8" }}>Net Margin</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: CTA (660-810)
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.06) * 0.1 + 1;
  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG_DARK})` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 56, fontWeight: 900, color: GOLD, textAlign: "center",
          transform: `scale(${titleSpring * pulse})`, opacity: titleSpring }}>
          $2.5M SERIES SEED
        </div>
        <div style={{ fontFamily: inter, fontSize: 24, color: "#94A3B8", textAlign: "center", marginTop: 20,
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
          Target: 10x ROI within 36 months
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 60, opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }) }}>
          {[
            { label: "12", sub: "TERMINALS" },
            { label: "$103B+", sub: "COMBINED TAM" },
            { label: "$75M+", sub: "2029 ARR" },
          ].map((s) => (
            <div key={s.sub} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: orbitron, fontSize: 40, fontWeight: 900, color: GREEN }}>{s.label}</div>
              <div style={{ fontFamily: inter, fontSize: 11, color: "#94A3B8", letterSpacing: 2, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: orbitron, fontSize: 16, color: GOLD, letterSpacing: 3 }}>PGVA VENTURES, LLC</div>
          <div style={{ fontFamily: inter, fontSize: 11, color: "#475569" }}>
            © 2026 All Rights Reserved. Patent Pending. Confidential.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FranchisePitch: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}><TitleScene /></Sequence>
      <Sequence from={90} durationInFrames={150}><TerminalGrid /></Sequence>
      <Sequence from={240} durationInFrames={150}><CoreFeatures /></Sequence>
      <Sequence from={390} durationInFrames={120}><RevenueModel /></Sequence>
      <Sequence from={510} durationInFrames={150}><Projections /></Sequence>
      <Sequence from={660} durationInFrames={150}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};

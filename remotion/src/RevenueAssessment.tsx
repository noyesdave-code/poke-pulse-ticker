import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const NAVY = "#0A1628";
const GOLD = "#D4A843";
const GREEN = "#22C55E";
const CYAN = "#06B6D4";
const RED = "#EF4444";
const BG = "#050B15";
const PURPLE = "#A855F7";

const verticals = [
  { name: "Pokémon TCG", ticker: "PKMN", color: "#EAB308", yr1: 1.2, yr5: 22.0, tam: 12.1, cagr: 78 },
  { name: "NFL", ticker: "NFL", color: "#16A34A", yr1: 1.0, yr5: 18.5, tam: 11.2, cagr: 73 },
  { name: "FIFA Soccer", ticker: "FIFA", color: "#10B981", yr1: 1.1, yr5: 20.0, tam: 15.5, cagr: 75 },
  { name: "NBA", ticker: "NBA", color: "#F97316", yr1: 0.95, yr5: 17.0, tam: 10.5, cagr: 72 },
  { name: "MLB", ticker: "MLB", color: "#DC2626", yr1: 0.9, yr5: 16.0, tam: 9.8, cagr: 71 },
  { name: "MTG", ticker: "MTG", color: "#8B5CF6", yr1: 0.8, yr5: 15.0, tam: 8.4, cagr: 72 },
  { name: "Yu-Gi-Oh!", ticker: "YGO", color: "#EF4444", yr1: 0.6, yr5: 11.5, tam: 6.2, cagr: 70 },
  { name: "Star Wars", ticker: "STRW", color: "#6B7280", yr1: 0.5, yr5: 10.5, tam: 4.5, cagr: 74 },
  { name: "DragonBall Z", ticker: "DBZ", color: "#F59E0B", yr1: 0.5, yr5: 10.0, tam: 5.2, cagr: 74 },
  { name: "Lorcana", ticker: "LOR", color: "#38BDF8", yr1: 0.4, yr5: 9.8, tam: 2.8, cagr: 85 },
  { name: "NHL", ticker: "NHL", color: "#2563EB", yr1: 0.35, yr5: 7.5, tam: 3.8, cagr: 76 },
];

// Scene 1: Title (0-90)
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const sub = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.06) * 0.12 + 0.88;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${NAVY}, ${BG})` }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, transparent 35%, ${GOLD}0A 50%, transparent 65%)`, opacity: pulse }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 64, fontWeight: 900, color: GOLD, textAlign: "center", lineHeight: 1.1,
          transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [40, 0])}px)`, opacity: s }}>
          2026 REVENUE
          <br />
          ASSESSMENT
        </div>
        <div style={{ fontFamily: inter, fontSize: 22, color: "#94A3B8", textAlign: "center", marginTop: 20, opacity: sub, letterSpacing: 3 }}>
          PULSE MARKET TERMINAL TICKER™ — ALL 12 VERTICALS
        </div>
        <div style={{ fontFamily: inter, fontSize: 14, color: "#475569", marginTop: 30, opacity: sub, letterSpacing: 2 }}>
          PGVA VENTURES, LLC | CONFIDENTIAL
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Overall Valuation (0-120)
const ValuationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const metrics = [
    { label: "TOTAL 5-YR ARR", value: "$157.8M", color: GREEN },
    { label: "IP PORTFOLIO", value: "$38.0M", color: CYAN },
    { label: "ENTERPRISE VALUE", value: "$1.89B", color: GOLD },
    { label: "COMBINED TAM", value: "$103B+", color: PURPLE },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 60%, ${NAVY}, ${BG})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: GOLD, textAlign: "center", marginTop: 80 }}>
        COMPANY VALUATION
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, padding: "60px 120px", marginTop: 20 }}>
        {metrics.map((m, i) => {
          const s = spring({ frame: frame - i * 12, fps, config: { damping: 18 } });
          return (
            <div key={m.label} style={{ background: `${m.color}12`, border: `1px solid ${m.color}40`, borderRadius: 16, padding: "30px 24px", textAlign: "center",
              transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [30, 0])}px)`, opacity: s }}>
              <div style={{ fontFamily: orbitron, fontSize: 42, fontWeight: 900, color: m.color }}>{m.value}</div>
              <div style={{ fontFamily: inter, fontSize: 13, color: "#94A3B8", marginTop: 8, letterSpacing: 2 }}>{m.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Revenue waterfall (0-150)
const WaterfallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxHeight = 320;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, ${NAVY}, ${BG})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 30, fontWeight: 700, color: CYAN, textAlign: "center", marginTop: 50 }}>
        YEAR 5 ARR BY VERTICAL ($M)
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, height: maxHeight + 100, padding: "0 60px", marginTop: 20 }}>
        {verticals.map((v, i) => {
          const s = spring({ frame: frame - i * 8, fps, config: { damping: 20, stiffness: 120 } });
          const barH = (v.yr5 / 22) * maxHeight * s;
          return (
            <div key={v.ticker} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 70 }}>
              <div style={{ fontFamily: orbitron, fontSize: 11, color: v.color, marginBottom: 4, opacity: s }}>${v.yr5}M</div>
              <div style={{ width: 50, height: barH, background: `linear-gradient(to top, ${v.color}30, ${v.color})`, borderRadius: "6px 6px 0 0" }} />
              <div style={{ fontFamily: inter, fontSize: 9, color: "#64748B", marginTop: 6, textAlign: "center", opacity: s }}>{v.ticker}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Growth trajectory (0-120)
const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const years = [
    { year: "2026", rev: 8.3 },
    { year: "2027", rev: 26.7 },
    { year: "2028", rev: 60.6 },
    { year: "2029", rev: 102.0 },
    { year: "2030", rev: 157.8 },
  ];
  const maxRev = 157.8;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 40%, ${NAVY}, ${BG})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 30, fontWeight: 700, color: GREEN, textAlign: "center", marginTop: 60 }}>
        5-YEAR GROWTH TRAJECTORY
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40, height: 360, padding: "0 100px", marginTop: 40 }}>
        {years.map((y, i) => {
          const s = spring({ frame: frame - i * 15, fps, config: { damping: 15 } });
          const barH = (y.rev / maxRev) * 300 * s;
          return (
            <div key={y.year} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: orbitron, fontSize: 18, color: GREEN, marginBottom: 8, opacity: s }}>${y.rev}M</div>
              <div style={{ width: 90, height: barH, background: `linear-gradient(to top, ${GREEN}20, ${GREEN})`, borderRadius: "10px 10px 0 0" }} />
              <div style={{ fontFamily: inter, fontSize: 16, color: "#94A3B8", marginTop: 10, opacity: s }}>{y.year}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: inter, fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 20 }}>
        76% CAGR — 12 VERTICALS COMBINED
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Investor targets (0-120)
const InvestorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const investors = [
    { name: "Andreessen Horowitz", score: 98 },
    { name: "Sequoia Capital", score: 96 },
    { name: "Tiger Global", score: 94 },
    { name: "Lightspeed Ventures", score: 93 },
    { name: "Benchmark Capital", score: 92 },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 50%, ${NAVY}, ${BG})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 30, fontWeight: 700, color: GOLD, textAlign: "center", marginTop: 70 }}>
        TOP INVESTOR TARGETS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "40px 200px" }}>
        {investors.map((inv, i) => {
          const s = spring({ frame: frame - i * 12, fps, config: { damping: 20 } });
          return (
            <div key={inv.name} style={{ display: "flex", alignItems: "center", gap: 20, background: `${GOLD}08`, border: `1px solid ${GOLD}25`, borderRadius: 12, padding: "16px 24px",
              transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`, opacity: s }}>
              <div style={{ fontFamily: orbitron, fontSize: 24, fontWeight: 900, color: GOLD, width: 40 }}>#{i + 1}</div>
              <div style={{ flex: 1, fontFamily: inter, fontSize: 20, fontWeight: 600, color: "#E2E8F0" }}>{inv.name}</div>
              <div style={{ fontFamily: orbitron, fontSize: 18, color: GREEN }}>{inv.score}/100</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Closing (0-90)
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const pulse = Math.sin(frame * 0.08) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${NAVY}, ${BG})` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${GOLD}08, transparent 60%)`, opacity: pulse }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 48, fontWeight: 900, color: GOLD, textAlign: "center",
          transform: `scale(${s})`, opacity: s }}>
          $157.8M ARR
        </div>
        <div style={{ fontFamily: inter, fontSize: 22, color: "#94A3B8", marginTop: 16, opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }), letterSpacing: 3 }}>
          BY 2030 — ACROSS 12 VERTICALS
        </div>
        <div style={{ fontFamily: orbitron, fontSize: 16, color: GOLD, marginTop: 40, opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }), letterSpacing: 4 }}>
          PULSE MARKET TERMINAL TICKER™
        </div>
        <div style={{ fontFamily: inter, fontSize: 12, color: "#475569", marginTop: 20, opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }) }}>
          PGVA VENTURES, LLC — PROTECTED BY NOYES FAMILY TRUST
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RevenueAssessment: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}><TitleScene /></Sequence>
      <Sequence from={90} durationInFrames={120}><ValuationScene /></Sequence>
      <Sequence from={210} durationInFrames={150}><WaterfallScene /></Sequence>
      <Sequence from={360} durationInFrames={120}><GrowthScene /></Sequence>
      <Sequence from={480} durationInFrames={120}><InvestorScene /></Sequence>
      <Sequence from={600} durationInFrames={90}><ClosingScene /></Sequence>
    </AbsoluteFill>
  );
};

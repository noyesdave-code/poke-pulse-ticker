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

const verticals = [
  { name: "Pokémon TCG", emoji: "⚡", color: "#EAB308", tam: "$15.4B", arr: "$18.5M", status: "LIVE" },
  { name: "Magic: The Gathering", emoji: "🧙", color: "#8B5CF6", tam: "$8.2B", arr: "$14.2M", status: "Q3 2026" },
  { name: "Yu-Gi-Oh!", emoji: "🃏", color: "#EF4444", tam: "$5.1B", arr: "$11.8M", status: "Q3 2026" },
  { name: "MLB Baseball", emoji: "⚾", color: "#DC2626", tam: "$12.6B", arr: "$16.4M", status: "Q4 2026" },
  { name: "NFL Football", emoji: "🏈", color: "#16A34A", tam: "$18.3B", arr: "$19.7M", status: "Q4 2026" },
  { name: "NBA Basketball", emoji: "🏀", color: "#F97316", tam: "$14.7B", arr: "$17.1M", status: "Q1 2027" },
  { name: "NHL Hockey", emoji: "🏒", color: "#2563EB", tam: "$4.2B", arr: "$8.6M", status: "Q1 2027" },
  { name: "DragonBall Z", emoji: "🐉", color: "#F59E0B", tam: "$6.8B", arr: "$12.3M", status: "Q2 2027" },
  { name: "Lorcana", emoji: "✨", color: "#38BDF8", tam: "$1.8B", arr: "$6.4M", status: "Q2 2027" },
  { name: "Star Wars", emoji: "⭐", color: "#94A3B8", tam: "$9.5B", arr: "$14.8M", status: "Q3 2027" },
  { name: "FIFA Soccer", emoji: "⚽", color: "#10B981", tam: "$7.3B", arr: "$12.7M", status: "Q3 2027" },
];

const features = [
  { name: "Live Market Data Engine", desc: "Real-time pricing across all indexes, updated every 60-90 min" },
  { name: "AI Alpha Signals™", desc: "Proprietary breakout detection before market moves" },
  { name: "SimTrader World™", desc: "Risk-free virtual trading with $100K balance & AI opponents" },
  { name: "Poké-Pulse Arena™", desc: "PvP prediction duels, tournaments, competitive leaderboards" },
  { name: "Grading Arbitrage Engine", desc: "Identify raw-to-graded conversion profit opportunities" },
  { name: "Portfolio Intelligence", desc: "Track collection value with historical P&L snapshots" },
];

const milestones = [
  { year: "2026", rev: "$2.4M", users: "45K", note: "Pokémon + TCG Launch" },
  { year: "2027", rev: "$18.5M", users: "320K", note: "Sports Cards Expansion" },
  { year: "2028", rev: "$52M", users: "1.2M", note: "Full 12-Vertical Scale" },
  { year: "2029", rev: "$98M", users: "3.5M", note: "International + API" },
  { year: "2030", rev: "$157.8M", users: "8M+", note: "Market Leadership" },
];

const investors = [
  "Andreessen Horowitz (a16z)", "Sequoia Capital", "Accel Partners",
  "General Catalyst", "Pantera Capital", "Paradigm",
  "Tiger Global", "Ribbit Capital", "Bessemer Venture Partners", "Coatue Management",
];

// Scene 1: Cinematic Open (0-150 frames = 5s)
const CinematicOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const tagline = spring({ frame: frame - 40, fps, config: { damping: 20 } });
  const pulse = Math.sin(frame * 0.06) * 0.12 + 0.88;
  const glow = Math.sin(frame * 0.04) * 30 + 30;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NAVY}, ${BG})` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${GOLD}08 0%, transparent 60%)`, opacity: pulse }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 60 }}>
        <div style={{ fontFamily: orbitron, fontSize: 18, color: GOLD, letterSpacing: 8, marginBottom: 20, opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
          PGVA VENTURES, LLC PRESENTS
        </div>
        <div style={{ fontFamily: orbitron, fontSize: 82, fontWeight: 900, color: "#F8FAFC", textAlign: "center", lineHeight: 1.05,
          transform: `scale(${titleSpring})`, opacity: titleSpring, textShadow: `0 0 ${glow}px ${GOLD}40` }}>
          PULSE MARKET
          <br />
          <span style={{ color: GOLD }}>TERMINAL TICKER™</span>
        </div>
        <div style={{ fontFamily: inter, fontSize: 22, color: "#94A3B8", textAlign: "center", marginTop: 30, opacity: tagline, maxWidth: 700, lineHeight: 1.5 }}>
          The World's First AI-Powered Collectible Market Intelligence Platform
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 40, opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" }) }}>
          {["$103B+ TAM", "12 Verticals", "Patent Pending", "76% CAGR"].map(t => (
            <div key={t} style={{ fontFamily: inter, fontSize: 13, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 24, padding: "8px 18px", background: `${GOLD}08` }}>{t}</div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 30, fontFamily: inter, fontSize: 11, color: "#334155", letterSpacing: 3 }}>
          CONFIDENTIAL — FOR QUALIFIED INVESTORS ONLY
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Problem (150-300 = 5s)
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 18 } });
  const problems = [
    "Fragmented market data across dozens of platforms",
    "No standardized pricing indexes for collectibles",
    "Zero AI-powered analytics for card investors",
    "No professional tools — collectors rely on gut instinct",
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG}, #0F1729)` }}>
      <div style={{ padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 44, fontWeight: 700, color: RED, marginBottom: 50, transform: `translateX(${interpolate(headSpring, [0, 1], [-40, 0])}px)`, opacity: headSpring }}>
          THE PROBLEM
        </div>
        {problems.map((p, i) => {
          const s = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`, opacity: s }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, flexShrink: 0 }} />
              <div style={{ fontFamily: inter, fontSize: 22, color: "#CBD5E1", lineHeight: 1.4 }}>{p}</div>
            </div>
          );
        })}
        <div style={{ fontFamily: inter, fontSize: 16, color: "#64748B", marginTop: 40, opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }) }}>
          $103 BILLION market. Zero institutional-grade tools.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: The Solution (300-450 = 5s)
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 50%, ${NAVY}, ${BG})` }}>
      <div style={{ padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 44, fontWeight: 700, color: GREEN, marginBottom: 20, transform: `scale(${headSpring})`, opacity: headSpring }}>
          OUR SOLUTION
        </div>
        <div style={{ fontFamily: inter, fontSize: 20, color: "#94A3B8", marginBottom: 50, opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }), maxWidth: 700 }}>
          One platform. Every collectible market. AI-powered intelligence.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {features.map((f, i) => {
            const s = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20`, borderRadius: 12, padding: 20,
                transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`, opacity: s }}>
                <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 700, color: GREEN, marginBottom: 6 }}>{f.name}</div>
                <div style={{ fontFamily: inter, fontSize: 13, color: "#94A3B8" }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: 12 Verticals Grid (450-720 = 9s)
const VerticalsGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG}, ${NAVY})` }}>
      <div style={{ fontFamily: orbitron, fontSize: 38, fontWeight: 700, color: "#F8FAFC", textAlign: "center", marginTop: 40,
        opacity: headSpring, transform: `translateY(${interpolate(headSpring, [0, 1], [20, 0])}px)` }}>
        12 MARKET VERTICALS
      </div>
      <div style={{ fontFamily: inter, fontSize: 16, color: GOLD, textAlign: "center", marginTop: 8, opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
        Combined TAM: $103.9 Billion
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: "20px 50px", marginTop: 15 }}>
        {verticals.map((v, i) => {
          const s = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 16 } });
          return (
            <div key={i} style={{ background: `${v.color}0A`, border: `1px solid ${v.color}30`, borderRadius: 10, padding: "14px 16px",
              transform: `scale(${s})`, opacity: s, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{v.emoji}</span>
                <span style={{ fontFamily: inter, fontSize: 13, fontWeight: 700, color: v.color }}>{v.name}</span>
              </div>
              <div style={{ fontFamily: inter, fontSize: 11, color: "#94A3B8" }}>TAM: {v.tam}</div>
              <div style={{ fontFamily: inter, fontSize: 11, color: "#64748B" }}>Y5 ARR: {v.arr}</div>
              <div style={{ fontFamily: inter, fontSize: 9, color: v.status === "LIVE" ? GREEN : CYAN, letterSpacing: 1, marginTop: 2 }}>{v.status}</div>
            </div>
          );
        })}
        {/* Empty cell for alignment */}
        <div />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Revenue Growth (720-960 = 8s)
const RevenueGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 18 } });
  const maxRev = 157.8;
  const barData = [2.4, 18.5, 52, 98, 157.8];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 70%, ${NAVY}, ${BG})` }}>
      <div style={{ padding: "50px 80px", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 38, fontWeight: 700, color: GOLD, marginBottom: 8, opacity: headSpring }}>
          REVENUE TRAJECTORY
        </div>
        <div style={{ fontFamily: inter, fontSize: 16, color: "#94A3B8", marginBottom: 40 }}>
          76% Compound Annual Growth Rate — 2026 to 2030
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, flex: 1, paddingBottom: 40 }}>
          {milestones.map((m, i) => {
            const delay = 25 + i * 15;
            const barSpring = spring({ frame: frame - delay, fps, config: { damping: 14 } });
            const height = (barData[i] / maxRev) * 300;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: GOLD, marginBottom: 8, opacity: barSpring }}>{m.rev}</div>
                <div style={{ width: "100%", height: height * barSpring, background: `linear-gradient(180deg, ${GOLD}, ${GOLD}60)`, borderRadius: "8px 8px 0 0", minHeight: 4 }} />
                <div style={{ fontFamily: orbitron, fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginTop: 12 }}>{m.year}</div>
                <div style={{ fontFamily: inter, fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.users} users</div>
                <div style={{ fontFamily: inter, fontSize: 10, color: "#475569", marginTop: 2 }}>{m.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Company Valuation (960-1140 = 6s)
const ValuationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const valSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 60 } });
  const pulse = Math.sin(frame * 0.05) * 0.1 + 0.9;

  const metrics = [
    { label: "Base Valuation", value: "$1.89B", color: GOLD },
    { label: "IP Portfolio", value: "$38M", color: CYAN },
    { label: "Y5 ARR (All Verticals)", value: "$157.8M", color: GREEN },
    { label: "Revenue Multiple", value: "12x", color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #1A1040, ${BG})` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 60 }}>
        <div style={{ fontFamily: orbitron, fontSize: 20, color: "#64748B", letterSpacing: 6, marginBottom: 20, opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
          COMPANY VALUATION
        </div>
        <div style={{ fontFamily: orbitron, fontSize: 96, fontWeight: 900, color: GOLD, textShadow: `0 0 40px ${GOLD}30`,
          transform: `scale(${valSpring})`, opacity: valSpring * pulse }}>
          $1.89B
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 50, width: "100%", maxWidth: 700 }}>
          {metrics.map((m, i) => {
            const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 20 } });
            return (
              <div key={i} style={{ background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: 12, padding: "16px 20px",
                opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)` }}>
                <div style={{ fontFamily: inter, fontSize: 12, color: "#64748B", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: orbitron, fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Top Investors (1140-1380 = 8s)
const InvestorTargets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG}, ${NAVY})` }}>
      <div style={{ padding: "50px 80px", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: CYAN, marginBottom: 8, opacity: headSpring }}>
          STRATEGIC ACQUISITION TARGETS
        </div>
        <div style={{ fontFamily: inter, fontSize: 15, color: "#94A3B8", marginBottom: 40, opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
          Top 10 Institutional Investors & Strategic Acquirers
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1, alignContent: "start" }}>
          {investors.map((name, i) => {
            const s = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: `${CYAN}06`, border: `1px solid ${CYAN}15`, borderRadius: 10, padding: "14px 18px",
                transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -40 : 40, 0])}px)`, opacity: s }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${CYAN}15`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: CYAN }}>
                  {i + 1}
                </div>
                <div style={{ fontFamily: inter, fontSize: 15, fontWeight: 600, color: "#E2E8F0" }}>{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: IP Protection + Legal (1380-1530 = 5s)
const LegalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSpring = spring({ frame, fps, config: { damping: 18 } });
  const protections = [
    "Patent-Pending Market Terminal Architecture",
    "12 Registered Trademarks (SimTrader World™, Alpha Signals™, etc.)",
    "DMCA · CFAA · DTSA Federal Protections",
    "Noyes Family Trust — Liability Shield & Asset Protection",
    "Trade Secret Classification — All Source Code",
    "Forensic Watermarking & DRM Metadata Embedded",
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG}, #0F0A20)` }}>
      <div style={{ padding: "50px 80px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <div style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: "#F8FAFC", marginBottom: 40, opacity: headSpring }}>
          IP & LEGAL PROTECTION
        </div>
        {protections.map((p, i) => {
          const s = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [30, 0])}px)` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
              <div style={{ fontFamily: inter, fontSize: 17, color: "#CBD5E1" }}>{p}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 9: Call to Action (1530-1770 = 8s)
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 50 } });
  const glow = Math.sin(frame * 0.04) * 40 + 40;
  const pulse = Math.sin(frame * 0.06) * 0.08 + 0.92;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1A1040, ${BG})` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${GOLD}06 0%, transparent 50%)`, opacity: pulse }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 60 }}>
        <div style={{ fontFamily: orbitron, fontSize: 56, fontWeight: 900, color: GOLD, textAlign: "center", lineHeight: 1.15,
          transform: `scale(${titleSpring})`, opacity: titleSpring, textShadow: `0 0 ${glow}px ${GOLD}30` }}>
          THE FUTURE OF
          <br />
          COLLECTIBLE MARKETS
        </div>
        <div style={{ fontFamily: inter, fontSize: 20, color: "#94A3B8", textAlign: "center", marginTop: 30, maxWidth: 600,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }) }}>
          One platform to rule 12 verticals. $103B+ TAM.
          <br />
          Patent-pending technology. Ready for acquisition.
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: 50, opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: inter, fontSize: 14, color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 30, padding: "12px 30px" }}>
            contact@poke-pulse-ticker.com
          </div>
          <div style={{ fontFamily: inter, fontSize: 14, color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 30, padding: "12px 30px" }}>
            poke-pulse-ticker.com/blueprint
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, textAlign: "center" }}>
          <div style={{ fontFamily: orbitron, fontSize: 12, color: "#475569", letterSpacing: 3 }}>
            © 2026 PGVA VENTURES, LLC · ALL RIGHTS RESERVED · PATENT PENDING
          </div>
          <div style={{ fontFamily: inter, fontSize: 9, color: "#334155", marginTop: 6 }}>
            PROTECTED UNDER DMCA, CFAA & DTSA · NOYES FAMILY TRUST
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Extended Investor Pitch — 59 seconds at 30fps = 1770 frames
export const ExtendedInvestorPitch: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={150}><CinematicOpen /></Sequence>
      <Sequence from={150} durationInFrames={150}><ProblemScene /></Sequence>
      <Sequence from={300} durationInFrames={150}><SolutionScene /></Sequence>
      <Sequence from={450} durationInFrames={270}><VerticalsGrid /></Sequence>
      <Sequence from={720} durationInFrames={240}><RevenueGrowth /></Sequence>
      <Sequence from={960} durationInFrames={180}><ValuationScene /></Sequence>
      <Sequence from={1140} durationInFrames={240}><InvestorTargets /></Sequence>
      <Sequence from={1380} durationInFrames={150}><LegalScene /></Sequence>
      <Sequence from={1530} durationInFrames={240}><ClosingScene /></Sequence>
    </AbsoluteFill>
  );
};

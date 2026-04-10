import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";
import { loadFont as loadOrbitron } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: orbitron } = loadOrbitron("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const PRIMARY = "#2dd4a8";
const BG_DARK = "#0c0f17";
const BG_MID = "#111827";
const AMBER = "#f59e0b";
const BLUE = "#3b82f6";

/* ─── Scene 1: Hook ─── */
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(
    spring({ frame, fps, config: { damping: 18, stiffness: 120 } }),
    [0, 1], [60, 0]
  );
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const pulseScale = 1 + 0.03 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG_MID} 100%)` }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${pulseScale})`,
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${PRIMARY}15 0%, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, ${titleY - 50}%)`,
        textAlign: "center", opacity: titleOp, width: "90%",
      }}>
        <p style={{ fontFamily: orbitron, fontSize: 72, fontWeight: 900, color: PRIMARY, lineHeight: 1.1 }}>
          PLATFORM UPDATE
        </p>
        <p style={{ fontFamily: orbitron, fontSize: 36, fontWeight: 700, color: "#fff", marginTop: 10, opacity: subtitleOp }}>
          Q2 2026 — What's New
        </p>
      </div>
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        fontFamily: inter, fontSize: 16, color: PRIMARY, opacity: interpolate(frame, [40, 60], [0, 0.7], { extrapolateRight: "clamp" }),
      }}>
        poke-pulse-ticker.lovable.app
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Grid ─── */
const features = [
  { emoji: "📊", title: "eBay Live Deals", desc: "Real-time auction tracking for raw, graded & sealed" },
  { emoji: "🧮", title: "1000+ Card Pool", desc: "Grading ROI calc now searches the full card universe" },
  { emoji: "🔄", title: "Trending Rotation", desc: "5-minute refresh cycle for maximum card variety" },
  { emoji: "🛡️", title: "Legal Protection", desc: "Full IP & security documentation embedded on-site" },
  { emoji: "📹", title: "PGTV Media Hub", desc: "10 Poké Ripz™ episodes + institutional promo suite" },
  { emoji: "🤖", title: "Social Auto-Post", desc: "Automated 2-hour rotation across all platforms" },
];

const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG_MID} 0%, ${BG_DARK} 100%)` }}>
      <p style={{
        fontFamily: orbitron, fontSize: 36, fontWeight: 900, color: "#fff",
        position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)",
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        NEW FEATURES
      </p>
      <div style={{
        position: "absolute", top: 140, left: "50%", transform: "translateX(-50%)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, width: "85%",
      }}>
        {features.map((f, i) => {
          const delay = 10 + i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(s, [0, 1], [40, 0]);
          return (
            <div key={i} style={{
              opacity: op, transform: `translateY(${y}px)`,
              background: `linear-gradient(145deg, ${PRIMARY}10, ${PRIMARY}05)`,
              border: `1px solid ${PRIMARY}30`,
              borderRadius: 12, padding: "28px 20px", textAlign: "center",
            }}>
              <p style={{ fontSize: 40 }}>{f.emoji}</p>
              <p style={{ fontFamily: orbitron, fontSize: 16, fontWeight: 700, color: PRIMARY, marginTop: 10 }}>
                {f.title}
              </p>
              <p style={{ fontFamily: inter, fontSize: 13, color: "#94a3b8", marginTop: 6, lineHeight: 1.4 }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Market Stats ─── */
const stats = [
  { label: "RAW 1000 INDEX", value: "$847,230", change: "+2.4%", color: PRIMARY },
  { label: "GRADED 1000 INDEX", value: "$1,245,800", change: "+3.1%", color: AMBER },
  { label: "SEALED 1000 INDEX", value: "$623,450", change: "+1.8%", color: BLUE },
];

const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = Math.sin(frame * 0.04) * 3;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, #0a1628 100%)` }}>
      <p style={{
        fontFamily: orbitron, fontSize: 34, fontWeight: 900, color: "#fff",
        position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)",
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        LIVE MARKET DATA
      </p>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, calc(-50% + ${drift}px))`,
        display: "flex", gap: 40, alignItems: "center",
      }}>
        {stats.map((s, i) => {
          const delay = 10 + i * 12;
          const sc = spring({ frame: frame - delay, fps, config: { damping: 16 } });
          const scale = interpolate(sc, [0, 1], [0.8, 1]);
          const op = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              opacity: op, transform: `scale(${scale})`,
              border: `2px solid ${s.color}40`,
              borderRadius: 16, padding: "36px 32px", textAlign: "center",
              background: `${s.color}08`, minWidth: 260,
            }}>
              <p style={{ fontFamily: orbitron, fontSize: 13, color: s.color, letterSpacing: 2 }}>{s.label}</p>
              <p style={{ fontFamily: orbitron, fontSize: 42, fontWeight: 900, color: "#fff", marginTop: 10 }}>{s.value}</p>
              <p style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: s.color, marginTop: 6 }}>{s.change}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: Franchise Vision ─── */
const tiers = [
  { num: "1", name: "PokéGarageVA™", sub: "Home-Based Franchise" },
  { num: "2", name: "Poke-Pulse-Engine™", sub: "Consumer Terminal" },
  { num: "3", name: "Personal Pulse Engine™", sub: "Institutional Data" },
  { num: "4", name: "PGTV Media Hub™", sub: "Media Production" },
  { num: "5", name: "Pulse Philanthropic™", sub: "National Museum" },
];

const SceneFranchise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(145deg, ${BG_MID} 0%, ${BG_DARK} 100%)` }}>
      <p style={{
        fontFamily: orbitron, fontSize: 32, fontWeight: 900, color: "#fff",
        position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)",
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        5-TIER FRANCHISE
      </p>
      <div style={{
        position: "absolute", top: 140, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", gap: 16, width: "75%",
      }}>
        {tiers.map((t, i) => {
          const delay = 8 + i * 10;
          const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
          const x = interpolate(s, [0, 1], [-300, 0]);
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              opacity: op, transform: `translateX(${x}px)`,
              display: "flex", alignItems: "center", gap: 20,
              background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20`,
              borderRadius: 12, padding: "20px 24px",
            }}>
              <div style={{
                fontFamily: orbitron, fontSize: 28, fontWeight: 900, color: PRIMARY,
                width: 50, textAlign: "center",
              }}>
                {t.num}
              </div>
              <div>
                <p style={{ fontFamily: orbitron, fontSize: 18, fontWeight: 700, color: "#fff" }}>{t.name}</p>
                <p style={{ fontFamily: inter, fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{t.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: CTA Close ─── */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const drift = Math.sin(frame * 0.06) * 5;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, #081018 100%)` }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, calc(-50% + ${drift}px)) scale(${scale})`,
        textAlign: "center", width: "80%",
      }}>
        <p style={{ fontFamily: orbitron, fontSize: 52, fontWeight: 900, color: PRIMARY, lineHeight: 1.15 }}>
          THE FUTURE OF
        </p>
        <p style={{ fontFamily: orbitron, fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.15, marginTop: 8 }}>
          CARD INVESTING
        </p>
        <div style={{
          marginTop: 30, fontFamily: inter, fontSize: 18, color: "#94a3b8",
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          poke-pulse-ticker.lovable.app
        </div>
        <div style={{
          marginTop: 20, fontFamily: inter, fontSize: 11, color: "#475569",
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          © 2026 PGVA Ventures, LLC · All Rights Reserved · 18 U.S.C. § 1832
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const PlatformUpdatePromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}><SceneHook /></Sequence>
      <Sequence from={90} durationInFrames={120}><SceneFeatures /></Sequence>
      <Sequence from={210} durationInFrames={120}><SceneStats /></Sequence>
      <Sequence from={330} durationInFrames={120}><SceneFranchise /></Sequence>
      <Sequence from={450} durationInFrames={90}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};

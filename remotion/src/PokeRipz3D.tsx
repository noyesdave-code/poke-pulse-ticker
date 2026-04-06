import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";

/* ─── helpers ─── */
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const KenBurns: React.FC<{
  src: string;
  startScale?: number;
  endScale?: number;
  panX?: number;
  panY?: number;
}> = ({ src, startScale = 1, endScale = 1.15, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = clamp(frame / durationInFrames, 0, 1);
  const scale = startScale + (endScale - startScale) * p;
  const tx = panX * p;
  const ty = panY * p;
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}px,${ty}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ─── 3D Card Flip Component ─── */
const Card3D: React.FC<{
  delay?: number;
  x?: number;
  y?: number;
  label: string;
  value: string;
  rarity: string;
  color: string;
}> = ({ delay = 0, x = 0, y = 0, label, value, rarity, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const rotY = interpolate(s, [0, 1], [180, 0]);
  const scale = interpolate(s, [0, 1], [0.3, 1]);
  const opacity = interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  // holographic shimmer
  const shimmer = Math.sin(frame * 0.15) * 20;
  return (
    <div
      style={{
        position: "absolute",
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        transform: `translate(-50%,-50%) scale(${scale}) perspective(800px) rotateY(${rotY}deg)`,
        opacity,
        width: 220,
        height: 310,
        borderRadius: 16,
        background: `linear-gradient(${135 + shimmer}deg, ${color}, #1a1a2e, ${color})`,
        border: `3px solid ${color}`,
        boxShadow: `0 0 30px ${color}80, 0 0 60px ${color}40`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>{rarity}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", textAlign: "center", padding: "0 10px" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, marginTop: 8 }}>{value}</div>
    </div>
  );
};

/* ─── Particle System ─── */
const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 40, color = "#ffd700" }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: 2 + (i % 4),
        speed: 0.3 + (i % 5) * 0.15,
        phase: (i * 41) % 360,
      });
    }
    return arr;
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const y = (p.y + frame * p.speed) % 110 - 5;
        const x = p.x + Math.sin((frame * 0.03 + p.phase) * 0.1) * 5;
        const opacity = 0.3 + Math.sin(frame * 0.05 + p.phase) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── Text Overlay ─── */
const TextOverlay: React.FC<{
  text: string;
  sub?: string;
  delay?: number;
  size?: number;
  y?: string;
}> = ({ text, sub, delay = 0, size = 64, y = "80%" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateY = interpolate(s, [0, 1], [40, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translate(-50%,-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: size, fontWeight: 900, color: "#fff", textShadow: "0 0 40px #7c3aed, 0 4px 20px rgba(0,0,0,0.8)" }}>
        {text}
      </div>
      {sub && (
        <div style={{ fontSize: size * 0.35, color: "#d4af37", marginTop: 8, fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
          {sub}
        </div>
      )}
    </div>
  );
};

/* ─── Data HUD ─── */
const DataHUD: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 25 } });
  const stats = [
    { label: "Pull Rate", value: "1:396", color: "#22d3ee" },
    { label: "Print Run", value: "~12,400", color: "#a78bfa" },
    { label: "Market Value", value: "$347.00", color: "#34d399" },
    { label: "24h Change", value: "+18.2%", color: "#fbbf24" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 40,
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
      }}
    >
      {stats.map((st, i) => {
        const stagger = spring({ frame: frame - delay - i * 5, fps, config: { damping: 20 } });
        return (
          <div
            key={st.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 30,
              padding: "8px 20px",
              marginBottom: 6,
              background: "rgba(0,0,0,0.7)",
              borderRadius: 8,
              border: `1px solid ${st.color}40`,
              opacity: interpolate(stagger, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(stagger, [0, 1], [30, 0])}px)`,
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#888", fontSize: 16 }}>{st.label}</span>
            <span style={{ color: st.color, fontSize: 18, fontWeight: 700 }}>{st.value}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Price Ticker ─── */
const PriceTicker: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 25 } });
  const items = [
    "Charizard ex SAR $312 ▲",
    "Pikachu VMAX $189 ▲",
    "Umbreon Alt Art $420 ▼",
    "Moonbreon $580 ▲",
    "Gold Mew ex $95 ▲",
    "Lugia V Alt $275 ▲",
  ];
  const scrollX = frame * 2;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        background: "linear-gradient(90deg, rgba(0,0,0,0.9), rgba(20,0,40,0.9))",
        borderTop: "2px solid #7c3aed",
        overflow: "hidden",
        opacity: interpolate(s, [0, 1], [0, 1]),
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", transform: `translateX(-${scrollX}px)`, fontFamily: "monospace", fontSize: 18 }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ color: t.includes("▲") ? "#34d399" : "#f87171", fontWeight: 600 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Betting Overlay ─── */
const BettingOverlay: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        bottom: 70,
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        background: "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(30,0,60,0.9))",
        padding: "16px 28px",
        borderRadius: 16,
        border: "1px solid #a78bfa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>💰 LIVE BETTING</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>Next Pull: Ultra Rare?</div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ background: "#22c55e30", border: "1px solid #22c55e", borderRadius: 8, padding: "6px 18px", color: "#22c55e", fontSize: 16, fontWeight: 700 }}>
          YES — 3.2x
        </div>
        <div style={{ background: "#ef444430", border: "1px solid #ef4444", borderRadius: 8, padding: "6px 18px", color: "#ef4444", fontSize: 16, fontWeight: 700 }}>
          NO — 1.4x
        </div>
      </div>
    </div>
  );
};

/* ─── Coin Balance ─── */
const CoinBalance: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  const coins = Math.round(interpolate(clamp(frame - delay, 0, 60), [0, 60], [5000, 4200]));
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        opacity: interpolate(s, [0, 1], [0, 1]),
        background: "rgba(0,0,0,0.75)",
        padding: "10px 24px",
        borderRadius: 12,
        border: "1px solid #fbbf24",
        fontFamily: "monospace",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 28 }}>🪙</span>
      <span style={{ color: "#fbbf24", fontSize: 24, fontWeight: 800 }}>{coins.toLocaleString()}</span>
      <span style={{ color: "#888", fontSize: 14 }}>COINS</span>
    </div>
  );
};

/* ═══════════ SCENES ═══════════ */

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-dealer-setup.jpg")} startScale={1.1} endScale={1.25} panX={-30} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,0,20,0.3) 0%, rgba(10,0,20,0.85) 100%)" }} />
      <Particles color="#a78bfa" count={30} />
      <TextOverlay text="POKÉ RIPZ™" sub="DIGITAL PACK RIPPING — LIVE NOW" delay={15} size={80} y="45%" />
      <TextOverlay text="Prismatic Evolutions ETB" sub="8 Packs • $89.99 Buy-In • 800 Coins" delay={45} size={36} y="70%" />
      <PriceTicker delay={30} />
    </AbsoluteFill>
  );
};

const SceneETBOpen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-etb-unbox.jpg")} startScale={1} endScale={1.2} panY={-20} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.8) 100%)" }} />
      <Particles color="#ffd700" count={50} />
      <CoinBalance delay={10} />
      <TextOverlay text="CRACKING THE ETB" sub="8 Booster Packs Inside — Let's Go!" delay={20} size={48} y="78%" />
      <DataHUD delay={15} />
    </AbsoluteFill>
  );
};

const ScenePackRip: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-pack-open.jpg")} startScale={1.05} endScale={1.2} panX={20} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,0,20,0.85) 100%)" }} />
      <Particles color="#22d3ee" count={35} />
      <CoinBalance delay={5} />
      <TextOverlay text="PACK 1 — TEARING THE FOIL" sub="10 Cards Per Pack • Reverse Holo Guaranteed" delay={15} size={42} y="18%" />
      <BettingOverlay delay={30} />
      <PriceTicker delay={10} />
    </AbsoluteFill>
  );
};

const SceneCardReveal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0030 0%, #0a0014 100%)" }}>
      <Particles color="#ffd700" count={60} />
      {/* 3D flipping cards */}
      <Card3D delay={10} x={-30} y={-8} label="Eevee" value="$2.50" rarity="Common" color="#94a3b8" />
      <Card3D delay={20} x={-15} y={-8} label="Vaporeon" value="$4.80" rarity="Uncommon" color="#38bdf8" />
      <Card3D delay={30} x={0} y={-8} label="Sylveon ex" value="$28.00" rarity="Ultra Rare" color="#f472b6" />
      <Card3D delay={40} x={15} y={-8} label="Umbreon" value="$89.50" rarity="Art Rare" color="#a78bfa" />
      <Card3D delay={50} x={30} y={-8} label="Charizard ex" value="$312.00" rarity="★ SAR ★" color="#fbbf24" />
      <TextOverlay text="THE REVEALS" sub="Every flip could change the game" delay={5} size={42} y="88%" />
      <CoinBalance delay={5} />
      <DataHUD delay={25} />
    </AbsoluteFill>
  );
};

const SceneBigPull: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const glow = spring({ frame: frame - 20, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-big-pull.jpg")} startScale={1} endScale={1.3} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(251,191,36,${0.15 * glow}) 0%, transparent 70%)` }} />
      <Particles color="#ffd700" count={80} />
      {/* Giant holographic badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "20%",
          transform: `translate(-50%,-50%) scale(${pulse * interpolate(glow, [0, 1], [0.5, 1])})`,
          opacity: interpolate(glow, [0, 1], [0, 1]),
          fontSize: 100,
          textShadow: "0 0 60px #ffd700, 0 0 120px #ffd700",
        }}
      >
        ⭐
      </div>
      <TextOverlay text="CHARIZARD EX SAR!" sub="$312.00 — 1:396 PULL RATE" delay={10} size={56} y="50%" />
      <CoinBalance delay={0} />
      <BettingOverlay delay={15} />
      <PriceTicker delay={5} />
    </AbsoluteFill>
  );
};

const SceneCustomerReact: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-customer-react.jpg")} startScale={1} endScale={1.15} panX={10} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.85) 100%)" }} />
      <Particles color="#a78bfa" count={45} />
      <TextOverlay text="THAT REACTION!" sub="Winners get paid in PokéCoins — Redeem across all games!" delay={15} size={48} y="80%" />
    </AbsoluteFill>
  );
};

const SceneBoosterBox: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-booster-box.jpg")} startScale={1.05} endScale={1.2} panX={-15} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.85) 100%)" }} />
      <Particles color="#34d399" count={40} />
      <TextOverlay text="BOOSTER BOX — 36 PACKS" sub="2,400 Coins • Expected Value: $180-$650" delay={15} size={44} y="78%" />
      <DataHUD delay={20} />
      <CoinBalance delay={5} />
      <PriceTicker delay={10} />
    </AbsoluteFill>
  );
};

const SceneDataTerminal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-live-data.jpg")} startScale={1} endScale={1.1} />
      <AbsoluteFill style={{ background: "rgba(10,0,20,0.4)" }} />
      <Particles color="#22d3ee" count={25} />
      <TextOverlay text="LIVE MARKET INTELLIGENCE" sub="Real-time pull rates • Print runs • Price history" delay={10} size={44} y="15%" />
      <BettingOverlay delay={30} />
      <PriceTicker delay={5} />
    </AbsoluteFill>
  );
};

const SceneSleeveUp: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-sleeve-card.jpg")} startScale={1} endScale={1.2} panY={-15} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
      <Particles color="#ffd700" count={35} />
      <TextOverlay text="SLEEVED & SECURED" sub="Added to your Digital Portfolio — Track value 24/7" delay={15} size={44} y="80%" />
      <CoinBalance delay={5} />
    </AbsoluteFill>
  );
};

const SceneCardGrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/scene-card-grid.jpg")} startScale={1} endScale={1.15} panX={10} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,0,20,0.85) 100%)" }} />
      <Particles color="#a78bfa" count={40} />
      <TextOverlay text="YOUR COLLECTION GROWS" sub="Every rip builds your portfolio" delay={15} size={44} y="15%" />
      <DataHUD delay={20} />
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0030 0%, #0a0014 100%)" }}>
      <Particles color="#ffd700" count={60} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          transform: `translate(-50%,-50%) scale(${pulse})`,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", textShadow: "0 0 40px #7c3aed" }}>
          POKÉ RIPZ™
        </div>
        <div style={{ fontSize: 28, color: "#fbbf24", fontWeight: 700, marginTop: 16 }}>
          BUY IN • BET • RIP • WIN
        </div>
      </div>
      <TextOverlay text="5,000 Free Coins on Sign-Up" sub="pulsemarketcap.com/ripz" delay={30} size={32} y="65%" />
      {/* Legal footer */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 10,
          color: "#555",
        }}
      >
        © 2026 PGVA Ventures LLC. All rights reserved. Not affiliated with Nintendo, The Pokémon Company, or Game Freak.
        Digital entertainment only — no real currency wagering. Patent Pending.
      </div>
      <PriceTicker delay={10} />
    </AbsoluteFill>
  );
};

/* ═══════════ MAIN COMPOSITION ═══════════ */
export const PokeRipz3D: React.FC = () => {
  // 11 scenes × ~270 frames each ≈ ~3 minutes at 30fps (5400 frames)
  const sceneDur = 270; // 9 seconds each
  const scenes = [
    SceneIntro,
    SceneETBOpen,
    ScenePackRip,
    SceneCardReveal,
    SceneBigPull,
    SceneCustomerReact,
    SceneBoosterBox,
    SceneDataTerminal,
    SceneSleeveUp,
    SceneCardGrid,
    SceneCTA,
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      {scenes.map((SceneComp, i) => (
        <Sequence key={i} from={i * sceneDur} durationInFrames={sceneDur}>
          <SceneComp />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

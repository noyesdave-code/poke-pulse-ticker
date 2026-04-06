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
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${panX * p}px,${panY * p}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 40, color = "#ffd700" }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({ x: (i * 37 + 13) % 100, y: (i * 53 + 7) % 100, size: 2 + (i % 4), speed: 0.3 + (i % 5) * 0.15, phase: (i * 41) % 360 });
    }
    return arr;
  }, [count]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x + Math.sin((frame * 0.03 + p.phase) * 0.1) * 5}%`,
            top: `${(p.y + frame * p.speed) % 110 - 5}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: 0.3 + Math.sin(frame * 0.05 + p.phase) * 0.3,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const DataBadge: React.FC<{
  label: string;
  value: string;
  color: string;
  x: string;
  y: string;
  delay?: number;
}> = ({ label, value, color, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
        opacity: interpolate(s, [0, 1], [0, 1]),
        background: "rgba(0,0,0,0.8)",
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: "8px 20px",
        fontFamily: "monospace",
        textAlign: "center",
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <div style={{ color: "#999", fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div style={{ color, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
};

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
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translate(-50%,-50%) translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        opacity: interpolate(s, [0, 1], [0, 1]),
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: size, fontWeight: 900, color: "#fff", textShadow: "0 0 40px #7c3aed, 0 4px 20px rgba(0,0,0,0.8)" }}>{text}</div>
      {sub && <div style={{ fontSize: size * 0.35, color: "#d4af37", marginTop: 8, fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{sub}</div>}
    </div>
  );
};

const PriceTicker: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    "Charizard ex SAR $312 ▲", "Pikachu VMAX $189 ▲", "Umbreon Alt Art $420 ▲",
    "Moonbreon $580 ▲", "Gold Mew ex $95 ▲", "Lugia V Alt $275 ▲",
    "Sylveon ex SAR $148 ▲", "Eevee Heroes $65 ▼",
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "linear-gradient(90deg, rgba(0,0,0,0.9), rgba(20,0,40,0.9))", borderTop: "2px solid #7c3aed", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", transform: `translateX(-${frame * 2}px)`, fontFamily: "monospace", fontSize: 18 }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ color: t.includes("▲") ? "#34d399" : "#f87171", fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

const BettingOverlay: React.FC<{ question: string; yesOdds: string; noOdds: string; delay?: number }> = ({ question, yesOdds, noOdds, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div style={{
      position: "absolute", left: 40, bottom: 70,
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
      background: "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(30,0,60,0.9))",
      padding: "16px 28px", borderRadius: 16, border: "1px solid #a78bfa", fontFamily: "sans-serif",
    }}>
      <div style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>💰 LIVE BETTING</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>{question}</div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ background: "#22c55e30", border: "1px solid #22c55e", borderRadius: 8, padding: "6px 18px", color: "#22c55e", fontSize: 16, fontWeight: 700 }}>YES — {yesOdds}</div>
        <div style={{ background: "#ef444430", border: "1px solid #ef4444", borderRadius: 8, padding: "6px 18px", color: "#ef4444", fontSize: 16, fontWeight: 700 }}>NO — {noOdds}</div>
      </div>
    </div>
  );
};

const CoinBalance: React.FC<{ coins: number; delay?: number }> = ({ coins, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div style={{
      position: "absolute", left: 40, top: 40,
      opacity: interpolate(s, [0, 1], [0, 1]),
      background: "rgba(0,0,0,0.75)", padding: "10px 24px", borderRadius: 12, border: "1px solid #fbbf24",
      fontFamily: "monospace", display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 28 }}>🪙</span>
      <span style={{ color: "#fbbf24", fontSize: 24, fontWeight: 800 }}>{coins.toLocaleString()}</span>
      <span style={{ color: "#888", fontSize: 14 }}>COINS</span>
    </div>
  );
};

/* ═══════ SCENES ═══════ */

const S1_Intro: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-dealer-setup.jpg")} startScale={1.1} endScale={1.25} panX={-30} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,0,20,0.3) 0%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#a78bfa" count={30} />
    <TextOverlay text="POKÉ RIPZ™" sub="DIGITAL PACK RIPPING — LIVE NOW" delay={10} size={80} y="42%" />
    <TextOverlay text="Prismatic Evolutions ETB" sub="8 Packs • 800 Coins Buy-In" delay={35} size={36} y="68%" />
    <PriceTicker />
  </AbsoluteFill>
);

const S2_ETBOpen: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-etb-unbox.jpg")} startScale={1} endScale={1.2} panY={-20} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#ffd700" count={50} />
    <CoinBalance coins={5000} delay={5} />
    <TextOverlay text="CRACKING THE ETB" sub="8 Booster Packs Inside" delay={15} size={48} y="80%" />
    <DataBadge label="Set" value="Prismatic Evolutions" color="#a78bfa" x="72%" y="12%" delay={20} />
    <DataBadge label="Print Run" value="~2.8M Boxes" color="#22d3ee" x="72%" y="28%" delay={28} />
    <PriceTicker />
  </AbsoluteFill>
);

const S3_PackRip: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-pack-open.jpg")} startScale={1.05} endScale={1.2} panX={20} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#22d3ee" count={35} />
    <CoinBalance coins={4900} delay={5} />
    <TextOverlay text="PACK 1 — TEARING FOIL" sub="10 Cards • Reverse Holo Guaranteed" delay={10} size={42} y="16%" />
    <BettingOverlay question="Ultra Rare in Pack 1?" yesOdds="4.2x" noOdds="1.2x" delay={25} />
    <PriceTicker />
  </AbsoluteFill>
);

const S4_CommonFan: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-fan-through.jpg")} startScale={1} endScale={1.15} panX={-10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#94a3b8" count={20} />
    <CoinBalance coins={4900} delay={5} />
    <TextOverlay text="FANNING THROUGH..." sub="Commons & Uncommons — building the set" delay={10} size={40} y="82%" />
    <DataBadge label="Card 1" value="Bulbasaur $0.25" color="#34d399" x="68%" y="10%" delay={15} />
    <DataBadge label="Card 2" value="Squirtle $0.30" color="#38bdf8" x="68%" y="26%" delay={22} />
    <DataBadge label="Card 3" value="Vulpix $0.35" color="#f97316" x="68%" y="42%" delay={29} />
    <PriceTicker />
  </AbsoluteFill>
);

const S5_Pikachu: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-pikachu.jpg")} startScale={1} endScale={1.25} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.1) 0%, rgba(10,0,20,0.6) 100%)" }} />
    <Particles color="#fbbf24" count={50} />
    <CoinBalance coins={4900} delay={5} />
    <TextOverlay text="PIKACHU VMAX!" sub="Rainbow Rare — $189.00" delay={10} size={52} y="82%" />
    <DataBadge label="Pull Rate" value="1:72" color="#fbbf24" x="72%" y="10%" delay={18} />
    <DataBadge label="Print Run" value="~38,900" color="#22d3ee" x="72%" y="26%" delay={24} />
    <DataBadge label="24h Change" value="+12.4%" color="#34d399" x="72%" y="42%" delay={30} />
    <PriceTicker />
  </AbsoluteFill>
);

const S6_BoosterBox: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-booster-box.jpg")} startScale={1.05} endScale={1.2} panX={-15} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#34d399" count={40} />
    <CoinBalance coins={4700} delay={5} />
    <TextOverlay text="BOOSTER BOX — 36 PACKS" sub="2,400 Coins • Expected Value: $180–$650" delay={10} size={44} y="80%" />
    <BettingOverlay question="Hit total value over $400?" yesOdds="2.8x" noOdds="1.5x" delay={25} />
    <PriceTicker />
  </AbsoluteFill>
);

const S7_Umbreon: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-umbreon.jpg")} startScale={1} endScale={1.3} panY={-10} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.15) 0%, rgba(10,0,20,0.6) 100%)" }} />
    <Particles color="#a78bfa" count={60} />
    <CoinBalance coins={4500} delay={5} />
    <TextOverlay text="UMBREON V ALT ART!" sub="The Moonbreon — $420.00" delay={8} size={52} y="82%" />
    <DataBadge label="Pull Rate" value="1:288" color="#a78bfa" x="72%" y="10%" delay={15} />
    <DataBadge label="In Existence" value="~9,700" color="#22d3ee" x="72%" y="26%" delay={22} />
    <DataBadge label="All-Time High" value="$580" color="#fbbf24" x="72%" y="42%" delay={28} />
    <PriceTicker />
  </AbsoluteFill>
);

const S8_Sylveon: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-sylveon.jpg")} startScale={1} endScale={1.2} panX={10} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(244,114,182,0.1) 0%, rgba(10,0,20,0.5) 100%)" }} />
    <Particles color="#f472b6" count={45} />
    <CoinBalance coins={4300} delay={5} />
    <TextOverlay text="SYLVEON EX SAR" sub="Special Art Rare — $148.00" delay={10} size={48} y="82%" />
    <DataBadge label="Pull Rate" value="1:180" color="#f472b6" x="72%" y="10%" delay={18} />
    <DataBadge label="Print Run" value="~15,600" color="#22d3ee" x="72%" y="26%" delay={24} />
    <DataBadge label="30d Trend" value="+22.8%" color="#34d399" x="72%" y="42%" delay={30} />
    <PriceTicker />
  </AbsoluteFill>
);

const S9_Mew: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-mew.jpg")} startScale={1} endScale={1.25} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, rgba(10,0,20,0.5) 100%)" }} />
    <Particles color="#ffd700" count={55} />
    <CoinBalance coins={4100} delay={5} />
    <TextOverlay text="GOLD MEW EX!" sub="Gold Rare — $95.00" delay={10} size={52} y="82%" />
    <DataBadge label="Pull Rate" value="1:432" color="#ffd700" x="72%" y="10%" delay={18} />
    <DataBadge label="Scarcity" value="Ultra Rare" color="#ef4444" x="72%" y="26%" delay={24} />
    <DataBadge label="PSA 10 Value" value="$340" color="#a78bfa" x="72%" y="42%" delay={30} />
    <PriceTicker />
  </AbsoluteFill>
);

const S10_Lugia: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/card-lugia.jpg")} startScale={1} endScale={1.3} panY={-15} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.15) 0%, rgba(10,0,20,0.5) 100%)" }} />
    <Particles color="#38bdf8" count={50} />
    <CoinBalance coins={3800} delay={5} />
    <TextOverlay text="LUGIA V ALT ART!" sub="Alternate Art — $275.00" delay={8} size={52} y="82%" />
    <DataBadge label="Pull Rate" value="1:240" color="#38bdf8" x="72%" y="10%" delay={15} />
    <DataBadge label="Market Cap" value="$2.67M" color="#fbbf24" x="72%" y="26%" delay={22} />
    <DataBadge label="Volume (24h)" value="142 sales" color="#34d399" x="72%" y="42%" delay={28} />
    <PriceTicker />
  </AbsoluteFill>
);

const S11_Charizard: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.1) * 0.03;
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile("images/card-charizard.jpg")} startScale={1} endScale={1.35} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.2) 0%, rgba(10,0,20,0.5) 100%)" }} />
      <Particles color="#ffd700" count={80} />
      <div style={{ position: "absolute", left: "50%", top: "12%", transform: `translate(-50%,-50%) scale(${pulse})`, fontSize: 80, textShadow: "0 0 60px #ffd700" }}>⭐</div>
      <CoinBalance coins={3500} delay={5} />
      <TextOverlay text="CHARIZARD EX SAR!" sub="★ Special Art Rare — $312.00 ★" delay={8} size={56} y="82%" />
      <DataBadge label="Pull Rate" value="1:396" color="#ffd700" x="72%" y="10%" delay={15} />
      <DataBadge label="In Existence" value="~7,100" color="#ef4444" x="72%" y="26%" delay={22} />
      <DataBadge label="PSA 10" value="$890" color="#a78bfa" x="72%" y="42%" delay={28} />
      <PriceTicker />
    </AbsoluteFill>
  );
};

const S12_Reaction: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-customer-react.jpg")} startScale={1} endScale={1.15} panX={10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#fbbf24" count={45} />
    <TextOverlay text="THAT PULL!" sub="Total session value: $1,489 from 800 coin buy-in!" delay={10} size={48} y="80%" />
    <DataBadge label="ROI" value="+1,761%" color="#22c55e" x="72%" y="15%" delay={20} />
    <PriceTicker />
  </AbsoluteFill>
);

const S13_DataTerminal: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-live-data.jpg")} startScale={1} endScale={1.1} />
    <AbsoluteFill style={{ background: "rgba(10,0,20,0.4)" }} />
    <Particles color="#22d3ee" count={25} />
    <TextOverlay text="LIVE MARKET DATA" sub="Real-time pull rates • Print runs • Price history" delay={8} size={44} y="15%" />
    <BettingOverlay question="Will next ETB hit a chase card?" yesOdds="5.1x" noOdds="1.1x" delay={20} />
    <PriceTicker />
  </AbsoluteFill>
);

const S14_Sleeve: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-sleeve-card.jpg")} startScale={1} endScale={1.2} panY={-15} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#ffd700" count={35} />
    <CoinBalance coins={3500} delay={5} />
    <TextOverlay text="SLEEVED & SECURED" sub="Added to Digital Portfolio — Track value 24/7" delay={12} size={44} y="82%" />
    <PriceTicker />
  </AbsoluteFill>
);

const S15_Grid: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/scene-card-grid.jpg")} startScale={1} endScale={1.15} panX={10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#a78bfa" count={40} />
    <TextOverlay text="YOUR COLLECTION GROWS" sub="Every rip builds your portfolio" delay={10} size={44} y="15%" />
    <DataBadge label="Cards Pulled" value="80" color="#22d3ee" x="72%" y="60%" delay={18} />
    <DataBadge label="Portfolio Value" value="$1,489" color="#34d399" x="72%" y="76%" delay={24} />
    <PriceTicker />
  </AbsoluteFill>
);

const S16_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0030 0%, #0a0014 100%)" }}>
      <Particles color="#ffd700" count={60} />
      <div style={{ position: "absolute", left: "50%", top: "35%", transform: `translate(-50%,-50%) scale(${pulse})`, textAlign: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", textShadow: "0 0 40px #7c3aed" }}>POKÉ RIPZ™</div>
        <div style={{ fontSize: 28, color: "#fbbf24", fontWeight: 700, marginTop: 16 }}>BUY IN • BET • RIP • WIN</div>
      </div>
      <TextOverlay text="5,000 Free Coins on Sign-Up" sub="pulsemarketcap.com/ripz" delay={20} size={32} y="62%" />
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "#555" }}>
        © 2026 PGVA Ventures LLC. All rights reserved. Digital entertainment only. Patent Pending.
      </div>
      <PriceTicker />
    </AbsoluteFill>
  );
};

export const PokeRipz3D: React.FC = () => {
  const sceneDur = 90; // 3 seconds each × 16 scenes = 48s total (we'll extend with ffmpeg)
  const scenes = [S1_Intro, S2_ETBOpen, S3_PackRip, S4_CommonFan, S5_Pikachu, S6_BoosterBox, S7_Umbreon, S8_Sylveon, S9_Mew, S10_Lugia, S11_Charizard, S12_Reaction, S13_DataTerminal, S14_Sleeve, S15_Grid, S16_CTA];
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      {scenes.map((C, i) => (
        <Sequence key={i} from={i * sceneDur} durationInFrames={sceneDur}><C /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

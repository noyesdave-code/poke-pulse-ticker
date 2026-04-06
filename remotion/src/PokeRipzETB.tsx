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
  return (
    <AbsoluteFill>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translate(${panX * p}px,${panY * p}px)` }} />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 30, color = "#ffd700" }) => {
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
        <div key={i} style={{
          position: "absolute",
          left: `${p.x + Math.sin((frame * 0.03 + p.phase) * 0.1) * 5}%`,
          top: `${(p.y + frame * p.speed) % 110 - 5}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: color, opacity: 0.3 + Math.sin(frame * 0.05 + p.phase) * 0.3,
          boxShadow: `0 0 ${p.size * 3}px ${color}`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ label: string; value: string; color: string; x: string; y: string; delay?: number }> = ({ label, value, color, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
      opacity: interpolate(s, [0, 1], [0, 1]),
      background: "rgba(0,0,0,0.85)", border: `2px solid ${color}`, borderRadius: 12,
      padding: "8px 20px", fontFamily: "monospace", textAlign: "center",
      boxShadow: `0 0 20px ${color}40`,
    }}>
      <div style={{ color: "#999", fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div style={{ color, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
};

const TextOverlay: React.FC<{ text: string; sub?: string; delay?: number; size?: number; y?: string }> = ({ text, sub, delay = 0, size = 48, y = "82%" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <div style={{
      position: "absolute", left: "50%", top: y,
      transform: `translate(-50%,-50%) translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      opacity: interpolate(s, [0, 1], [0, 1]),
      textAlign: "center", fontFamily: "sans-serif",
    }}>
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
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, background: "linear-gradient(90deg, rgba(0,0,0,0.9), rgba(20,0,40,0.9))", borderTop: "2px solid #7c3aed", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", transform: `translateX(-${frame * 2}px)`, fontFamily: "monospace", fontSize: 16 }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ color: t.includes("▲") ? "#34d399" : "#f87171", fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

const PackCounter: React.FC<{ current: number; total: number; delay?: number }> = ({ current, total, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div style={{
      position: "absolute", right: 40, top: 40,
      opacity: interpolate(s, [0, 1], [0, 1]),
      background: "rgba(0,0,0,0.8)", padding: "10px 24px", borderRadius: 12,
      border: "1px solid #7c3aed", fontFamily: "monospace",
    }}>
      <div style={{ color: "#999", fontSize: 12 }}>PACK</div>
      <div style={{ color: "#a78bfa", fontSize: 28, fontWeight: 900 }}>{current}/{total}</div>
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
      background: "rgba(0,0,0,0.75)", padding: "10px 24px", borderRadius: 12,
      border: "1px solid #fbbf24", fontFamily: "monospace",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 24 }}>🪙</span>
      <span style={{ color: "#fbbf24", fontSize: 22, fontWeight: 800 }}>{coins.toLocaleString()}</span>
      <span style={{ color: "#888", fontSize: 12 }}>COINS</span>
    </div>
  );
};

const BetOverlay: React.FC<{ question: string; yes: string; no: string; delay?: number }> = ({ question, yes, no, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div style={{
      position: "absolute", left: 40, bottom: 60,
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
      background: "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(30,0,60,0.9))",
      padding: "14px 24px", borderRadius: 14, border: "1px solid #a78bfa", fontFamily: "sans-serif",
    }}>
      <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>💰 BET NOW</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{question}</div>
      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <div style={{ background: "#22c55e30", border: "1px solid #22c55e", borderRadius: 8, padding: "4px 14px", color: "#22c55e", fontSize: 14, fontWeight: 700 }}>YES — {yes}</div>
        <div style={{ background: "#ef444430", border: "1px solid #ef4444", borderRadius: 8, padding: "4px 14px", color: "#ef4444", fontSize: 14, fontWeight: 700 }}>NO — {no}</div>
      </div>
    </div>
  );
};

const PACK_RESULTS = [
  { packNum: 1, commons: ["Bulbasaur $0.15", "Squirtle $0.20", "Rattata $0.10", "Pidgey $0.10", "Caterpie $0.08"],
    uncommons: ["Ivysaur $0.35", "Wartortle $0.40", "Pidgeotto $0.25"],
    revHolo: { name: "Jolteon", value: "$1.50", pullRate: "1:6" },
    rare: { name: "Arcanine Holo", value: "$2.80", rarity: "Holo Rare", pullRate: "1:4", color: "#60a5fa", img: "rare-reveal-normal.jpg" },
  },
  { packNum: 2, commons: ["Charmander $0.25", "Geodude $0.10", "Machop $0.12", "Gastly $0.15", "Eevee $0.45"],
    uncommons: ["Charmeleon $0.50", "Haunter $0.35", "Machoke $0.20"],
    revHolo: { name: "Flareon", value: "$2.10", pullRate: "1:6" },
    rare: { name: "Ninetales", value: "$1.50", rarity: "Rare", pullRate: "1:2", color: "#94a3b8", img: "rare-reveal-normal.jpg" },
  },
  { packNum: 3, commons: ["Magikarp $0.10", "Psyduck $0.15", "Oddish $0.08", "Bellsprout $0.10", "Poliwag $0.12"],
    uncommons: ["Golduck $0.30", "Gloom $0.20", "Poliwhirl $0.25"],
    revHolo: { name: "Vaporeon", value: "$2.80", pullRate: "1:6" },
    rare: { name: "Gyarados Holo", value: "$5.50", rarity: "Holo Rare", pullRate: "1:4", color: "#38bdf8", img: "reverse-holo-reveal.jpg" },
  },
  { packNum: 4, commons: ["Voltorb $0.10", "Magnemite $0.12", "Pichu $0.35", "Togepi $0.20", "Mareep $0.15"],
    uncommons: ["Electrode $0.25", "Magneton $0.30", "Flaaffy $0.20"],
    revHolo: { name: "Leafeon", value: "$2.40", pullRate: "1:6" },
    rare: { name: "Ampharos", value: "$1.80", rarity: "Rare", pullRate: "1:2", color: "#94a3b8", img: "rare-reveal-normal.jpg" },
  },
  { packNum: 5, commons: ["Dratini $0.30", "Larvitar $0.25", "Bagon $0.15", "Gible $0.20", "Deino $0.18"],
    uncommons: ["Dragonair $0.55", "Pupitar $0.35", "Shelgon $0.25"],
    revHolo: { name: "Sylveon", value: "$4.20", pullRate: "1:6" },
    rare: { name: "Umbreon ex", value: "$28.50", rarity: "Ultra Rare", pullRate: "1:8", color: "#a78bfa", img: "ultra-rare-hit.jpg" },
  },
  { packNum: 6, commons: ["Abra $0.12", "Drowzee $0.08", "Ralts $0.20", "Solosis $0.10", "Espurr $0.15"],
    uncommons: ["Kadabra $0.30", "Kirlia $0.35", "Duosion $0.20"],
    revHolo: { name: "Espeon", value: "$3.50", pullRate: "1:6" },
    rare: { name: "Alakazam", value: "$2.20", rarity: "Rare", pullRate: "1:2", color: "#94a3b8", img: "rare-reveal-normal.jpg" },
  },
  { packNum: 7, commons: ["Snorlax $0.35", "Munchlax $0.20", "Chansey $0.25", "Blissey $0.30", "Audino $0.12"],
    uncommons: ["Snorlax Holo $1.20", "Wigglytuff $0.25", "Clefable $0.30"],
    revHolo: { name: "Glaceon", value: "$2.60", pullRate: "1:6" },
    rare: { name: "Togekiss", value: "$1.90", rarity: "Rare", pullRate: "1:2", color: "#94a3b8", img: "rare-reveal-normal.jpg" },
  },
  { packNum: 8, commons: ["Pikachu $0.45", "Raichu $0.35", "Emolga $0.15", "Pachirisu $0.20", "Dedenne $0.18"],
    uncommons: ["Pikachu ex $2.50", "Raikou $1.80", "Zapdos $1.50"],
    revHolo: { name: "Umbreon", value: "$5.80", pullRate: "1:6" },
    rare: { name: "Charizard ex SAR", value: "$312.00", rarity: "Special Art Rare", pullRate: "1:50", color: "#ffd700", img: "sar-chase-hit.jpg" },
  },
];

const IntroScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/etb-8-packs.jpg")} startScale={1} endScale={1.15} panY={-10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,0,20,0.2) 0%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#a78bfa" count={25} />
    <TextOverlay text="PRISMATIC EVOLUTIONS ETB" sub="8 Packs — 800 Coin Buy-In — Let's Rip!" delay={10} size={52} y="15%" />
    <CoinBalance coins={5000} delay={5} />
    <BetOverlay question="Will this ETB hit a chase card?" yes="6.2x" no="1.1x" delay={25} />
    <Badge label="Product" value="ETB — 8 Packs" color="#a78bfa" x="72%" y="55%" delay={15} />
    <Badge label="Est. Value" value="$40–$400+" color="#22d3ee" x="72%" y="71%" delay={22} />
    <PriceTicker />
  </AbsoluteFill>
);

const PackTearScene: React.FC<{ packNum: number }> = ({ packNum }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/pack-tear-open.jpg")} startScale={1.05} endScale={1.2} panX={packNum % 2 === 0 ? 15 : -15} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#22d3ee" count={20} />
    <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text={`PACK ${packNum} — TEARING FOIL`} sub="10 Cards Inside" delay={5} size={40} y="82%" />
    <PriceTicker />
  </AbsoluteFill>
);

const PullOutScene: React.FC<{ packNum: number }> = ({ packNum }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/cards-pulled-out.jpg")} startScale={1} endScale={1.12} panY={-8} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#94a3b8" count={15} />
    <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text="CARDS OUT — FACE DOWN" sub="Sorting energy & code card to back..." delay={5} size={36} y="82%" />
    <PriceTicker />
  </AbsoluteFill>
);

const SortEnergyScene: React.FC<{ packNum: number }> = ({ packNum }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/sorting-energy.jpg")} startScale={1} endScale={1.15} panX={10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#34d399" count={15} />
    <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text="ENERGY & CODE → BACK" sub="Now let's see what we got..." delay={5} size={36} y="82%" />
    <PriceTicker />
  </AbsoluteFill>
);

const FanCommonsScene: React.FC<{ packNum: number; pack: typeof PACK_RESULTS[0] }> = ({ packNum, pack }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/fanning-commons.jpg")} startScale={1} endScale={1.18} panX={-10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,0,20,0.85) 100%)" }} />
    <Particles color="#94a3b8" count={10} />
    <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text="FANNING THROUGH..." sub="Commons & Uncommons" delay={5} size={36} y="14%" />
    {pack.commons.slice(0, 3).map((c, i) => (
      <Badge key={i} label={`Card ${i + 1}`} value={c} color="#94a3b8" x="68%" y={`${18 + i * 16}%`} delay={12 + i * 8} />
    ))}
    <PriceTicker />
  </AbsoluteFill>
);

const RevHoloScene: React.FC<{ packNum: number; pack: typeof PACK_RESULTS[0] }> = ({ packNum, pack }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/reverse-holo-reveal.jpg")} startScale={1} endScale={1.2} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.1) 0%, rgba(10,0,20,0.6) 100%)" }} />
    <Particles color="#fbbf24" count={30} />
    <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text={`REVERSE HOLO — ${pack.revHolo.name.toUpperCase()}`} sub={`Value: ${pack.revHolo.value}`} delay={8} size={40} y="82%" />
    <Badge label="Pull Rate" value={pack.revHolo.pullRate} color="#fbbf24" x="72%" y="12%" delay={15} />
    <PriceTicker />
  </AbsoluteFill>
);

const RareRevealScene: React.FC<{ packNum: number; pack: typeof PACK_RESULTS[0] }> = ({ packNum, pack }) => {
  const frame = useCurrentFrame();
  const isChase = pack.rare.rarity === "Special Art Rare" || pack.rare.rarity === "Ultra Rare";
  const pulse = isChase ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      <KenBurns src={staticFile(`images/${pack.rare.img}`)} startScale={1} endScale={isChase ? 1.3 : 1.15} />
      <AbsoluteFill style={{ background: isChase
        ? "radial-gradient(ellipse at center, rgba(251,191,36,0.2) 0%, rgba(10,0,20,0.5) 100%)"
        : "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
      <Particles color={pack.rare.color} count={isChase ? 70 : 20} />
      {isChase && (
        <div style={{ position: "absolute", left: "50%", top: "10%", transform: `translate(-50%,-50%) scale(${pulse})`, fontSize: 60, textShadow: "0 0 40px #ffd700" }}>⭐</div>
      )}
      <CoinBalance coins={5000 - (packNum - 1) * 100} delay={3} />
      <PackCounter current={packNum} total={8} delay={3} />
      <TextOverlay
        text={pack.rare.name.toUpperCase() + (isChase ? "!" : "")}
        sub={`${pack.rare.rarity} — ${pack.rare.value}`}
        delay={8}
        size={isChase ? 52 : 40}
        y="82%"
      />
      <Badge label="Rarity" value={pack.rare.rarity} color={pack.rare.color} x="72%" y="12%" delay={15} />
      <Badge label="Pull Rate" value={pack.rare.pullRate} color="#22d3ee" x="72%" y="28%" delay={20} />
      {isChase && <Badge label="Market Value" value={pack.rare.value} color="#ffd700" x="72%" y="44%" delay={25} />}
      <PriceTicker />
    </AbsoluteFill>
  );
};

const SleeveScene: React.FC<{ packNum: number }> = ({ packNum }) => (
  <AbsoluteFill style={{ background: "#0a0014" }}>
    <KenBurns src={staticFile("images/sleeving-card.jpg")} startScale={1} endScale={1.15} panY={-10} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,0,20,0.8) 100%)" }} />
    <Particles color="#ffd700" count={20} />
    <CoinBalance coins={5000 - packNum * 100} delay={3} />
    <PackCounter current={packNum} total={8} delay={3} />
    <TextOverlay text="SLEEVED & SECURED" sub="Added to digital portfolio" delay={8} size={38} y="82%" />
    <PriceTicker />
  </AbsoluteFill>
);

const ResultsScene: React.FC = () => {
  const totalValue = PACK_RESULTS.reduce((sum, p) => {
    const rareVal = parseFloat(p.rare.value.replace("$", ""));
    const revVal = parseFloat(p.revHolo.value.replace("$", ""));
    return sum + rareVal + revVal + 2.5;
  }, 0);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0030 0%, #0a0014 100%)" }}>
      <Particles color="#ffd700" count={60} />
      <TextOverlay text="ETB RESULTS" sub="Prismatic Evolutions — 8 Packs Complete" delay={5} size={52} y="15%" />
      <Badge label="Total Cards" value="80" color="#22d3ee" x="20%" y="35%" delay={12} />
      <Badge label="Total Value" value={`$${totalValue.toFixed(2)}`} color="#34d399" x="50%" y="35%" delay={18} />
      <Badge label="Buy-In" value="800 Coins" color="#fbbf24" x="80%" y="35%" delay={24} />
      <Badge label="Best Pull" value="Charizard ex SAR" color="#ffd700" x="30%" y="55%" delay={30} />
      <Badge label="Best Value" value="$312.00" color="#ef4444" x="65%" y="55%" delay={36} />
      <Badge label="ROI" value={`+${((totalValue / 8) * 100 / 100).toFixed(0)}%`} color="#22c55e" x="50%" y="72%" delay={42} />
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 24, color: "#fbbf24", fontWeight: 700 }}>BUY IN • BET • RIP • WIN</div>
        <div style={{ fontSize: 16, color: "#a78bfa", marginTop: 8 }}>pulsemarketcap.com/ripz</div>
      </div>
      <div style={{ position: "absolute", bottom: 15, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 9, color: "#555" }}>
        © 2026 PGVA Ventures LLC. All rights reserved. Digital entertainment only. Patent Pending.
      </div>
      <PriceTicker />
    </AbsoluteFill>
  );
};

export const PokeRipzETB: React.FC = () => {
  const INTRO = 150;
  const TEAR = 90;
  const PULL = 75;
  const SORT = 75;
  const FAN = 105;
  const REV = 90;
  const RARE = 105;
  const SLEEVE = 75;
  const RESULTS = 180;
  
  const sequences: { from: number; dur: number; el: React.ReactElement }[] = [];
  let t = 0;
  
  sequences.push({ from: t, dur: INTRO, el: <IntroScene /> });
  t += INTRO;
  
  for (let i = 0; i < 8; i++) {
    const pack = PACK_RESULTS[i];
    const isHit = pack.rare.rarity === "Ultra Rare" || pack.rare.rarity === "Special Art Rare";
    
    sequences.push({ from: t, dur: TEAR, el: <PackTearScene packNum={i + 1} /> });
    t += TEAR;
    
    sequences.push({ from: t, dur: PULL, el: <PullOutScene packNum={i + 1} /> });
    t += PULL;
    
    sequences.push({ from: t, dur: SORT, el: <SortEnergyScene packNum={i + 1} /> });
    t += SORT;
    
    sequences.push({ from: t, dur: FAN, el: <FanCommonsScene packNum={i + 1} pack={pack} /> });
    t += FAN;
    
    sequences.push({ from: t, dur: REV, el: <RevHoloScene packNum={i + 1} pack={pack} /> });
    t += REV;
    
    sequences.push({ from: t, dur: isHit ? RARE + 30 : RARE, el: <RareRevealScene packNum={i + 1} pack={pack} /> });
    t += isHit ? RARE + 30 : RARE;
    
    if (isHit) {
      sequences.push({ from: t, dur: SLEEVE, el: <SleeveScene packNum={i + 1} /> });
      t += SLEEVE;
    }
  }
  
  sequences.push({ from: t, dur: RESULTS, el: <ResultsScene /> });
  t += RESULTS;
  
  return (
    <AbsoluteFill style={{ background: "#0a0014" }}>
      {sequences.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          {s.el}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

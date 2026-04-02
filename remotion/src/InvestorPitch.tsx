import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

const ACCENT = "#00d26a";
const GOLD = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const PURPLE = "#a855f7";
const CYAN = "#06b6d4";
const PINK = "#ec4899";
const ORANGE = "#f97316";
const BG = "#060a10";

// ─── Primitives ───
const Text: React.FC<{
  text: string; delay: number; size?: number; color?: string; weight?: number; spacing?: number; align?: string;
}> = ({ text, delay, size = 56, color = "white", weight = 800, spacing = 0, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, fontSize: size, fontWeight: weight, color, fontFamily: "'Space Grotesk', sans-serif", textAlign: align as any, lineHeight: 1.15, letterSpacing: spacing }}>
      {text}
    </div>
  );
};

const Glow: React.FC<{ color: string; size?: number; x?: string; y?: string; opacity?: number }> = ({ color, size = 500, x = "50%", y = "50%", opacity: op = 0.15 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: "blur(60px)", opacity: op, pointerEvents: "none" }} />
);

const Stat: React.FC<{ value: string; label: string; delay: number; color?: string; size?: number }> = ({ value, label, delay, color = ACCENT, size = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: size, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// ─── Scene 1: Hero Title (0-145) ───
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={900} x="50%" y="45%" opacity={0.2} />
      <div style={{ textAlign: "center" }}>
        <Text text="PULSE MARKET" delay={5} size={110} color={ACCENT} weight={900} spacing={8} />
        <Text text="TERMINAL TICKER™" delay={15} size={80} color="white" weight={900} spacing={6} />
        <div style={{ height: 32 }} />
        <Text text="12 Revenue Engines. One Platform." delay={30} size={34} color="rgba(255,255,255,0.5)" weight={500} spacing={4} />
        <div style={{ height: 16 }} />
        <Text text="PGVA Ventures, LLC" delay={42} size={24} color="rgba(255,255,255,0.3)" weight={400} spacing={6} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: 12 Verticals Grid (145-295) ───
const SceneVerticals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const verticals = [
    { name: "Pokémon TCG", icon: "⚡", tam: "$15.4B", color: GOLD },
    { name: "Magic: The Gathering", icon: "🔮", tam: "$14.2B", color: PURPLE },
    { name: "MLB Baseball", icon: "⚾", tam: "$12.1B", color: RED },
    { name: "NFL Football", icon: "🏈", tam: "$11.8B", color: BLUE },
    { name: "NBA Basketball", icon: "🏀", tam: "$10.5B", color: ORANGE },
    { name: "Yu-Gi-Oh!", icon: "🎴", tam: "$9.8B", color: PINK },
    { name: "FIFA Soccer", icon: "⚽", tam: "$8.9B", color: ACCENT },
    { name: "Dragon Ball Z", icon: "🐉", tam: "$6.1B", color: GOLD },
    { name: "Star Wars", icon: "⭐", tam: "$5.2B", color: "#fbbf24" },
    { name: "NHL Hockey", icon: "🏒", tam: "$4.2B", color: CYAN },
    { name: "Disney Lorcana", icon: "✨", tam: "$3.8B", color: "#8b5cf6" },
    { name: "Blueprint™", icon: "📐", tam: "Master", color: "white" },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={GOLD} size={700} x="30%" y="30%" opacity={0.12} />
      <Glow color={PURPLE} size={600} x="70%" y="70%" opacity={0.1} />
      <div style={{ textAlign: "center", width: "92%" }}>
        <Text text="12 MARKET VERTICALS" delay={3} size={64} color={ACCENT} weight={900} />
        <Text text="$103B+ Combined TAM" delay={12} size={36} color={GOLD} weight={700} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 50 }}>
          {verticals.map((v, i) => {
            const s = spring({ frame: frame - 22 - i * 4, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                width: 220, padding: "22px 16px", borderRadius: 18, background: "rgba(255,255,255,0.04)",
                border: `2px solid ${v.color}50`, transform: `scale(${s})`, opacity: s, textAlign: "center",
              }}>
                <div style={{ fontSize: 36 }}>{v.icon}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 700, color: v.color, marginTop: 8 }}>{v.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{v.tam}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Market Indexes (295-430) ───
const SceneIndexes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [110, 135], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chartW = 1500, chartH = 450, padL = 80, padR = 40, padT = 30, padB = 50;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const rawIdx = [100,106,112,119,128,134,142,155,163,178,192,210];
  const gradedIdx = [100,104,109,113,120,125,131,139,148,155,164,175];
  const sealedIdx = [100,103,107,110,115,119,124,129,135,140,147,156];
  const maxV = 230, minV = 90;
  const drawProg = interpolate(frame, [15, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const toX = (i: number) => padL + (i / 11) * innerW;
  const toY = (v: number) => padT + innerH - ((v - minV) / (maxV - minV)) * innerH;
  const buildPath = (data: number[]) => {
    const vis = Math.floor(drawProg * data.length);
    const pts: string[] = [];
    for (let i = 0; i <= Math.min(vis, data.length - 1); i++) pts.push(`${toX(i)},${toY(data[i])}`);
    return pts.length > 1 ? `M${pts.join("L")}` : "";
  };
  const datasets = [
    { data: rawIdx, color: ACCENT, label: "Raw Index", val: "+110%" },
    { data: gradedIdx, color: GOLD, label: "Graded Index", val: "+75%" },
    { data: sealedIdx, color: CYAN, label: "Sealed Index", val: "+56%" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={600} x="40%" y="30%" opacity={0.12} />
      <div style={{ textAlign: "center" }}>
        <Text text="📊 REAL-TIME MARKET INDEXES" delay={3} size={56} color={ACCENT} />
        <Text text="Live Price Tracking Across All Verticals" delay={12} size={26} color="rgba(255,255,255,0.4)" weight={500} />
        <svg width={chartW} height={chartH} style={{ marginTop: 40 }}>
          {[100, 150, 200].map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={padL + innerW} y2={toY(v)} stroke="rgba(255,255,255,0.06)" />
              <text x={padL - 12} y={toY(v) + 5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={18} fontFamily="monospace">{v}</text>
            </g>
          ))}
          {months.map((m, i) => (
            <text key={i} x={toX(i)} y={chartH - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={17} fontFamily="sans-serif">{m}</text>
          ))}
          {datasets.map((ds, di) => (
            <path key={di} d={buildPath(ds.data)} fill="none" stroke={ds.color} strokeWidth={di === 0 ? 5 : 3.5} strokeLinecap="round" strokeLinejoin="round" opacity={di === 0 ? 1 : 0.75} />
          ))}
        </svg>
        <div style={{ display: "flex", gap: 50, justifyContent: "center", marginTop: 30 }}>
          {datasets.map((ds, i) => {
            const ls = spring({ frame: frame - 90 - i * 10, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: ls }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: ds.color }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.6)" }}>{ds.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: ds.color }}>{ds.val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: SimTrader World™ (430-575) ───
const SceneSimTrader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const portfolioValue = interpolate(frame, [20, 80], [100000, 134850], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnl = portfolioValue - 100000;
  const pnlPct = ((pnl / 100000) * 100).toFixed(1);

  const sparkData = [100, 98, 105, 108, 112, 118, 122, 126, 130, 135];
  const sparkW = 350, sparkH = 80;
  const sparkProg = interpolate(frame, [30, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sparkPath = (() => {
    const pts: string[] = [];
    const vis = Math.floor(sparkProg * sparkData.length);
    for (let i = 0; i <= Math.min(vis, sparkData.length - 1); i++) {
      pts.push(`${(i / 9) * sparkW},${sparkH - ((sparkData[i] - 95) / 45) * sparkH}`);
    }
    return pts.length > 1 ? `M${pts.join("L")}` : "";
  })();

  const bots = [
    { name: "Neural Nate", action: "BUY", card: "Charizard ex", color: ACCENT },
    { name: "Whale Wendy", action: "SELL", card: "Pikachu VMAX", color: RED },
    { name: "Swing Sara", action: "BUY", card: "Lugia V", color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={500} x="25%" y="40%" opacity={0.15} />
      <Glow color={BLUE} size={450} x="75%" y="60%" opacity={0.1} />
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ width: 750 }}>
          <Text text="🎮 SIMTRADER WORLD™" delay={3} size={60} color={ACCENT} weight={900} />
          <Text text="Virtual Trading · Real Market Data" delay={12} size={24} color="rgba(255,255,255,0.4)" weight={500} />
          <Sequence from={18}>
            {(() => {
              const cardPop = spring({ frame: frame - 18, fps, config: { damping: 14 } });
              return (
                <div style={{ marginTop: 36, padding: "32px 36px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,210,106,0.2)", transform: `scale(${cardPop})`, opacity: cardPop }}>
                  <div style={{ fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.3)", letterSpacing: 4 }}>PORTFOLIO VALUE</div>
                  <div style={{ fontFamily: "monospace", fontSize: 68, fontWeight: 900, color: "white", marginTop: 8 }}>${Math.floor(portfolioValue).toLocaleString()}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: ACCENT }}>+${Math.floor(pnl).toLocaleString()} ({pnlPct}%)</span>
                    <svg width={sparkW} height={sparkH}><path d={sparkPath} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" /></svg>
                  </div>
                </div>
              );
            })()}
          </Sequence>
        </div>
        <div style={{ width: 450 }}>
          <div style={{ fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.3)", letterSpacing: 4, marginBottom: 20 }}>BOT ACTIVITY</div>
          {bots.map((bot, i) => {
            const rs = spring({ frame: frame - 40 - i * 12, fps, config: { damping: 16 } });
            return (
              <div key={i} style={{ padding: "16px 20px", marginBottom: 10, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", opacity: rs, transform: `translateX(${interpolate(rs, [0, 1], [30, 0])}px)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)" }}>{bot.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.35)" }}>{bot.action} {bot.card}</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${bot.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: bot.color }}>{bot.action === "BUY" ? "▲" : "▼"}</div>
              </div>
            );
          })}
          <Sequence from={90}>
            <Text text="🤖 10 AI Opponents · 3 Difficulty Levels" delay={0} size={16} color={GOLD} weight={600} />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Poké-Pulse Arena™ (575-720) ───
const SceneArena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { icon: "🎰", title: "Price Prediction Bets", desc: "Wager PokéCoins on real price movements" },
    { icon: "🏆", title: "Live Tournaments", desc: "Weekly competitions with cash prizes" },
    { icon: "📦", title: "Virtual Pack Opens", desc: "Open packs with real market odds" },
    { icon: "⚔️", title: "Prediction Duels", desc: "1v1 PvP price prediction battles" },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={GOLD} size={700} x="50%" y="40%" opacity={0.15} />
      <div style={{ textAlign: "center", width: "90%" }}>
        <Text text="🏟️ POKÉ-PULSE ARENA™" delay={3} size={64} color={GOLD} weight={900} />
        <Text text="Gamified Trading · Real Stakes" delay={12} size={28} color="rgba(255,255,255,0.4)" weight={500} />
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 50 }}>
          {features.map((f, i) => {
            const s = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{ width: 320, padding: "36px 28px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,158,11,0.15)", transform: `scale(${s})`, opacity: s, textAlign: "center" }}>
                <div style={{ fontSize: 48 }}>{f.icon}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginTop: 14 }}>{f.title}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 8, lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: PokémonKids Adventure (720-865) ───
const SceneAdventure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sprites = [25, 6, 150, 149, 384]; // pikachu, charizard, mewtwo, dragonite, rayquaza
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ORANGE} size={600} x="40%" y="35%" opacity={0.15} />
      <Glow color={RED} size={500} x="65%" y="65%" opacity={0.1} />
      <div style={{ textAlign: "center" }}>
        <Text text="🎮 POKÉMONKIDS ADVENTURE" delay={3} size={60} color={ORANGE} weight={900} />
        <Text text="Choose · Battle · Collect · Win" delay={12} size={28} color="rgba(255,255,255,0.4)" weight={500} />
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 50 }}>
          {sprites.map((id, i) => {
            const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 12, stiffness: 200 } });
            const bob = Math.sin((frame - 20) * 0.06 + i) * 6;
            return (
              <div key={i} style={{ transform: `scale(${s}) translateY(${bob}px)`, opacity: s }}>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                  style={{ width: 180, height: 180, objectFit: "contain" }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 50, justifyContent: "center", marginTop: 40 }}>
          <Stat value="17" label="Battle Zones" delay={55} color={ORANGE} size={52} />
          <Stat value="PvP" label="Real-Time" delay={65} color={RED} size={52} />
          <Stat value="$0.99" label="Full Access" delay={75} color={ACCENT} size={52} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: AI Signals & Portfolio (865-1010) ───
const SceneAIPortfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tools = [
    { icon: "🧠", name: "AI Pulse Score™", desc: "Predictive signal strength rating", color: CYAN },
    { icon: "📈", name: "Alpha Signals", desc: "Early trend detection alerts", color: ACCENT },
    { icon: "💼", name: "Portfolio P&L", desc: "Real-time profit/loss tracking", color: GOLD },
    { icon: "🔔", name: "Price Alerts", desc: "Instant notifications on targets", color: PURPLE },
    { icon: "📊", name: "Correlation Matrix", desc: "Cross-card price relationships", color: PINK },
    { icon: "Δ", name: "Pop Report Delta", desc: "Grading population changes", color: ORANGE },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={CYAN} size={600} x="50%" y="40%" opacity={0.12} />
      <div style={{ textAlign: "center", width: "92%" }}>
        <Text text="🧠 AI-POWERED INTELLIGENCE" delay={3} size={56} color={CYAN} weight={900} />
        <Text text="Professional-Grade Tools for Every Vertical" delay={12} size={24} color="rgba(255,255,255,0.4)" weight={500} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", marginTop: 45 }}>
          {tools.map((t, i) => {
            const s = spring({ frame: frame - 22 - i * 7, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ width: 280, padding: "28px 22px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: `1px solid ${t.color}25`, transform: `scale(${s})`, opacity: s, textAlign: "left" }}>
                <div style={{ fontSize: 32 }}>{t.icon}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 700, color: t.color, marginTop: 10 }}>{t.name}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{t.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: Revenue Model (1010-1155) ───
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const streams = [
    { name: "Subscriptions", pct: 35, color: ACCENT },
    { name: "Franchise Licensing", pct: 25, color: GOLD },
    { name: "Arena & Gaming", pct: 15, color: PURPLE },
    { name: "Affiliate Revenue", pct: 10, color: CYAN },
    { name: "Data API", pct: 10, color: BLUE },
    { name: "PokéCoin Store", pct: 5, color: PINK },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={500} x="50%" y="50%" opacity={0.12} />
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ width: 600 }}>
          <Text text="💰 6 REVENUE STREAMS" delay={3} size={52} color="white" weight={900} align="left" />
          <div style={{ marginTop: 40 }}>
            {streams.map((s, i) => {
              const barSpring = spring({ frame: frame - 18 - i * 8, fps, config: { damping: 15 } });
              return (
                <div key={i} style={{ marginBottom: 18, opacity: barSpring, transform: `translateX(${interpolate(barSpring, [0, 1], [-20, 0])}px)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.6)" }}>{s.name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: s.color }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct * 2.5}%`, background: s.color, borderRadius: 6, transform: `scaleX(${barSpring})`, transformOrigin: "left" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ width: 500 }}>
          <Stat value="$157.8M" label="ARR by 2030" delay={30} color={ACCENT} size={72} />
          <div style={{ height: 40 }} />
          <Stat value="76%" label="5-Year CAGR" delay={42} color={GOLD} size={60} />
          <div style={{ height: 40 }} />
          <Stat value="$1.89B" label="Valuation Target" delay={54} color="white" size={60} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 9: Growth Chart (1155-1300) ───
const SceneGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const years = [
    { year: "2026", arr: "$8.6M", users: "45K", h: 70 },
    { year: "2027", arr: "$28.4M", users: "185K", h: 150 },
    { year: "2028", arr: "$67.2M", users: "480K", h: 260 },
    { year: "2029", arr: "$112.5M", users: "820K", h: 370 },
    { year: "2030", arr: "$157.8M", users: "1.2M", h: 460 },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={600} x="50%" y="50%" opacity={0.12} />
      <div style={{ textAlign: "center" }}>
        <Text text="📈 5-YEAR GROWTH TRAJECTORY" delay={3} size={56} color="white" weight={900} />
        <Text text="From $8.6M to $157.8M ARR" delay={12} size={28} color={ACCENT} weight={600} />
        <div style={{ display: "flex", gap: 50, alignItems: "flex-end", justifyContent: "center", marginTop: 70, height: 500 }}>
          {years.map((y, i) => {
            const barGrow = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 900, color: ACCENT, marginBottom: 10, opacity: barGrow }}>{y.arr}</div>
                <div style={{ width: 110, height: y.h * barGrow, borderRadius: "12px 12px 0 0", background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT}40 100%)` }} />
                <div style={{ fontFamily: "monospace", fontSize: 22, color: "white", marginTop: 12, fontWeight: 700 }}>{y.year}</div>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{y.users} users</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 10: Security & Legal (1300-1430) ───
const SceneSecurity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [105, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const items = [
    { icon: "🔒", title: "RLS Security", desc: "Row-level database protection" },
    { icon: "📜", title: "Patent Portfolio", desc: "Full IP protection filed" },
    { icon: "™️", title: "Trademark Suite", desc: "12 brand marks registered" },
    { icon: "🏛️", title: "Trust Structure", desc: "Noyes Family Trust shield" },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={BLUE} size={500} x="50%" y="50%" opacity={0.12} />
      <div style={{ textAlign: "center", width: "88%" }}>
        <Text text="🛡️ BULLETPROOF PROTECTION" delay={3} size={56} color={BLUE} weight={900} />
        <Text text="Enterprise Security · Full Legal Coverage" delay={12} size={24} color="rgba(255,255,255,0.4)" weight={500} />
        <div style={{ display: "flex", gap: 30, justifyContent: "center", marginTop: 50 }}>
          {items.map((item, i) => {
            const s = spring({ frame: frame - 22 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{ width: 280, padding: "36px 24px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.15)", transform: `scale(${s})`, opacity: s, textAlign: "center" }}>
                <div style={{ fontSize: 44 }}>{item.icon}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginTop: 14 }}>{item.title}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 11: Audit Score (1430-1560) ───
const SceneAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [105, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scoreVal = interpolate(frame, [10, 50], [0, 98], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 200;
  const ringProg = interpolate(frame, [10, 60], [0, 0.98], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <Glow color={ACCENT} size={500} x="50%" y="50%" opacity={0.15} />
      <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
        <div>
          <Text text="✅ PLATFORM AUDIT" delay={3} size={52} color="white" weight={900} align="left" />
          <Text text="Daily Automated Self-Assessment" delay={12} size={22} color="rgba(255,255,255,0.4)" weight={500} align="left" />
          <div style={{ marginTop: 40 }}>
            {["Aesthetics 96", "Efficiency 97", "Security 93", "Legal 96", "Capital 94"].map((cat, i) => {
              const s = spring({ frame: frame - 55 - i * 7, fps, config: { damping: 16 } });
              return (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 22, color: "rgba(255,255,255,0.5)", marginBottom: 14, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-20, 0])}px)` }}>
                  {cat}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "relative", width: 440, height: 440 }}>
          <svg width={440} height={440} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={220} cy={220} r={200} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={18} />
            <circle cx={220} cy={220} r={200} fill="none" stroke={ACCENT} strokeWidth={18} strokeDasharray={`${circumference * ringProg} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 120, fontWeight: 900, color: "white" }}>{Math.floor(scoreVal)}</div>
            <div style={{ fontFamily: "monospace", fontSize: 28, color: "rgba(255,255,255,0.3)" }}>/100</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 12: Final CTA (1560-1770) ───
const SceneFinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 80 } });
  const glowPulse = 0.35 + Math.sin(frame * 0.05) * 0.15;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(100px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring})`, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 84, fontWeight: 900, color: "white", marginBottom: 8 }}>OWN THE FUTURE OF</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 84, fontWeight: 900, color: ACCENT, marginBottom: 24 }}>COLLECTIBLES DATA</div>
        <div style={{ fontFamily: "monospace", fontSize: 44, color: GOLD, marginBottom: 50 }}>$103B+ MARKET OPPORTUNITY</div>
        <div style={{ fontFamily: "monospace", fontSize: 30, color: "rgba(255,255,255,0.5)", letterSpacing: 4, marginBottom: 20 }}>PGVA VENTURES, LLC</div>
        <Sequence from={25}>
          <Text text="contact@poke-pulse-ticker.com" delay={0} size={32} color={ACCENT} weight={500} />
        </Sequence>
        <Sequence from={40}>
          <Text text="© 2026 Noyes Family Trust — All Rights Reserved" delay={0} size={18} color="rgba(255,255,255,0.2)" weight={400} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition: 59 seconds = 1770 frames at 30fps ───
export const InvestorPitch: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: 18 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const y = baseY + Math.sin(frame * 0.03 + i) * 35;
    const size = 2 + (i % 3) * 1.2;
    const opacity = 0.06 + Math.sin(frame * 0.025 + i * 0.8) * 0.04;
    const colors = [ACCENT, BLUE, GOLD, CYAN];
    return { x, y, size, opacity, color: colors[i % 4] };
  });

  // 12 scenes across 1770 frames
  const scenes: [number, number][] = [
    [0, 145],       // Hero
    [145, 150],     // Verticals
    [295, 135],     // Indexes
    [430, 145],     // SimTrader
    [575, 145],     // Arena
    [720, 145],     // Adventure
    [865, 145],     // AI/Portfolio
    [1010, 145],    // Revenue
    [1155, 145],    // Growth
    [1300, 130],    // Security
    [1430, 130],    // Audit
    [1560, 210],    // Final CTA
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.012) * 10}, 50%, 6%) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(215, 45%, 5%) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, hsl(${260 + Math.sin(frame * 0.008) * 12}, 35%, 4%) 0%, transparent 60%),
          linear-gradient(180deg, ${BG} 0%, #0a1220 50%, ${BG} 100%)
        `,
      }} />

      <AbsoluteFill style={{ opacity: 0.03 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 10), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 7), top: 0, bottom: 0, width: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>

      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}

      <Sequence from={scenes[0][0]} durationInFrames={scenes[0][1]}><SceneHero /></Sequence>
      <Sequence from={scenes[1][0]} durationInFrames={scenes[1][1]}><SceneVerticals /></Sequence>
      <Sequence from={scenes[2][0]} durationInFrames={scenes[2][1]}><SceneIndexes /></Sequence>
      <Sequence from={scenes[3][0]} durationInFrames={scenes[3][1]}><SceneSimTrader /></Sequence>
      <Sequence from={scenes[4][0]} durationInFrames={scenes[4][1]}><SceneArena /></Sequence>
      <Sequence from={scenes[5][0]} durationInFrames={scenes[5][1]}><SceneAdventure /></Sequence>
      <Sequence from={scenes[6][0]} durationInFrames={scenes[6][1]}><SceneAIPortfolio /></Sequence>
      <Sequence from={scenes[7][0]} durationInFrames={scenes[7][1]}><SceneRevenue /></Sequence>
      <Sequence from={scenes[8][0]} durationInFrames={scenes[8][1]}><SceneGrowth /></Sequence>
      <Sequence from={scenes[9][0]} durationInFrames={scenes[9][1]}><SceneSecurity /></Sequence>
      <Sequence from={scenes[10][0]} durationInFrames={scenes[10][1]}><SceneAudit /></Sequence>
      <Sequence from={scenes[11][0]} durationInFrames={scenes[11][1]}><SceneFinalCTA /></Sequence>

      <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.1)", letterSpacing: 4 }}>
        PGVA VENTURES LLC — CONFIDENTIAL
      </div>
    </AbsoluteFill>
  );
};

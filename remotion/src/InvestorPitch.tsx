import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

const ACCENT = "#00d26a";
const GOLD = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const BG = "#060a10";

// ─── Reusable Primitives ───

const TextReveal: React.FC<{
  text: string; delay: number; fontSize?: number; color?: string; fontWeight?: number; letterSpacing?: number;
}> = ({ text, delay, fontSize = 56, color = "white", fontWeight = 800, letterSpacing = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [50, 0]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, fontSize, fontWeight, color, fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.15, letterSpacing }}>
      {text}
    </div>
  );
};

const StatBlock: React.FC<{ value: string; label: string; delay: number; color?: string; large?: boolean }> = ({ value, label, delay, color = ACCENT, large }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  const sz = large ? 90 : 72;
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: sz, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.45)", letterSpacing: 3, marginTop: 10, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// ─── Scene 1: Title (0–120) ───
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOp = interpolate(frame, [0, 30], [0, 0.7], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [95, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowOp * 0.25}) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <TextReveal text="POKE PULSE TICKER" delay={5} fontSize={100} color={ACCENT} fontWeight={900} letterSpacing={8} />
        <Sequence from={15}>
          <TextReveal text="INVESTOR PITCH" delay={0} fontSize={52} color="rgba(255,255,255,0.5)" fontWeight={600} letterSpacing={10} />
        </Sequence>
        <Sequence from={30}>
          <TextReveal text="Q1 2026" delay={0} fontSize={40} color={GOLD} fontWeight={700} letterSpacing={6} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Audit Score (120–300) ───
const SceneAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scoreProgress = interpolate(frame, [15, 60], [0, 95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayScore = Math.floor(scoreProgress);
  const ringProgress = interpolate(frame, [15, 70], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 200;
  const strokeDash = circumference * ringProgress;

  const categories = [
    { name: "Aesthetics", score: 96 },
    { name: "Efficiency", score: 97 },
    { name: "Info Quality", score: 95 },
    { name: "Security", score: 93 },
    { name: "Legal", score: 96 },
    { name: "Capital Intake", score: 94 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 36, color: "rgba(255,255,255,0.4)", letterSpacing: 6, marginBottom: 40, textTransform: "uppercase" }}>
          Platform Audit Score
        </div>
        <div style={{ position: "relative", width: 440, height: 440, margin: "0 auto 50px" }}>
          <svg width={440} height={440} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={220} cy={220} r={200} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} />
            <circle cx={220} cy={220} r={200} fill="none" stroke={ACCENT} strokeWidth={16}
              strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 130, fontWeight: 900, color: "white" }}>{displayScore}</div>
            <div style={{ fontFamily: "monospace", fontSize: 30, color: "rgba(255,255,255,0.4)" }}>/100</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", maxWidth: 800, margin: "0 auto" }}>
          {categories.map((cat, i) => {
            const barSpring = spring({ frame: frame - 70 - i * 8, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ width: 240, opacity: barSpring, transform: `translateY(${interpolate(barSpring, [0, 1], [20, 0])}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 18, color: "rgba(255,255,255,0.5)" }}>{cat.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 18, color: ACCENT }}>{cat.score}</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cat.score}%`, background: ACCENT, borderRadius: 4, transform: `scaleX(${barSpring})`, transformOrigin: "left" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Subscription Tiers (300–480) ───
const SceneTiers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", color: "rgba(255,255,255,0.3)", features: ["Market ticker", "Top movers", "Community"] },
    { name: "PRO", price: "$12/mo", color: ACCENT, features: ["Real-time data", "AI signals", "Portfolio P&L"] },
    { name: "PREMIUM", price: "$29/mo", color: GOLD, features: ["API access", "SimTrader™", "Tax reports"] },
    { name: "TEAM", price: "$79/mo", color: BLUE, features: ["3 seats", "LGS tools", "B2B dashboard"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "92%" }}>
        <TextReveal text="REVENUE MODEL" delay={5} fontSize={48} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <TextReveal text="4 SUBSCRIPTION TIERS" delay={12} fontSize={64} color="white" />
        <div style={{ marginTop: 55, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {tiers.map((t, i) => {
            const cardSpring = spring({ frame: frame - 25 - i * 12, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{
                width: 300, padding: "36px 28px", borderRadius: 20,
                background: "rgba(255,255,255,0.04)", border: `1px solid ${i === 1 ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transform: `scale(${cardSpring}) ${i === 1 ? "translateY(-16px)" : ""}`,
                opacity: cardSpring,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, color: t.color, letterSpacing: 4, marginBottom: 14 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 44, fontWeight: 900, color: "white", marginBottom: 20 }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: t.color, fontSize: 14 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <Sequence from={120}>
          <TextReveal text="ARR potential: $500K+ at 3,000 subs" delay={0} fontSize={34} color={GOLD} fontWeight={600} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Competitor Price Chart (480–660) ───
const ScenePriceChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chartW = 1400;
  const chartH = 500;
  const padL = 90;
  const padR = 40;
  const padT = 30;
  const padB = 60;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const pokePulse = [100,108,115,122,135,142,155,168,180,195,210,230];
  const tcgPlayer = [100,102,105,103,108,110,112,115,118,120,122,125];
  const rareCandy = [100,99,101,104,103,106,108,107,110,112,115,118];

  const maxVal = 250;
  const minVal = 90;

  const drawProgress = interpolate(frame, [20, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const toX = (i: number) => padL + (i / (months.length - 1)) * innerW;
  const toY = (v: number) => padT + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const buildPath = (data: number[]) => {
    const visibleCount = Math.floor(drawProgress * data.length);
    const frac = (drawProgress * data.length) - visibleCount;
    const pts: string[] = [];
    for (let i = 0; i <= Math.min(visibleCount, data.length - 1); i++) {
      pts.push(`${toX(i)},${toY(data[i])}`);
    }
    if (visibleCount < data.length - 1 && frac > 0) {
      const x = toX(visibleCount) + frac * (toX(visibleCount + 1) - toX(visibleCount));
      const y = toY(data[visibleCount]) + frac * (toY(data[visibleCount + 1]) - toY(data[visibleCount]));
      pts.push(`${x},${y}`);
    }
    return pts.length > 1 ? `M${pts.join("L")}` : "";
  };

  const datasets = [
    { data: pokePulse, color: ACCENT, label: "Poke Pulse Ticker", value: `+${pokePulse[pokePulse.length-1] - 100}%` },
    { data: tcgPlayer, color: "#a855f7", label: "TCGPlayer", value: `+${tcgPlayer[tcgPlayer.length-1] - 100}%` },
    { data: rareCandy, color: "#f97316", label: "RareCandy", value: `+${rareCandy[rareCandy.length-1] - 100}%` },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center" }}>
        <TextReveal text="MARKET INDEX PERFORMANCE" delay={5} fontSize={48} color="white" />
        <div style={{ fontFamily: "sans-serif", fontSize: 22, color: "rgba(255,255,255,0.35)", marginTop: 8, marginBottom: 40, letterSpacing: 3 }}>
          12-MONTH COMPARISON — NORMALIZED TO 100
        </div>
        <svg width={chartW} height={chartH}>
          {[100, 150, 200, 250].map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={padL + innerW} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={padL - 14} y={toY(v) + 5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={16} fontFamily="monospace">{v}</text>
            </g>
          ))}
          {months.map((m, i) => (
            <text key={i} x={toX(i)} y={chartH - 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={16} fontFamily="sans-serif">{m}</text>
          ))}
          {datasets.map((ds, di) => (
            <path key={di} d={buildPath(ds.data)} fill="none" stroke={ds.color} strokeWidth={di === 0 ? 5 : 3}
              strokeLinecap="round" strokeLinejoin="round" opacity={di === 0 ? 1 : 0.7} />
          ))}
        </svg>
        <div style={{ display: "flex", gap: 50, justifyContent: "center", marginTop: 30 }}>
          {datasets.map((ds, i) => {
            const legendSpring = spring({ frame: frame - 110 - i * 12, fps, config: { damping: 15 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: legendSpring, transform: `translateY(${interpolate(legendSpring, [0, 1], [20, 0])}px)` }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: ds.color }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.6)" }}>{ds.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: ds.color }}>{ds.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: SimTrader World™ Showcase (660–840) ───
const SceneSimTrader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Animated portfolio value counter
  const portfolioValue = interpolate(frame, [30, 90], [100000, 127450], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnl = portfolioValue - 100000;
  const pnlPct = ((pnl / 100000) * 100).toFixed(1);

  // Simulated mini price chart (animated sparkline)
  const sparkData = [100, 98, 103, 107, 104, 112, 118, 115, 122, 127];
  const sparkW = 300;
  const sparkH = 80;
  const sparkProgress = interpolate(frame, [40, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sparkPath = (() => {
    const pts: string[] = [];
    const visible = Math.floor(sparkProgress * sparkData.length);
    for (let i = 0; i <= Math.min(visible, sparkData.length - 1); i++) {
      const x = (i / (sparkData.length - 1)) * sparkW;
      const y = sparkH - ((sparkData[i] - 95) / 35) * sparkH;
      pts.push(`${x},${y}`);
    }
    return pts.length > 1 ? `M${pts.join("L")}` : "";
  })();

  // Bot activity feed entries
  const bots = [
    { name: "Neural Nate", action: "BUY", card: "Charizard ex", price: "$42.50", color: ACCENT },
    { name: "Whale Wendy", action: "SELL", card: "Pikachu VMAX", price: "$28.90", color: RED },
    { name: "Swing Sara", action: "BUY", card: "Lugia V", price: "$18.75", color: ACCENT },
    { name: "Momentum Mike", action: "BUY", card: "Mewtwo ex", price: "$35.20", color: ACCENT },
  ];

  // Floating orbs
  const orbPositions = [
    { x: 150, y: 200, size: 200, color: ACCENT },
    { x: 1600, y: 700, size: 250, color: BLUE },
    { x: 900, y: 100, size: 180, color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      {/* Floating orbs background */}
      {orbPositions.map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          left: orb.x + Math.sin(frame * 0.02 + i * 2) * 30,
          top: orb.y + Math.cos(frame * 0.015 + i) * 25,
          width: orb.size, height: orb.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }} />
      ))}

      <div style={{ display: "flex", gap: 60, alignItems: "flex-start", position: "relative" }}>
        {/* Left: Dashboard mock */}
        <div style={{ width: 700 }}>
          <TextReveal text="SIMTRADER WORLD™" delay={5} fontSize={56} color={ACCENT} fontWeight={900} letterSpacing={4} />
          <Sequence from={15}>
            <TextReveal text="Virtual Trading. Real Market Data." delay={0} fontSize={26} color="rgba(255,255,255,0.4)" fontWeight={500} letterSpacing={3} />
          </Sequence>

          {/* Portfolio card */}
          <Sequence from={25}>
            {(() => {
              const cardPop = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 160 } });
              return (
                <div style={{
                  marginTop: 40,
                  padding: "32px 36px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,210,106,0.2)",
                  transform: `scale(${cardPop})`,
                  opacity: cardPop,
                }}>
                  <div style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(255,255,255,0.35)", letterSpacing: 4, marginBottom: 12 }}>PORTFOLIO VALUE</div>
                  <div style={{ fontFamily: "monospace", fontSize: 64, fontWeight: 900, color: "white" }}>
                    ${Math.floor(portfolioValue).toLocaleString()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: ACCENT }}>
                      +${Math.floor(pnl).toLocaleString()} ({pnlPct}%)
                    </span>
                    <svg width={sparkW} height={sparkH}>
                      <path d={sparkPath} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Starting Balance</div>
                      <div style={{ fontFamily: "monospace", fontSize: 22, color: "white" }}>$100,000</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Cards Held</div>
                      <div style={{ fontFamily: "monospace", fontSize: 22, color: GOLD }}>14</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Difficulty</div>
                      <div style={{ fontFamily: "monospace", fontSize: 22, color: RED }}>HARD</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Sequence>
        </div>

        {/* Right: Bot Activity Feed */}
        <div style={{ width: 480, marginTop: 80 }}>
          <div style={{ fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.35)", letterSpacing: 4, marginBottom: 20 }}>LIVE BOT ACTIVITY</div>
          {bots.map((bot, i) => {
            const rowSpring = spring({ frame: frame - 50 - i * 15, fps, config: { damping: 16 } });
            return (
              <div key={i} style={{
                padding: "16px 20px",
                marginBottom: 10,
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [40, 0])}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${bot.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: bot.color,
                  }}>
                    {bot.action === "BUY" ? "▲" : "▼"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)" }}>{bot.name}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{bot.action} {bot.card}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: bot.color }}>{bot.price}</div>
              </div>
            );
          })}

          {/* 10 AI opponents badge */}
          <Sequence from={110}>
            {(() => {
              const badgeSpring = spring({ frame: frame - 110, fps, config: { damping: 12 } });
              return (
                <div style={{
                  marginTop: 16, padding: "14px 20px", borderRadius: 12,
                  background: `${GOLD}10`, border: `1px solid ${GOLD}30`,
                  textAlign: "center", opacity: badgeSpring, transform: `scale(${badgeSpring})`,
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: GOLD, fontWeight: 700, letterSpacing: 2 }}>
                    🤖 10 AI OPPONENTS • 3 DIFFICULTY LEVELS
                  </span>
                </div>
              );
            })()}
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Competitive Edge (840–1020) ───
const SceneCompetitive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rows = [
    { feature: "Real-time pricing", us: true, tcg: false, rare: false },
    { feature: "AI signal analysis", us: true, tcg: false, rare: false },
    { feature: "SimTrader™ game", us: true, tcg: false, rare: false },
    { feature: "Portfolio P&L", us: true, tcg: false, rare: true },
    { feature: "Grading arbitrage", us: true, tcg: false, rare: false },
    { feature: "Trading contests", us: true, tcg: false, rare: false },
    { feature: "Price alerts", us: true, tcg: true, rare: true },
    { feature: "Market indices", us: true, tcg: false, rare: false },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ width: "88%", textAlign: "center" }}>
        <TextReveal text="COMPETITIVE ADVANTAGE" delay={5} fontSize={52} color="white" />
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", padding: "0 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Feature</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 18, color: ACCENT, textAlign: "center" }}>US</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>TCGPlayer</div>
            <div style={{ flex: 1, fontFamily: "monospace", fontSize: 18, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>RareCandy</div>
          </div>
          {rows.map((row, i) => {
            const rowSpring = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{
                display: "flex", padding: "14px 20px", alignItems: "center",
                opacity: rowSpring, transform: `translateX(${interpolate(rowSpring, [0, 1], [-30, 0])}px)`,
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
                <div style={{ flex: 2, fontFamily: "sans-serif", fontSize: 22, color: "rgba(255,255,255,0.7)", textAlign: "left" }}>{row.feature}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 26 }}>{row.us ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 26 }}>{row.tcg ? "✅" : "❌"}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 26 }}>{row.rare ? "✅" : "❌"}</div>
              </div>
            );
          })}
        </div>
        <Sequence from={120}>
          <TextReveal text="8 of 8 exclusive features" delay={0} fontSize={36} color={ACCENT} fontWeight={700} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Key Metrics (1020–1170) ───
const SceneMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.012;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", transform: `scale(${pulse})` }}>
        <TextReveal text="BY THE NUMBERS" delay={5} fontSize={52} color="rgba(255,255,255,0.4)" fontWeight={600} />
        <div style={{ marginTop: 50, display: "flex", gap: 80, justifyContent: "center", flexWrap: "wrap" }}>
          <StatBlock value="500+" label="Cards Tracked" delay={15} large />
          <StatBlock value="95" label="Audit Score" delay={25} color={GOLD} large />
          <StatBlock value="4" label="Revenue Tiers" delay={35} large />
          <StatBlock value="24/7" label="Live Data" delay={45} color={BLUE} large />
        </div>
        <Sequence from={60}>
          <div style={{ marginTop: 50, display: "flex", gap: 80, justifyContent: "center" }}>
            <StatBlock value="$43B" label="TCG Market" delay={0} color={GOLD} large />
            <StatBlock value="0" label="Direct Competitors" delay={10} color={ACCENT} large />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: CTA (1170–1350) ───
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const glowPulse = 0.3 + Math.sin(frame * 0.06) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(80px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring})`, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 84, fontWeight: 900, color: "white", marginBottom: 16 }}>LET'S BUILD</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 84, fontWeight: 900, color: ACCENT, marginBottom: 45 }}>TOGETHER</div>
        <div style={{ fontFamily: "monospace", fontSize: 32, color: "rgba(255,255,255,0.4)", letterSpacing: 5 }}>PGVA VENTURES, LLC.</div>
        <Sequence from={25}>
          <TextReveal text="contact@poke-pulse-ticker.com" delay={0} fontSize={28} color={ACCENT} fontWeight={500} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───
export const InvestorPitch: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const y = baseY + Math.sin(frame * 0.03 + i) * 40;
    const size = 2 + (i % 3) * 1.5;
    const opacity = 0.08 + Math.sin(frame * 0.025 + i * 0.8) * 0.05;
    const colors = [ACCENT, BLUE, GOLD, RED];
    return { x, y, size, opacity, color: colors[i % 4] };
  });

  // Scene timings (45 seconds = 1350 frames at 30fps)
  const S1 = 0, S1D = 120;       // Title (4s)
  const S2 = 120, S2D = 180;     // Audit (6s)
  const S3 = 300, S3D = 180;     // Tiers (6s)
  const S4 = 480, S4D = 180;     // Price Chart (6s)
  const S5 = 660, S5D = 180;     // SimTrader World (6s)
  const S6 = 840, S6D = 180;     // Competitive (6s)
  const S7 = 1020, S7D = 150;    // Metrics (5s)
  const S8 = 1170, S8D = 180;    // CTA (6s)

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.012) * 12}, 50%, 6%) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(215, 45%, 5%) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, hsl(${260 + Math.sin(frame * 0.008) * 15}, 35%, 4%) 0%, transparent 60%),
          linear-gradient(180deg, ${BG} 0%, #0a1220 50%, ${BG} 100%)
        `,
      }} />

      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.03 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 10), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 7), top: 0, bottom: 0, width: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}

      {/* Background Music */}
      <Audio src={staticFile("audio/bgmusic.mp3")} volume={0.12} />

      {/* Voiceover Audio */}
      <Sequence from={S1}><Audio src={staticFile("audio/intro.mp3")} volume={1} /></Sequence>
      <Sequence from={S2}><Audio src={staticFile("audio/audit.mp3")} volume={1} /></Sequence>
      <Sequence from={S3}><Audio src={staticFile("audio/tiers.mp3")} volume={1} /></Sequence>
      <Sequence from={S4}><Audio src={staticFile("audio/pricechart.mp3")} volume={1} /></Sequence>
      <Sequence from={S5}><Audio src={staticFile("audio/simtrader.mp3")} volume={1} /></Sequence>
      <Sequence from={S6}><Audio src={staticFile("audio/competitive.mp3")} volume={1} /></Sequence>
      <Sequence from={S7}><Audio src={staticFile("audio/metrics.mp3")} volume={1} /></Sequence>
      <Sequence from={S8}><Audio src={staticFile("audio/cta.mp3")} volume={1} /></Sequence>

      {/* Scenes */}
      <Sequence from={S1} durationInFrames={S1D}><SceneTitle /></Sequence>
      <Sequence from={S2} durationInFrames={S2D}><SceneAudit /></Sequence>
      <Sequence from={S3} durationInFrames={S3D}><SceneTiers /></Sequence>
      <Sequence from={S4} durationInFrames={S4D}><ScenePriceChart /></Sequence>
      <Sequence from={S5} durationInFrames={S5D}><SceneSimTrader /></Sequence>
      <Sequence from={S6} durationInFrames={S6D}><SceneCompetitive /></Sequence>
      <Sequence from={S7} durationInFrames={S7D}><SceneMetrics /></Sequence>
      <Sequence from={S8} durationInFrames={S8D}><SceneCTA /></Sequence>

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.12)", letterSpacing: 4 }}>
        CONFIDENTIAL — INVESTOR USE ONLY
      </div>
    </AbsoluteFill>
  );
};

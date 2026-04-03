import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ─── Brighter, bolder palette ───
const NEON_GREEN = "#00ff88";
const BRIGHT_GOLD = "#ffb700";
const ELECTRIC_BLUE = "#4da6ff";
const HOT_PINK = "#ff3d8e";
const VIVID_PURPLE = "#b44dff";
const BRIGHT_RED = "#ff4d4d";
const WHITE = "#ffffff";
const BG_DARK = "#050d18";

// ─── Primitives ───

const BigText: React.FC<{
  text: string; delay: number; fontSize?: number; color?: string; fontWeight?: number; letterSpacing?: number; glow?: boolean;
}> = ({ text, delay, fontSize = 48, color = WHITE, fontWeight = 900, letterSpacing = 0, glow = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [60, 0]);
  return (
    <div style={{
      transform: `translateY(${y}px)`, opacity, fontSize, fontWeight, color,
      fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.15, letterSpacing,
      textShadow: glow ? `0 0 40px ${color}80, 0 0 80px ${color}40` : undefined,
    }}>
      {text}
    </div>
  );
};

const GlowStat: React.FC<{ value: string; label: string; delay: number; color: string; size?: number }> = ({ value, label, delay, color, size = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 180 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: size, fontWeight: 900, color, textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30` }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const BrightCard: React.FC<{ icon: string; title: string; desc: string; delay: number; accent: string }> = ({ icon, title, desc, delay, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <div style={{
      padding: "24px 20px", borderRadius: 20, width: 260,
      background: `linear-gradient(145deg, ${accent}15, ${accent}08)`,
      border: `2px solid ${accent}50`,
      boxShadow: `0 0 30px ${accent}20, inset 0 0 20px ${accent}08`,
      transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      opacity: s, textAlign: "center",
    }}>
      <div style={{ fontSize: 52, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
};

// ─── Animated Background ───
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const orbs = [
    { x: 0.25, y: 0.2, color: NEON_GREEN, size: 500, speed: 0.008 },
    { x: 0.75, y: 0.7, color: ELECTRIC_BLUE, size: 450, speed: 0.01 },
    { x: 0.5, y: 0.5, color: VIVID_PURPLE, size: 600, speed: 0.006 },
  ];

  return (
    <>
      <AbsoluteFill style={{
        background: `linear-gradient(160deg, ${BG_DARK} 0%, #0a1628 40%, #081020 100%)`,
      }} />
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          left: orb.x * width + Math.sin(frame * orb.speed + i * 2) * 80,
          top: orb.y * height + Math.cos(frame * orb.speed + i * 1.5) * 60,
          width: orb.size, height: orb.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color}12 0%, transparent 70%)`,
          filter: "blur(40px)",
        }} />
      ))}
      {/* Subtle horizontal scan lines */}
      <AbsoluteFill style={{ opacity: 0.012 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", top: i * (height / 5), left: 0, right: 0, height: 1, background: NEON_GREEN }} />
        ))}
      </AbsoluteFill>
    </>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 1: HOOK (0–150)
// ═══════════════════════════════════════════════════
const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.05) * 0.015;
  const glowOp = interpolate(frame, [0, 30], [0, 0.6], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${NEON_GREEN}${Math.round(glowOp * 25).toString(16).padStart(2, '0')} 0%, transparent 70%)`, filter: "blur(50px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${pulse})`, padding: "0 40px" }}>
        <BigText text="YOUR POKÉMON CARDS" delay={5} fontSize={44} color={WHITE} glow />
        <BigText text="ARE WORTH MORE" delay={18} fontSize={44} color={NEON_GREEN} glow />
        <BigText text="THAN YOU THINK" delay={30} fontSize={44} color={BRIGHT_GOLD} glow />
        <Sequence from={55}>
          <BigText text="Track · Trade · Compete" delay={0} fontSize={22} color="rgba(255,255,255,0.5)" letterSpacing={5} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 2: MARKET PULSE INTRO (150–300)
// ═══════════════════════════════════════════════════
const Scene02MarketIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", padding: "0 40px" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>📊</div>
        <BigText text="LIVE MARKET PULSE" delay={5} fontSize={42} color={NEON_GREEN} glow />
        <BigText text="Real-time Pokémon card prices" delay={15} fontSize={20} color="rgba(255,255,255,0.5)" />
        <Sequence from={30}>
          <div style={{ marginTop: 40, display: "flex", gap: 30, justifyContent: "center" }}>
            <GlowStat value="500+" label="Cards" delay={32} color={NEON_GREEN} size={64} />
            <GlowStat value="3" label="Indexes" delay={40} color={ELECTRIC_BLUE} size={64} />
            <GlowStat value="24/7" label="Live Data" delay={48} color={BRIGHT_GOLD} size={64} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 3: MARKET TICKER (300–460)
// ═══════════════════════════════════════════════════
const Scene03Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tickers = [
    { name: "CHARIZARD VMAX", price: "$412", change: "+8.2%", up: true },
    { name: "UMBREON ALT", price: "$289", change: "+12.4%", up: true },
    { name: "PIKACHU VSTAR", price: "$89", change: "+5.2%", up: true },
    { name: "MEWTWO EX", price: "$156", change: "-3.1%", up: false },
    { name: "LUGIA V ALT", price: "$198", change: "+7.8%", up: true },
    { name: "RAYQUAZA ALT", price: "$245", change: "+6.3%", up: true },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ width: "88%", padding: "0 20px" }}>
        <BigText text="LIVE PRICE FEED" delay={3} fontSize={36} color={NEON_GREEN} glow />
        <div style={{ marginTop: 30 }}>
          {tickers.map((t, i) => {
            const s = spring({ frame: frame - 15 - i * 6, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)`,
                opacity: s,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 20px", marginBottom: 8,
                background: `linear-gradient(90deg, ${t.up ? NEON_GREEN : BRIGHT_RED}08, transparent)`,
                borderRadius: 14,
                borderLeft: `3px solid ${t.up ? NEON_GREEN : BRIGHT_RED}`,
              }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 700, color: WHITE }}>{t.name}</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: WHITE }}>{t.price}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 700, color: t.up ? NEON_GREEN : BRIGHT_RED }}>{t.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 4: MARKET INDEX CHARTS (460–630)
// ═══════════════════════════════════════════════════
const Scene04Charts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [145, 170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const indexes = [
    { name: "RAW 500", value: "+4.8%", color: NEON_GREEN, data: [40, 42, 38, 45, 50, 48, 55, 60, 58, 65, 68, 72] },
    { name: "GRADED 1000", value: "+7.2%", color: BRIGHT_GOLD, data: [30, 35, 33, 40, 38, 45, 50, 48, 55, 60, 62, 70] },
    { name: "SEALED 1000", value: "+3.1%", color: ELECTRIC_BLUE, data: [50, 48, 52, 55, 53, 58, 60, 57, 63, 65, 68, 66] },
  ];

  const chartW = 320;
  const chartH = 80;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%", padding: "0 20px" }}>
        <BigText text="📈 INDEX PERFORMANCE" delay={5} fontSize={36} color={WHITE} glow />
        <BigText text="NYSE trading hours · 1D / 5D / 1M" delay={15} fontSize={18} color="rgba(255,255,255,0.4)" />
        <div style={{ marginTop: 30 }}>
          {indexes.map((idx, i) => {
            const s = spring({ frame: frame - 25 - i * 12, fps, config: { damping: 14 } });
            const progress = interpolate(frame, [30 + i * 10, 90 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pts = idx.data.map((v, j) => `${(j / (idx.data.length - 1)) * chartW},${chartH - ((v - 25) / 55) * chartH}`);
            const visiblePts = pts.slice(0, Math.max(2, Math.floor(progress * pts.length)));

            return (
              <div key={i} style={{
                opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                padding: "18px 24px", marginBottom: 14,
                background: `linear-gradient(135deg, ${idx.color}10, transparent)`,
                borderRadius: 16, border: `1px solid ${idx.color}30`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: idx.color, letterSpacing: 2 }}>{idx.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 900, color: idx.color, textShadow: `0 0 20px ${idx.color}40` }}>{idx.value}</div>
                </div>
                <svg width={chartW} height={chartH}>
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={idx.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={idx.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {visiblePts.length > 1 && (
                    <>
                      <path d={`M${visiblePts.join("L")}L${chartW},${chartH}L0,${chartH}Z`} fill={`url(#grad-${i})`} />
                      <path d={`M${visiblePts.join("L")}`} fill="none" stroke={idx.color} strokeWidth={3} strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 5: PORTFOLIO TRACKER (630–790)
// ═══════════════════════════════════════════════════
const Scene05Portfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const totalValue = interpolate(frame, [20, 70], [0, 14850], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnl = interpolate(frame, [20, 70], [0, 2340], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", padding: "0 40px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>💼</div>
        <BigText text="PORTFOLIO TRACKER" delay={5} fontSize={38} color={WHITE} glow />
        <BigText text="Track every card you own" delay={15} fontSize={20} color="rgba(255,255,255,0.45)" />
        <Sequence from={20}>
          {(() => {
            const cardPop = spring({ frame: frame - 20, fps, config: { damping: 12 } });
            return (
              <div style={{
                marginTop: 36, padding: "32px 40px", borderRadius: 24,
                background: `linear-gradient(145deg, ${NEON_GREEN}10, ${ELECTRIC_BLUE}08)`,
                border: `2px solid ${NEON_GREEN}30`,
                boxShadow: `0 0 50px ${NEON_GREEN}15`,
                transform: `scale(${cardPop})`, opacity: cardPop,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: "rgba(255,255,255,0.35)", letterSpacing: 4, marginBottom: 8 }}>TOTAL VALUE</div>
                <div style={{ fontFamily: "monospace", fontSize: 72, fontWeight: 900, color: WHITE, textShadow: `0 0 30px ${NEON_GREEN}30` }}>${Math.floor(totalValue).toLocaleString()}</div>
                <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: NEON_GREEN, marginTop: 8, textShadow: `0 0 20px ${NEON_GREEN}40` }}>+${Math.floor(pnl).toLocaleString()} (+18.7%)</div>
              </div>
            );
          })()}
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 6: AI SIGNALS (790–940)
// ═══════════════════════════════════════════════════
const Scene06Signals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const signals = [
    { type: "🔥 BREAKOUT", card: "Charizard ex 223/197", strength: "STRONG", color: BRIGHT_RED },
    { type: "📈 MOMENTUM", card: "Umbreon VMAX Alt Art", strength: "STRONG", color: BRIGHT_GOLD },
    { type: "💎 UNDERVALUED", card: "Pikachu VSTAR TG29", strength: "MEDIUM", color: NEON_GREEN },
    { type: "🚀 SURGE", card: "Rayquaza VMAX Alt", strength: "STRONG", color: ELECTRIC_BLUE },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%", padding: "0 20px" }}>
        <BigText text="🤖 AI ALPHA SIGNALS" delay={5} fontSize={38} color={VIVID_PURPLE} glow />
        <BigText text="Spot breakouts before anyone" delay={15} fontSize={20} color="rgba(255,255,255,0.45)" />
        <div style={{ marginTop: 30 }}>
          {signals.map((sig, i) => {
            const s = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{
                transform: `scale(${s})`, opacity: s,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 22px", marginBottom: 10,
                background: `linear-gradient(135deg, ${sig.color}12, transparent)`,
                borderRadius: 14, border: `1px solid ${sig.color}35`,
                boxShadow: `0 0 20px ${sig.color}10`,
              }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: sig.color, letterSpacing: 2 }}>{sig.type}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 700, color: WHITE }}>{sig.card}</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: sig.color, background: `${sig.color}15`, padding: "5px 14px", borderRadius: 8, letterSpacing: 2 }}>{sig.strength}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 7: SIMTRADER INTRO (940–1100)
// ═══════════════════════════════════════════════════
const Scene07SimIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${NEON_GREEN}18 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${pulse})`, padding: "0 40px" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎮</div>
        <BigText text="SIMTRADER WORLD™" delay={5} fontSize={42} color={NEON_GREEN} glow />
        <BigText text="Paper trade with real prices" delay={18} fontSize={22} color="rgba(255,255,255,0.5)" />
        <Sequence from={40}>
          <BigText text="Zero risk. Real experience." delay={0} fontSize={20} color={BRIGHT_GOLD} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 8: SIMTRADER PORTFOLIO (1100–1280)
// ═══════════════════════════════════════════════════
const Scene08SimPortfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const balance = interpolate(frame, [20, 75], [10000, 12745], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pnlPct = ((balance - 10000) / 100).toFixed(1);

  const holdings = [
    { card: "Charizard VMAX", qty: 3, value: "$1,236", pnl: "+18%", color: NEON_GREEN },
    { card: "Umbreon Alt Art", qty: 2, value: "$579", pnl: "+12%", color: ELECTRIC_BLUE },
    { card: "Pikachu VSTAR", qty: 5, value: "$447", pnl: "+8%", color: BRIGHT_GOLD },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%", padding: "0 20px" }}>
        <BigText text="YOUR SIM PORTFOLIO" delay={3} fontSize={32} color={NEON_GREEN} glow />
        <Sequence from={15}>
          {(() => {
            const s = spring({ frame: frame - 15, fps, config: { damping: 14 } });
            return (
              <div style={{
                marginTop: 20, padding: "24px 32px", borderRadius: 20,
                background: `linear-gradient(145deg, ${NEON_GREEN}10, ${ELECTRIC_BLUE}06)`,
                border: `2px solid ${NEON_GREEN}30`, boxShadow: `0 0 40px ${NEON_GREEN}12`,
                transform: `scale(${s})`, opacity: s,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 3 }}>VIRTUAL BALANCE</div>
                <div style={{ fontFamily: "monospace", fontSize: 56, fontWeight: 900, color: WHITE, textShadow: `0 0 20px ${NEON_GREEN}30` }}>${Math.floor(balance).toLocaleString()}</div>
                <div style={{ fontFamily: "monospace", fontSize: 24, color: NEON_GREEN, textShadow: `0 0 15px ${NEON_GREEN}40` }}>+${Math.floor(balance - 10000).toLocaleString()} (+{pnlPct}%)</div>
              </div>
            );
          })()}
        </Sequence>
        <div style={{ marginTop: 20 }}>
          {holdings.map((h, i) => {
            const s = spring({ frame: frame - 60 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                opacity: s, transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 18px", marginBottom: 8,
                background: `linear-gradient(90deg, ${h.color}08, transparent)`,
                borderRadius: 12, borderLeft: `3px solid ${h.color}60`,
              }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 17, fontWeight: 600, color: WHITE }}>{h.card} ×{h.qty}</div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 17, color: WHITE }}>{h.value}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: h.color }}>{h.pnl}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 9: SIMTRADER BOTS (1280–1430)
// ═══════════════════════════════════════════════════
const Scene09Bots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bots = [
    { rank: "🥇", name: "Neural Nate", pnl: "+24.8%", trades: 142, color: BRIGHT_GOLD },
    { rank: "🥈", name: "Whale Wendy", pnl: "+18.4%", trades: 98, color: "rgba(200,200,200,0.8)" },
    { rank: "🥉", name: "Swing Sara", pnl: "+12.1%", trades: 65, color: "#cd7f32" },
    { rank: "#4", name: "You", pnl: "+27.4%", trades: 87, color: NEON_GREEN },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%", padding: "0 20px" }}>
        <BigText text="🤖 AI BOT LEADERBOARD" delay={3} fontSize={32} color={ELECTRIC_BLUE} glow />
        <BigText text="Compete against AI traders" delay={12} fontSize={18} color="rgba(255,255,255,0.4)" />
        <div style={{ marginTop: 28 }}>
          {bots.map((b, i) => {
            const s = spring({ frame: frame - 22 - i * 10, fps, config: { damping: 14 } });
            const isYou = b.name === "You";
            return (
              <div key={i} style={{
                opacity: s, transform: `scale(${s})`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 22px", marginBottom: 10,
                background: isYou ? `linear-gradient(135deg, ${NEON_GREEN}15, ${NEON_GREEN}06)` : "rgba(255,255,255,0.03)",
                borderRadius: 14,
                border: isYou ? `2px solid ${NEON_GREEN}50` : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isYou ? `0 0 30px ${NEON_GREEN}15` : undefined,
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{b.rank}</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 19, fontWeight: isYou ? 800 : 600, color: isYou ? NEON_GREEN : WHITE }}>{b.name}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: b.color }}>{b.pnl}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{b.trades} trades</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 10: ARENA INTRO (1430–1590)
// ═══════════════════════════════════════════════════
const Scene10ArenaIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.07) * 0.025;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${BRIGHT_GOLD}20 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ textAlign: "center", transform: `scale(${pulse})`, padding: "0 40px" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>⚡</div>
        <BigText text="POKE-PULSE ARENA™" delay={5} fontSize={40} color={BRIGHT_GOLD} glow />
        <BigText text="Bet PokéCoins on real prices" delay={18} fontSize={22} color="rgba(255,255,255,0.5)" />
        <Sequence from={40}>
          <BigText text="Win big. Have fun." delay={0} fontSize={22} color={HOT_PINK} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 11: ARENA ACTIVITIES (1590–1770)
// ═══════════════════════════════════════════════════
const Scene11ArenaActivities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const coinBalance = interpolate(frame, [25, 65], [0, 25000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const activities = [
    { icon: "🎲", label: "PRICE BETS", desc: "Charizard VMAX — BULL 🐂", result: "+1,950 PC", color: NEON_GREEN },
    { icon: "📦", label: "PACK OPENS", desc: "Champion Chest — ✨ Ultra Rare!", result: "+3,200 PC", color: BRIGHT_GOLD },
    { icon: "🏆", label: "TOURNAMENTS", desc: "Daily Showdown — Rank #3", result: "+5,000 PC", color: VIVID_PURPLE },
    { icon: "🎰", label: "DAILY BONUS", desc: "Login streak × 7 days", result: "+500 PC", color: ELECTRIC_BLUE },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%", padding: "0 20px" }}>
        <Sequence from={5}>
          {(() => {
            const s = spring({ frame: frame - 5, fps, config: { damping: 14 } });
            return (
              <div style={{
                padding: "20px 32px", borderRadius: 20,
                background: `linear-gradient(145deg, ${BRIGHT_GOLD}12, transparent)`,
                border: `2px solid ${BRIGHT_GOLD}30`, boxShadow: `0 0 40px ${BRIGHT_GOLD}15`,
                transform: `scale(${s})`, opacity: s,
                display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 24,
              }}>
                <span style={{ fontSize: 40 }}>🪙</span>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 3 }}>POKECOINS</div>
                  <div style={{ fontFamily: "monospace", fontSize: 44, fontWeight: 900, color: BRIGHT_GOLD, textShadow: `0 0 25px ${BRIGHT_GOLD}50` }}>{Math.floor(coinBalance).toLocaleString()}</div>
                </div>
              </div>
            );
          })()}
        </Sequence>
        {activities.map((a, i) => {
          const s = spring({ frame: frame - 40 - i * 10, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 18px", marginBottom: 8,
              background: `linear-gradient(90deg, ${a.color}10, transparent)`,
              borderRadius: 14, borderLeft: `3px solid ${a.color}50`,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: a.color, letterSpacing: 1 }}>{a.label}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 600, color: WHITE }}>{a.desc}</div>
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 800, color: a.color, textShadow: `0 0 10px ${a.color}30` }}>{a.result}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 12: ARENA LEADERBOARD (1770–1920)
// ═══════════════════════════════════════════════════
const Scene12ArenaLeaderboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const leaders = [
    { rank: "🥇", name: "DragonMaster", coins: "284K", color: BRIGHT_GOLD },
    { rank: "🥈", name: "PikaCollector", coins: "198K", color: "rgba(200,200,200,0.8)" },
    { rank: "🥉", name: "RareFinder", coins: "145K", color: "#cd7f32" },
    { rank: "#4", name: "CardShark88", coins: "112K", color: ELECTRIC_BLUE },
    { rank: "#5", name: "VMaxHunter", coins: "98K", color: VIVID_PURPLE },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "88%", padding: "0 20px" }}>
        <BigText text="🏆 ARENA LEADERBOARD" delay={3} fontSize={32} color={BRIGHT_GOLD} glow />
        <BigText text="Top PokéCoin earners" delay={12} fontSize={18} color="rgba(255,255,255,0.4)" />
        <div style={{ marginTop: 24 }}>
          {leaders.map((l, i) => {
            const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                opacity: s, transform: `scale(${s})`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 22px", marginBottom: 8,
                background: i === 0 ? `linear-gradient(135deg, ${BRIGHT_GOLD}12, transparent)` : "rgba(255,255,255,0.03)",
                borderRadius: 14,
                border: i === 0 ? `2px solid ${BRIGHT_GOLD}40` : "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{l.rank}</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 700, color: WHITE }}>{l.name}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: l.color, textShadow: `0 0 10px ${l.color}30` }}>🪙 {l.coins}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 13: PRO TOOLS (1920–2080)
// ═══════════════════════════════════════════════════
const Scene13ProTools: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [135, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "90%", padding: "0 20px" }}>
        <BigText text="⚡ PRO TOOLS" delay={5} fontSize={38} color={WHITE} glow />
        <div style={{ marginTop: 36, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <BrightCard icon="📊" title="Grading Arb" desc="Find undervalued grading opportunities" delay={18} accent={NEON_GREEN} />
          <BrightCard icon="🐋" title="Whale Reports" desc="See what big collectors buy" delay={28} accent={ELECTRIC_BLUE} />
          <BrightCard icon="🔔" title="Price Alerts" desc="Notified when cards hit targets" delay={38} accent={BRIGHT_RED} />
        </div>
        <Sequence from={55}>
          <div style={{ marginTop: 16, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <BrightCard icon="📈" title="Delta Track" desc="Price deviation monitoring" delay={57} accent={VIVID_PURPLE} />
            <BrightCard icon="📦" title="Sealed Track" desc="Booster box & ETB values" delay={67} accent={BRIGHT_GOLD} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 14: PRICING (2080–2260)
// ═══════════════════════════════════════════════════
const Scene14Pricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tiers = [
    { name: "FREE", price: "$0", color: "rgba(255,255,255,0.35)", features: ["Live ticker", "Top movers"] },
    { name: "ARENA", price: "$0.99", color: BRIGHT_GOLD, features: ["Price bets", "Pack opens"] },
    { name: "PRO", price: "$9/mo", color: NEON_GREEN, highlight: true, features: ["AI signals", "Full board"] },
    { name: "PREMIUM", price: "$39", color: VIVID_PURPLE, features: ["SimTrader™", "Whale data"] },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
      <div style={{ textAlign: "center", width: "92%", padding: "0 16px" }}>
        <BigText text="START AT $0.99" delay={5} fontSize={40} color={WHITE} glow />
        <BigText text="LESS THAN A COFFEE ☕" delay={15} fontSize={22} color={BRIGHT_GOLD} />
        <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center" }}>
          {tiers.map((t, i) => {
            const s = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 14 } });
            const hl = (t as any).highlight;
            return (
              <div key={i} style={{
                width: 200, padding: "24px 14px", borderRadius: 18,
                background: hl ? `linear-gradient(145deg, ${NEON_GREEN}12, ${NEON_GREEN}04)` : "rgba(255,255,255,0.03)",
                border: `2px solid ${hl ? NEON_GREEN : t.color}${hl ? "60" : "20"}`,
                boxShadow: hl ? `0 0 40px ${NEON_GREEN}15` : undefined,
                transform: `scale(${s}) ${hl ? "translateY(-8px)" : ""}`, opacity: s,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 14, color: t.color, letterSpacing: 3, marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 900, color: WHITE, marginBottom: 12, textShadow: hl ? `0 0 20px ${NEON_GREEN}30` : undefined }}>{t.price}</div>
                {t.features.map((f, fi) => (
                  <div key={fi} style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 5, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <span style={{ color: t.color, fontSize: 12 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SCENE 15: CTA (2260–2520) — Extended ending
// ═══════════════════════════════════════════════════
const Scene15CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const urlSpring = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.015;
  const glowPulse = 0.3 + Math.sin(frame * 0.05) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${NEON_GREEN}${Math.round(glowPulse * 30).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: "blur(70px)",
      }} />
      <div style={{ textAlign: "center", transform: `scale(${ctaSpring * pulse})`, position: "relative", padding: "0 40px" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 48, fontWeight: 900, color: WHITE, marginBottom: 8, textShadow: `0 0 30px rgba(255,255,255,0.15)` }}>SIGN UP FREE</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 48, fontWeight: 900, color: NEON_GREEN, marginBottom: 24, textShadow: `0 0 40px ${NEON_GREEN}40` }}>TODAY</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 22, color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>Arena access from just $0.99</div>
        <div style={{
          transform: `scale(${urlSpring})`,
          fontFamily: "monospace", fontSize: 26, color: NEON_GREEN,
          background: `linear-gradient(135deg, ${NEON_GREEN}12, ${NEON_GREEN}06)`,
          border: `2px solid ${NEON_GREEN}50`,
          boxShadow: `0 0 40px ${NEON_GREEN}20`,
          padding: "18px 50px", borderRadius: 16, letterSpacing: 2,
        }}>
          poke-pulse-ticker.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// MAIN COMPOSITION — 84 seconds = 2520 frames @ 30fps
// ═══════════════════════════════════════════════════
export const FeatureShowcase: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      {/* Scene 1: Hook */}
      <Sequence from={0} durationInFrames={150}><Scene01Hook /></Sequence>
      {/* Scene 2: Market Pulse Intro */}
      <Sequence from={150} durationInFrames={150}><Scene02MarketIntro /></Sequence>
      {/* Scene 3: Live Ticker */}
      <Sequence from={300} durationInFrames={160}><Scene03Ticker /></Sequence>
      {/* Scene 4: Index Charts */}
      <Sequence from={460} durationInFrames={170}><Scene04Charts /></Sequence>
      {/* Scene 5: Portfolio */}
      <Sequence from={630} durationInFrames={160}><Scene05Portfolio /></Sequence>
      {/* Scene 6: AI Signals */}
      <Sequence from={790} durationInFrames={150}><Scene06Signals /></Sequence>
      {/* Scene 7: SimTrader Intro */}
      <Sequence from={940} durationInFrames={160}><Scene07SimIntro /></Sequence>
      {/* Scene 8: SimTrader Portfolio */}
      <Sequence from={1100} durationInFrames={180}><Scene08SimPortfolio /></Sequence>
      {/* Scene 9: SimTrader Bots */}
      <Sequence from={1280} durationInFrames={150}><Scene09Bots /></Sequence>
      {/* Scene 10: Arena Intro */}
      <Sequence from={1430} durationInFrames={160}><Scene10ArenaIntro /></Sequence>
      {/* Scene 11: Arena Activities */}
      <Sequence from={1590} durationInFrames={180}><Scene11ArenaActivities /></Sequence>
      {/* Scene 12: Arena Leaderboard */}
      <Sequence from={1770} durationInFrames={150}><Scene12ArenaLeaderboard /></Sequence>
      {/* Scene 13: Pro Tools */}
      <Sequence from={1920} durationInFrames={160}><Scene13ProTools /></Sequence>
      {/* Scene 14: Pricing */}
      <Sequence from={2080} durationInFrames={180}><Scene14Pricing /></Sequence>
      {/* Scene 15: CTA */}
      <Sequence from={2260} durationInFrames={260}><Scene15CTA /></Sequence>

      {/* Branding watermark */}
      <div style={{
        position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center",
        fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.08)", letterSpacing: 3,
      }}>
        PGVA VENTURES, LLC
      </div>
    </AbsoluteFill>
  );
};

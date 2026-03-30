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
const BG_DARK = "#060a10";

const TextReveal: React.FC<{
  text: string;
  delay: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, delay, fontSize = 48, color = "white", fontWeight = 800 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [60, 0]);

  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, fontSize, fontWeight, color, fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.2 }}>
      {text}
    </div>
  );
};

const StatBlock: React.FC<{ value: string; label: string; delay: number; color?: string }> = ({ value, label, delay, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: 52, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginTop: 6 }}>{label}</div>
    </div>
  );
};

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Floating particles
  const particles = Array.from({ length: 25 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const y = baseY + Math.sin(frame * 0.04 + i) * 50;
    const size = 2 + (i % 4) * 1.5;
    const opacity = 0.1 + Math.sin(frame * 0.03 + i * 0.8) * 0.08;
    const colors = [ACCENT, "#3b82f6", GOLD, "#ef4444"];
    return { x, y, size, opacity, color: colors[i % 4] };
  });

  // Scene timing (30fps × 30s = 900 frames)
  // Scene 1: 0-120 — Title + Hook
  // Scene 2: 100-280 — Virtual Cash
  // Scene 3: 260-440 — Buy & Sell
  // Scene 4: 420-600 — Contests & Prizes
  // Scene 5: 580-750 — Leaderboard
  // Scene 6: 730-900 — CTA

  return (
    <AbsoluteFill>
      {/* Animated dark background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.015) * 15}, 55%, 7%) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(215, 50%, 5%) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(${260 + Math.sin(frame * 0.01) * 20}, 40%, 4%) 0%, transparent 60%),
            linear-gradient(180deg, ${BG_DARK} 0%, #0a1220 50%, ${BG_DARK} 100%)
          `,
        }}
      />

      {/* Grid lines */}
      <AbsoluteFill style={{ opacity: 0.04 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 12), left: 0, right: 0, height: 1, background: ACCENT }} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 8), top: 0, bottom: 0, width: 1, background: ACCENT }} />
        ))}
      </AbsoluteFill>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
      ))}

      {/* === SCENE 1: Title + Hook (0-120) === */}
      <Sequence from={0} durationInFrames={130}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <TextReveal text="SIM" delay={5} fontSize={120} color={ACCENT} fontWeight={900} />
            <TextReveal text="TRADER" delay={12} fontSize={100} color="white" fontWeight={900} />
            <Sequence from={25}>
              <TextReveal text="THE ULTIMATE POKÉMON" delay={0} fontSize={28} color="rgba(255,255,255,0.6)" fontWeight={600} />
            </Sequence>
            <Sequence from={35}>
              <TextReveal text="CARD TRADING GAME" delay={0} fontSize={28} color={GOLD} fontWeight={700} />
            </Sequence>
          </div>
          {/* Glow */}
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(0,210,106,0.15) 0%, transparent 70%)`,
            filter: "blur(60px)", opacity: interpolate(frame, [0, 30], [0, 0.8], { extrapolateRight: "clamp" }),
          }} />
        </AbsoluteFill>
        {/* Exit */}
        <AbsoluteFill style={{
          background: BG_DARK,
          opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }} />
      </Sequence>

      {/* === SCENE 2: Virtual Cash (120-280) === */}
      <Sequence from={120} durationInFrames={170}>
        {(() => {
          const localFrame = frame - 120;
          const enterOp = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const exitOp = interpolate(localFrame, [150, 170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          
          // Counting animation
          const countProgress = interpolate(localFrame, [20, 60], [0, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const displayValue = Math.floor(countProgress).toLocaleString();

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 32, color: "rgba(255,255,255,0.5)", letterSpacing: 4, marginBottom: 20 }}>
                  START WITH
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 110, fontWeight: 900, color: ACCENT, letterSpacing: -2 }}>
                  ${displayValue}
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
                  IN VIRTUAL CASH
                </div>
                <Sequence from={70}>
                  <TextReveal text="Build your dream portfolio" delay={0} fontSize={36} color={GOLD} fontWeight={600} />
                </Sequence>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* === SCENE 3: Buy & Sell (280-440) === */}
      <Sequence from={280} durationInFrames={170}>
        {(() => {
          const localFrame = frame - 280;
          const enterOp = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const exitOp = interpolate(localFrame, [150, 170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          const cards = [
            { name: "CHARIZARD VMAX", price: "$245.00", change: "+12.4%", up: true },
            { name: "PIKACHU VSTAR", price: "$89.50", change: "+5.2%", up: true },
            { name: "MEWTWO EX", price: "$156.00", change: "-3.1%", up: false },
          ];

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
              <div style={{ textAlign: "center", width: "85%" }}>
                <TextReveal text="REAL CARDS" delay={5} fontSize={56} color="white" />
                <TextReveal text="REAL PRICES" delay={12} fontSize={56} color={ACCENT} />
                
                <div style={{ marginTop: 60 }}>
                  {cards.map((card, i) => {
                    const cardSpring = spring({ frame: localFrame - 30 - i * 10, fps, config: { damping: 15 } });
                    const cardY = interpolate(cardSpring, [0, 1], [80, 0]);
                    return (
                      <div key={i} style={{
                        transform: `translateY(${cardY}px)`,
                        opacity: cardSpring,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "18px 24px", marginBottom: 12,
                        background: "rgba(255,255,255,0.05)", borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>{card.name}</div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 800, color: "white" }}>{card.price}</div>
                          <div style={{ fontFamily: "monospace", fontSize: 16, color: card.up ? ACCENT : "#ef4444" }}>{card.change}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* === SCENE 4: Contests & Prizes (440-610) === */}
      <Sequence from={440} durationInFrames={180}>
        {(() => {
          const localFrame = frame - 440;
          const enterOp = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const exitOp = interpolate(localFrame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 80, marginBottom: 20 }}>🏆</div>
                <TextReveal text="WEEKLY CONTESTS" delay={5} fontSize={52} color="white" />
                <TextReveal text="EXCLUSIVE PRIZES" delay={15} fontSize={48} color={GOLD} />
                
                <Sequence from={40}>
                  <div style={{ marginTop: 50, display: "flex", gap: 40, justifyContent: "center" }}>
                    <StatBlock value="1st" label="TOP TRADER" delay={45} color={GOLD} />
                    <StatBlock value="P&L" label="TRACKED LIVE" delay={55} color={ACCENT} />
                  </div>
                </Sequence>

                <Sequence from={80}>
                  <TextReveal text="Climb the leaderboard" delay={0} fontSize={30} color="rgba(255,255,255,0.6)" fontWeight={500} />
                </Sequence>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* === SCENE 5: No Risk (610-750) === */}
      <Sequence from={610} durationInFrames={150}>
        {(() => {
          const localFrame = frame - 610;
          const enterOp = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const exitOp = interpolate(localFrame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          const pulseScale = 1 + Math.sin(localFrame * 0.08) * 0.03;

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp * exitOp }}>
              <div style={{ textAlign: "center", transform: `scale(${pulseScale})` }}>
                <TextReveal text="NO RISK" delay={5} fontSize={90} color={ACCENT} fontWeight={900} />
                <TextReveal text="ALL SKILL" delay={18} fontSize={90} color="white" fontWeight={900} />
                
                <Sequence from={50}>
                  <div style={{ marginTop: 50, display: "flex", gap: 50, justifyContent: "center" }}>
                    <StatBlock value="500+" label="CARDS" delay={55} />
                    <StatBlock value="24/7" label="LIVE DATA" delay={65} />
                    <StatBlock value="FREE" label="TO PLAY" delay={75} color={GOLD} />
                  </div>
                </Sequence>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* === SCENE 6: CTA (750-900) === */}
      <Sequence from={750}>
        {(() => {
          const localFrame = frame - 750;
          const enterOp = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ctaSpring = spring({ frame: localFrame - 10, fps, config: { damping: 12, stiffness: 100 } });
          const urlSpring = spring({ frame: localFrame - 40, fps, config: { damping: 15 } });
          const glowPulse = 0.3 + Math.sin(localFrame * 0.06) * 0.15;

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
              {/* Big glow */}
              <div style={{
                position: "absolute", width: 500, height: 500, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`,
                filter: "blur(80px)",
              }} />
              <div style={{ textAlign: "center", transform: `scale(${ctaSpring})`, position: "relative" }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 52, fontWeight: 900, color: "white", marginBottom: 10 }}>
                  PLAY FREE
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: 52, fontWeight: 900, color: ACCENT, marginBottom: 40 }}>
                  NOW
                </div>
                <div style={{
                  transform: `scale(${urlSpring})`,
                  fontFamily: "monospace", fontSize: 24, color: ACCENT,
                  background: "rgba(0, 210, 106, 0.1)",
                  border: "2px solid rgba(0, 210, 106, 0.4)",
                  padding: "18px 50px", borderRadius: 16, letterSpacing: 1,
                }}>
                  poke-pulse-ticker.com
                </div>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* Branding watermark */}
      <div style={{
        position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center",
        fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 3,
      }}>
        PGVA VENTURES, LLC.
      </div>
    </AbsoluteFill>
  );
};

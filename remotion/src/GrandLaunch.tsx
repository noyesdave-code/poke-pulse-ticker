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
const CRIMSON = "#ef4444";
const CYAN = "#06b6d4";
const PURPLE = "#a855f7";
const BG = "#040810";

const Bold: React.FC<{ text: string; delay: number; size?: number; color?: string; weight?: number }> = ({
  text, delay, size = 64, color = "white", weight = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [80, 0]);
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  return (
    <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, fontSize: size, fontWeight: weight, color, fontFamily: "'Segoe UI', sans-serif", textAlign: "center", lineHeight: 1.15, textTransform: "uppercase", letterSpacing: size > 60 ? -2 : 1 }}>
      {text}
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string; delay: number; color?: string; size?: number }> = ({ value, label, delay, color = ACCENT, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: size, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", letterSpacing: 4, marginTop: 8 }}>{label}</div>
    </div>
  );
};

const Glow: React.FC<{ color: string; size?: number; x?: string; y?: string; opacity?: number }> = ({ color, size = 400, x = "50%", y = "50%", opacity = 0.2 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: "blur(60px)", opacity, pointerEvents: "none" }} />
);

const FadeOut: React.FC<{ start: number; dur: number; children: React.ReactNode }> = ({ start, dur, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const FadeIn: React.FC<{ dur?: number; children: React.ReactNode }> = ({ dur = 15, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// VO-synced scene timing (30fps)
// VO speech segments with silence gaps:
//   Seg1: 0–10.76s (0–323f)     → S1 Title + S2 Launch
//   Gap:  10.76–11.3s (323–339f) → transition
//   Seg2: 11.3–24.66s (339–740f) → S3 RAW + S4 Graded + S5 Sealed
//   Gap:  24.66–25.34s (740–760f) → transition
//   Seg3: 25.34–36.47s (760–1094f) → S6 Market Pulse + S7 Portfolio
//   Gap:  36.47–37.01s (1094–1111f) → transition
//   Seg4: 37.01–51.07s (1111–1532f) → S8 Alpha + S9 Delta + S10 SimTrader
//   Gap:  51.07–51.58s (1532–1547f) → transition
//   Seg5: 51.58–69.05s (1547–2072f) → S11 Arena + S12 Tiers + S13 Security + S14 24/7 + S15 Mobile
//   Gap:  69.05–69.6s (2072–2088f) → transition
//   Seg6: 69.6–72.88s (2088–2186f) → S16 Community
//   Gap:  72.88–73.43s (2186–2203f) → transition
//   Seg7: 73.43–76.5s (2203–2295f) → S17 Testimonials
//   Gap:  76.5–77.02s (2295–2311f) → transition
//   Seg8: 77.02–81s (2311–2430f) → S18 Mega Launch
//   Post-VO: 81–90s (2430–2700f) → S19 Recap + S20 CTA

export const GrandLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = (v: number, h: number) => isVertical ? v : h;

  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const y = baseY + Math.sin(frame * 0.035 + i) * 40;
    const size = 2 + (i % 5) * 1.5;
    const opacity = 0.08 + Math.sin(frame * 0.025 + i * 0.7) * 0.06;
    const colors = [ACCENT, CYAN, GOLD, PURPLE, CRIMSON];
    return { x, y, size, opacity, color: colors[i % 5] };
  });

  const bgHue = 200 + Math.sin(frame * 0.008) * 20;
  const rootScale = isVertical ? 1 : 1.15;

  return (
    <AbsoluteFill>
      {/* BG */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 30%, hsl(${bgHue}, 40%, 6%) 0%, transparent 50%), radial-gradient(ellipse at 60% 70%, hsl(${bgHue + 40}, 30%, 4%) 0%, transparent 50%), ${BG}` }} />
      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.03 }}>
        {Array.from({ length: 14 }, (_, i) => <div key={`h${i}`} style={{ position: "absolute", top: i * (height / 14), left: 0, right: 0, height: 1, background: ACCENT }} />)}
        {Array.from({ length: 8 }, (_, i) => <div key={`v${i}`} style={{ position: "absolute", left: i * (width / 8), top: 0, bottom: 0, width: 1, background: ACCENT }} />)}
      </AbsoluteFill>
      {/* Particles */}
      {particles.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: p.opacity }} />)}

      <AbsoluteFill style={{ transform: `scale(${rootScale})`, transformOrigin: "center center" }}>

      {/* ===== SEGMENT 1: 0-323f (0-10.76s) — Title + Launch ===== */}
      {/* S1: POKE PULSE TICKER (0-160) */}
      <Sequence from={0} durationInFrames={165}>
        <FadeIn><FadeOut start={140} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={500} opacity={0.25} />
            <div style={{ textAlign: "center" }}>
              <Bold text="POKE" delay={5} size={sz(130, 88)} color={ACCENT} />
              <Bold text="PULSE" delay={12} size={sz(110, 74)} color="white" />
              <Bold text="TICKER" delay={20} size={sz(90, 60)} color={GOLD} />
              <Sequence from={40}><Bold text="MARKET TERMINAL" delay={0} size={sz(28, 22)} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S2: OFFICIAL LAUNCH (160-323) */}
      <Sequence from={160} durationInFrames={168}>
        <FadeIn><FadeOut start={143} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={600} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>🚀</div>
              <Bold text="OFFICIAL" delay={5} size={sz(80, 56)} color="white" />
              <Bold text="MEGA LAUNCH" delay={15} size={sz(70, 48)} color={GOLD} />
              <Sequence from={35}><Bold text="THE WAIT IS OVER" delay={0} size={sz(30, 22)} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 2: 339-740f (11.3-24.66s) — Indices ===== */}
      {/* S3: RAW 500 (339-475) */}
      <Sequence from={339} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="RAW 500" delay={5} size={sz(90, 64)} color={ACCENT} />
              <Bold text="INDEX™" delay={15} size={sz(60, 44)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(40, 30), display: "flex", gap: sz(50, 40), justifyContent: "center" }}>
                  <Stat value="500" label="PREMIUM CARDS" delay={35} size={sz(56, 44)} />
                  <Stat value="LIVE" label="REAL-TIME DATA" delay={45} color={GOLD} size={sz(56, 44)} />
                </div>
              </Sequence>
              <Sequence from={60}><Bold text="ILLUSTRATION RARES • SPECIAL ARTS • HYPER RARES" delay={0} size={sz(18, 15)} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S4: GRADED 1000 (475-610) */}
      <Sequence from={475} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CYAN} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="GRADED" delay={5} size={sz(80, 56)} color={CYAN} />
              <Bold text="1000 INDEX™" delay={15} size={sz(60, 44)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(40, 30), display: "flex", gap: sz(50, 40), justifyContent: "center" }}>
                  <Stat value="PSA" label="GRADE 10" delay={35} color={CYAN} size={sz(56, 40)} />
                  <Stat value="CGC" label="PRISTINE" delay={45} color={CYAN} size={sz(56, 40)} />
                  <Stat value="BGS" label="BLACK LABEL" delay={55} color={GOLD} size={sz(56, 40)} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S5: SEALED 1000 (610-740) */}
      <Sequence from={610} durationInFrames={135}>
        <FadeIn><FadeOut start={110} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={PURPLE} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="SEALED" delay={5} size={sz(80, 56)} color={PURPLE} />
              <Bold text="1000 INDEX™" delay={15} size={sz(60, 44)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(40, 30), display: "flex", gap: sz(50, 40), justifyContent: "center" }}>
                  <Stat value="ETBs" label="BOOSTER BOXES" delay={35} color={PURPLE} size={sz(56, 40)} />
                  <Stat value="ALL" label="ERAS COVERED" delay={45} color={GOLD} size={sz(56, 40)} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 3: 760-1094f (25.34-36.47s) — Market + Portfolio ===== */}
      {/* S6: LIVE MARKET PULSE (760-930) */}
      <Sequence from={760} durationInFrames={175}>
        <FadeIn><FadeOut start={150} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(50, 38), marginBottom: 10 }}>📡</div>
              <Bold text="LIVE MARKET" delay={5} size={sz(70, 50)} color="white" />
              <Bold text="PULSE" delay={15} size={sz(80, 56)} color={ACCENT} />
              <Sequence from={35}><Bold text="REAL-TIME PRICE FEEDS • HOURLY UPDATES" delay={0} size={sz(20, 16)} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S7: PORTFOLIO TRACKER (930-1094) */}
      <Sequence from={930} durationInFrames={170}>
        <FadeIn><FadeOut start={145} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(50, 38), marginBottom: 10 }}>💼</div>
              <Bold text="PORTFOLIO" delay={5} size={sz(70, 50)} color={GOLD} />
              <Bold text="TRACKER" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(40, 30), display: "flex", gap: sz(50, 40), justifyContent: "center" }}>
                  <Stat value="P&L" label="LIVE TRACKING" delay={35} color={ACCENT} size={sz(56, 40)} />
                  <Stat value="CSV" label="EXPORT DATA" delay={45} color={GOLD} size={sz(56, 40)} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 4: 1111-1532f (37.01-51.07s) — AI + Delta + SimTrader ===== */}
      {/* S8: ALPHA SIGNALS AI (1111-1255) */}
      <Sequence from={1111} durationInFrames={148}>
        <FadeIn><FadeOut start={123} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CRIMSON} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(50, 38), marginBottom: 10 }}>🧠</div>
              <Bold text="ALPHA" delay={5} size={sz(80, 56)} color={CRIMSON} />
              <Bold text="SIGNALS™" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}><Bold text="AI-POWERED BUY / SELL / HOLD" delay={0} size={sz(24, 18)} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
              <Sequence from={50}><Bold text="MARKET INTELLIGENCE AT YOUR FINGERTIPS" delay={0} size={sz(18, 14)} color="rgba(255,255,255,0.35)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S9: DELTA ALERTS (1255-1395) */}
      <Sequence from={1255} durationInFrames={145}>
        <FadeIn><FadeOut start={120} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(50, 38), marginBottom: 10 }}>🔔</div>
              <Bold text="DELTA" delay={5} size={sz(80, 56)} color={GOLD} />
              <Bold text="ALERTS™" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}><Bold text="INSTANT PRICE DEVIATION NOTIFICATIONS" delay={0} size={sz(20, 16)} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S10: SIMTRADER WORLD (1395-1532) */}
      <Sequence from={1395} durationInFrames={142}>
        <FadeIn><FadeOut start={117} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={600} opacity={0.25} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(50, 38), marginBottom: 10 }}>🎮</div>
              <Bold text="SIMTRADER" delay={5} size={sz(80, 56)} color={ACCENT} />
              <Bold text="WORLD™" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(30, 24), display: "flex", gap: sz(40, 30), justifyContent: "center" }}>
                  <Stat value="$10K" label="VIRTUAL CASH" delay={35} size={sz(56, 40)} />
                  <Stat value="500+" label="LIVE CARDS" delay={45} color={GOLD} size={sz(56, 40)} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 5: 1547-2072f (51.58-69.05s) — Arena thru Mobile ===== */}
      {/* S11: ARENA (1547-1650) */}
      <Sequence from={1547} durationInFrames={108}>
        <FadeIn><FadeOut start={83} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>🏆</div>
              <Bold text="POKÉ-PULSE" delay={5} size={sz(60, 44)} color={GOLD} />
              <Bold text="ARENA™" delay={15} size={sz(80, 56)} color="white" />
              <Sequence from={30}><Bold text="TOURNAMENTS • PRIZES • LEADERBOARDS" delay={0} size={sz(20, 16)} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S12: 7 PRICING TIERS (1650-1760) */}
      <Sequence from={1650} durationInFrames={115}>
        <FadeIn><FadeOut start={90} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <Bold text="7 TIERS" delay={5} size={sz(90, 64)} color={ACCENT} />
              <Bold text="FOR EVERYONE" delay={15} size={sz(50, 36)} color="white" />
              <Sequence from={30}>
                {(() => {
                  const tiers = ["FREE $0", "ARENA $0.99", "STARTER $1.99", "PRO $4.99", "PREMIUM $9.99", "TEAM $19.99", "WHALE $49.99"];
                  return <div style={{ marginTop: sz(30, 20) }}>
                    {tiers.map((t, i) => {
                      const s2 = spring({ frame: frame - 1650 - 35 - i * 5, fps, config: { damping: 15 } });
                      return <div key={i} style={{ transform: `scale(${s2})`, fontFamily: "monospace", fontSize: sz(20, 16), fontWeight: 700, color: i === 3 ? GOLD : i === 6 ? ACCENT : "rgba(255,255,255,0.7)", marginBottom: sz(4, 2) }}>{t}/MO</div>;
                    })}
                  </div>;
                })()}
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S13: SECURITY (1760-1860) */}
      <Sequence from={1760} durationInFrames={105}>
        <FadeIn><FadeOut start={80} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CYAN} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>🛡️</div>
              <Bold text="ENTERPRISE" delay={5} size={sz(60, 44)} color={CYAN} />
              <Bold text="SECURITY" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}><Bold text="DRM • WATERMARKS • IP PROTECTION" delay={0} size={sz(18, 15)} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S14: 24/7 LIVE DATA (1860-1965) */}
      <Sequence from={1860} durationInFrames={110}>
        <FadeIn><FadeOut start={85} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <Bold text="24/7" delay={5} size={sz(120, 80)} color={ACCENT} />
              <Bold text="LIVE DATA" delay={15} size={sz(60, 44)} color="white" />
              <Sequence from={30}><Bold text="MARKET OPEN INDICATOR • INTRADAY CHARTS" delay={0} size={sz(18, 15)} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S15: MOBILE READY (1965-2072) */}
      <Sequence from={1965} durationInFrames={112}>
        <FadeIn><FadeOut start={87} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={PURPLE} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>📱</div>
              <Bold text="MOBILE" delay={5} size={sz(80, 56)} color={PURPLE} />
              <Bold text="READY" delay={15} size={sz(70, 50)} color="white" />
              <Sequence from={30}><Bold text="PWA • INSTALL ON ANY DEVICE" delay={0} size={sz(20, 16)} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 6: 2088-2186f (69.6-72.88s) ===== */}
      {/* S16: COMMUNITY (2088-2186) */}
      <Sequence from={2088} durationInFrames={103}>
        <FadeIn><FadeOut start={78} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>👥</div>
              <Bold text="GROWING" delay={5} size={sz(70, 50)} color={GOLD} />
              <Bold text="COMMUNITY" delay={15} size={sz(60, 44)} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: sz(30, 24), display: "flex", gap: sz(50, 40), justifyContent: "center" }}>
                  <Stat value="2.4K+" label="USERS" delay={35} color={GOLD} size={sz(56, 40)} />
                  <Stat value="4.8★" label="RATING" delay={45} color={ACCENT} size={sz(56, 40)} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 7: 2203-2295f (73.43-76.5s) ===== */}
      {/* S17: TESTIMONIALS (2203-2295) */}
      <Sequence from={2203} durationInFrames={97}>
        <FadeIn><FadeOut start={72} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.1} />
            <div style={{ textAlign: "center", maxWidth: "85%" }}>
              <Bold text="WHAT TRADERS SAY" delay={5} size={sz(40, 30)} color="rgba(255,255,255,0.5)" weight={600} />
              <Sequence from={20}>
                <div style={{ marginTop: sz(30, 20), padding: sz(24, 18) + "px " + sz(30, 24) + "px", background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: sz(22, 18), color: "rgba(255,255,255,0.8)", fontStyle: "italic", lineHeight: 1.5 }}>
                    "Finally a real-time Pokémon TCG market terminal. This changes everything."
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: sz(14, 12), color: ACCENT, marginTop: 12 }}>— @PokéCollector_Pro</div>
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== SEGMENT 8: 2311-2430f (77.02-81s) ===== */}
      {/* S18: MEGA LAUNCH SALE (2311-2430) */}
      <Sequence from={2311} durationInFrames={124}>
        <FadeIn><FadeOut start={99} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CRIMSON} size={600} opacity={0.25} />
            <Glow color={GOLD} size={400} y="60%" opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: sz(60, 44), marginBottom: 10 }}>🔥</div>
              <Bold text="MEGA" delay={5} size={sz(100, 68)} color={CRIMSON} />
              <Bold text="LAUNCH" delay={12} size={sz(90, 62)} color="white" />
              <Bold text="SALE" delay={20} size={sz(100, 68)} color={GOLD} />
              <Sequence from={40}><Bold text="STARTING AT $0.99/MONTH" delay={0} size={sz(28, 20)} color="rgba(255,255,255,0.6)" weight={700} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* ===== POST-VO: 2430-2700f (81-90s) — Recap + CTA ===== */}
      {/* S19: FEATURE RECAP (2430-2570) */}
      <Sequence from={2430} durationInFrames={145}>
        <FadeIn><FadeOut start={120} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Bold text="EVERYTHING" delay={5} size={sz(60, 44)} color="white" />
              <Bold text="YOU NEED" delay={12} size={sz(60, 44)} color={ACCENT} />
              <Sequence from={25}>
                {(() => {
                  const features = ["RAW 500 INDEX™", "GRADED 1000 INDEX™", "SEALED 1000 INDEX™", "ALPHA SIGNALS™", "DELTA ALERTS™", "SIMTRADER WORLD™", "POKÉ-PULSE ARENA™", "PORTFOLIO TRACKER", "CONSENSUS PRICING", "GRADING ARBITRAGE"];
                  return <div style={{ marginTop: sz(25, 16) }}>
                    {features.map((f, i) => {
                      const fs = spring({ frame: frame - 2430 - 30 - i * 7, fps, config: { damping: 18 } });
                      return <div key={i} style={{ transform: `translateX(${interpolate(fs, [0, 1], [-300, 0])}px)`, opacity: fs, fontFamily: "monospace", fontSize: sz(18, 14), fontWeight: 700, color: i % 2 === 0 ? ACCENT : "rgba(255,255,255,0.7)", marginBottom: sz(4, 2), letterSpacing: 2 }}>✓ {f}</div>;
                    })}
                  </div>;
                })()}
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S20: CTA (2570-2700) */}
      <Sequence from={2570}>
        {(() => {
          const lf = frame - 2570;
          const enterOp = interpolate(lf, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ctaS = spring({ frame: lf - 10, fps, config: { damping: 12, stiffness: 100 } });
          const urlS = spring({ frame: lf - 40, fps, config: { damping: 15 } });
          const glowPulse = 0.3 + Math.sin(lf * 0.06) * 0.15;
          const contactS = spring({ frame: lf - 80, fps, config: { damping: 15 } });

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
              <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(80px)" }} />
              <div style={{ textAlign: "center", transform: `scale(${ctaS})`, position: "relative" }}>
                <Bold text="JOIN NOW" delay={5} size={sz(80, 56)} color="white" />
                <Bold text="FREE FOREVER" delay={15} size={sz(60, 44)} color={ACCENT} />
                <div style={{ transform: `scale(${urlS})`, marginTop: sz(30, 20), fontFamily: "monospace", fontSize: sz(22, 18), color: ACCENT, background: "rgba(0,210,106,0.1)", border: "2px solid rgba(0,210,106,0.4)", padding: sz(16, 12) + "px " + sz(40, 30) + "px", borderRadius: 16, letterSpacing: 1 }}>
                  poke-pulse-ticker.lovable.app
                </div>
                <div style={{ transform: `scale(${contactS})`, marginTop: sz(20, 14), fontFamily: "monospace", fontSize: sz(14, 12), color: "rgba(255,255,255,0.4)" }}>
                  contact@poke-pulse-ticker.com
                </div>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      </AbsoluteFill>

      {/* Branding */}
      <div style={{ position: "absolute", bottom: 25, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 3 }}>
        © 2026 PGVA VENTURES, LLC · ALL RIGHTS RESERVED
      </div>
    </AbsoluteFill>
  );
};

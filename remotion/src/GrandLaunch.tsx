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

const Stat: React.FC<{ value: string; label: string; delay: number; color?: string }> = ({ value, label, delay, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: 56, fontWeight: 900, color }}>{value}</div>
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

// 90s × 30fps = 2700 frames, 20 scenes (~135 frames each avg)
// S1: 0-135 Title blast
// S2: 135-270 "OFFICIAL LAUNCH"
// S3: 270-400 RAW 500 INDEX
// S4: 400-530 GRADED 1000 INDEX
// S5: 530-660 SEALED 1000 INDEX
// S6: 660-790 Live Market Pulse
// S7: 790-920 Portfolio Tracker
// S8: 920-1050 Alpha Signals AI
// S9: 1050-1170 Delta Alerts
// S10: 1170-1290 SimTrader World
// S11: 1290-1410 Arena
// S12: 1410-1520 7 Pricing Tiers
// S13: 1520-1630 Security Shield
// S14: 1630-1740 24/7 Live Data
// S15: 1740-1850 Mobile Ready
// S16: 1850-1960 Community Growth
// S17: 1960-2080 Testimonials
// S18: 2080-2200 Mega Launch Sale
// S19: 2200-2400 Feature Recap
// S20: 2400-2700 CTA

export const GrandLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

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

      {/* S1: POKE PULSE TICKER (0-135) */}
      <Sequence from={0} durationInFrames={145}>
        <FadeIn><FadeOut start={120} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={500} opacity={0.25} />
            <div style={{ textAlign: "center" }}>
              <Bold text="POKE" delay={5} size={130} color={ACCENT} />
              <Bold text="PULSE" delay={12} size={110} color="white" />
              <Bold text="TICKER" delay={20} size={90} color={GOLD} />
              <Sequence from={40}><Bold text="MARKET TERMINAL" delay={0} size={28} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S2: OFFICIAL LAUNCH (135-270) */}
      <Sequence from={135} durationInFrames={145}>
        <FadeIn><FadeOut start={120} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={600} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>🚀</div>
              <Bold text="OFFICIAL" delay={5} size={80} color="white" />
              <Bold text="MEGA LAUNCH" delay={15} size={70} color={GOLD} />
              <Sequence from={35}><Bold text="THE WAIT IS OVER" delay={0} size={30} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S3: RAW 500 (270-400) */}
      <Sequence from={270} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="RAW 500" delay={5} size={90} color={ACCENT} />
              <Bold text="INDEX™" delay={15} size={60} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center" }}>
                  <Stat value="500" label="PREMIUM CARDS" delay={35} />
                  <Stat value="LIVE" label="REAL-TIME DATA" delay={45} color={GOLD} />
                </div>
              </Sequence>
              <Sequence from={60}><Bold text="ILLUSTRATION RARES • SPECIAL ARTS • HYPER RARES" delay={0} size={18} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S4: GRADED 1000 (400-530) */}
      <Sequence from={400} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CYAN} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="GRADED" delay={5} size={80} color={CYAN} />
              <Bold text="1000 INDEX™" delay={15} size={60} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center" }}>
                  <Stat value="PSA" label="GRADE 10" delay={35} color={CYAN} />
                  <Stat value="CGC" label="PRISTINE" delay={45} color={CYAN} />
                  <Stat value="BGS" label="BLACK LABEL" delay={55} color={GOLD} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S5: SEALED 1000 (530-660) */}
      <Sequence from={530} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={PURPLE} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <Bold text="SEALED" delay={5} size={80} color={PURPLE} />
              <Bold text="1000 INDEX™" delay={15} size={60} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center" }}>
                  <Stat value="ETBs" label="BOOSTER BOXES" delay={35} color={PURPLE} />
                  <Stat value="ALL" label="ERAS COVERED" delay={45} color={GOLD} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S6: LIVE MARKET PULSE (660-790) */}
      <Sequence from={660} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>📡</div>
              <Bold text="LIVE MARKET" delay={5} size={70} color="white" />
              <Bold text="PULSE" delay={15} size={80} color={ACCENT} />
              <Sequence from={35}><Bold text="REAL-TIME PRICE FEEDS • HOURLY UPDATES" delay={0} size={20} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S7: PORTFOLIO TRACKER (790-920) */}
      <Sequence from={790} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>💼</div>
              <Bold text="PORTFOLIO" delay={5} size={70} color={GOLD} />
              <Bold text="TRACKER" delay={15} size={70} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 40, display: "flex", gap: 50, justifyContent: "center" }}>
                  <Stat value="P&L" label="LIVE TRACKING" delay={35} color={ACCENT} />
                  <Stat value="CSV" label="EXPORT DATA" delay={45} color={GOLD} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S8: ALPHA SIGNALS AI (920-1050) */}
      <Sequence from={920} durationInFrames={140}>
        <FadeIn><FadeOut start={115} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CRIMSON} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🧠</div>
              <Bold text="ALPHA" delay={5} size={80} color={CRIMSON} />
              <Bold text="SIGNALS™" delay={15} size={70} color="white" />
              <Sequence from={30}><Bold text="AI-POWERED BUY / SELL / HOLD" delay={0} size={24} color="rgba(255,255,255,0.5)" weight={600} /></Sequence>
              <Sequence from={50}><Bold text="MARKET INTELLIGENCE AT YOUR FINGERTIPS" delay={0} size={18} color="rgba(255,255,255,0.35)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S9: DELTA ALERTS (1050-1170) */}
      <Sequence from={1050} durationInFrames={130}>
        <FadeIn><FadeOut start={105} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🔔</div>
              <Bold text="DELTA" delay={5} size={80} color={GOLD} />
              <Bold text="ALERTS™" delay={15} size={70} color="white" />
              <Sequence from={30}><Bold text="INSTANT PRICE DEVIATION NOTIFICATIONS" delay={0} size={20} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S10: SIMTRADER WORLD (1170-1290) */}
      <Sequence from={1170} durationInFrames={130}>
        <FadeIn><FadeOut start={105} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={600} opacity={0.25} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🎮</div>
              <Bold text="SIMTRADER" delay={5} size={80} color={ACCENT} />
              <Bold text="WORLD™" delay={15} size={70} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 30, display: "flex", gap: 40, justifyContent: "center" }}>
                  <Stat value="$10K" label="VIRTUAL CASH" delay={35} />
                  <Stat value="500+" label="LIVE CARDS" delay={45} color={GOLD} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S11: ARENA (1290-1410) */}
      <Sequence from={1290} durationInFrames={130}>
        <FadeIn><FadeOut start={105} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={500} opacity={0.2} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>🏆</div>
              <Bold text="POKÉ-PULSE" delay={5} size={60} color={GOLD} />
              <Bold text="ARENA™" delay={15} size={80} color="white" />
              <Sequence from={30}><Bold text="TOURNAMENTS • PRIZES • LEADERBOARDS" delay={0} size={20} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S12: 7 PRICING TIERS (1410-1520) */}
      <Sequence from={1410} durationInFrames={120}>
        <FadeIn><FadeOut start={95} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <Bold text="7 TIERS" delay={5} size={90} color={ACCENT} />
              <Bold text="FOR EVERYONE" delay={15} size={50} color="white" />
              <Sequence from={30}>
                {(() => {
                  const tiers = ["FREE $0", "ARENA $0.99", "STARTER $1.99", "PRO $4.99", "PREMIUM $9.99", "TEAM $19.99", "WHALE $49.99"];
                  return <div style={{ marginTop: 30 }}>
                    {tiers.map((t, i) => {
                      const s2 = spring({ frame: frame - 1410 - 35 - i * 6, fps, config: { damping: 15 } });
                      return <div key={i} style={{ transform: `scale(${s2})`, fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: i === 3 ? GOLD : i === 6 ? ACCENT : "rgba(255,255,255,0.7)", marginBottom: 4 }}>{t}/MO</div>;
                    })}
                  </div>;
                })()}
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S13: SECURITY (1520-1630) */}
      <Sequence from={1520} durationInFrames={120}>
        <FadeIn><FadeOut start={95} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CYAN} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>🛡️</div>
              <Bold text="ENTERPRISE" delay={5} size={60} color={CYAN} />
              <Bold text="SECURITY" delay={15} size={70} color="white" />
              <Sequence from={30}><Bold text="DRM • WATERMARKS • IP PROTECTION" delay={0} size={18} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
              <Sequence from={45}><Bold text="PGVA VENTURES, LLC" delay={0} size={16} color="rgba(255,255,255,0.3)" weight={600} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S14: 24/7 LIVE DATA (1630-1740) */}
      <Sequence from={1630} durationInFrames={120}>
        <FadeIn><FadeOut start={95} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <Bold text="24/7" delay={5} size={120} color={ACCENT} />
              <Bold text="LIVE DATA" delay={15} size={60} color="white" />
              <Sequence from={30}><Bold text="MARKET OPEN INDICATOR • INTRADAY CHARTS" delay={0} size={18} color="rgba(255,255,255,0.4)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S15: MOBILE READY (1740-1850) */}
      <Sequence from={1740} durationInFrames={120}>
        <FadeIn><FadeOut start={95} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={PURPLE} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>📱</div>
              <Bold text="MOBILE" delay={5} size={80} color={PURPLE} />
              <Bold text="READY" delay={15} size={70} color="white" />
              <Sequence from={30}><Bold text="PWA • INSTALL ON ANY DEVICE" delay={0} size={20} color="rgba(255,255,255,0.45)" weight={500} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S16: COMMUNITY (1850-1960) */}
      <Sequence from={1850} durationInFrames={120}>
        <FadeIn><FadeOut start={95} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={GOLD} size={400} opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>👥</div>
              <Bold text="GROWING" delay={5} size={70} color={GOLD} />
              <Bold text="COMMUNITY" delay={15} size={60} color="white" />
              <Sequence from={30}>
                <div style={{ marginTop: 30, display: "flex", gap: 50, justifyContent: "center" }}>
                  <Stat value="2.4K+" label="USERS" delay={35} color={GOLD} />
                  <Stat value="4.8★" label="RATING" delay={45} color={ACCENT} />
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S17: TESTIMONIALS (1960-2080) */}
      <Sequence from={1960} durationInFrames={130}>
        <FadeIn><FadeOut start={105} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={400} opacity={0.1} />
            <div style={{ textAlign: "center", maxWidth: "85%" }}>
              <Bold text="WHAT TRADERS SAY" delay={5} size={40} color="rgba(255,255,255,0.5)" weight={600} />
              <Sequence from={20}>
                <div style={{ marginTop: 30, padding: "24px 30px", background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 22, color: "rgba(255,255,255,0.8)", fontStyle: "italic", lineHeight: 1.5 }}>
                    "Finally a real-time Pokémon TCG market terminal. This changes everything for serious collectors."
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: ACCENT, marginTop: 12 }}>— @PokéCollector_Pro</div>
                </div>
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S18: MEGA LAUNCH SALE (2080-2200) */}
      <Sequence from={2080} durationInFrames={130}>
        <FadeIn><FadeOut start={105} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={CRIMSON} size={600} opacity={0.25} />
            <Glow color={GOLD} size={400} y="60%" opacity={0.15} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>🔥</div>
              <Bold text="MEGA" delay={5} size={100} color={CRIMSON} />
              <Bold text="LAUNCH" delay={12} size={90} color="white" />
              <Bold text="SALE" delay={20} size={100} color={GOLD} />
              <Sequence from={40}><Bold text="STARTING AT $0.99/MONTH" delay={0} size={28} color="rgba(255,255,255,0.6)" weight={700} /></Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S19: FEATURE RECAP (2200-2400) */}
      <Sequence from={2200} durationInFrames={210}>
        <FadeIn><FadeOut start={185} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Bold text="EVERYTHING" delay={5} size={60} color="white" />
              <Bold text="YOU NEED" delay={12} size={60} color={ACCENT} />
              <Sequence from={25}>
                {(() => {
                  const features = ["RAW 500 INDEX™", "GRADED 1000 INDEX™", "SEALED 1000 INDEX™", "ALPHA SIGNALS™", "DELTA ALERTS™", "SIMTRADER WORLD™", "POKÉ-PULSE ARENA™", "PORTFOLIO TRACKER", "CONSENSUS PRICING", "GRADING ARBITRAGE"];
                  return <div style={{ marginTop: 25 }}>
                    {features.map((f, i) => {
                      const fs = spring({ frame: frame - 2200 - 30 - i * 8, fps, config: { damping: 18 } });
                      return <div key={i} style={{ transform: `translateX(${interpolate(fs, [0, 1], [-300, 0])}px)`, opacity: fs, fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: i % 2 === 0 ? ACCENT : "rgba(255,255,255,0.7)", marginBottom: 4, letterSpacing: 2 }}>✓ {f}</div>;
                    })}
                  </div>;
                })()}
              </Sequence>
            </div>
          </AbsoluteFill>
        </FadeOut></FadeIn>
      </Sequence>

      {/* S20: CTA (2400-2700) */}
      <Sequence from={2400}>
        {(() => {
          const lf = frame - 2400;
          const enterOp = interpolate(lf, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ctaS = spring({ frame: lf - 10, fps, config: { damping: 12, stiffness: 100 } });
          const urlS = spring({ frame: lf - 40, fps, config: { damping: 15 } });
          const glowPulse = 0.3 + Math.sin(lf * 0.06) * 0.15;
          const contactS = spring({ frame: lf - 80, fps, config: { damping: 15 } });

          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterOp }}>
              <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,210,106,${glowPulse}) 0%, transparent 70%)`, filter: "blur(80px)" }} />
              <div style={{ textAlign: "center", transform: `scale(${ctaS})`, position: "relative" }}>
                <Bold text="JOIN NOW" delay={5} size={80} color="white" />
                <Bold text="FREE FOREVER" delay={15} size={60} color={ACCENT} />
                <div style={{ transform: `scale(${urlS})`, marginTop: 30, fontFamily: "monospace", fontSize: 22, color: ACCENT, background: "rgba(0,210,106,0.1)", border: "2px solid rgba(0,210,106,0.4)", padding: "16px 40px", borderRadius: 16, letterSpacing: 1 }}>
                  poke-pulse-ticker.lovable.app
                </div>
                <div style={{ transform: `scale(${contactS})`, marginTop: 20, fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                  contact@poke-pulse-ticker.com
                </div>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* Branding */}
      <div style={{ position: "absolute", bottom: 25, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 3 }}>
        © 2026 PGVA VENTURES, LLC · ALL RIGHTS RESERVED
      </div>
    </AbsoluteFill>
  );
};

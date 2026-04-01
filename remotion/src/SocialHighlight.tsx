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
const PINK = "#ec4899";
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
    <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, fontSize: size, fontWeight: weight, color, fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif", textAlign: "center", lineHeight: 1.15, textTransform: "uppercase", letterSpacing: size > 60 ? -2 : 1 }}>
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
      <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: size, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
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

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; delay: number; color: string; index: number }> = ({ title, desc, icon, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 160 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      transform: `translateY(${y}px)`, opacity,
      background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`,
      borderRadius: 16, padding: "24px 28px", display: "flex", gap: 16, alignItems: "center",
    }}>
      <div style={{ fontSize: 40 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color }}>{title}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  );
};

const PulsingDot: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7;
  return (
    <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 20px ${color}`, opacity: pulse }} />
  );
};

// VO-synced scene timing for SocialHighlight (2min = 3600 frames)
// VO covers 0-81s (0-2430f), then extended scenes fill 81-120s (2430-3600f)
// VO silence gaps at: 10.76s, 24.66s, 36.47s, 51.07s, 69.05s, 72.88s, 76.5s
//
// Seg1: 0-323f → S1 Hook + S2 Brand
// Seg2: 339-740f → S3 Pricing + S4 RAW Index + S5 Graded/Sealed
// Seg3: 760-1094f → S6 Portfolio + S7 SimTrader
// Seg4: 1111-1532f → S8 Arena + S9 AI Signals + S10 Delta
// Seg5: 1547-2072f → S11 Grading Arb + S12 Security + S13 Tiers + S14 Community
// Seg6: 2088-2186f → S15 Feature Recap
// Seg7: 2203-2295f → S16 Social Proof
// Seg8: 2311-2430f → S17 PGVA Ventures
// Post-VO: 2430-3600f → S18 Free Trial CTA + S19 Final CTA + S20 End Card

export const SocialHighlight: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const sz = (v: number, h: number) => isVertical ? v : h;
  const rootScale = isVertical ? 1 : 1.15;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ transform: `scale(${rootScale})`, transformOrigin: "center center" }}>

      {/* ===== SEGMENT 1: 0-323f — Hook + Brand ===== */}
      {/* S1: 0-165 — HOOK */}
      <Sequence from={0} durationInFrames={170}>
        <FadeOut start={145} dur={25}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={600} opacity={0.15} />
            <Glow color={CYAN} size={400} x="30%" y="30%" opacity={0.1} />
            <Glow color={PURPLE} size={350} x="70%" y="70%" opacity={0.08} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}>
              <Bold text="YOUR CARDS" delay={10} size={sz(52, 72)} color="white" />
              <Bold text="ARE MOVING" delay={20} size={sz(52, 72)} color="white" />
              <Bold text="RIGHT NOW" delay={30} size={sz(58, 80)} color={ACCENT} />
              <div style={{ height: 30 }} />
              <Bold text="Are You Tracking Them?" delay={55} size={sz(24, 32)} color="rgba(255,255,255,0.6)" weight={500} />
            </div>
          </AbsoluteFill>
        </FadeOut>
      </Sequence>

      {/* S2: 165-323 — BRAND REVEAL */}
      <Sequence from={165} durationInFrames={163}>
        <FadeIn dur={15}>
          <FadeOut start={138} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={500} opacity={0.12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 2 }}>
                <Bold text="Poke-Pulse-" delay={5} size={sz(48, 64)} color="white" />
                <Bold text="Market Terminal" delay={15} size={sz(38, 52)} color={ACCENT} />
                <div style={{ height: 20 }} />
                <Bold text="by PGVA Ventures, LLC" delay={35} size={sz(16, 20)} color="rgba(255,255,255,0.4)" weight={400} />
                <div style={{ height: 30 }} />
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <PulsingDot color={ACCENT} />
                  <Bold text="LIVE NOW" delay={50} size={sz(18, 22)} color={ACCENT} weight={700} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 2: 339-740f — Market Data ===== */}
      {/* S3: 339-475 — REAL-TIME PRICING */}
      <Sequence from={339} durationInFrames={140}>
        <FadeIn dur={12}>
          <FadeOut start={115} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: sz(40, 80) }}>
              <Glow color={CYAN} size={500} opacity={0.12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 2 }}>
                <Bold text="💰 Live Market Data" delay={5} size={sz(36, 48)} color={CYAN} />
                <div style={{ display: "flex", gap: sz(30, 50), marginTop: 20 }}>
                  <Stat value="500+" label="Cards Tracked" delay={20} color={CYAN} size={sz(44, 56)} />
                  <Stat value="1HR" label="Update Cycle" delay={30} color={ACCENT} size={sz(44, 56)} />
                </div>
                <div style={{ display: "flex", gap: sz(30, 50), marginTop: 10 }}>
                  <Stat value="3" label="Market Indices" delay={40} color={GOLD} size={sz(44, 56)} />
                  <Stat value="24/7" label="Coverage" delay={50} color={CRIMSON} size={sz(44, 56)} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S4: 475-610 — RAW INDEX */}
      <Sequence from={475} durationInFrames={140}>
        <FadeIn dur={12}>
          <FadeOut start={115} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={500} opacity={0.15} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 2 }}>
                <Bold text="📊 RAW 500 INDEX" delay={5} size={sz(36, 48)} color={ACCENT} />
                <Stat value="$42,847" label="Total Market Value" delay={20} color={ACCENT} size={sz(60, 80)} />
                <Bold text="+12.3% This Month" delay={45} size={sz(22, 28)} color={ACCENT} weight={600} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S5: 610-740 — GRADED + SEALED */}
      <Sequence from={610} durationInFrames={135}>
        <FadeIn dur={12}>
          <FadeOut start={110} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={GOLD} size={500} opacity={0.12} />
              <Glow color={PURPLE} size={400} x="30%" y="60%" opacity={0.08} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 2 }}>
                <Bold text="🏆 Graded & Sealed" delay={5} size={sz(34, 44)} color={GOLD} />
                <div style={{ display: "flex", gap: sz(30, 60) }}>
                  <Stat value="$128K" label="Graded 1000" delay={20} color={GOLD} />
                  <Stat value="$67K" label="Sealed 1000" delay={30} color={PURPLE} />
                </div>
                <Bold text="Professional-Grade Market Intelligence" delay={50} size={sz(16, 20)} color="rgba(255,255,255,0.5)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 3: 760-1094f — Portfolio + SimTrader ===== */}
      {/* S6: 760-930 — PORTFOLIO TRACKING */}
      <Sequence from={760} durationInFrames={175}>
        <FadeIn dur={12}>
          <FadeOut start={150} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: sz(40, 60) }}>
              <Glow color={CYAN} size={450} opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 2, width: "100%" }}>
                <Bold text="📁 Portfolio Tracker" delay={5} size={sz(36, 48)} color={CYAN} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "80%", maxWidth: 500, marginTop: 16 }}>
                  <FeatureCard title="Track Every Card" desc="Real-time value of your entire collection" icon="📈" delay={20} color={CYAN} index={0} />
                  <FeatureCard title="P&L Analysis" desc="FIFO-based gain/loss calculations" icon="💹" delay={30} color={ACCENT} index={1} />
                  <FeatureCard title="Export Reports" desc="CSV, PDF, and shareable links" icon="📊" delay={40} color={GOLD} index={2} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S7: 930-1094 — SIMTRADER WORLD */}
      <Sequence from={930} durationInFrames={170}>
        <FadeIn dur={12}>
          <FadeOut start={145} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={600} opacity={0.15} />
              <Glow color={GOLD} size={400} x="70%" y="30%" opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="🎮 SimTrader World™" delay={5} size={sz(38, 52)} color={ACCENT} />
                <Bold text="Virtual Trading Game" delay={18} size={sz(24, 32)} color="white" weight={600} />
                <div style={{ height: 16 }} />
                <Stat value="$100K" label="Starting Balance" delay={30} color={ACCENT} size={sz(48, 64)} />
                <div style={{ display: "flex", gap: sz(20, 40), marginTop: 16 }}>
                  <Stat value="0" label="Real Risk" delay={45} color={GOLD} size={sz(36, 44)} />
                  <Stat value="∞" label="Learning" delay={50} color={CYAN} size={sz(36, 44)} />
                </div>
                <Bold text="Trade like a pro. No risk." delay={65} size={sz(18, 22)} color="rgba(255,255,255,0.5)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 4: 1111-1532f — Arena + AI + Delta ===== */}
      {/* S8: 1111-1255 — ARENA */}
      <Sequence from={1111} durationInFrames={148}>
        <FadeIn dur={12}>
          <FadeOut start={123} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={CRIMSON} size={500} opacity={0.15} />
              <Glow color={PURPLE} size={400} x="30%" y="70%" opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="⚔️ Poké-Pulse Arena™" delay={5} size={sz(36, 48)} color={CRIMSON} />
                <Bold text="Competitive Market Betting" delay={18} size={sz(22, 28)} color="white" weight={600} />
                <div style={{ height: 12 }} />
                <div style={{ display: "flex", gap: sz(20, 40) }}>
                  <Stat value="1v1" label="Prediction Duels" delay={30} color={CRIMSON} />
                  <Stat value="🏆" label="Tournaments" delay={40} color={GOLD} />
                </div>
                <Bold text="Bet on card prices. Win PokéCoins." delay={55} size={sz(16, 20)} color="rgba(255,255,255,0.5)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S9: 1255-1395 — AI SIGNALS */}
      <Sequence from={1255} durationInFrames={145}>
        <FadeIn dur={12}>
          <FadeOut start={120} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: sz(40, 60) }}>
              <Glow color={PURPLE} size={500} opacity={0.15} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2, width: "100%" }}>
                <Bold text="🧠 AI-Powered Signals" delay={5} size={sz(36, 48)} color={PURPLE} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "80%", maxWidth: 500, marginTop: 16 }}>
                  <FeatureCard title="Breakout Detection" desc="Catch spikes before they trend" icon="🚀" delay={20} color={PURPLE} index={0} />
                  <FeatureCard title="Whale Alerts" desc="Track big money movements" icon="🐋" delay={30} color={CYAN} index={1} />
                  <FeatureCard title="Grading Arbitrage" desc="Find PSA vs raw profit gaps" icon="💎" delay={40} color={GOLD} index={2} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S10: 1395-1532 — DELTA ALERTS */}
      <Sequence from={1395} durationInFrames={142}>
        <FadeIn dur={12}>
          <FadeOut start={117} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={GOLD} size={500} opacity={0.12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 2 }}>
                <Bold text="🔔 Delta Alerts" delay={5} size={sz(36, 48)} color={GOLD} />
                <Bold text="Price Movement Notifications" delay={18} size={sz(20, 26)} color="white" weight={600} />
                <div style={{ height: 12 }} />
                <Stat value="±5%" label="Custom Thresholds" delay={30} color={GOLD} size={sz(48, 60)} />
                <Bold text="Never miss a market move" delay={50} size={sz(16, 20)} color="rgba(255,255,255,0.5)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 5: 1547-2072f — Grading + Security + Tiers + Community ===== */}
      {/* S11: 1547-1680 — GRADING ARBITRAGE */}
      <Sequence from={1547} durationInFrames={138}>
        <FadeIn dur={12}>
          <FadeOut start={113} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={500} opacity={0.12} />
              <Glow color={GOLD} size={350} x="70%" y="30%" opacity={0.08} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 2 }}>
                <Bold text="💎 Grading Arbitrage" delay={5} size={sz(34, 44)} color={ACCENT} />
                <Bold text="Find Hidden Profit" delay={18} size={sz(22, 28)} color="white" weight={600} />
                <div style={{ display: "flex", gap: sz(20, 40), marginTop: 16 }}>
                  <Stat value="RAW" label="Buy Low" delay={30} color={ACCENT} size={sz(36, 44)} />
                  <Bold text="→" delay={35} size={sz(36, 44)} color="rgba(255,255,255,0.3)" />
                  <Stat value="PSA 10" label="Sell High" delay={40} color={GOLD} size={sz(36, 44)} />
                </div>
                <Bold text="Automated spread analysis" delay={55} size={sz(16, 20)} color="rgba(255,255,255,0.5)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S12: 1680-1810 — SECURITY */}
      <Sequence from={1680} durationInFrames={135}>
        <FadeIn dur={12}>
          <FadeOut start={110} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: sz(40, 60) }}>
              <Glow color={CYAN} size={450} opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2, width: "100%" }}>
                <Bold text="🛡️ Enterprise Security" delay={5} size={sz(34, 44)} color={CYAN} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "80%", maxWidth: 500, marginTop: 16 }}>
                  <FeatureCard title="Rate Limiting" desc="IP-based API protection" icon="🔒" delay={20} color={CYAN} index={0} />
                  <FeatureCard title="RLS Policies" desc="Row-level security on all data" icon="🗄️" delay={30} color={ACCENT} index={1} />
                  <FeatureCard title="DMCA Protected" desc="Full IP protection suite" icon="⚖️" delay={40} color={GOLD} index={2} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S13: 1810-1940 — 7 PRICING TIERS */}
      <Sequence from={1810} durationInFrames={135}>
        <FadeIn dur={12}>
          <FadeOut start={110} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={GOLD} size={500} opacity={0.15} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="💳 7 Pricing Tiers" delay={5} size={sz(36, 48)} color={GOLD} />
                {["Free", "Starter $4.99", "Pro $14.99", "Elite $29.99", "Ultra $49.99", "Master $79.99", "Diamond $149.99"].map((tier, i) => {
                  const colors = [ACCENT, CYAN, PURPLE, GOLD, CRIMSON, PINK, "#fff"];
                  return <Bold key={tier} text={tier} delay={15 + i * 7} size={sz(18, 22)} color={colors[i]} weight={600} />;
                })}
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S14: 1940-2072 — COMMUNITY */}
      <Sequence from={1940} durationInFrames={137}>
        <FadeIn dur={12}>
          <FadeOut start={112} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={500} opacity={0.12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 2 }}>
                <Bold text="🌎 Growing Community" delay={5} size={sz(36, 48)} color={ACCENT} />
                <div style={{ display: "flex", gap: sz(20, 40), marginTop: 16 }}>
                  <Stat value="10K+" label="Users" delay={20} color={ACCENT} />
                  <Stat value="50K+" label="Cards Tracked" delay={30} color={CYAN} />
                  <Stat value="$2M+" label="Portfolio Value" delay={40} color={GOLD} />
                </div>
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 6: 2088-2186f — Feature Recap ===== */}
      {/* S15: 2088-2186 — FEATURE RECAP */}
      <Sequence from={2088} durationInFrames={103}>
        <FadeIn dur={12}>
          <FadeOut start={78} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={600} opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
                <Bold text="Everything You Need" delay={5} size={sz(30, 40)} color="white" />
                <div style={{ height: 8 }} />
                {[
                  { t: "✅ 500+ Live Card Prices", d: 12 },
                  { t: "✅ AI Market Signals", d: 18 },
                  { t: "✅ SimTrader World™", d: 24 },
                  { t: "✅ Poké-Pulse Arena™", d: 30 },
                  { t: "✅ Portfolio Tracking", d: 36 },
                  { t: "✅ Grading Arbitrage", d: 42 },
                ].map(({ t, d }) => (
                  <Bold key={t} text={t} delay={d} size={sz(16, 20)} color="rgba(255,255,255,0.8)" weight={600} />
                ))}
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 7: 2203-2295f — Social Proof ===== */}
      {/* S16: 2203-2295 — SOCIAL PROOF */}
      <Sequence from={2203} durationInFrames={97}>
        <FadeIn dur={12}>
          <FadeOut start={72} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={GOLD} size={500} opacity={0.12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="⭐ What Collectors Say" delay={5} size={sz(34, 44)} color={GOLD} />
                <Bold text={'"Best TCG data tool on the market."'} delay={15} size={sz(18, 24)} color="white" weight={500} />
                <Bold text="— @PokéInvestor" delay={25} size={sz(14, 16)} color="rgba(255,255,255,0.4)" weight={400} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== SEGMENT 8: 2311-2430f — PGVA Ventures ===== */}
      {/* S17: 2311-2430 — PGVA VENTURES */}
      <Sequence from={2311} durationInFrames={124}>
        <FadeIn dur={12}>
          <FadeOut start={99} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={500} opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="Built by" delay={5} size={sz(20, 26)} color="rgba(255,255,255,0.5)" weight={500} />
                <Bold text="PGVA Ventures, LLC" delay={15} size={sz(38, 50)} color="white" />
                <div style={{ height: 20 }} />
                <Bold text="🔒 DMCA Protected" delay={35} size={sz(16, 20)} color={CYAN} weight={600} />
                <Bold text="⚖️ DTSA Compliant" delay={42} size={sz(16, 20)} color={GOLD} weight={600} />
                <Bold text="🛡️ Enterprise Security" delay={49} size={sz(16, 20)} color={ACCENT} weight={600} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* ===== POST-VO: 2430-3600f — Extended CTA ===== */}
      {/* S18: 2430-2700 — FREE TRIAL CTA */}
      <Sequence from={2430} durationInFrames={275}>
        <FadeIn dur={12}>
          <FadeOut start={250} dur={25}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={700} opacity={0.2} />
              <Glow color={CYAN} size={400} x="30%" y="30%" opacity={0.1} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="🚀 Start Free Today" delay={5} size={sz(42, 56)} color={ACCENT} />
                <Bold text="14-DAY FREE TRIAL" delay={20} size={sz(48, 64)} color="white" />
                <div style={{ height: 16 }} />
                <Bold text="No credit card required" delay={40} size={sz(18, 22)} color="rgba(255,255,255,0.5)" weight={400} />
                <Bold text="Cancel anytime" delay={48} size={sz(16, 20)} color="rgba(255,255,255,0.4)" weight={400} />
                <div style={{ height: 24 }} />
                <Bold text="poke-pulse-ticker.com" delay={60} size={sz(24, 30)} color={ACCENT} weight={700} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S19: 2700-3050 — FINAL CTA */}
      <Sequence from={2700} durationInFrames={355}>
        <FadeIn dur={15}>
          <FadeOut start={325} dur={30}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Glow color={ACCENT} size={800} opacity={0.2} />
              <Glow color={CYAN} size={500} x="20%" y="40%" opacity={0.12} />
              <Glow color={PURPLE} size={400} x="80%" y="60%" opacity={0.08} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 2 }}>
                <Bold text="THE FUTURE OF" delay={5} size={sz(34, 44)} color="rgba(255,255,255,0.7)" />
                <Bold text="POKÉ-ECONOMICS" delay={15} size={sz(52, 72)} color={ACCENT} />
                <Bold text="IS HERE" delay={25} size={sz(52, 72)} color="white" />
                <div style={{ height: 30 }} />
                <Bold text="poke-pulse-ticker.com" delay={50} size={sz(28, 36)} color={ACCENT} weight={700} />
                <div style={{ height: 16 }} />
                <Bold text="START YOUR FREE TRIAL →" delay={65} size={sz(22, 28)} color="white" weight={700} />
              </div>
            </AbsoluteFill>
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* S20: 3050-3600 — END CARD */}
      <Sequence from={3050} durationInFrames={550}>
        <FadeIn dur={20}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Glow color={ACCENT} size={600} opacity={0.1} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}>
              <Bold text="Poke-Pulse-" delay={5} size={sz(44, 60)} color="white" />
              <Bold text="Market Terminal" delay={12} size={sz(36, 48)} color={ACCENT} />
              <div style={{ height: 24 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <PulsingDot color={ACCENT} />
                <Bold text="LIVE" delay={25} size={sz(18, 22)} color={ACCENT} weight={700} />
              </div>
              <div style={{ height: 20 }} />
              <Bold text="poke-pulse-ticker.com" delay={35} size={sz(18, 22)} color="rgba(255,255,255,0.5)" weight={500} />
              <Bold text="© 2026 PGVA Ventures, LLC. All Rights Reserved." delay={45} size={sz(10, 12)} color="rgba(255,255,255,0.2)" weight={400} />
            </div>
          </AbsoluteFill>
        </FadeIn>
      </Sequence>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

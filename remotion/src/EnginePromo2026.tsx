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
const CYAN = "#06b6d4";
const PURPLE = "#a855f7";
const CRIMSON = "#ef4444";
const BG = "#040810";

/* ─── Reusable primitives ─── */

const Bold: React.FC<{
  text: string; delay: number; size?: number; color?: string;
}> = ({ text, delay, size = 58, color = "white" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [60, 0]);
  return (
    <div style={{
      transform: `translateY(${y}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
      opacity, fontSize: size, fontWeight: 900, color, fontFamily: "'Segoe UI', sans-serif",
      textAlign: "center", lineHeight: 1.15, textTransform: "uppercase", letterSpacing: -1,
    }}>{text}</div>
  );
};

const Stat: React.FC<{
  value: string; label: string; delay: number; color?: string; size?: number;
}> = ({ value, label, delay, color = ACCENT, size = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontFamily: "monospace", fontSize: size, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, marginTop: 6 }}>{label}</div>
    </div>
  );
};

const Glow: React.FC<{
  color: string; size?: number; x?: string; y?: string; opacity?: number;
}> = ({ color, size = 400, x = "50%", y = "50%", opacity: op = 0.2 }) => (
  <div style={{
    position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
    width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    filter: "blur(60px)", opacity: op, pointerEvents: "none",
  }} />
);

const FadeIn: React.FC<{ dur?: number; children: React.ReactNode }> = ({ dur = 12, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const FadeOut: React.FC<{ start: number; dur: number; children: React.ReactNode }> = ({ start, dur, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const FeatureCard: React.FC<{
  icon: string; title: string; desc: string; delay: number; color?: string;
}> = ({ icon, title, desc, delay, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 160 } });
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div style={{
      transform: `translateY(${y}px)`, opacity: s,
      background: "rgba(255,255,255,0.04)", border: `1px solid ${color}44`,
      borderRadius: 16, padding: "20px 24px", minWidth: 220, flex: 1,
    }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, marginTop: 8, fontFamily: "sans-serif" }}>{title}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4, fontFamily: "sans-serif", lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
};

/* ─── Scenes (total ~60s = 1800 frames @ 30fps) ─── */

// S1: Title Splash (0–150f = 5s)
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.06) * 4;
  return (
    <FadeOut start={120} dur={30}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, #0a1628 0%, ${BG} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Glow color={ACCENT} size={600} y="40%" opacity={0.25} />
        <Glow color={PURPLE} size={400} x="30%" y="60%" opacity={0.15} />
        <div style={{ transform: `translateY(${pulse}px)` }}>
          <Bold text="POKE-PULSE-" delay={10} size={72} color="white" />
          <Bold text="MARKET TERMINAL TICKER™" delay={20} size={42} color={ACCENT} />
        </div>
        <div style={{ marginTop: 30, opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 18, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", letterSpacing: 6 }}>
          THE FUTURE OF POKÉ ECONOMICS
        </div>
      </AbsoluteFill>
    </FadeOut>
  );
};

// S2: Live Data Engine (150–330f = 6s)
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <FadeIn dur={15}>
      <FadeOut start={150} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, #060d1a 0%, #0a1628 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
          <Glow color={CYAN} size={500} x="70%" y="30%" opacity={0.2} />
          <Bold text="⚡ LIVE DATA ENGINE" delay={10} size={48} color={CYAN} />
          <div style={{ display: "flex", gap: 50, marginTop: 20 }}>
            <Stat value="500+" label="LIVE CARDS" delay={20} color={ACCENT} />
            <Stat value="1s" label="REFRESH" delay={25} color={GOLD} />
            <Stat value="ALL ERAS" label="COVERED" delay={30} color={CYAN} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
            <FeatureCard icon="📊" title="Real-Time Indexes" desc="Raw, Graded, Sealed & Era indexes" delay={35} color={ACCENT} />
            <FeatureCard icon="🔔" title="Alpha Signals" desc="AI-powered breakout alerts" delay={40} color={GOLD} />
            <FeatureCard icon="📈" title="Price History" desc="Full historical charts" delay={45} color={CYAN} />
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S3: SimTrader + Arena (330–540f = 7s)
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.04) * 6;
  return (
    <FadeIn dur={15}>
      <FadeOut start={180} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(160deg, #0d0520 0%, #0a1628 50%, #061018 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
          <Glow color={PURPLE} size={500} x="25%" y="35%" opacity={0.2} />
          <Glow color={CRIMSON} size={400} x="75%" y="65%" opacity={0.15} />
          <div style={{ display: "flex", gap: 60, transform: `translateY(${drift}px)` }}>
            <div style={{ textAlign: "center" }}>
              <Bold text="🎮 SIMTRADER WORLD™" delay={10} size={38} color={PURPLE} />
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginTop: 10 }}>
                Virtual trading • Zero risk • Real strategy
              </div>
              <div style={{ display: "flex", gap: 30, marginTop: 20, justifyContent: "center" }}>
                <Stat value="$100K" label="STARTING BALANCE" delay={20} color={PURPLE} size={36} />
                <Stat value="∞" label="CARDS" delay={25} color={ACCENT} size={36} />
              </div>
            </div>
            <div style={{ width: 2, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <Bold text="⚔️ POKÉ-PULSE ARENA™" delay={15} size={38} color={CRIMSON} />
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginTop: 10 }}>
                Competitive predictions • PokéCoin betting
              </div>
              <div style={{ display: "flex", gap: 30, marginTop: 20, justifyContent: "center" }}>
                <Stat value="1000" label="FREE COINS" delay={30} color={GOLD} size={36} />
                <Stat value="24/7" label="TOURNAMENTS" delay={35} color={CRIMSON} size={36} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S4: Games & Adventure (540–720f = 6s)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const bounce = Math.sin(frame * 0.08) * 5;
  return (
    <FadeIn dur={15}>
      <FadeOut start={150} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(140deg, #1a0a28 0%, #0d1a2a 50%, #0a1018 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
          <Glow color={GOLD} size={500} x="50%" y="40%" opacity={0.2} />
          <Bold text="🏰 POKÉ ADVENTURE LAND" delay={10} size={46} color={GOLD} />
          <div style={{ display: "flex", gap: 16, marginTop: 20, transform: `translateY(${bounce}px)` }}>
            <FeatureCard icon="⚔️" title="Battle System" desc="PvP & PvE with real card stats" delay={20} color={CRIMSON} />
            <FeatureCard icon="🃏" title="Card Collection" desc="Catch & collect digital cards" delay={25} color={PURPLE} />
            <FeatureCard icon="🏆" title="Leaderboards" desc="Global competitive rankings" delay={30} color={GOLD} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <FeatureCard icon="🎲" title="Poké Race™" desc="5-min sprint card races" delay={35} color={ACCENT} />
            <FeatureCard icon="🔮" title="Prediction Duels" desc="Head-to-head price bets" delay={40} color={CYAN} />
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S5: Pro Tools (720–900f = 6s)
const Scene5: React.FC = () => {
  return (
    <FadeIn dur={15}>
      <FadeOut start={150} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(145deg, #061018 0%, #0a1830 50%, #040810 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
          <Glow color={ACCENT} size={500} x="60%" y="30%" opacity={0.2} />
          <Bold text="🛠️ PRO-GRADE TOOLS" delay={10} size={46} color={ACCENT} />
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <FeatureCard icon="💎" title="Grading ROI" desc="Calculate PSA/CGC/BGS profit margins" delay={18} color={ACCENT} />
            <FeatureCard icon="🧠" title="AI Insights" desc="Machine learning market analysis" delay={23} color={PURPLE} />
            <FeatureCard icon="📋" title="Portfolio" desc="Track collection value in real-time" delay={28} color={GOLD} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <FeatureCard icon="🐋" title="Whale Reports" desc="Institutional-grade analytics" delay={33} color={CYAN} />
            <FeatureCard icon="⚠️" title="Delta Alerts" desc="Price deviation notifications" delay={38} color={CRIMSON} />
            <FeatureCard icon="🔄" title="Arbitrage" desc="Cross-platform price spreads" delay={43} color={ACCENT} />
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S6: Subscription Tiers (900–1080f = 6s)
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiers = [
    { name: "FREE", price: "$0", color: "rgba(255,255,255,0.6)" },
    { name: "SCOUT", price: "$4.99", color: CYAN },
    { name: "TRACKER", price: "$12.99", color: ACCENT },
    { name: "PRO", price: "$29.99", color: GOLD },
    { name: "ELITE", price: "$59.99", color: PURPLE },
    { name: "WHALE", price: "$119.99", color: CRIMSON },
    { name: "INST.", price: "$499.99", color: "#e0e0e0" },
  ];
  return (
    <FadeIn dur={15}>
      <FadeOut start={150} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(140deg, #0a1830 0%, #040810 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
          <Glow color={GOLD} size={500} opacity={0.15} />
          <Bold text="7 SUBSCRIPTION TIERS" delay={8} size={44} color={GOLD} />
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            {tiers.map((t, i) => {
              const s = spring({ frame: frame - 15 - i * 4, fps, config: { damping: 14, stiffness: 180 } });
              return (
                <div key={t.name} style={{
                  transform: `scale(${s})`, textAlign: "center",
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${t.color}44`,
                  borderRadius: 12, padding: "16px 14px", minWidth: 110,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: t.color, fontFamily: "monospace" }}>{t.price}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginTop: 4, fontFamily: "sans-serif" }}>{t.name}</div>
                </div>
              );
            })}
          </div>
          <div style={{ opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 16, color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", letterSpacing: 3 }}>
            FROM CASUAL TO INSTITUTIONAL — EVERY LEVEL COVERED
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S7: Franchise Scalability (1080–1290f = 7s)
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const verticals = ["MLB", "NFL", "NBA", "NHL", "FIFA", "MTG", "Yu-Gi-Oh!", "DBZ", "Lorcana", "Star Wars"];
  return (
    <FadeIn dur={15}>
      <FadeOut start={180} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, #0a1018 0%, #0d1830 50%, #040810 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
          <Glow color={ACCENT} size={600} opacity={0.15} />
          <Bold text="12 MARKET VERTICALS" delay={8} size={44} color={ACCENT} />
          <Bold text="$103B+ TOTAL ADDRESSABLE MARKET" delay={16} size={28} color={GOLD} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 800, marginTop: 16 }}>
            {verticals.map((v, i) => {
              const s = spring({ frame: frame - 25 - i * 3, fps, config: { damping: 16, stiffness: 160 } });
              return (
                <div key={v} style={{
                  transform: `scale(${s})`, background: "rgba(0,210,106,0.08)",
                  border: "1px solid rgba(0,210,106,0.2)", borderRadius: 8,
                  padding: "8px 16px", fontSize: 14, fontWeight: 700,
                  color: ACCENT, fontFamily: "sans-serif",
                }}>{v}</div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 50, marginTop: 20 }}>
            <Stat value="$1.89B" label="VALUATION" delay={55} color={GOLD} size={40} />
            <Stat value="$157.8M" label="ARR TARGET" delay={60} color={ACCENT} size={40} />
            <Stat value="76%" label="CAGR" delay={65} color={CYAN} size={40} />
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S8: Security & Legal (1290–1440f = 5s)
const Scene8: React.FC = () => {
  return (
    <FadeIn dur={15}>
      <FadeOut start={120} dur={30}>
        <AbsoluteFill style={{ background: `linear-gradient(140deg, #040810 0%, #0a1830 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
          <Glow color={ACCENT} size={400} opacity={0.15} />
          <Bold text="🔒 ENTERPRISE SECURITY" delay={8} size={44} color={ACCENT} />
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <FeatureCard icon="🛡️" title="95/100 Audit" desc="Industry-leading security score" delay={18} color={ACCENT} />
            <FeatureCard icon="📜" title="IP Protected" desc="U.S. Patent, Trademark & Copyright" delay={23} color={GOLD} />
            <FeatureCard icon="🔐" title="DRM Secured" desc="Forensic watermarks & encryption" delay={28} color={CYAN} />
          </div>
        </AbsoluteFill>
      </FadeOut>
    </FadeIn>
  );
};

// S9: CTA (1440–1800f = 12s)
const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 6;
  const glow = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.15, 0.35]);
  return (
    <FadeIn dur={20}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, #0a1830 0%, ${BG} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <Glow color={ACCENT} size={700} opacity={glow} />
        <Glow color={GOLD} size={400} x="30%" y="60%" opacity={0.15} />
        <Glow color={PURPLE} size={400} x="70%" y="30%" opacity={0.15} />
        <div style={{ transform: `translateY(${pulse}px)` }}>
          <Bold text="THE ERA OF THE" delay={10} size={36} color="rgba(255,255,255,0.7)" />
          <Bold text="UNINFORMED COLLECTOR" delay={18} size={42} color="rgba(255,255,255,0.7)" />
          <Bold text="IS OVER." delay={28} size={56} color={ACCENT} />
        </div>
        <div style={{ marginTop: 20 }}>
          <Bold text="POKE-PULSE-TICKER.COM" delay={50} size={34} color={GOLD} />
        </div>
        <div style={{ opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 14, color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif", letterSpacing: 3, marginTop: 20 }}>
          14-DAY FREE TRIAL • NO CREDIT CARD REQUIRED
        </div>
        <div style={{ opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif", letterSpacing: 2, marginTop: 30 }}>
          © 2026 PGVA VENTURES, LLC. ALL RIGHTS RESERVED.
        </div>
        <div style={{ opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "sans-serif", letterSpacing: 1, marginTop: 6, textAlign: "center", maxWidth: 700 }}>
          PROTECTED UNDER U.S. PATENT, TRADEMARK & COPYRIGHT LAW. UNAUTHORIZED USE PROHIBITED.
        </div>
      </AbsoluteFill>
    </FadeIn>
  );
};

/* ─── Main Composition ─── */
export const EnginePromo2026: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isHorizontal = width > height;
  const rootScale = isHorizontal ? 1.0 : 0.55;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ transform: `scale(${rootScale})`, transformOrigin: "center center" }}>
        {/* S1: Title 0–150 */}
        <Sequence from={0} durationInFrames={150}><Scene1 /></Sequence>
        {/* S2: Live Data 150–330 */}
        <Sequence from={150} durationInFrames={180}><Scene2 /></Sequence>
        {/* S3: SimTrader + Arena 330–540 */}
        <Sequence from={330} durationInFrames={210}><Scene3 /></Sequence>
        {/* S4: Games 540–720 */}
        <Sequence from={540} durationInFrames={180}><Scene4 /></Sequence>
        {/* S5: Pro Tools 720–900 */}
        <Sequence from={720} durationInFrames={180}><Scene5 /></Sequence>
        {/* S6: Tiers 900–1080 */}
        <Sequence from={900} durationInFrames={180}><Scene6 /></Sequence>
        {/* S7: Franchise 1080–1290 */}
        <Sequence from={1080} durationInFrames={210}><Scene7 /></Sequence>
        {/* S8: Security 1290–1440 */}
        <Sequence from={1290} durationInFrames={150}><Scene8 /></Sequence>
        {/* S9: CTA 1440–1800 */}
        <Sequence from={1440} durationInFrames={360}><Scene9 /></Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

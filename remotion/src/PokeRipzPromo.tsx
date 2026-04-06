import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Bangers";
import { loadFont as loadBody } from "@remotion/google-fonts/Quicksand";

const { fontFamily: bangers } = loadFont();
const { fontFamily: quicksand } = loadBody();

const BG_DARK = "#0a0a12";
const ACCENT_GOLD = "#FFD700";
const ACCENT_PINK = "#FF3CAC";
const ACCENT_CYAN = "#00E5FF";
const ACCENT_GREEN = "#00D166";

export const PokeRipzPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, overflow: "hidden" }}>
      {/* Animated background particles */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (i * 97 + frame * (0.3 + i * 0.08)) % width;
        const y = (i * 73 + frame * (0.2 + i * 0.04)) % height;
        const size = 2 + (i % 5);
        const opacity = interpolate(Math.sin(frame * 0.02 + i), [-1, 1], [0.08, 0.35]);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: size, height: size, borderRadius: "50%",
            backgroundColor: [ACCENT_GOLD, ACCENT_PINK, ACCENT_CYAN, ACCENT_GREEN][i % 4],
            opacity,
          }} />
        );
      })}

      {/* Scene 1: Logo reveal (0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneLogo fps={fps} />
      </Sequence>

      {/* Scene 2: Era showcase (90-180) */}
      <Sequence from={90} durationInFrames={90}>
        <SceneEras fps={fps} />
      </Sequence>

      {/* Scene 3: Products (180-255) */}
      <Sequence from={180} durationInFrames={75}>
        <SceneProducts fps={fps} />
      </Sequence>

      {/* Scene 4: Rip action (255-345) */}
      <Sequence from={255} durationInFrames={90}>
        <SceneRipAction fps={fps} />
      </Sequence>

      {/* Scene 5: Fan voting (345-420) */}
      <Sequence from={345} durationInFrames={75}>
        <SceneFanVoting fps={fps} />
      </Sequence>

      {/* Scene 6: Sets showcase (420-510) */}
      <Sequence from={420} durationInFrames={90}>
        <SceneSets fps={fps} />
      </Sequence>

      {/* Scene 7: Digital portfolio (510-585) */}
      <Sequence from={510} durationInFrames={75}>
        <SceneDigitalPortfolio fps={fps} />
      </Sequence>

      {/* Scene 8: Coin economy (585-660) */}
      <Sequence from={585} durationInFrames={75}>
        <SceneCoinEconomy fps={fps} />
      </Sequence>

      {/* Scene 9: PGTV shows (660-750) */}
      <Sequence from={660} durationInFrames={90}>
        <ScenePGTV fps={fps} />
      </Sequence>

      {/* Scene 10: CTA (750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <SceneCTA fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const SceneLogo: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0, 30]);
  const subtitleY = interpolate(spring({ frame: frame - 25, fps, config: { damping: 20 } }), [0, 1], [40, 0]);
  const subtitleOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        transform: `scale(${scale})`, opacity: titleOpacity, textAlign: "center",
        filter: `drop-shadow(0 0 ${glow}px ${ACCENT_GOLD})`,
      }}>
        <div style={{
          fontFamily: bangers, fontSize: 140, color: ACCENT_GOLD,
          letterSpacing: 8, lineHeight: 1,
          textShadow: `0 0 40px ${ACCENT_GOLD}50, 0 4px 0 #B8860B`,
        }}>POKÉ RIPZ™</div>
      </div>
      <div style={{
        opacity: subtitleOp, transform: `translateY(${subtitleY}px)`,
        fontFamily: quicksand, fontSize: 32, color: "#ffffff90", letterSpacing: 6, marginTop: 16,
      }}>DIGITAL PACK RIPPING EXPERIENCE</div>
      <div style={{
        position: "absolute", bottom: 60,
        fontFamily: quicksand, fontSize: 14, color: "#ffffff40",
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
      }}>© PGVA Ventures, LLC — Noyes Family Trust</div>
    </AbsoluteFill>
  );
};

const SceneEras: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const eras = [
    { icon: "🏆", name: "VINTAGE", color: "#00D166", years: "1999–2003", sets: "Base Set, Fossil, Jungle" },
    { icon: "🔴", name: "EX ERA", color: "#FF4444", years: "2003–2007", sets: "Ruby & Sapphire, FireRed" },
    { icon: "💠", name: "DP/PLAT", color: "#4488FF", years: "2007–2011", sets: "Diamond & Pearl, Platinum" },
    { icon: "⚫", name: "BW/XY", color: "#6688FF", years: "2011–2017", sets: "Boundaries Crossed, Evolutions" },
    { icon: "☀️", name: "SM/SWSH", color: "#FFAA00", years: "2017–2023", sets: "Evolving Skies, Cosmic Eclipse" },
    { icon: "🔮", name: "MODERN", color: "#AA55FF", years: "2023–NOW", sets: "Prismatic Evolutions, Ascended Heroes" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 52, color: "#fff", marginBottom: 40,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>EVERY ERA. EVERY SET.</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1200 }}>
        {eras.map((era, i) => {
          const delay = i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          return (
            <div key={era.name} style={{
              opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${y}px)`, textAlign: "center", width: 160,
              background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 8px",
              border: `1px solid ${era.color}30`,
            }}>
              <div style={{ fontSize: 42 }}>{era.icon}</div>
              <div style={{ fontFamily: bangers, fontSize: 20, color: era.color, marginTop: 6 }}>{era.name}</div>
              <div style={{ fontFamily: quicksand, fontSize: 11, color: "#ffffff60" }}>{era.years}</div>
              <div style={{ fontFamily: quicksand, fontSize: 9, color: "#ffffff40", marginTop: 4 }}>{era.sets}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneProducts: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const products = [
    { icon: "🃏", name: "Booster Pack", cost: "100" },
    { icon: "📦", name: "Booster Bundle", cost: "500" },
    { icon: "🎁", name: "ETB", cost: "800" },
    { icon: "📬", name: "Booster Box", cost: "3,200" },
    { icon: "🎯", name: "Collection Box", cost: "600" },
    { icon: "👑", name: "UPC", cost: "2,400" },
    { icon: "💎", name: "SPC", cost: "1,800" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 48, color: "#fff", marginBottom: 36,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>7 PRODUCT TYPES</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {products.map((prod, i) => {
          const delay = i * 6;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          return (
            <div key={prod.name} style={{
              transform: `scale(${s})`, width: 140, padding: 16,
              background: "rgba(255,255,255,0.05)", borderRadius: 12, textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: 36 }}>{prod.icon}</div>
              <div style={{ fontFamily: quicksand, fontSize: 14, color: "#fff", marginTop: 8, fontWeight: 700 }}>{prod.name}</div>
              <div style={{ fontFamily: bangers, fontSize: 18, color: ACCENT_GOLD, marginTop: 4 }}>{prod.cost} 🪙</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneRipAction: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const shake = frame > 20 && frame < 50 ? Math.sin(frame * 2) * 4 : 0;
  const tearProgress = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardScale = spring({ frame: frame - 50, fps, config: { damping: 8 } });
  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [10, 50]);

  const rarities = ["COMMON", "UNCOMMON", "RARE", "ULTRA RARE", "HYPER RARE"];
  const rarityIdx = Math.min(Math.floor(interpolate(frame, [55, 80], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 4);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px)` }}>
      <div style={{
        width: 300, height: 420, borderRadius: 16,
        background: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_PINK})`,
        display: "flex", justifyContent: "center", alignItems: "center",
        transform: `scale(${1 - tearProgress * 0.3})`, opacity: 1 - tearProgress,
        boxShadow: `0 0 ${glowPulse}px ${ACCENT_GOLD}50`,
      }}>
        <div style={{ fontFamily: bangers, fontSize: 36, color: "#fff", textAlign: "center" }}>RIP IT<br/>OPEN!</div>
      </div>

      {frame > 50 && (
        <div style={{
          position: "absolute", transform: `scale(${cardScale})`,
          width: 280, height: 390, borderRadius: 12,
          background: `linear-gradient(145deg, #1a1a2e, #2d1b4e)`,
          border: `3px solid ${ACCENT_GOLD}`, boxShadow: `0 0 40px ${ACCENT_GOLD}40`,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        }}>
          <div style={{ fontSize: 60 }}>⭐</div>
          <div style={{ fontFamily: bangers, fontSize: 28, color: ACCENT_GOLD, marginTop: 12 }}>{rarities[rarityIdx]}!</div>
          <div style={{ fontFamily: quicksand, fontSize: 14, color: "#fff", marginTop: 8 }}>Based on Real Pull Rates</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneFanVoting: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const votes = [
    { label: "Evolving Skies", pct: 42, color: ACCENT_CYAN },
    { label: "Prismatic Evolutions", pct: 31, color: ACCENT_PINK },
    { label: "Ascended Heroes", pct: 27, color: ACCENT_GOLD },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 48, color: "#fff", marginBottom: 40,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>🗳️ FAN VOTING SYSTEM</div>
      <div style={{
        fontFamily: quicksand, fontSize: 20, color: "#ffffff80", marginBottom: 30,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>YOU decide what gets ripped next!</div>
      <div style={{ width: 700 }}>
        {votes.map((v, i) => {
          const delay = 15 + i * 10;
          const barWidth = interpolate(frame, [delay, delay + 30], [0, v.pct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={v.label} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: quicksand, fontSize: 16, color: "#fff", marginBottom: 6, fontWeight: 700 }}>{v.label}</div>
              <div style={{ height: 32, background: "rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: `${barWidth}%`, background: v.color, borderRadius: 8 }} />
                <div style={{ position: "absolute", right: 12, top: 6, fontFamily: bangers, fontSize: 16, color: "#fff" }}>{Math.round(barWidth)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneSets: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const sets = [
    { name: "Evolving Skies", era: "SM/SWSH", color: "#4488FF" },
    { name: "Prismatic Evolutions", era: "Modern", color: "#AA55FF" },
    { name: "Ascended Heroes", era: "Modern", color: "#FF3CAC" },
    { name: "Base Set", era: "Vintage", color: "#00D166" },
    { name: "Cosmic Eclipse", era: "SM/SWSH", color: "#FFAA00" },
    { name: "Obsidian Flames", era: "Modern", color: "#FF4444" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 48, color: "#fff", marginBottom: 36,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>HOT SETS TO RIP</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
        {sets.map((s, i) => {
          const delay = i * 8;
          const sc = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          return (
            <div key={s.name} style={{
              transform: `scale(${sc})`, width: 240, padding: 20,
              background: `linear-gradient(135deg, ${s.color}15, ${s.color}05)`,
              borderRadius: 12, border: `1px solid ${s.color}40`,
            }}>
              <div style={{ fontFamily: bangers, fontSize: 22, color: s.color }}>{s.name}</div>
              <div style={{ fontFamily: quicksand, fontSize: 12, color: "#ffffff60", marginTop: 4 }}>{s.era} Era</div>
              <div style={{ fontFamily: quicksand, fontSize: 11, color: ACCENT_GOLD, marginTop: 6 }}>Live Market Pricing 🪙</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneDigitalPortfolio: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const slideIn = spring({ frame, fps, config: { damping: 20 } });
  const x = interpolate(slideIn, [0, 1], [-400, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateX(${x}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: bangers, fontSize: 48, color: ACCENT_CYAN, marginBottom: 20 }}>📁 DIGITAL PORTFOLIO</div>
        <div style={{ fontFamily: quicksand, fontSize: 22, color: "#ffffffcc", marginBottom: 30 }}>
          Track your pulls separately from your physical collection
        </div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
          {[
            { label: "Physical", icon: "🏠", desc: "Real cards you own" },
            { label: "Digital", icon: "🎮", desc: "Your Poké Ripz pulls" },
          ].map((p, i) => {
            const delay = 20 + i * 15;
            const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
            return (
              <div key={p.label} style={{
                transform: `scale(${s})`, padding: 28, width: 260,
                background: "rgba(255,255,255,0.05)", borderRadius: 16,
                border: `1px solid ${i === 1 ? ACCENT_CYAN : "#ffffff20"}`,
              }}>
                <div style={{ fontSize: 48 }}>{p.icon}</div>
                <div style={{ fontFamily: bangers, fontSize: 24, color: "#fff", marginTop: 12 }}>{p.label}</div>
                <div style={{ fontFamily: quicksand, fontSize: 13, color: "#ffffff60", marginTop: 6 }}>{p.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCoinEconomy: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const coinSpin = frame * 4;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 52, color: ACCENT_GOLD, marginBottom: 30,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        textShadow: `0 0 20px ${ACCENT_GOLD}40`,
      }}>🪙 COIN ECONOMY</div>
      <div style={{ display: "flex", gap: 32 }}>
        {[
          { coins: "5,000", label: "FREE START", color: ACCENT_GREEN },
          { coins: "$0.99", label: "JOIN FEE", color: ACCENT_CYAN },
          { coins: "∞", label: "BUNDLES", color: ACCENT_PINK },
        ].map((item, i) => {
          const delay = i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          return (
            <div key={item.label} style={{
              transform: `scale(${s})`, padding: 32, width: 200,
              background: "rgba(255,255,255,0.04)", borderRadius: 16, textAlign: "center",
              border: `1px solid ${item.color}30`,
            }}>
              <div style={{ fontFamily: bangers, fontSize: 40, color: item.color }}>{item.coins}</div>
              <div style={{ fontFamily: quicksand, fontSize: 14, color: "#fff", marginTop: 8, fontWeight: 700 }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ScenePGTV: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: bangers, fontSize: 56, color: "#fff", marginBottom: 16,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}>📺 PGTV MEDIA HUB™</div>
        <div style={{
          fontFamily: quicksand, fontSize: 22, color: "#ffffff80", marginBottom: 30,
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
        }}>20-30 Minute Poké Ripz Shows</div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {["Unique Hosts", "Live Rips", "Celebrity Rippers", "Fan Favorites"].map((feat, i) => {
            const delay = 20 + i * 10;
            const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
            return (
              <div key={feat} style={{
                transform: `scale(${s * pulse})`, padding: "14px 24px",
                background: "rgba(255,215,0,0.08)", borderRadius: 10,
                border: `1px solid ${ACCENT_GOLD}30`,
                fontFamily: quicksand, fontSize: 15, color: ACCENT_GOLD, fontWeight: 700,
              }}>{feat}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{
          fontFamily: bangers, fontSize: 80, color: ACCENT_GOLD,
          textShadow: `0 0 30px ${ACCENT_GOLD}50`,
        }}>START RIPPING</div>
        <div style={{
          fontFamily: quicksand, fontSize: 28, color: "#ffffffcc", marginTop: 16,
        }}>5,000 FREE COINS • $0.99 TO JOIN</div>
        <div style={{
          marginTop: 32, transform: `scale(${pulse})`,
          fontFamily: bangers, fontSize: 44,
          color: "#fff", background: `linear-gradient(90deg, ${ACCENT_PINK}, ${ACCENT_GOLD})`,
          padding: "18px 56px", borderRadius: 14, display: "inline-block",
        }}>POKÉ RIPZ™</div>
        <div style={{
          marginTop: 20, fontFamily: quicksand, fontSize: 16, color: "#ffffff60",
        }}>poke-pulse-ticker.lovable.app/ripz</div>
        <div style={{
          marginTop: 16, fontFamily: quicksand, fontSize: 12, color: "#ffffff30",
        }}>© 2026 PGVA Ventures, LLC • Personal Pulse Engine™ • Noyes Family Trust</div>
        <div style={{
          marginTop: 8, fontFamily: quicksand, fontSize: 9, color: "#ffffff20",
        }}>Protected under U.S. Patent, Trademark & Copyright law. 18 U.S.C. § 1832</div>
      </div>
    </AbsoluteFill>
  );
};

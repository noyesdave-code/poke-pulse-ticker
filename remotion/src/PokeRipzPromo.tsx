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

export const PokeRipzPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, overflow: "hidden" }}>
      {/* Animated background particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 97 + frame * (0.3 + i * 0.1)) % width;
        const y = (i * 73 + frame * (0.2 + i * 0.05)) % height;
        const size = 2 + (i % 4);
        const opacity = interpolate(Math.sin(frame * 0.02 + i), [-1, 1], [0.1, 0.4]);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: size, height: size, borderRadius: "50%",
            backgroundColor: i % 3 === 0 ? ACCENT_GOLD : i % 3 === 1 ? ACCENT_PINK : ACCENT_CYAN,
            opacity,
          }} />
        );
      })}

      {/* Scene 1: Logo reveal (0-90 frames) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Logo fps={fps} />
      </Sequence>

      {/* Scene 2: Era showcase (90-180) */}
      <Sequence from={90} durationInFrames={90}>
        <Scene2Eras fps={fps} />
      </Sequence>

      {/* Scene 3: Rip action (180-270) */}
      <Sequence from={180} durationInFrames={90}>
        <Scene3Rip fps={fps} />
      </Sequence>

      {/* Scene 4: Products (270-360) */}
      <Sequence from={270} durationInFrames={90}>
        <Scene4Products fps={fps} />
      </Sequence>

      {/* Scene 5: CTA / Branding (360-450) */}
      <Sequence from={360} durationInFrames={90}>
        <Scene5CTA fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Scene1Logo: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(spring({ frame: frame - 25, fps, config: { damping: 20 } }), [0, 1], [40, 0]);
  const subtitleOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0, 30]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        transform: `scale(${scale})`,
        opacity: titleOpacity,
        textAlign: "center",
        filter: `drop-shadow(0 0 ${glow}px ${ACCENT_GOLD})`,
      }}>
        <div style={{
          fontFamily: bangers, fontSize: 140, color: ACCENT_GOLD,
          letterSpacing: 8, lineHeight: 1,
          textShadow: `0 0 40px ${ACCENT_GOLD}50, 0 4px 0 #B8860B`,
        }}>
          POKÉ RIPZ
        </div>
      </div>
      <div style={{
        opacity: subtitleOp,
        transform: `translateY(${subtitleY}px)`,
        fontFamily: quicksand, fontSize: 32, color: "#ffffff90",
        letterSpacing: 6, marginTop: 16,
      }}>
        DIGITAL PACK RIPPING EXPERIENCE
      </div>
      <div style={{
        position: "absolute", bottom: 60,
        fontFamily: quicksand, fontSize: 14, color: "#ffffff40",
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        © PGVA Ventures, LLC — Noyes Family Trust
      </div>
    </AbsoluteFill>
  );
};

const Scene2Eras: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const eras = [
    { icon: "🏆", name: "VINTAGE", color: "#00D166", years: "1999–2003" },
    { icon: "🔴", name: "EX ERA", color: "#FF4444", years: "2003–2007" },
    { icon: "💠", name: "DP/PLAT", color: "#4488FF", years: "2007–2011" },
    { icon: "⚫", name: "BW/XY", color: "#6688FF", years: "2011–2017" },
    { icon: "☀️", name: "SM/SWSH", color: "#FFAA00", years: "2017–2023" },
    { icon: "🔮", name: "MODERN", color: "#AA55FF", years: "2023–NOW" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 52, color: "#fff", marginBottom: 40,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        EVERY ERA. EVERY SET.
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {eras.map((era, i) => {
          const delay = i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          return (
            <div key={era.name} style={{
              opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${y}px)`,
              textAlign: "center", width: 140,
            }}>
              <div style={{ fontSize: 48 }}>{era.icon}</div>
              <div style={{ fontFamily: bangers, fontSize: 22, color: era.color, marginTop: 8 }}>
                {era.name}
              </div>
              <div style={{ fontFamily: quicksand, fontSize: 12, color: "#ffffff60" }}>
                {era.years}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene3Rip: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const shake = frame > 20 && frame < 50 ? Math.sin(frame * 2) * 4 : 0;
  const tearProgress = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardScale = spring({ frame: frame - 50, fps, config: { damping: 8 } });
  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [10, 50]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px)` }}>
      {/* Pack tearing effect */}
      <div style={{
        width: 300, height: 420, borderRadius: 16,
        background: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_PINK})`,
        display: "flex", justifyContent: "center", alignItems: "center",
        transform: `scale(${1 - tearProgress * 0.3})`,
        opacity: 1 - tearProgress,
        boxShadow: `0 0 ${glowPulse}px ${ACCENT_GOLD}50`,
      }}>
        <div style={{ fontFamily: bangers, fontSize: 36, color: "#fff", textAlign: "center" }}>
          BOOSTER<br/>PACK
        </div>
      </div>

      {/* Revealed card */}
      {frame > 50 && (
        <div style={{
          position: "absolute",
          transform: `scale(${cardScale})`,
          width: 280, height: 390, borderRadius: 12,
          background: `linear-gradient(145deg, #1a1a2e, #2d1b4e)`,
          border: `3px solid ${ACCENT_GOLD}`,
          boxShadow: `0 0 40px ${ACCENT_GOLD}40`,
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
        }}>
          <div style={{ fontSize: 60 }}>⭐</div>
          <div style={{ fontFamily: bangers, fontSize: 28, color: ACCENT_GOLD, marginTop: 12 }}>
            HYPER RARE!
          </div>
          <div style={{ fontFamily: quicksand, fontSize: 16, color: "#fff", marginTop: 8 }}>
            50,000 Value
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene4Products: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const products = [
    { icon: "🃏", name: "Booster Pack", cost: "100" },
    { icon: "🎁", name: "ETB", cost: "800" },
    { icon: "📬", name: "Booster Box", cost: "3,200" },
    { icon: "👑", name: "UPC", cost: "2,400" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 48, color: "#fff", marginBottom: 40,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        CHOOSE YOUR PRODUCT
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {products.map((prod, i) => {
          const delay = i * 10;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          return (
            <div key={prod.name} style={{
              transform: `scale(${s})`,
              width: 200, padding: 24,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 16, textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: 48 }}>{prod.icon}</div>
              <div style={{ fontFamily: quicksand, fontSize: 18, color: "#fff", marginTop: 12, fontWeight: 700 }}>
                {prod.name}
              </div>
              <div style={{ fontFamily: bangers, fontSize: 24, color: ACCENT_GOLD, marginTop: 8 }}>
                {prod.cost} 🪙
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene5CTA: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{
          fontFamily: bangers, fontSize: 72, color: ACCENT_GOLD,
          textShadow: `0 0 30px ${ACCENT_GOLD}50`,
        }}>
          START RIPPING
        </div>
        <div style={{
          fontFamily: quicksand, fontSize: 28, color: "#ffffffcc",
          marginTop: 16,
        }}>
          5,000 FREE COINS TO START
        </div>
        <div style={{
          marginTop: 32, transform: `scale(${pulse})`,
          fontFamily: bangers, fontSize: 36,
          color: "#fff", background: `linear-gradient(90deg, ${ACCENT_PINK}, ${ACCENT_GOLD})`,
          padding: "16px 48px", borderRadius: 12,
          display: "inline-block",
        }}>
          POKÉ RIPZ™
        </div>
        <div style={{
          marginTop: 24, fontFamily: quicksand, fontSize: 14, color: "#ffffff40",
        }}>
          A PGVA Ventures, LLC Product • Personal Pulse Engine™
        </div>
      </div>
    </AbsoluteFill>
  );
};

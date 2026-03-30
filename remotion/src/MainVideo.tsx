import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  staticFile,
  Img,
} from "remotion";

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Background gradient pulse
  const bgPulse = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Screen scroll — the hero image scrolls up to reveal content
  const scrollProgress = interpolate(frame, [60, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Image is 1536x864, we display it at full width 1080, so height = 1080 * 864/1536 = 607.5
  // But we want to show a "scrolling" effect of the full app
  const imgDisplayWidth = width;
  const imgNativeWidth = 1536;
  const imgNativeHeight = 864;
  const imgDisplayHeight = (imgDisplayWidth / imgNativeWidth) * imgNativeHeight;
  
  // We'll scale the image to be taller to simulate scrolling
  const scaledWidth = width;
  const scaledHeight = imgDisplayHeight;
  const scrollOffset = interpolate(scrollProgress, [0, 1], [0, -(scaledHeight * 0.3)]);

  // Title entrance
  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Title exit
  const titleExit = interpolate(frame, [40, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screenshot entrance
  const screenEnter = spring({ frame: frame - 45, fps, config: { damping: 20, stiffness: 100 } });
  const screenY = interpolate(screenEnter, [0, 1], [height, 300]);

  // Glow effect
  const glowOpacity = interpolate(frame, [45, 90], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA at end
  const ctaProgress = spring({ frame: frame - 370, fps, config: { damping: 12 } });
  const ctaOpacity = interpolate(frame, [370, 390], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137.5) % width;
    const baseY = (i * 97.3) % height;
    const speed = 0.3 + (i % 5) * 0.15;
    const y = baseY + Math.sin((frame * speed * 0.05) + i) * 40;
    const size = 2 + (i % 3) * 2;
    const opacity = 0.15 + Math.sin(frame * 0.03 + i * 0.7) * 0.1;
    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill>
      {/* Animated dark background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(${160 + Math.sin(frame * 0.02) * 10}, 60%, 8%) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(215, 60%, 6%) 0%, transparent 50%),
            linear-gradient(180deg, #060a10 0%, #0a1018 50%, #060a10 100%)
          `,
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? "#00d26a" : i % 3 === 1 ? "#3b82f6" : "#f59e0b",
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Title card */}
      <Sequence from={0} durationInFrames={65}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: titleOpacity * titleExit,
          }}
        >
          <div
            style={{
              transform: `scale(${titleScale})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                letterSpacing: -2,
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: "#00d26a" }}>P</span>OKE-PULSE
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 36,
                fontWeight: 600,
                color: "#00d26a",
                letterSpacing: 8,
                marginTop: 8,
              }}
            >
              TICKER
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                marginTop: 24,
                letterSpacing: 3,
              }}
            >
              LIVE POKÉMON TCG MARKET DATA
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* App screenshot with scroll effect */}
      <Sequence from={45}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: screenY,
            transform: "translateX(-50%)",
            width: width - 60,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `0 0 ${40 + Math.sin(frame * 0.05) * 10}px rgba(0, 210, 106, ${glowOpacity * 0.3}), 0 20px 60px rgba(0,0,0,0.5)`,
            border: "1px solid rgba(0, 210, 106, 0.2)",
          }}
        >
          <div style={{ transform: `translateY(${scrollOffset}px)` }}>
            <Img
              src={staticFile("images/hero.png")}
              style={{
                width: width - 60,
                display: "block",
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* Green glow behind screenshot */}
      <Sequence from={45}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: screenY + 100,
            transform: "translateX(-50%)",
            width: width * 0.6,
            height: 300,
            background: "radial-gradient(ellipse, rgba(0, 210, 106, 0.15) 0%, transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(40px)",
            zIndex: -1,
          }}
        />
      </Sequence>

      {/* Stats bar */}
      <Sequence from={120} durationInFrames={280}>
        {(() => {
          const statsEnter = spring({ frame: frame - 120, fps, config: { damping: 18 } });
          const statsY = interpolate(statsEnter, [0, 1], [100, 0]);
          const statsOpacity = interpolate(frame, [120, 145], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const stats = [
            { label: "CARDS TRACKED", value: "500+" },
            { label: "HOURLY UPDATES", value: "24/7" },
            { label: "USER RATING", value: "4.8/5" },
          ];

          return (
            <div
              style={{
                position: "absolute",
                bottom: 180,
                left: 30,
                right: 30,
                display: "flex",
                justifyContent: "space-around",
                opacity: statsOpacity,
                transform: `translateY(${statsY}px)`,
              }}
            >
              {stats.map((s, i) => {
                const delay = i * 8;
                const pop = spring({ frame: frame - 130 - delay, fps, config: { damping: 10 } });
                return (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      transform: `scale(${pop})`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 40,
                        fontWeight: 900,
                        color: "#00d26a",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: 2,
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Sequence>

      {/* CTA at end */}
      <Sequence from={370}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 120,
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${ctaProgress})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                marginBottom: 16,
              }}
            >
              Start tracking your cards
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                color: "#00d26a",
                background: "rgba(0, 210, 106, 0.1)",
                border: "1px solid rgba(0, 210, 106, 0.3)",
                padding: "14px 40px",
                borderRadius: 12,
                letterSpacing: 2,
              }}
            >
              poke-pulse-ticker.com
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Branding watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: 3,
        }}
      >
        PGVA VENTURES, LLC.
      </div>
    </AbsoluteFill>
  );
};

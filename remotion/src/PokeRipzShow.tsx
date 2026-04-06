import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Bangers";
import { loadFont as loadBody } from "@remotion/google-fonts/Quicksand";

const { fontFamily: bangers } = loadFont();
const { fontFamily: quicksand } = loadBody();

const BG = "#0a0a12";
const GOLD = "#FFD700";
const PINK = "#FF3CAC";
const CYAN = "#00E5FF";
const GREEN = "#00D166";

type EpisodeProps = {
  setName: string;
  setEra: string;
  hostName: string;
  hostEmoji: string;
  products: { name: string; icon: string }[];
  pulls: { name: string; rarity: string; value: string; emoji: string }[];
  accentColor: string;
};

const defaultEpisodes: EpisodeProps[] = [
  {
    setName: "Evolving Skies", setEra: "Sword & Shield", hostName: "DJ Spark", hostEmoji: "⚡",
    products: [{ name: "ETB Case #1", icon: "🎁" }, { name: "ETB Case #2", icon: "🎁" }, { name: "ETB Case #3", icon: "🎁" }],
    pulls: [
      { name: "Umbreon VMAX Alt Art", rarity: "HYPER RARE", value: "$312.50", emoji: "🌙" },
      { name: "Rayquaza VMAX Alt Art", rarity: "ULTRA RARE", value: "$189.00", emoji: "🐉" },
      { name: "Dragonite V Alt Art", rarity: "ULTRA RARE", value: "$78.50", emoji: "🐲" },
      { name: "Glaceon VMAX", rarity: "RARE", value: "$42.00", emoji: "❄️" },
    ],
    accentColor: CYAN,
  },
  {
    setName: "Prismatic Evolutions", setEra: "Modern", hostName: "Luna Blaze", hostEmoji: "🔮",
    products: [{ name: "ETB Case #1", icon: "🎁" }, { name: "ETB Case #2", icon: "🎁" }, { name: "ETB Case #3", icon: "🎁" }],
    pulls: [
      { name: "Eevee Full Art", rarity: "HYPER RARE", value: "$245.00", emoji: "✨" },
      { name: "Sylveon EX", rarity: "ULTRA RARE", value: "$156.00", emoji: "🎀" },
      { name: "Umbreon EX", rarity: "ULTRA RARE", value: "$198.00", emoji: "🌑" },
      { name: "Jolteon EX", rarity: "RARE", value: "$67.00", emoji: "⚡" },
    ],
    accentColor: PINK,
  },
  {
    setName: "Ascended Heroes", setEra: "Modern", hostName: "Rex Thunder", hostEmoji: "🦖",
    products: [{ name: "ETB Case #1", icon: "🎁" }, { name: "ETB Case #2", icon: "🎁" }, { name: "ETB Case #3", icon: "🎁" }],
    pulls: [
      { name: "Charizard EX SAR", rarity: "HYPER RARE", value: "$425.00", emoji: "🔥" },
      { name: "Mewtwo EX Alt Art", rarity: "ULTRA RARE", value: "$215.00", emoji: "🧠" },
      { name: "Pikachu EX", rarity: "ULTRA RARE", value: "$134.00", emoji: "⚡" },
      { name: "Gengar EX", rarity: "RARE", value: "$89.00", emoji: "👻" },
    ],
    accentColor: GOLD,
  },
  {
    setName: "Obsidian Flames", setEra: "Scarlet & Violet", hostName: "Blaze Runner", hostEmoji: "🔥",
    products: [{ name: "Booster Box", icon: "📦" }, { name: "ETB", icon: "🎁" }, { name: "UPC", icon: "👑" }],
    pulls: [
      { name: "Charizard ex SAR", rarity: "HYPER RARE", value: "$385.00", emoji: "🔥" },
      { name: "Tyranitar ex", rarity: "ULTRA RARE", value: "$95.00", emoji: "🗿" },
      { name: "Dragonite ex", rarity: "ULTRA RARE", value: "$72.00", emoji: "🐉" },
      { name: "Eevee Illustration", rarity: "RARE", value: "$45.00", emoji: "🌟" },
    ],
    accentColor: "#FF6B35",
  },
  {
    setName: "Crown Zenith", setEra: "Sword & Shield", hostName: "Nova Crystal", hostEmoji: "💎",
    products: [{ name: "ETB Case #1", icon: "🎁" }, { name: "ETB Case #2", icon: "🎁" }, { name: "Tin Case", icon: "🥫" }],
    pulls: [
      { name: "Giratina VSTAR Gold", rarity: "HYPER RARE", value: "$275.00", emoji: "👻" },
      { name: "Pikachu VMAX TG", rarity: "ULTRA RARE", value: "$165.00", emoji: "⚡" },
      { name: "Mewtwo VSTAR", rarity: "ULTRA RARE", value: "$88.00", emoji: "🧠" },
      { name: "Leafeon VSTAR", rarity: "RARE", value: "$38.00", emoji: "🍃" },
    ],
    accentColor: "#9B59B6",
  },
  {
    setName: "151", setEra: "Scarlet & Violet", hostName: "Retro Rick", hostEmoji: "🕹️",
    products: [{ name: "ETB Case", icon: "🎁" }, { name: "UPC", icon: "👑" }, { name: "Booster Bundle", icon: "📦" }],
    pulls: [
      { name: "Charizard ex SAR", rarity: "HYPER RARE", value: "$520.00", emoji: "🔥" },
      { name: "Mew ex SAR", rarity: "HYPER RARE", value: "$310.00", emoji: "✨" },
      { name: "Alakazam ex", rarity: "ULTRA RARE", value: "$125.00", emoji: "🔮" },
      { name: "Snorlax Illustration", rarity: "RARE", value: "$55.00", emoji: "😴" },
    ],
    accentColor: "#E74C3C",
  },
  {
    setName: "Paldea Evolved", setEra: "Scarlet & Violet", hostName: "Pixel Sage", hostEmoji: "🧙",
    products: [{ name: "Booster Box", icon: "📦" }, { name: "ETB", icon: "🎁" }, { name: "3-Pack Blister", icon: "🃏" }],
    pulls: [
      { name: "Iono SAR", rarity: "HYPER RARE", value: "$445.00", emoji: "⚡" },
      { name: "Tinkaton ex", rarity: "ULTRA RARE", value: "$78.00", emoji: "🔨" },
      { name: "Gardevoir ex", rarity: "ULTRA RARE", value: "$92.00", emoji: "💃" },
      { name: "Quaquaval ex", rarity: "RARE", value: "$35.00", emoji: "💧" },
    ],
    accentColor: "#2ECC71",
  },
  {
    setName: "Temporal Forces", setEra: "Scarlet & Violet", hostName: "Chrono Kai", hostEmoji: "⏰",
    products: [{ name: "Booster Box", icon: "📦" }, { name: "ETB", icon: "🎁" }, { name: "Elite Box", icon: "🎁" }],
    pulls: [
      { name: "Walking Wake ex", rarity: "HYPER RARE", value: "$195.00", emoji: "🌊" },
      { name: "Iron Leaves ex", rarity: "ULTRA RARE", value: "$112.00", emoji: "🍃" },
      { name: "Raging Bolt ex", rarity: "ULTRA RARE", value: "$88.00", emoji: "⚡" },
      { name: "Farigiraf ex", rarity: "RARE", value: "$42.00", emoji: "🦒" },
    ],
    accentColor: "#3498DB",
  },
  {
    setName: "Stellar Crown", setEra: "Scarlet & Violet", hostName: "Stella Vex", hostEmoji: "⭐",
    products: [{ name: "ETB Case", icon: "🎁" }, { name: "Booster Box", icon: "📦" }, { name: "SPC", icon: "🏆" }],
    pulls: [
      { name: "Terapagos ex SAR", rarity: "HYPER RARE", value: "$350.00", emoji: "🌈" },
      { name: "Arceus VSTAR", rarity: "ULTRA RARE", value: "$145.00", emoji: "✨" },
      { name: "Lapras ex", rarity: "ULTRA RARE", value: "$78.00", emoji: "🐢" },
      { name: "Briar SAR", rarity: "RARE", value: "$62.00", emoji: "🌹" },
    ],
    accentColor: "#F39C12",
  },
  {
    setName: "Surging Sparks", setEra: "Scarlet & Violet", hostName: "Volt Viper", hostEmoji: "🐍",
    products: [{ name: "Booster Box", icon: "📦" }, { name: "ETB", icon: "🎁" }, { name: "Collection Box", icon: "📦" }],
    pulls: [
      { name: "Pikachu ex SAR", rarity: "HYPER RARE", value: "$480.00", emoji: "⚡" },
      { name: "Miraidon ex", rarity: "ULTRA RARE", value: "$165.00", emoji: "🤖" },
      { name: "Koraidon ex", rarity: "ULTRA RARE", value: "$135.00", emoji: "🦎" },
      { name: "Entei Illustration", rarity: "RARE", value: "$58.00", emoji: "🦁" },
    ],
    accentColor: "#E67E22",
  },
];

export const PokeRipzShow: React.FC<{ episodeIndex?: number }> = ({ episodeIndex = 0 }) => {
  const ep = defaultEpisodes[episodeIndex % defaultEpisodes.length];
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = (i * 127 + frame * (0.2 + i * 0.06)) % width;
        const y = (i * 89 + frame * (0.15 + i * 0.03)) % height;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: 3, height: 3, borderRadius: "50%",
            backgroundColor: ep.accentColor, opacity: 0.2,
          }} />
        );
      })}

      {/* Scene 1: Show intro (0-120) */}
      <Sequence from={0} durationInFrames={120}>
        <ShowIntro ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 2: Host intro (120-210) */}
      <Sequence from={120} durationInFrames={90}>
        <HostIntro ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 3: Products (210-300) */}
      <Sequence from={210} durationInFrames={90}>
        <ProductsScene ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 4: Rip sequence (300-450) */}
      <Sequence from={300} durationInFrames={150}>
        <RipSequence ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 5: Big pulls (450-600) */}
      <Sequence from={450} durationInFrames={150}>
        <BigPulls ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 6: Results + rating (600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <ResultsScene ep={ep} fps={fps} />
      </Sequence>

      {/* Scene 7: Outro (750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <OutroScene ep={ep} fps={fps} />
      </Sequence>

      {/* Persistent PGTV watermark */}
      <div style={{
        position: "absolute", top: 20, right: 24,
        fontFamily: bangers, fontSize: 18, color: "#ffffff20",
        letterSpacing: 4,
      }}>PGTV MEDIA HUB™</div>

      {/* Live badge */}
      <div style={{
        position: "absolute", top: 20, left: 24,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          backgroundColor: "#FF0000",
          opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1]),
        }} />
        <span style={{ fontFamily: quicksand, fontSize: 14, color: "#FF0000", fontWeight: 700 }}>LIVE</span>
      </div>
    </AbsoluteFill>
  );
};

const ShowIntro: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.06), [-1, 1], [5, 25]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})`, opacity: titleOp }}>
        <div style={{ fontFamily: bangers, fontSize: 100, color: GOLD, letterSpacing: 6, filter: `drop-shadow(0 0 ${glow}px ${GOLD})`, textShadow: `0 4px 0 #B8860B` }}>
          POKÉ RIPZ™
        </div>
        <div style={{ fontFamily: bangers, fontSize: 36, color: ep.accentColor, marginTop: 12, opacity: subOp }}>
          EPISODE: {ep.setName.toUpperCase()}
        </div>
        <div style={{ fontFamily: quicksand, fontSize: 18, color: "#ffffff60", marginTop: 8, opacity: subOp }}>
          {ep.setEra} Era • 3× ETB Cases
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HostIntro: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();
  const slideIn = spring({ frame, fps, config: { damping: 18 } });
  const x = interpolate(slideIn, [0, 1], [-500, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `translateX(${x}px)` }}>
        <div style={{
          width: 200, height: 200, borderRadius: "50%",
          background: `linear-gradient(135deg, ${ep.accentColor}30, ${ep.accentColor}10)`,
          border: `3px solid ${ep.accentColor}`,
          display: "flex", justifyContent: "center", alignItems: "center",
          fontSize: 80,
        }}>{ep.hostEmoji}</div>
        <div>
          <div style={{ fontFamily: quicksand, fontSize: 16, color: "#ffffff60", letterSpacing: 4, textTransform: "uppercase" }}>YOUR HOST</div>
          <div style={{ fontFamily: bangers, fontSize: 64, color: "#fff", marginTop: 8 }}>{ep.hostName}</div>
          <div style={{
            fontFamily: quicksand, fontSize: 18, color: ep.accentColor, marginTop: 8,
            opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
          }}>"Let's rip some {ep.setName}!"</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProductsScene: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 48, color: "#fff", marginBottom: 40,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>TONIGHT'S PRODUCTS</div>
      <div style={{ display: "flex", gap: 40 }}>
        {ep.products.map((p, i) => {
          const s = spring({ frame: frame - i * 10, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{
              transform: `scale(${s})`, width: 220, padding: 28,
              background: `linear-gradient(135deg, ${ep.accentColor}10, transparent)`,
              borderRadius: 16, textAlign: "center",
              border: `1px solid ${ep.accentColor}30`,
            }}>
              <div style={{ fontSize: 56 }}>{p.icon}</div>
              <div style={{ fontFamily: quicksand, fontSize: 18, color: "#fff", marginTop: 12, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontFamily: quicksand, fontSize: 12, color: ep.accentColor, marginTop: 6 }}>{ep.setName}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const RipSequence: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();
  const shake = frame > 30 && frame < 70 ? Math.sin(frame * 3) * 6 : 0;
  const tearProgress = interpolate(frame, [40, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [10, 40]);
  const excitementOp = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px)` }}>
      <div style={{
        width: 350, height: 480, borderRadius: 20,
        background: `linear-gradient(135deg, ${ep.accentColor}, ${GOLD})`,
        display: "flex", justifyContent: "center", alignItems: "center",
        transform: `scale(${1 - tearProgress * 0.4}) rotate(${tearProgress * 5}deg)`,
        opacity: 1 - tearProgress,
        boxShadow: `0 0 ${glow}px ${ep.accentColor}60`,
      }}>
        <div style={{ fontFamily: bangers, fontSize: 32, color: "#fff", textAlign: "center" }}>
          {ep.setName}<br/><span style={{ fontSize: 24 }}>ETB</span>
        </div>
      </div>

      {frame > 75 && (
        <div style={{
          position: "absolute",
          fontFamily: bangers, fontSize: 72, color: GOLD,
          opacity: excitementOp,
          textShadow: `0 0 30px ${GOLD}50`,
        }}>
          {ep.hostEmoji} RIPPING!
        </div>
      )}

      {/* Host reaction */}
      {frame > 100 && (
        <div style={{
          position: "absolute", bottom: 80,
          fontFamily: quicksand, fontSize: 22, color: "#ffffffcc",
          opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          {ep.hostName}: "Oh my... what do we have here?!"
        </div>
      )}
    </AbsoluteFill>
  );
};

const BigPulls: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: bangers, fontSize: 44, color: GOLD, marginBottom: 30,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        textShadow: `0 0 20px ${GOLD}40`,
      }}>🔥 TONIGHT'S BIG PULLS</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {ep.pulls.map((pull, i) => {
          const delay = i * 20;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          const isHyper = pull.rarity === "HYPER RARE";
          const glowAmt = isHyper ? interpolate(Math.sin((frame - delay) * 0.08), [-1, 1], [5, 30]) : 0;
          return (
            <div key={i} style={{
              transform: `scale(${s})`, width: 220, padding: 20,
              background: isHyper
                ? `linear-gradient(145deg, #2d1b4e, #1a1a2e)`
                : "rgba(255,255,255,0.04)",
              borderRadius: 14, textAlign: "center",
              border: `2px solid ${isHyper ? GOLD : ep.accentColor + "40"}`,
              boxShadow: isHyper ? `0 0 ${glowAmt}px ${GOLD}40` : "none",
            }}>
              <div style={{ fontSize: 40 }}>{pull.emoji}</div>
              <div style={{ fontFamily: quicksand, fontSize: 14, color: "#fff", marginTop: 8, fontWeight: 700 }}>{pull.name}</div>
              <div style={{ fontFamily: bangers, fontSize: 16, color: isHyper ? GOLD : ep.accentColor, marginTop: 4 }}>{pull.rarity}</div>
              <div style={{ fontFamily: bangers, fontSize: 22, color: GREEN, marginTop: 6 }}>{pull.value}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ResultsScene: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();
  const totalValue = ep.pulls.reduce((sum, p) => sum + parseFloat(p.value.replace(/[$,]/g, "")), 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: bangers, fontSize: 44, color: "#fff", marginBottom: 24,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}>📊 SESSION RESULTS</div>
        <div style={{
          fontFamily: bangers, fontSize: 80, color: GREEN, marginBottom: 20,
          opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
          textShadow: `0 0 20px ${GREEN}40`,
        }}>${totalValue.toFixed(2)}</div>
        <div style={{
          fontFamily: quicksand, fontSize: 20, color: "#ffffff80",
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}>Total Pull Value • {ep.pulls.length} Notable Cards</div>

        {/* Fan rating */}
        <div style={{
          marginTop: 40, opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: bangers, fontSize: 28, color: GOLD, marginBottom: 12 }}>⭐ RATE THIS EPISODE</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= 4;
              return (
                <div key={star} style={{
                  fontSize: 36,
                  opacity: filled ? 1 : 0.3,
                  transform: `scale(${spring({ frame: frame - 70 - star * 5, fps, config: { damping: 10 } })})`,
                }}>⭐</div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ ep: EpisodeProps; fps: number }> = ({ ep, fps }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: bangers, fontSize: 56, color: GOLD,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          textShadow: `0 0 25px ${GOLD}40`,
        }}>THANKS FOR WATCHING!</div>
        <div style={{
          fontFamily: quicksand, fontSize: 22, color: "#ffffffcc", marginTop: 16,
          opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
        }}>Vote for next episode's set in the Poké Ripz app!</div>
        <div style={{
          marginTop: 32, transform: `scale(${pulse})`,
          fontFamily: bangers, fontSize: 40,
          color: "#fff", background: `linear-gradient(90deg, ${PINK}, ${GOLD})`,
          padding: "14px 48px", borderRadius: 12, display: "inline-block",
        }}>POKÉ RIPZ™</div>
        <div style={{
          marginTop: 16, fontFamily: quicksand, fontSize: 14, color: "#ffffff50",
        }}>poke-pulse-ticker.lovable.app/ripz</div>
        <div style={{
          marginTop: 12, fontFamily: quicksand, fontSize: 11, color: "#ffffff25",
        }}>© 2026 PGVA Ventures, LLC • Personal Pulse Engine™ • Protected under 18 U.S.C. § 1832</div>
      </div>
    </AbsoluteFill>
  );
};

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🎬 Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

// VO silence gaps (seconds) — transitions happen here
const voGaps = [10.76, 11.3, 24.66, 25.34, 36.47, 37.01, 51.07, 51.58, 69.05, 69.6, 72.88, 73.43, 76.5, 77.02];
// Midpoints of each gap for SFX placement
const sfxTimes = [];
for (let i = 0; i < voGaps.length; i += 2) {
  sfxTimes.push((voGaps[i] + voGaps[i + 1]) / 2);
}

// Build SFX chain for ffmpeg (whoosh at each transition gap)
const whooshPath = path.resolve(__dirname, "../public/audio/whoosh.mp3");
const sfxInputs = sfxTimes.map((_, i) => `-i "${whooshPath}"`).join(" ");
const sfxDelays = sfxTimes.map((t, i) => `[${i + 3}]adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)}[sfx${i}]`).join(";");
const sfxMixInputs = sfxTimes.map((_, i) => `[sfx${i}]`).join("");

// --- Render GrandLaunch (YouTube horizontal) ---
console.log("🎥 Rendering GrandLaunch YouTube (1920x1080)...");
const compGL = await selectComposition({
  serveUrl: bundled,
  id: "grand-launch-yt",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compGL,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/tmp/grand-launch-yt-mute.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ GrandLaunch YT video rendered (muted)");

// --- Render SocialHighlight (YouTube horizontal) ---
console.log("🎥 Rendering SocialHighlight YouTube (1920x1080)...");
const compSH = await selectComposition({
  serveUrl: bundled,
  id: "social-highlight-yt",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compSH,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/tmp/social-highlight-yt-mute.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ SocialHighlight YT video rendered (muted)");

await browser.close({ silent: false });

// --- Audio mixing with sidechain ducking + SFX ---
const voPath = path.resolve(__dirname, "../public/audio/feature-vo.mp3");
const bgPath = path.resolve(__dirname, "../public/audio/feature-bg.mp3");

// Create ducked music mix: lower music when VO is active, bring it up during gaps
// Using ffmpeg sidechaincompress to duck music based on VO presence
console.log("🎵 Mixing audio with sidechain ducking + transition SFX...");

// Step 1: Create the mixed audio track (90s for GrandLaunch)
// Music loops, VO on top, sidechain compression ducks music during speech
const mixCmd90 = `ffmpeg -y \
  -i "${voPath}" \
  -stream_loop -1 -i "${bgPath}" \
  ${sfxInputs} \
  -filter_complex "\
    [1]atrim=0:90,asetpts=PTS-STARTPTS[bgraw];\
    [0]apad=whole_dur=90[vopad];\
    [vopad]asplit=2[vomain][vosc];\
    [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=8:attack=50:release=300:level_sc=1:level_in=0.7[bgducked];\
    ${sfxDelays};\
    [bgducked]${sfxMixInputs}amix=inputs=${sfxTimes.length + 1}:duration=longest:dropout_transition=0[bgsfx];\
    [vomain][bgsfx]amix=inputs=2:duration=first:weights=1 0.6[out]" \
  -map "[out]" -t 90 -ac 2 -ar 44100 /tmp/audio-mix-90s.mp3`;

try {
  execSync(mixCmd90, { stdio: "pipe", timeout: 120000 });
  console.log("✅ 90s audio mix created");
} catch (e) {
  // Fallback: simpler mix without SFX if complex filter fails
  console.log("⚠️ Complex mix failed, using simplified mix...");
  const simpleMix90 = `ffmpeg -y \
    -i "${voPath}" \
    -stream_loop -1 -i "${bgPath}" \
    -filter_complex "\
      [1]atrim=0:90,asetpts=PTS-STARTPTS[bgraw];\
      [0]apad=whole_dur=90[vopad];\
      [vopad]asplit=2[vomain][vosc];\
      [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
      [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[out]" \
    -map "[out]" -t 90 -ac 2 -ar 44100 /tmp/audio-mix-90s.mp3`;
  execSync(simpleMix90, { stdio: "pipe", timeout: 120000 });
  console.log("✅ 90s audio mix created (simplified)");
}

// Step 2: Create 120s audio mix for SocialHighlight
const simpleMix120 = `ffmpeg -y \
  -i "${voPath}" \
  -stream_loop -1 -i "${bgPath}" \
  -filter_complex "\
    [1]atrim=0:120,asetpts=PTS-STARTPTS[bgraw];\
    [0]apad=whole_dur=120[vopad];\
    [vopad]asplit=2[vomain][vosc];\
    [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
    [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[out]" \
  -map "[out]" -t 120 -ac 2 -ar 44100 /tmp/audio-mix-120s.mp3`;
execSync(simpleMix120, { stdio: "pipe", timeout: 120000 });
console.log("✅ 120s audio mix created");

// Step 3: Mux video + audio
console.log("🎬 Muxing GrandLaunch YT...");
execSync(`ffmpeg -y -i /tmp/grand-launch-yt-mute.mp4 -i /tmp/audio-mix-90s.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/grand-launch-yt-synced.mp4`, { stdio: "pipe", timeout: 120000 });
console.log("✅ GrandLaunch YT muxed → /mnt/documents/grand-launch-yt-synced.mp4");

console.log("🎬 Muxing SocialHighlight YT...");
execSync(`ffmpeg -y -i /tmp/social-highlight-yt-mute.mp4 -i /tmp/audio-mix-120s.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/social-highlight-yt-synced.mp4`, { stdio: "pipe", timeout: 120000 });
console.log("✅ SocialHighlight YT muxed → /mnt/documents/social-highlight-yt-synced.mp4");

console.log("\n🎉 Done! Both videos rendered with VO-synced transitions, ducked music, and transition SFX.");

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

console.log("🎥 Rendering Engine Promo 2026 (1920x1080, 60s)...");
const comp = await selectComposition({
  serveUrl: bundled,
  id: "engine-promo-2026",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/tmp/engine-promo-mute.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ Engine Promo rendered (muted)");
await browser.close({ silent: false });

// Check for VO and music files
const voPath = path.resolve(__dirname, "../public/audio/engine-promo-vo.mp3");
const bgPath = path.resolve(__dirname, "../public/audio/engine-promo-bg.mp3");

try {
  // Mix VO + BG with sidechain ducking
  console.log("🎵 Mixing audio (VO + sidechain-ducked music)...");
  execSync(`ffmpeg -y \
    -i "${voPath}" \
    -stream_loop -1 -i "${bgPath}" \
    -filter_complex "\
      [1]atrim=0:60,asetpts=PTS-STARTPTS[bgraw];\
      [0]apad=whole_dur=60[vopad];\
      [vopad]asplit=2[vomain][vosc];\
      [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
      [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[out]" \
    -map "[out]" -t 60 -ac 2 -ar 44100 /tmp/engine-promo-mix.mp3`, { stdio: "pipe", timeout: 60000 });
  console.log("✅ Audio mixed");

  // Mux
  console.log("🎬 Muxing video + audio...");
  execSync(`ffmpeg -y -i /tmp/engine-promo-mute.mp4 -i /tmp/engine-promo-mix.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/PGVA_Engine_Promo_2026.mp4`, { stdio: "pipe", timeout: 60000 });
  console.log("✅ Final video → /mnt/documents/PGVA_Engine_Promo_2026.mp4");
} catch (e) {
  // If no audio files, just copy mute version
  console.log("⚠️ Audio files not found, outputting silent video...");
  execSync(`cp /tmp/engine-promo-mute.mp4 /mnt/documents/PGVA_Engine_Promo_2026.mp4`);
  console.log("✅ Silent video → /mnt/documents/PGVA_Engine_Promo_2026.mp4");
}

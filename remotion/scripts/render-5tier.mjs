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

console.log("🎥 Rendering 5-Tier Promo (1920x1080, 63s)...");
const comp = await selectComposition({
  serveUrl: bundled,
  id: "five-tier-promo",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/tmp/5tier-mute.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ Video rendered (muted)");
await browser.close({ silent: false });

// Mix VO + BG with sidechain ducking
const voPath = "/tmp/5tier-vo.mp3";
const bgPath = "/tmp/5tier-bg.mp3";

try {
  console.log("🎵 Mixing audio (VO + sidechain-ducked music)...");
  execSync(`ffmpeg -y \
    -i "${voPath}" \
    -stream_loop -1 -i "${bgPath}" \
    -filter_complex "\
      [1]atrim=0:64,asetpts=PTS-STARTPTS[bgraw];\
      [0]apad=whole_dur=64[vopad];\
      [vopad]asplit=2[vomain][vosc];\
      [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
      [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[premix];\
      [premix]afade=t=out:st=59:d=4[out]" \
    -map "[out]" -t 63 -ac 2 -ar 44100 /tmp/5tier-mix.mp3`, { stdio: "pipe", timeout: 60000 });
  console.log("✅ Audio mixed");

  console.log("🎬 Muxing video + audio...");
  execSync(`ffmpeg -y -i /tmp/5tier-mute.mp4 -i /tmp/5tier-mix.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/PGVA_5Tier_Promo_2026.mp4`, { stdio: "pipe", timeout: 60000 });
  console.log("✅ Final video → /mnt/documents/PGVA_5Tier_Promo_2026.mp4");
} catch (e) {
  console.log("⚠️ Audio mixing failed, outputting silent video...");
  execSync(`cp /tmp/5tier-mute.mp4 /mnt/documents/PGVA_5Tier_Promo_2026.mp4`);
  console.log("✅ Silent video → /mnt/documents/PGVA_5Tier_Promo_2026.mp4");
}

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

console.log("🎥 Rendering 5-Tier Promo (1920x1080, ~103s synced to VO)...");
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

// Get VO duration for precise trim
const voDur = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 /tmp/5tier-vo.mp3`).toString().trim();
const dur = Math.ceil(parseFloat(voDur));
console.log(`VO duration: ${voDur}s, trimming to ${dur}s`);

// Mix VO + BG music with sidechain ducking
try {
  console.log("🎵 Mixing audio (VO + sidechain-ducked music)...");
  execSync(`ffmpeg -y \
    -i /tmp/5tier-vo.mp3 \
    -stream_loop -1 -i /tmp/5tier-bg.mp3 \
    -filter_complex "\
      [1]atrim=0:${dur+2},asetpts=PTS-STARTPTS[bgraw];\
      [0]apad=whole_dur=${dur}[vopad];\
      [vopad]asplit=2[vomain][vosc];\
      [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
      [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.45[premix];\
      [premix]afade=t=out:st=${dur-4}:d=4[out]" \
    -map "[out]" -t ${dur} -ac 2 -ar 44100 /tmp/5tier-mix.mp3`, { stdio: "pipe", timeout: 60000 });
  console.log("✅ Audio mixed");

  console.log("🎬 Muxing video + audio...");
  execSync(`ffmpeg -y -i /tmp/5tier-mute.mp4 -i /tmp/5tier-mix.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/PGVA_5Tier_Promo_2026.mp4`, { stdio: "pipe", timeout: 60000 });
  
  const size = execSync(`wc -c < /mnt/documents/PGVA_5Tier_Promo_2026.mp4`).toString().trim();
  console.log(`✅ Final video: /mnt/documents/PGVA_5Tier_Promo_2026.mp4 (${(parseInt(size)/1024/1024).toFixed(1)}MB)`);
} catch (e) {
  console.log("⚠️ Audio mixing failed:", e.message);
  execSync(`cp /tmp/5tier-mute.mp4 /mnt/documents/PGVA_5Tier_Promo_2026.mp4`);
}

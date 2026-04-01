import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

// Render Grand Launch YT
console.log("Rendering Grand Launch YT...");
const glComp = await selectComposition({
  serveUrl: bundled, id: "grand-launch-yt", puppeteerInstance: browser,
});
await renderMedia({
  composition: glComp, serveUrl: bundled, codec: "h264",
  outputLocation: "/tmp/gl-yt-mute.mp4", puppeteerInstance: browser, muted: true, concurrency: 1,
});
console.log("✅ Grand Launch YT rendered");

// Render Social Highlight YT
console.log("Rendering Social Highlight YT...");
const shComp = await selectComposition({
  serveUrl: bundled, id: "social-highlight-yt", puppeteerInstance: browser,
});
await renderMedia({
  composition: shComp, serveUrl: bundled, codec: "h264",
  outputLocation: "/tmp/sh-yt-mute.mp4", puppeteerInstance: browser, muted: true, concurrency: 1,
});
console.log("✅ Social Highlight YT rendered");

await browser.close({ silent: false });

// Audio mix for GL (90s)
const voPath = path.resolve(__dirname, "../public/audio/feature-vo.mp3");
const bgPath = path.resolve(__dirname, "../public/audio/feature-bg.mp3");

execSync(`ffmpeg -y -i "${voPath}" -stream_loop -1 -i "${bgPath}" -filter_complex "[1]atrim=0:90,asetpts=PTS-STARTPTS[bgraw];[0]apad=whole_dur=90[vopad];[vopad]asplit=2[vomain][vosc];[bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];[vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[out]" -map "[out]" -t 90 -ac 2 -ar 44100 /tmp/gl-mix90.mp3`, { stdio: "pipe", timeout: 60000 });
console.log("✅ GL audio mixed");

// Mux GL
execSync(`ffmpeg -y -i /tmp/gl-yt-mute.mp4 -i /tmp/gl-mix90.mp3 -c:v copy -c:a aac -b:a 192k -shortest /tmp/gl-yt-final.mp4`, { stdio: "pipe", timeout: 60000 });
console.log("✅ GL muxed");

// Audio mix for SH (120s)
execSync(`ffmpeg -y -i "${voPath}" -stream_loop -1 -i "${bgPath}" -filter_complex "[1]atrim=0:120,asetpts=PTS-STARTPTS[bgraw];[0]apad=whole_dur=120[vopad];[vopad]asplit=2[vomain][vosc];[bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];[vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[out]" -map "[out]" -t 120 -ac 2 -ar 44100 /tmp/sh-mix120.mp3`, { stdio: "pipe", timeout: 60000 });
console.log("✅ SH audio mixed");

// Mux SH
execSync(`ffmpeg -y -i /tmp/sh-yt-mute.mp4 -i /tmp/sh-mix120.mp3 -c:v copy -c:a aac -b:a 192k -shortest /tmp/sh-yt-final.mp4`, { stdio: "pipe", timeout: 60000 });
console.log("✅ SH muxed");

// Combine with 2s crossfade
execSync(`ffmpeg -y -i /tmp/gl-yt-final.mp4 -i /tmp/sh-yt-final.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=88[v];[0:a][1:a]acrossfade=d=2[a]" -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 192k /mnt/documents/combined-gl-sh-3min.mp4`, { stdio: "pipe", timeout: 120000 });
console.log("✅ Combined → /mnt/documents/combined-gl-sh-3min.mp4");

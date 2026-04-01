import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

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

const comp = await selectComposition({
  serveUrl: bundled,
  id: "social-highlight-yt",
  puppeteerInstance: browser,
});

// Override to 90s (2700 frames)
comp.durationInFrames = 2700;

console.log("Rendering 90s YouTube horizontal video (1920x1080, 2700 frames)...");
await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/tmp/social-highlight-yt-90s-mute.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ YouTube video rendered");

await browser.close({ silent: false });
console.log("Done!");

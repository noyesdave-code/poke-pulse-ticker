import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("📦 Bundling PokeRipz3D...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("🌐 Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

console.log("🎬 Selecting composition...");
const composition = await selectComposition({
  serveUrl: bundled,
  id: "PokeRipz3D",
  puppeteerInstance: browser,
});

console.log(`🎥 Rendering ${composition.durationInFrames} frames (${(composition.durationInFrames / 30).toFixed(1)}s)...`);
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/PokeRipz_3D_EP1.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
  onProgress: ({ progress }) => {
    if (Math.round(progress * 100) % 10 === 0) {
      process.stdout.write(`\r  Progress: ${Math.round(progress * 100)}%`);
    }
  },
});

console.log("\n✅ Render complete!");
await browser.close({ silent: false });

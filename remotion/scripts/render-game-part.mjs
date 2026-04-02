import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compositionId = process.argv[2] || "game-highlight";
const part = process.argv[3] || "1"; // "1" or "2"

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: compositionId,
  puppeteerInstance: browser,
});

const totalFrames = composition.durationInFrames;
const midpoint = Math.floor(totalFrames / 2);
const frameRange = part === "1" ? [0, midpoint - 1] : [midpoint, totalFrames - 1];
const suffix = compositionId === "game-highlight" ? "vertical" : "youtube";
const outputPath = `/tmp/game-highlight-${suffix}-part${part}.mp4`;

console.log(`Rendering ${compositionId} part ${part}: frames ${frameRange[0]}-${frameRange[1]}`);

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: outputPath,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
  frameRange,
});

console.log(`✅ Part ${part} rendered: ${outputPath}`);
await browser.close({ silent: false });

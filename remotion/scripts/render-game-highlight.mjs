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

// Render vertical (social) version
const compVertical = await selectComposition({
  serveUrl: bundled,
  id: "game-highlight",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compVertical,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/game-highlight-vertical.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ Vertical game highlight rendered.");

// Render horizontal (YouTube) version
const compHorizontal = await selectComposition({
  serveUrl: bundled,
  id: "game-highlight-yt",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compHorizontal,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/game-highlight-youtube.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ YouTube game highlight rendered.");

await browser.close({ silent: false });
console.log("Done!");

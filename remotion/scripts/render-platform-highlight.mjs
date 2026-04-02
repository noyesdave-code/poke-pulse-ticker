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

// Render vertical version
const compV = await selectComposition({
  serveUrl: bundled,
  id: "platform-highlight",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compV,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/platform-highlight-vertical.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ Vertical platform highlight rendered.");

// Render horizontal version
const compH = await selectComposition({
  serveUrl: bundled,
  id: "platform-highlight-yt",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: compH,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/platform-highlight-youtube.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("✅ YouTube platform highlight rendered.");

await browser.close({ silent: false });
console.log("Done!");

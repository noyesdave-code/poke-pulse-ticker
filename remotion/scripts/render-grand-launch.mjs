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
const socialComp = await selectComposition({
  serveUrl: bundled,
  id: "grand-launch",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: socialComp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/grand-launch-social-vertical.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});
console.log("Vertical social version rendered.");

// Render horizontal (YouTube) version
const ytComp = await selectComposition({
  serveUrl: bundled,
  id: "grand-launch-yt",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: ytComp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/grand-launch-youtube.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log("Both grand launch videos rendered successfully.");

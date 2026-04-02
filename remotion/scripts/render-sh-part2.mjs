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
  serveUrl: bundled, id: "social-highlight-yt", puppeteerInstance: browser,
});

await renderMedia({
  composition: comp, serveUrl: bundled, codec: "h264",
  outputLocation: "/tmp/sh-yt-part2.mp4", puppeteerInstance: browser,
  muted: true, concurrency: 1,
  frameRange: [1800, 3599],
});
console.log("✅ SH Part 2 rendered (frames 1800-3599)");
await browser.close({ silent: false });

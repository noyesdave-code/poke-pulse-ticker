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
  id: "platform-update-promo",
  puppeteerInstance: browser,
});

await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/mnt/documents/PGVA_Platform_Update_Q2_2026.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

console.log("✅ Platform Update Promo rendered.");
await browser.close({ silent: false });

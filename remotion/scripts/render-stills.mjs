import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const scenes = [
  { frame: 30, name: "01-intro" },
  { frame: 80, name: "02-intro-sub" },
  { frame: 150, name: "03-host" },
  { frame: 180, name: "04-host-quote" },
  { frame: 240, name: "05-products" },
  { frame: 270, name: "06-products-all" },
  { frame: 340, name: "07-rip" },
  { frame: 400, name: "08-ripping" },
  { frame: 480, name: "09-pulls1" },
  { frame: 530, name: "10-pulls2" },
  { frame: 630, name: "11-results" },
  { frame: 680, name: "12-rating" },
  { frame: 780, name: "13-outro" },
  { frame: 850, name: "14-brand" },
];

const comp = await selectComposition({ serveUrl: bundled, id: "poke-ripz-show-ep1", puppeteerInstance: browser });

for (const s of scenes) {
  console.log(`Still: ${s.name} @ frame ${s.frame}`);
  await renderStill({ composition: comp, serveUrl: bundled, output: `/tmp/ripz-stills/${s.name}.png`, frame: s.frame, puppeteerInstance: browser });
}

await browser.close({ silent: false });
console.log("✅ All stills rendered!");

import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import fs from "fs";

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve("/dev-server/remotion/src/index.ts"),
  webpackOverride: c => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const scenes = [
  { frame: 30, name: "01-intro" },
  { frame: 150, name: "03-host" },
  { frame: 240, name: "05-products" },
  { frame: 340, name: "07-rip" },
  { frame: 400, name: "08-ripping" },
  { frame: 480, name: "09-pulls1" },
  { frame: 530, name: "10-pulls2" },
  { frame: 630, name: "11-results" },
  { frame: 780, name: "13-outro" },
];

for (let ep = 1; ep <= 10; ep++) {
  const compId = `poke-ripz-show-ep${ep}`;
  const dir = `/tmp/ripz-stills/ep${ep}`;
  fs.mkdirSync(dir, { recursive: true });
  
  try {
    const comp = await selectComposition({ serveUrl: bundled, id: compId, puppeteerInstance: browser });
    for (const s of scenes) {
      await renderStill({ composition: comp, serveUrl: bundled, output: `${dir}/${s.name}.png`, frame: s.frame, puppeteerInstance: browser });
    }
    console.log(`✅ EP${ep} done`);
  } catch(e) {
    console.error(`❌ EP${ep}: ${e.message}`);
  }
}

await browser.close({ silent: false });
console.log("✅ All stills rendered!");

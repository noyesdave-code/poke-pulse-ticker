import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compositions = [
  { id: "tier1-promo", output: "/mnt/documents/PGVA_Tier1_PokePulse_Promo_2026.mp4" },
  { id: "tier2-promo", output: "/mnt/documents/PGVA_Tier2_PulseMarket_Promo_2026.mp4" },
  { id: "tier3-promo", output: "/mnt/documents/PGVA_Tier3_PGTV_Promo_2026.mp4" },
  { id: "combined-demo", output: "/mnt/documents/PGVA_3Tier_Combined_Demo_2026.mp4" },
];

const targetId = process.argv[2] || "all";

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const toRender = targetId === "all" ? compositions : compositions.filter(c => c.id === targetId);

for (const comp of toRender) {
  console.log(`\n🎬 Rendering ${comp.id}...`);
  const composition = await selectComposition({ serveUrl: bundled, id: comp.id, puppeteerInstance: browser });
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: comp.output,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log(`✅ ${comp.id} → ${comp.output}`);
}

await browser.close({ silent: false });
console.log("\n🎉 All renders complete!");

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tiers = [
  { id: "tier1-promo", out: "PGVA_Tier1_PokéGarageVA_Promo_v2.mp4" },
  { id: "tier2-promo", out: "PGVA_Tier2_PokePulseEngine_Promo_v2.mp4" },
  { id: "tier3-promo", out: "PGVA_Tier3_PersonalPulseEngine_Promo_v2.mp4" },
  { id: "tier4-promo", out: "PGVA_Tier4_PGTVMediaHub_Promo_v2.mp4" },
  { id: "tier5-promo", out: "PGVA_Tier5_PulsePhilanthropic_Promo_v2.mp4" },
];

console.log("🎬 Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

for (const tier of tiers) {
  console.log(`\n🎥 Rendering ${tier.id}...`);
  const comp = await selectComposition({ serveUrl: bundled, id: tier.id, puppeteerInstance: browser });

  await renderMedia({
    composition: comp,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: `/mnt/documents/${tier.out}`,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log(`✅ ${tier.out} saved to /mnt/documents/`);
}

await browser.close({ silent: false });
console.log("\n🎉 All 5 refined tier promo videos rendered!");

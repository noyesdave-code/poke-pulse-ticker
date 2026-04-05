import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tiers = [
  { id: "tier1-promo", out: "PGVA_Tier1_PokéGarageVA_Promo.mp4", vo: "/tmp/tier1-vo.mp3" },
  { id: "tier2-promo", out: "PGVA_Tier2_PokéPulseEngine_Promo.mp4", vo: "/tmp/tier2-vo.mp3" },
  { id: "tier3-promo", out: "PGVA_Tier3_PulseEngine_Promo.mp4", vo: "/tmp/tier3-vo.mp3" },
  { id: "tier4-promo", out: "PGVA_Tier4_PGTVMediaHub_Promo.mp4", vo: "/tmp/tier4-vo.mp3" },
  { id: "tier5-promo", out: "PGVA_Tier5_PulsePhilanthropic_Promo.mp4", vo: "/tmp/tier5-vo.mp3" },
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

const bgMusic = "/tmp/tier-bg.mp3";

for (const tier of tiers) {
  console.log(`\n🎥 Rendering ${tier.id}...`);
  const comp = await selectComposition({ serveUrl: bundled, id: tier.id, puppeteerInstance: browser });
  const mutePath = `/tmp/${tier.id}-mute.mp4`;
  
  await renderMedia({
    composition: comp,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: mutePath,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log(`✅ ${tier.id} rendered (muted)`);

  // Mix audio
  try {
    console.log(`🎵 Mixing audio for ${tier.id}...`);
    execSync(`ffmpeg -y \
      -i "${tier.vo}" \
      -stream_loop -1 -i "${bgMusic}" \
      -filter_complex "\
        [1]atrim=0:32,asetpts=PTS-STARTPTS[bgraw];\
        [0]apad=whole_dur=32[vopad];\
        [vopad]asplit=2[vomain][vosc];\
        [bgraw][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=50:release=400:level_in=0.6[bgducked];\
        [vomain][bgducked]amix=inputs=2:duration=first:weights=1 0.5[premix];\
        [premix]afade=t=out:st=28:d=3[out]" \
      -map "[out]" -t 30 -ac 2 -ar 44100 /tmp/${tier.id}-mix.mp3`, { stdio: "pipe", timeout: 30000 });
    
    execSync(`ffmpeg -y -i ${mutePath} -i /tmp/${tier.id}-mix.mp3 -c:v copy -c:a aac -b:a 192k -shortest /mnt/documents/${tier.out}`, { stdio: "pipe", timeout: 30000 });
    console.log(`✅ ${tier.out} → /mnt/documents/`);
  } catch (e) {
    execSync(`cp ${mutePath} /mnt/documents/${tier.out}`);
    console.log(`⚠️ Audio mix failed, silent video saved`);
  }
}

await browser.close({ silent: false });
console.log("\n🎉 All 5 tier videos rendered!");

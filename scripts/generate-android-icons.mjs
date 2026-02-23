/**
 * Generate Android launcher icons from Airtel SVG.
 * Run: node scripts/generate-android-icons.mjs
 * Requires: npm install sharp (dev)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "airtel_icon_x512.svg");
const resPath = path.join(root, "android", "app", "src", "main", "res");

const sizes = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  for (const { folder, size } of sizes) {
    const dir = path.join(resPath, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const png = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();

    const names = ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"];
    for (const name of names) {
      fs.writeFileSync(path.join(dir, name), png);
      console.log(`Wrote ${folder}/${name} (${size}x${size})`);
    }
  }
  console.log("Done. Airtel launcher icons generated.");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

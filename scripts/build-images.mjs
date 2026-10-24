// 產生網站用的多種尺寸圖片（public/_img/），讓手機只下載需要的大小。
// 在 `npm run build` 前自動執行；已存在且比原圖新的檔案會略過。
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const WIDTHS = [256, 480, 768, 1080, 1400];
const root = process.cwd();
const sourceDir = path.join(root, "public", "assets");
const outputDir = path.join(root, "public", "_img", "assets");

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(webp|jpe?g|png)$/i.test(entry.name)) yield full;
  }
}

async function isFresh(target, sourceMtime) {
  try {
    return (await fs.stat(target)).mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

let created = 0;
let skipped = 0;
for await (const file of walk(sourceDir)) {
  const relative = path.relative(sourceDir, file).replace(/\.(webp|jpe?g|png)$/i, "");
  const { mtimeMs } = await fs.stat(file);
  for (const width of WIDTHS) {
    const target = path.join(outputDir, `${relative}-${width}.webp`);
    if (await isFresh(target, mtimeMs)) {
      skipped += 1;
      continue;
    }
    await fs.mkdir(path.dirname(target), { recursive: true });
    const meta = await sharp(file).metadata();
    if (meta.format === "webp" && (meta.width ?? 0) <= width) {
      // 原圖已是壓縮過的 webp 且不比目標大：直接沿用
      await fs.copyFile(file, target);
    } else {
      await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 68, effort: 5, smartSubsample: true })
        .toFile(target);
    }
    created += 1;
  }
}
console.log(`images: ${created} created, ${skipped} up to date`);

/**
 * next/image 自訂載入器：靜態網站沒有圖片伺服器，
 * 改用 scripts/build-images.mjs 預先產生的尺寸（public/_img/）。
 */
const WIDTHS = [256, 480, 768, 1080, 1400];

export function imageVariant(src: string, width: number) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = basePath && src.startsWith(basePath) ? src.slice(basePath.length) : src;
  if (!path.startsWith("/assets/") || !/\.(webp|jpe?g|png)$/i.test(path)) return src;
  const size = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${basePath}/_img${path.replace(/\.(webp|jpe?g|png)$/i, "")}-${size}.webp`;
}

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return imageVariant(src, width);
}

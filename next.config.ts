import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
// 子路徑由 NEXT_PUBLIC_BASE_PATH 決定：github.io 預覽用 "/maison-aurelia-gift-demo"，
// 綁定自訂網域（例如 yue-jin-yan.com）後設為空字串即可。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

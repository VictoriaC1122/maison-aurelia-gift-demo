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
  experimental: {
    // 中英文各自是獨立的 root layout，404 頁面需要自己的外框
    globalNotFound: true
  },
  env: {
    NEXT_PUBLIC_TRAILING_SLASH: isGithubPages ? "true" : ""
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;

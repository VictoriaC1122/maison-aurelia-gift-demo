import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? "/maison-aurelia-gift-demo" : undefined,
  assetPrefix: isGithubPages ? "/maison-aurelia-gift-demo/" : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brandNameZh} ${site.brandName}`,
    short_name: site.brandNameZh,
    description: site.metaDescription,
    start_url: "/",
    display: "browser",
    background_color: "#F7F1E8",
    theme_color: "#FCFAF6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}

import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/checkout/", "/en/checkout/"]
    },
    sitemap: absoluteSiteUrl("/sitemap.xml")
  };
}

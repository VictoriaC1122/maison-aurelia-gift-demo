import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { absoluteSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/why-us",
    "/collections",
    "/custom",
    "/ordering",
    "/shipping",
    "/faq",
    "/contact",
    "/order"
  ];

  return [
    ...staticRoutes.map((route) => ({ url: absoluteSiteUrl(route || "/"), lastModified: new Date() })),
    ...getCategories().map((category) => ({
      url: absoluteSiteUrl(`/collections/${category.slug}`),
      lastModified: new Date()
    })),
    ...getProducts().map((product) => ({
      url: absoluteSiteUrl(`/products/${product.slug}`),
      lastModified: new Date()
    }))
  ];
}

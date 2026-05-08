import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
    "/order",
    "/admin/orders"
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...getCategories().map((category) => ({
      url: `${base}/collections/${category.slug}`,
      lastModified: new Date()
    })),
    ...getProducts().map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}

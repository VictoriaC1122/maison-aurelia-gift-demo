import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { localeUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/products",
    "/about",
    "/collections",
    "/custom",
    "/ordering",
    "/shipping",
    "/faq",
    "/contact",
    "/returns",
    "/privacy",
    ...getCategories().map((category) => `/collections/${category.slug}`),
    ...getProducts().map((product) => `/products/${product.slug}`)
  ];
  const lastModified = new Date();

  // 每個頁面列出中文與英文兩個網址，並互相標示對應語言版本
  return paths.flatMap((path) => {
    const languages = { "zh-Hant-TW": localeUrl("zh", path), en: localeUrl("en", path) };
    return [
      { url: localeUrl("zh", path), lastModified, alternates: { languages } },
      { url: localeUrl("en", path), lastModified, alternates: { languages } }
    ];
  });
}

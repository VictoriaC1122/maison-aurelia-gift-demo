import type { Metadata } from "next";
import { productName, productSummary, site } from "@/lib/content";
import { getMessages, hasEnglishVersion, localePath, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteUrlWithSlash = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
const trailingSlash = process.env.GITHUB_PAGES === "true";

export function absoluteSiteUrl(path = "/") {
  let normalizedPath = path === "/" ? "" : path.replace(/^\//, "");
  // 靜態網站的頁面網址以「/」結尾（圖片等檔案除外），避免多一次轉址
  if (trailingSlash && normalizedPath && !normalizedPath.endsWith("/") && !/\.[a-z0-9]+$/i.test(normalizedPath)) {
    normalizedPath = `${normalizedPath}/`;
  }
  return new URL(normalizedPath, siteUrlWithSlash).toString();
}

/** 指定語言版本的完整網址 */
export function localeUrl(locale: Locale, path = "/") {
  return absoluteSiteUrl(localePath(locale, path));
}

function resolveTitle(title: string | undefined, locale: Locale) {
  const fallback = getMessages(locale).home.metaTitle;
  if (!title) return fallback;
  if (title.includes(site.brandNameZh) || title.includes(site.brandName)) return title;
  return locale === "en" ? `${title} | ${site.brandName}` : `${title}｜${site.brandNameZh}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = site.ogImage,
  noIndex = false,
  locale = "zh"
}: {
  title?: string;
  description?: string;
  /** 不含 /en 的頁面路徑 */
  path?: string;
  image?: string;
  noIndex?: boolean;
  locale?: Locale;
} = {}): Metadata {
  const messages = getMessages(locale);
  const resolvedTitle = resolveTitle(title, locale);
  const resolvedDescription = description ?? messages.home.metaDescription;
  const canonical = localeUrl(locale, path);
  const ogImage = absoluteSiteUrl(image.startsWith("/") ? image : `/${image}`);
  const bilingual = hasEnglishVersion(path);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(siteUrlWithSlash),
    alternates: {
      canonical,
      languages: bilingual
        ? {
            "zh-Hant-TW": localeUrl("zh", path),
            en: localeUrl("en", path),
            "x-default": localeUrl("zh", path)
          }
        : undefined
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: locale === "en" ? site.brandName : site.brandNameZh,
      locale: messages.ogLocale,
      alternateLocale: bilingual ? [locale === "en" ? "zh_TW" : "en_US"] : undefined,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: locale === "en" ? site.brandName : site.brandNameZh
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : undefined
  };
}

export function buildSiteSchemas(locale: Locale = "zh") {
  const messages = getMessages(locale);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: locale === "en" ? site.brandName : site.brandNameZh,
      alternateName: locale === "en" ? site.brandNameZh : site.brandName,
      url: localeUrl(locale, "/"),
      slogan: locale === "en" ? site.englishSlogan : site.chineseSlogan,
      logo: absoluteSiteUrl(site.ogImage),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["zh-Hant", "en"],
        url: localeUrl(locale, "/contact")
      },
      sameAs: [site.socialLinks.instagram, `https://line.me/R/ti/p/~${site.socialLinks.line}`].filter(Boolean)
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: locale === "en" ? site.brandName : site.brandNameZh,
      url: localeUrl(locale, "/"),
      description: messages.home.metaDescription,
      inLanguage: messages.htmlLang
    }
  ];
}

export function buildProductSchema(product: Product, locale: Locale = "zh") {
  const url = localeUrl(locale, `/products/${product.slug}`);
  const offers = product.price
    ? {
        "@type": "Offer",
        priceCurrency: "TWD",
        availability: "https://schema.org/InStock",
        url,
        price: product.price,
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "TWD",
          price: product.price
        }
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName(product, locale),
    alternateName: locale === "en" ? product.nameZh : product.name,
    description: productSummary(product, locale),
    image: product.images.map((image) => absoluteSiteUrl(image)),
    brand: {
      "@type": "Brand",
      name: site.brandName
    },
    category: product.category,
    sku: product.slug,
    offers
  };
}

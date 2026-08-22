import type { Metadata } from "next";
import { site } from "@/lib/content";
import type { Product } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteUrlWithSlash = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;

export function absoluteSiteUrl(path = "/") {
  const normalizedPath = path === "/" ? "" : path.replace(/^\//, "");
  return new URL(normalizedPath, siteUrlWithSlash).toString();
}

function resolveTitle(title?: string) {
  if (!title || title === site.metaTitle) {
    return site.metaTitle;
  }

  return title.includes(site.brandName) ? title : `${title} | ${site.brandName}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = site.ogImage,
  noIndex = false
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const resolvedTitle = resolveTitle(title);
  const resolvedDescription = description ?? site.metaDescription;
  const canonical = absoluteSiteUrl(path);
  const ogImage = absoluteSiteUrl(image.startsWith("/") ? image : `/${image}`);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(siteUrlWithSlash),
    alternates: {
      canonical
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: site.brandName,
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: site.brandName
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

export function buildSiteSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.brandName,
      alternateName: site.brandNameZh,
      url: absoluteSiteUrl("/"),
      slogan: site.chineseSlogan,
      logo: absoluteSiteUrl(site.ogImage),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["zh-Hant", "en"],
        url: absoluteSiteUrl("/contact")
      },
      sameAs: [site.socialLinks.instagram, `https://line.me/R/ti/p/~${site.socialLinks.line}`].filter(Boolean)
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.brandName,
      url: absoluteSiteUrl("/"),
      description: site.metaDescription,
      inLanguage: "zh-Hant"
    }
  ];
}

export function buildProductSchema(product: Product) {
  const offers = product.price
    ? {
        "@type": "Offer",
        priceCurrency: "TWD",
        availability: "https://schema.org/InStock",
        url: absoluteSiteUrl(`/products/${product.slug}`),
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
    name: product.nameZh,
    alternateName: product.name,
    description: product.summary,
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

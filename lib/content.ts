import siteData from "@/data/site.json";
import contactData from "@/data/contact.json";
import faqData from "@/data/faq.json";
import productsData from "@/data/products.json";
import type { Locale } from "@/lib/i18n";
import type { Category, ContactData, FaqItem, OrderRecord, Product, ProductDetails, ProductsData, SiteData } from "@/lib/types";

export const site = siteData as SiteData;
export const contact = contactData as ContactData;
export const faqs = faqData as FaqItem[];
export const productContent = productsData as ProductsData;

export function getCategories() {
  return productContent.categories;
}

export function getCategory(slug: string) {
  return productContent.categories.find((category) => category.slug === slug);
}

export function getProducts() {
  return productContent.products;
}

export function getProduct(slug: string) {
  return productContent.products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return productContent.products.slice(0, 3);
}

export function getProductsByCategory(category: string) {
  return productContent.products.filter((product) => product.category === category);
}

/* ---------- 依語言取得顯示文字 ---------- */

export function productName(product: Product, locale: Locale) {
  return locale === "en" ? product.name : product.nameZh;
}

/** 次要名稱：中文版顯示英文名，英文版顯示中文名 */
export function productAltName(product: Product, locale: Locale) {
  return locale === "en" ? product.nameZh : product.name;
}

export function productSummary(product: Product, locale: Locale) {
  return locale === "en" ? product.summaryEn || product.summary : product.summary;
}

export function productFeatures(product: Product, locale: Locale) {
  return locale === "en" && product.featuresEn?.length ? product.featuresEn : product.features;
}

export function productDetails(product: Product, locale: Locale): ProductDetails {
  const base = product.details ?? {};
  if (locale !== "en" || !product.detailsEn) return base;
  const merged: ProductDetails = { ...base };
  for (const [key, value] of Object.entries(product.detailsEn)) {
    if (value) merged[key as keyof ProductDetails] = value;
  }
  return merged;
}

export function categoryName(category: Category, locale: Locale) {
  return locale === "en" ? category.nameEn || category.englishName : category.name;
}

export function categoryAltName(category: Category, locale: Locale) {
  return locale === "en" ? category.name : category.englishName;
}

export function categoryDescription(category: Category, locale: Locale) {
  return locale === "en" ? category.descriptionEn || category.description : category.description;
}

export function getFactoryCaption(image: string, index = 0, locale: Locale = "zh") {
  if (locale === "en") {
    return productContent.factoryCaptionsEn?.[image] ?? `Vietnam swiftlet house ${index + 1}`;
  }
  return productContent.factoryCaptions?.[image] ?? `越南燕廠實景 ${index + 1}`;
}

export function getFaqs(locale: Locale) {
  return faqs.map((item) => ({
    question: locale === "en" ? item.questionEn || item.question : item.question,
    answer: locale === "en" ? item.answerEn || item.answer : item.answer
  }));
}

export function getDefaultOrder(product?: Product): Partial<OrderRecord> {
  return {
    productName: product?.nameZh ?? "",
    category: product?.category ?? "",
    option: product?.specification ?? "",
    quantity: 1,
    note: ""
  };
}

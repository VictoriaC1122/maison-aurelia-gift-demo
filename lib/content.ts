import siteData from "@/data/site.json";
import contactData from "@/data/contact.json";
import faqData from "@/data/faq.json";
import productsData from "@/data/products.json";
import type { ContactData, OrderRecord, Product, ProductsData, SiteData } from "@/lib/types";

export const site = siteData as SiteData;
export const contact = contactData as ContactData;
export const faqs = faqData as Array<{ question: string; answer: string }>;
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

export function getDefaultOrder(product?: Product): Partial<OrderRecord> {
  return {
    productName: product?.nameZh ?? "",
    category: product?.category ?? "",
    option: product?.specification ?? "",
    quantity: 1,
    note: ""
  };
}

import { site } from "@/lib/content";
import type { Product } from "@/lib/types";

export type CartLine = { slug: string; quantity: number };

export type PricedLine = {
  product: Product;
  quantity: number;
  unitPrice: number | null;
  lineTotal: number | null;
};

export type CartSummary = {
  lines: PricedLine[];
  itemCount: number;
  /** null 代表購物車中有尚未公開售價的商品，金額由顧問確認 */
  subtotal: number | null;
  shippingFee: number | null;
  total: number | null;
  freeShippingThreshold: number;
  /** 距離免運還差多少；已達免運或無法計算時為 0 / null */
  freeShippingRemaining: number | null;
};

export function parsePrice(value: string | undefined) {
  if (!value) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : null;
}

export function displaySpecification(value: string) {
  return !value || value === "待補" ? "規格由顧問確認" : value;
}

export function formatTWD(value: number) {
  return `NT$${Math.round(value).toLocaleString("en-US")}`;
}

export function summarizeCart(
  cart: CartLine[],
  products: Product[],
  baseShippingFee: number | null = site.shippingPolicy.standardShippingFee
): CartSummary {
  const lines: PricedLine[] = cart
    .map((line) => {
      const product = products.find((item) => item.slug === line.slug);
      if (!product) return null;
      const unitPrice = parsePrice(product.price);
      return {
        product,
        quantity: line.quantity,
        unitPrice,
        lineTotal: unitPrice === null ? null : unitPrice * line.quantity
      };
    })
    .filter((line): line is PricedLine => line !== null);

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const allPriced = lines.length > 0 && lines.every((line) => line.lineTotal !== null);
  const subtotal = allPriced ? lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0) : null;
  const threshold = site.shippingPolicy.freeShippingThreshold;
  const shippingFee =
    subtotal === null ? null : subtotal >= threshold ? 0 : baseShippingFee;
  const total = subtotal === null || shippingFee === null ? null : subtotal + shippingFee;

  return {
    lines,
    itemCount,
    subtotal,
    shippingFee,
    total,
    freeShippingThreshold: threshold,
    freeShippingRemaining: subtotal === null ? null : Math.max(0, threshold - subtotal)
  };
}

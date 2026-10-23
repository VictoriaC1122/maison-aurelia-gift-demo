import { clsx } from "clsx";
import { getMessages, type Locale } from "@/lib/i18n";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function withBasePath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/")) {
    return path;
  }

  return `${basePath}${path}`;
}

export function formatCurrency(value: string, from = false, locale: Locale = "zh") {
  const messages = getMessages(locale);
  if (!value) {
    return messages.common.priceOnRequest;
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }

  const formatted = `NT$${Math.round(numeric).toLocaleString("en-US")}`;

  return from ? messages.common.priceFrom(formatted) : formatted;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function slugToTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

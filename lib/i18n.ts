import { en } from "@/lib/messages/en";
import { zh, type Messages } from "@/lib/messages/zh";

export type Locale = "zh" | "en";
export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";

/** 只有中文版的頁面（後台、舊版下單網址） */
const ZH_ONLY_PREFIXES = ["/admin", "/order"];

const dictionaries: Record<Locale, Messages> = { zh, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? zh;
}

/** 把站內路徑轉成指定語言的網址：中文維持原路徑，英文加上 /en */
export function localePath(locale: Locale, path: string) {
  if (locale === "zh" || path.startsWith("#") || /^https?:/.test(path)) return path;
  if (path === "/" || path === "") return "/en";
  if (path.startsWith("/?")) return `/en${path.slice(1)}`;
  return `/en${path.startsWith("/") ? path : `/${path}`}`;
}

/** 從網址判斷語言，並取出不含語言前綴的路徑 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/en" || pathname === "/en/") return { locale: "en", path: "/" };
  if (pathname.startsWith("/en/")) return { locale: "en", path: pathname.slice(3) || "/" };
  return { locale: "zh", path: pathname || "/" };
}

export function hasEnglishVersion(path: string) {
  return !ZH_ONLY_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export type { Messages };

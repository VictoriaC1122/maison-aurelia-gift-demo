"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { hasEnglishVersion, localePath, splitLocale, type Locale } from "@/lib/i18n";
import { cn, withBasePath } from "@/lib/utils";

/** 取得目前頁面「不含語言前綴」的路徑 */
export function useBarePath() {
  const pathname = usePathname() ?? "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const withoutBase = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
  const normalized = withoutBase.length > 1 ? withoutBase.replace(/\/$/, "") : withoutBase;
  return splitLocale(normalized).path;
}

/**
 * 語言切換：停留在同一頁，只換語言。
 * variant="pill" 用在導覽列；"menu" 用在手機選單；"footer" 用在頁尾。
 */
export function LanguageSwitch({ variant = "pill", className }: { variant?: "pill" | "menu" | "footer"; className?: string }) {
  const { locale } = useLocale();
  const path = useBarePath();

  if (!hasEnglishVersion(path)) return null;

  const trailing = process.env.NEXT_PUBLIC_TRAILING_SLASH === "true";
  const target = (next: Locale) => {
    const url = localePath(next, path);
    return withBasePath(trailing && !url.endsWith("/") ? `${url}/` : url);
  };

  const go = (next: Locale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (next === locale) {
      event.preventDefault();
      return;
    }
    // 保留查詢參數（例如訂單查詢的訂單編號）
    if (window.location.search || window.location.hash) {
      event.preventDefault();
      window.location.href = `${target(next)}${window.location.search}${window.location.hash}`;
    }
  };

  const options: Array<{ id: Locale; label: string; full: string }> = [
    { id: "zh", label: "中文", full: "中文版" },
    { id: "en", label: "EN", full: "English" }
  ];

  if (variant === "menu") {
    return (
      <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Language / 語言">
        <Globe aria-hidden="true" className="h-4 w-4 text-ink/45" />
        {options.map((option) => (
          <a
            key={option.id}
            href={target(option.id)}
            hrefLang={option.id === "zh" ? "zh-Hant" : "en"}
            lang={option.id === "zh" ? "zh-Hant" : "en"}
            onClick={go(option.id)}
            aria-current={option.id === locale ? "true" : undefined}
            className={cn(
              "inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border px-4 text-sm transition",
              option.id === locale ? "border-ink bg-ink text-pearl" : "border-champagne/30 bg-white/70 text-ink/75 hover:bg-white"
            )}
          >
            {option.full}
          </a>
        ))}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("flex items-center gap-3 text-xs", className)} role="group" aria-label="Language / 語言">
        <Globe aria-hidden="true" className="h-3.5 w-3.5 text-pearl/45" />
        {options.map((option, index) => (
          <span key={option.id} className="flex items-center gap-3">
            {index > 0 ? <span aria-hidden="true" className="text-pearl/25">|</span> : null}
            <a
              href={target(option.id)}
              hrefLang={option.id === "zh" ? "zh-Hant" : "en"}
              lang={option.id === "zh" ? "zh-Hant" : "en"}
              onClick={go(option.id)}
              aria-current={option.id === locale ? "true" : undefined}
              className={cn("transition hover:text-pearl", option.id === locale ? "text-pearl" : "text-pearl/55")}
            >
              {option.full}
            </a>
          </span>
        ))}
      </div>
    );
  }

  const other: Locale = locale === "zh" ? "en" : "zh";

  return (
    <>
      {/* 手機：一顆按鈕直接切到另一種語言 */}
      <a
        href={target(other)}
        hrefLang={other === "zh" ? "zh-Hant" : "en"}
        lang={other === "zh" ? "zh-Hant" : "en"}
        onClick={go(other)}
        aria-label={other === "zh" ? "切換為中文版" : "Switch to English"}
        className={cn(
          "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-champagne/25 bg-white/70 px-2.5 text-[12px] tracking-[0.04em] text-ink transition hover:bg-white sm:hidden",
          className
        )}
      >
        <Globe aria-hidden="true" className="h-3.5 w-3.5 text-ink/50" />
        {other === "zh" ? "中文" : "EN"}
      </a>
      {/* 平板以上：中文｜EN 切換 */}
      <div
        className={cn("hidden h-11 items-center rounded-full border border-champagne/25 bg-white/70 p-1 text-[12px] sm:inline-flex", className)}
        role="group"
        aria-label="Language / 語言"
      >
        {options.map((option) => (
          <a
            key={option.id}
            href={target(option.id)}
            hrefLang={option.id === "zh" ? "zh-Hant" : "en"}
            lang={option.id === "zh" ? "zh-Hant" : "en"}
            onClick={go(option.id)}
            aria-current={option.id === locale ? "true" : undefined}
            aria-label={option.id === "zh" ? "切換為中文版" : "Switch to English"}
            className={cn(
              "inline-flex h-full min-w-[38px] items-center justify-center rounded-full px-2.5 tracking-[0.04em] transition",
              option.id === locale ? "bg-ink text-pearl" : "text-ink/65 hover:text-ink"
            )}
          >
            {option.label}
          </a>
        ))}
      </div>
    </>
  );
}

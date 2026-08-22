"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleMore, Package2 } from "lucide-react";
import { contact, site } from "@/lib/content";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "品牌介紹" },
  { href: "/why-us", label: "Why Us" },
  { href: "/collections", label: "商品系列" },
  { href: "/custom", label: "客製化方案" },
  { href: "/ordering", label: "訂購流程" },
  { href: "/shipping", label: "配送與運費" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "聯絡我們" },
  { href: "/order", label: "立即下單" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActiveLink = (href: string) => (href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/40 bg-pearl/78 backdrop-blur-2xl">
        <div className="mobile-header-main mx-auto grid w-[min(1240px,calc(100vw-24px))] grid-cols-[1fr_auto] items-center gap-3 py-3 md:w-[min(1240px,calc(100vw-48px))] xl:grid-cols-[auto_1fr_auto] xl:gap-5 xl:py-4">
          <Link href="/" className="flex min-w-0 flex-col">
            <span className="text-[10px] uppercase tracking-[0.35em] text-champagne md:text-[11px]">
              {site.brandNameZh}
            </span>
            <span className="truncate font-display text-lg text-ink md:text-2xl">{site.brandName}</span>
          </Link>

          <nav aria-label="主要導覽" className="hidden min-w-0 gap-3 overflow-x-auto whitespace-nowrap pb-1 text-sm text-ink/70 xl:flex xl:items-center xl:justify-center xl:overflow-visible xl:gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActiveLink(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 transition hover:text-ink xl:px-3.5",
                  isActiveLink(item.href) ? "bg-white/75 text-ink shadow-[0_10px_25px_rgba(32,24,18,0.06)]" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:justify-self-end">
            <div className="mobile-header-actions xl:hidden">
              <a href={`https://line.me/R/ti/p/~${contact.line}`} className="mobile-header-actions__cta">
                LINE
              </a>
              <Link href="/order" className="mobile-header-actions__cta mobile-header-actions__cta--primary">
                下單
              </Link>
            </div>
            <Link
              href="/order"
              className="hidden rounded-full border border-champagne/40 bg-ink px-5 py-3 text-sm text-pearl shadow-glass transition hover:-translate-y-0.5 xl:inline-flex"
            >
              開始下單
            </Link>
          </div>
        </div>

        <div className="mobile-nav-strip xl:hidden">
          <div className="mobile-nav-strip__scroller">
            {navItems
              .filter((item) => item.href !== "/" && item.href !== "/order")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                  className={cn("mobile-nav-strip__chip", isActiveLink(item.href) ? "mobile-nav-strip__chip--active" : "")}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      </header>
      <div className="mobile-dock md:hidden">
        <a href={`https://line.me/R/ti/p/~${contact.line}`} className="mobile-dock__item">
          <MessageCircleMore className="h-4 w-4" />
          <span>LINE 諮詢</span>
        </a>
        <Link href="/order" className="mobile-dock__item mobile-dock__item--primary">
          <Package2 className="h-4 w-4" />
          <span>立即下單</span>
        </Link>
      </div>
    </>
  );
}

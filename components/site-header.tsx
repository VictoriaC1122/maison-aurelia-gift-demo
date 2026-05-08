"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MessageCircleMore, Package2, ShoppingBag, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/40 bg-pearl/78 backdrop-blur-2xl">
        <div className="mobile-header-main mx-auto grid w-[min(1240px,calc(100vw-24px))] grid-cols-[1fr_auto] items-center gap-3 py-3 md:w-[min(1240px,calc(100vw-48px))] xl:grid-cols-[auto_1fr_auto] xl:gap-4 xl:py-4">
          <Link href="/" className="flex min-w-0 flex-col" onClick={closeMenu}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-champagne md:text-[11px]">
              {site.brandNameZh}
            </span>
            <span className="truncate font-display text-lg text-ink md:text-2xl">{site.brandName}</span>
          </Link>

          <nav className="hidden gap-5 overflow-x-auto whitespace-nowrap pb-1 text-sm text-ink/70 xl:flex xl:items-center xl:justify-center xl:overflow-visible">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 xl:justify-self-end">
            <div className="mobile-header-actions">
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
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="mobile-menu-trigger inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/25 bg-white/70 text-ink shadow-glass transition active:scale-[0.98] xl:hidden"
              aria-label="開啟選單"
              aria-expanded={isOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mobile-nav-strip">
          <div className="mobile-nav-strip__scroller">
            {navItems
              .filter((item) => item.href !== "/" && item.href !== "/order")
              .map((item) => (
                <Link key={item.href} href={item.href} className="mobile-nav-strip__chip">
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-[#1b140f]/35 backdrop-blur-sm transition duration-300 xl:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMenu}
      />

      <div
        className={cn(
          "fixed inset-x-0 top-0 z-[70] mx-auto w-full max-w-none px-3 pt-3 transition duration-300 xl:hidden",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"
        )}
      >
        <div className="rounded-[2rem] border border-white/70 bg-[#f9f4eb]/96 p-5 shadow-[0_24px_80px_rgba(44,28,16,0.16)] backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-champagne">{site.brandNameZh}</p>
              <p className="mt-1 font-display text-2xl text-ink">{site.brandName}</p>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 bg-white/75 text-ink"
              aria-label="關閉選單"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-[1.2rem] border border-champagne/10 bg-white/60 px-4 py-4 text-base text-ink transition active:scale-[0.99]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link href="/collections" onClick={closeMenu} className="hero-button-light justify-center py-3.5">
              瀏覽系列
            </Link>
            <Link href="/order" onClick={closeMenu} className="hero-button-dark justify-center py-3.5">
              立即下單
            </Link>
          </div>
        </div>
      </div>

      <div className="mobile-dock xl:hidden">
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

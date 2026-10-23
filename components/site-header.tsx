"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, MessageCircleMore, PackageSearch, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { contact, site } from "@/lib/content";
import { formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "全部商品" },
  { href: "/collections/factory", label: "產地故事" },
  { href: "/custom", label: "企業禮贈" },
  { href: "/about", label: "品牌故事" },
  { href: "/ordering", label: "購物說明" }
];

function useNormalizedPath() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

function CartButton({ className }: { className?: string }) {
  const { count, open, ready } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`購物車，${count} 件商品`}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/25 bg-white/70 text-ink transition hover:bg-white",
        className
      )}
    >
      <ShoppingBag aria-hidden="true" className="h-[18px] w-[18px]" />
      {ready && count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a2533f] px-1 text-[11px] leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}

export function SiteHeader() {
  const path = useNormalizedPath();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isActive = (href: string) => {
    if (href === "/products") return path === "/products" || path.startsWith("/products/") || path === "/collections";
    return path === href || path.startsWith(`${href}/`);
  };

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[12px] tracking-[0.06em] text-pearl/85">
        全館滿 {formatTWD(site.shippingPolicy.freeShippingThreshold)} 免運
        <span className="mx-2 text-pearl/35">｜</span>
        <span className="hidden sm:inline">宅配到府・7-11／全家超商取貨</span>
        <span className="sm:hidden">宅配・超商取貨</span>
      </div>
      <header className="sticky top-0 z-50 border-b border-champagne/15 bg-pearl/88 backdrop-blur-2xl">
        <div className="shell flex items-center gap-3 py-3 xl:gap-6 xl:py-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="開啟選單"
            aria-expanded={menuOpen}
            className="-ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-white/70 xl:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>

          <Link href="/" className="flex min-w-0 flex-col leading-none" aria-label={`${site.brandNameZh} 首頁`}>
            <span className="font-display text-[1.45rem] text-ink md:text-[1.7rem]">{site.brandNameZh}</span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.42em] text-champagne md:text-[10px]">{site.brandName}</span>
          </Link>

          <nav aria-label="主要導覽" className="mx-auto hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-ink/70 transition hover:text-ink",
                  isActive(item.href) ? "bg-white text-ink shadow-[0_6px_18px_rgba(32,24,18,0.06)]" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <Link
              href="/track"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-ink/70 transition hover:bg-white/70 hover:text-ink md:inline-flex"
            >
              <PackageSearch aria-hidden="true" className="h-[18px] w-[18px]" />
              訂單查詢
            </Link>
            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-ink/70 transition hover:bg-white/70 hover:text-ink md:inline-flex"
            >
              <MessageCircleMore aria-hidden="true" className="h-[18px] w-[18px]" />
              LINE 諮詢
            </a>
            <CartButton />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label="網站選單">
            <motion.button
              type="button"
              aria-label="關閉選單"
              className="absolute inset-0 bg-[rgba(21,18,15,0.38)]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              aria-label="行動版選單"
              className="absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col bg-pearl"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-champagne/15 px-5 py-4">
                <span className="font-display text-xl text-ink">{site.brandNameZh}</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="關閉選單"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto px-3 py-3">
                {[{ href: "/", label: "首頁" }, ...navItems, { href: "/track", label: "訂單查詢" }, { href: "/faq", label: "常見問題" }, { href: "/contact", label: "聯絡我們" }].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex min-h-[52px] items-center rounded-2xl px-4 text-[1.02rem] text-ink/80",
                        (item.href === "/" ? path === "/" : isActive(item.href)) ? "bg-white text-ink" : "hover:bg-white/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 border-t border-champagne/15 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                <a
                  href={`https://line.me/R/ti/p/~${contact.line}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-button-dark min-h-[50px] w-full justify-center gap-2"
                >
                  <MessageCircleMore aria-hidden="true" className="h-4 w-4" /> LINE 諮詢
                </a>
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hero-button-light min-h-[50px] w-full justify-center gap-2">
                  <Phone aria-hidden="true" className="h-4 w-4" /> {contact.phone}
                </a>
              </div>
            </motion.nav>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

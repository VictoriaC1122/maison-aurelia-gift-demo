"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, MessageCircleMore, PackageSearch, Phone, ShoppingBag, X } from "lucide-react";
import { LanguageSwitch, useBarePath } from "@/components/language-switch";
import { useLocale } from "@/components/locale-provider";
import { useCart } from "@/lib/cart";
import { contact, site } from "@/lib/content";
import { formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function CartButton({ className }: { className?: string }) {
  const { count, open, ready } = useCart();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={t.nav.cartAria(count)}
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
  const { locale, t, href } = useLocale();
  const path = useBarePath();
  const navItems = [
    { href: "/products", label: t.nav.products },
    { href: "/collections/factory", label: t.nav.origin },
    { href: "/custom", label: t.nav.corporate },
    { href: "/about", label: t.nav.about },
    { href: "/ordering", label: t.nav.guide }
  ];
  const primaryName = locale === "en" ? site.brandName : site.brandNameZh;
  const secondaryName = locale === "en" ? site.brandNameZh : site.brandName;
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
        {t.announcement.freeShipping(formatTWD(site.shippingPolicy.freeShippingThreshold))}
        <span className="mx-2 text-pearl/35">｜</span>
        <span className="hidden sm:inline">{t.announcement.deliveryLong}</span>
        <span className="sm:hidden">{t.announcement.deliveryShort}</span>
      </div>
      <header className="sticky top-0 z-50 border-b border-champagne/15 bg-pearl/88 backdrop-blur-2xl">
        <div className="shell flex items-center gap-3 py-3 xl:gap-6 xl:py-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            className="-ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-white/70 xl:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>

          <Link href={href("/")} className="flex min-w-0 flex-col leading-none" aria-label={t.nav.homeAria}>
            <span
              className={cn(
                "font-display text-ink",
                locale === "en" ? "whitespace-nowrap text-[1.15rem] tracking-[0.12em] md:text-[1.4rem]" : "text-[1.45rem] md:text-[1.7rem]"
              )}
            >
              {primaryName}
            </span>
            <span
              className={cn(
                "mt-1 text-champagne",
                locale === "en" ? "text-[10px] tracking-[0.5em] md:text-[11px]" : "text-[9px] uppercase tracking-[0.42em] md:text-[10px]"
              )}
            >
              {secondaryName}
            </span>
          </Link>

          <nav aria-label={t.nav.mainNav} className="mx-auto hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
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
              href={href("/track")}
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-ink/70 transition hover:bg-white/70 hover:text-ink md:inline-flex"
            >
              <PackageSearch aria-hidden="true" className="h-[18px] w-[18px]" />
              {t.nav.track}
            </Link>
            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-ink/70 transition hover:bg-white/70 hover:text-ink md:inline-flex"
            >
              <MessageCircleMore aria-hidden="true" className="h-[18px] w-[18px]" />
              {t.common.lineConsult}
            </a>
            <LanguageSwitch />
            <CartButton />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
            <motion.button
              type="button"
              aria-label={t.nav.closeMenu}
              className="absolute inset-0 bg-[rgba(21,18,15,0.38)]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              aria-label={t.nav.mobileNav}
              className="absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col bg-pearl"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-champagne/15 px-5 py-4">
                <span className="font-display text-xl text-ink">{primaryName}</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto px-3 py-3">
                {[{ href: "/", label: t.nav.home }, ...navItems, { href: "/track", label: t.nav.track }, { href: "/faq", label: t.nav.faq }, { href: "/contact", label: t.nav.contact }].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={href(item.href)}
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
                <LanguageSwitch variant="menu" className="pb-2" />
                <a
                  href={`https://line.me/R/ti/p/~${contact.line}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-button-dark min-h-[50px] w-full justify-center gap-2"
                >
                  <MessageCircleMore aria-hidden="true" className="h-4 w-4" /> {t.common.lineConsult}
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

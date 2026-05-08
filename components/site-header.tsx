import Link from "next/link";
import { site } from "@/lib/content";

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
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-pearl/70 backdrop-blur-xl">
      <div className="mx-auto grid w-[min(1240px,calc(100vw-24px))] gap-4 py-4 md:w-[min(1240px,calc(100vw-48px))] xl:grid-cols-[auto_1fr_auto] xl:items-center">
        <Link href="/" className="flex min-w-0 flex-col">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne">
            {site.brandNameZh}
          </span>
          <span className="font-display text-xl text-ink md:text-2xl">{site.brandName}</span>
        </Link>
        <nav className="flex gap-5 overflow-x-auto whitespace-nowrap pb-1 text-sm text-ink/70 xl:items-center xl:justify-center xl:overflow-visible">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/order"
          className="justify-self-start rounded-full border border-champagne/40 bg-ink px-5 py-3 text-sm text-pearl shadow-glass transition hover:-translate-y-0.5 xl:justify-self-end"
        >
          開始下單
        </Link>
      </div>
    </header>
  );
}

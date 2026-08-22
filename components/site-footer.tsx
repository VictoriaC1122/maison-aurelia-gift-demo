import Link from "next/link";
import { contact, site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-champagne/20 bg-[#17120f] text-pearl md:mt-20">
      <div className="footer-shell mx-auto grid w-[min(1240px,calc(100vw-24px))] gap-8 py-10 md:w-[min(1240px,calc(100vw-48px))] md:grid-cols-[1.2fr_1fr_1fr] md:gap-10 md:py-14">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-champagne">{site.brandNameZh}</p>
          <h2 className="font-display text-[2rem] leading-[1.02] md:text-3xl">{site.brandName}</h2>
          <p className="max-w-md text-sm leading-7 text-pearl/72">{site.chineseSlogan}</p>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Explore</p>
          <Link href="/collections" className="transition hover:text-pearl">商品系列</Link>
          <Link href="/custom" className="transition hover:text-pearl">客製化方案</Link>
          <Link href="/ordering" className="transition hover:text-pearl">訂購流程</Link>
          <Link href="/contact" className="transition hover:text-pearl">聯絡我們</Link>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Contact</p>
          <p>{contact.name}</p>
          <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="transition hover:text-pearl">{contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="transition hover:text-pearl">{contact.email}</a>
          <a href={`https://line.me/R/ti/p/~${contact.line}`} className="transition hover:text-pearl">LINE: {contact.line}</a>
        </div>
      </div>
    </footer>
  );
}

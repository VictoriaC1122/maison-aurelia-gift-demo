import Link from "next/link";
import { contact, site } from "@/lib/content";

export function SiteFooter() {
  const legalItems = [
    ["統一編號", site.company.taxId],
    ["食品業者登錄字號", site.company.foodBusinessRegistrationNo],
    ["產品責任險", site.company.productLiabilityInsurance],
    ["地址", site.company.address]
  ].filter(([, value]) => value);

  return (
    <footer className="mt-16 border-t border-champagne/20 bg-[#17120f] text-pearl md:mt-20">
      <div className="footer-shell mx-auto grid w-[min(1240px,calc(100vw-24px))] gap-8 py-10 md:w-[min(1240px,calc(100vw-48px))] md:grid-cols-2 md:gap-10 md:py-14 lg:grid-cols-[1.2fr_0.75fr_0.85fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-champagne">{site.brandName}</p>
          <h2 className="font-display text-[2rem] leading-[1.02] md:text-3xl">{site.brandNameZh}</h2>
          <p className="max-w-md text-sm leading-7 text-pearl/72">{site.chineseSlogan}</p>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Explore</p>
          <Link href="/about" className="footer-link transition hover:text-pearl">品牌故事</Link>
          <Link href="/collections" className="footer-link transition hover:text-pearl">商品系列</Link>
          <Link href="/custom" className="footer-link transition hover:text-pearl">客製化方案</Link>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Service</p>
          <Link href="/ordering" className="footer-link transition hover:text-pearl">訂購流程</Link>
          <Link href="/shipping" className="footer-link transition hover:text-pearl">配送與運費</Link>
          <Link href="/faq" className="footer-link transition hover:text-pearl">常見問題</Link>
          <Link href="/returns" className="footer-link transition hover:text-pearl">退換貨說明</Link>
          <Link href="/privacy" className="footer-link transition hover:text-pearl">隱私權政策</Link>
          <Link href="/contact" className="footer-link transition hover:text-pearl">聯絡我們</Link>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Contact</p>
          <p>{contact.name}</p>
          <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="footer-link transition hover:text-pearl">{contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="footer-link break-all transition hover:text-pearl">{contact.email}</a>
          <a href={`https://line.me/R/ti/p/~${contact.line}`} className="footer-link transition hover:text-pearl">LINE: {contact.line}</a>
        </div>
      </div>
      <div className="border-t border-pearl/10">
        <div className="mx-auto flex w-[min(1240px,calc(100vw-24px))] flex-col gap-2 py-5 text-xs leading-6 text-pearl/50 md:w-[min(1240px,calc(100vw-48px))] md:flex-row md:flex-wrap md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.company.legalName || `${site.brandNameZh} ${site.brandName}`}</p>
          {legalItems.length > 0 ? (
            <p className="flex flex-wrap gap-x-4">
              {legalItems.map(([label, value]) => (
                <span key={label}>{label}：{value}</span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

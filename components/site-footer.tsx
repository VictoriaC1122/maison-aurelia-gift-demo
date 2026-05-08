import Link from "next/link";
import { contact, site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-champagne/20 bg-[#17120f] text-pearl">
      <div className="mx-auto grid w-[min(1240px,calc(100vw-24px))] gap-10 py-14 md:w-[min(1240px,calc(100vw-48px))] md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-champagne">{site.brandNameZh}</p>
          <h2 className="font-display text-3xl">{site.brandName}</h2>
          <p className="max-w-md text-sm leading-7 text-pearl/72">{site.chineseSlogan}</p>
        </div>
        <div className="space-y-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Explore</p>
          <Link href="/collections">商品系列</Link>
          <Link href="/custom">客製化方案</Link>
          <Link href="/ordering">訂購流程</Link>
          <Link href="/admin/orders">Admin Orders</Link>
        </div>
        <div className="space-y-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">Contact</p>
          <p>{contact.name}</p>
          <p>{contact.phone}</p>
          <p>{contact.email}</p>
          <p>LINE: {contact.line}</p>
        </div>
      </div>
    </footer>
  );
}

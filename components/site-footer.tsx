import Link from "next/link";
import { LanguageSwitch } from "@/components/language-switch";
import { contact, site } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale = "zh" }: { locale?: Locale }) {
  const t = getMessages(locale);
  const href = (path: string) => localePath(locale, path);
  const legalItems = [
    [t.footer.legal.taxId, site.company.taxId],
    [t.footer.legal.foodRegistration, site.company.foodBusinessRegistrationNo],
    [t.footer.legal.insurance, site.company.productLiabilityInsurance],
    [t.footer.legal.address, site.company.address]
  ].filter(([, value]) => value);
  const colon = locale === "en" ? ": " : "：";

  return (
    <footer className="mt-16 border-t border-champagne/20 bg-[#17120f] text-pearl md:mt-20">
      <div className="footer-shell mx-auto grid w-[min(1240px,calc(100vw-24px))] gap-8 py-10 md:w-[min(1240px,calc(100vw-48px))] md:grid-cols-2 md:gap-10 md:py-14 lg:grid-cols-[1.2fr_0.75fr_0.85fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-champagne">{locale === "en" ? site.brandNameZh : site.brandName}</p>
          <h2 className="font-display text-[2rem] leading-[1.02] md:text-3xl">{locale === "en" ? site.brandName : site.brandNameZh}</h2>
          <p className="max-w-md text-sm leading-7 text-pearl/72">{locale === "en" ? site.englishSlogan : site.chineseSlogan}</p>
          <ul className="flex flex-wrap gap-2 pt-2 text-[11px] text-pearl/70">
            {t.footer.tags.map((label) => (
              <li key={label} className="rounded-full border border-pearl/15 px-3 py-1">{label}</li>
            ))}
          </ul>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">{t.footer.shop}</p>
          <Link href={href("/products")} className="footer-link transition hover:text-pearl">{t.nav.products}</Link>
          <Link href={href("/collections/factory")} className="footer-link transition hover:text-pearl">{t.nav.origin}</Link>
          <Link href={href("/custom")} className="footer-link transition hover:text-pearl">{t.nav.corporate}</Link>
          <Link href={href("/about")} className="footer-link transition hover:text-pearl">{t.nav.about}</Link>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">{t.footer.service}</p>
          <Link href={href("/track")} className="footer-link transition hover:text-pearl">{t.nav.track}</Link>
          <Link href={href("/ordering")} className="footer-link transition hover:text-pearl">{t.nav.guide}</Link>
          <Link href={href("/shipping")} className="footer-link transition hover:text-pearl">{t.footer.shipping}</Link>
          <Link href={href("/faq")} className="footer-link transition hover:text-pearl">{t.nav.faq}</Link>
          <Link href={href("/returns")} className="footer-link transition hover:text-pearl">{t.footer.returns}</Link>
          <Link href={href("/privacy")} className="footer-link transition hover:text-pearl">{t.footer.privacy}</Link>
          <Link href={href("/contact")} className="footer-link transition hover:text-pearl">{t.nav.contact}</Link>
        </div>
        <div className="footer-group grid gap-3 text-sm text-pearl/72">
          <p className="font-display text-lg text-pearl">{t.footer.contactInfo}</p>
          <p>{contact.name}</p>
          <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="footer-link transition hover:text-pearl">{contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="footer-link break-all transition hover:text-pearl">{contact.email}</a>
          <a href={`https://line.me/R/ti/p/~${contact.line}`} className="footer-link transition hover:text-pearl">LINE: {contact.line}</a>
        </div>
      </div>
      <div className="border-t border-pearl/10">
        <div className="mx-auto flex w-[min(1240px,calc(100vw-24px))] flex-col gap-3 py-5 text-xs leading-6 text-pearl/50 md:w-[min(1240px,calc(100vw-48px))] md:flex-row md:flex-wrap md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.company.legalName || `${site.brandNameZh} ${site.brandName}`}</p>
          {legalItems.length > 0 ? (
            <p className="flex flex-wrap gap-x-4">
              {legalItems.map(([label, value]) => (
                <span key={label}>{label}{colon}{value}</span>
              ))}
            </p>
          ) : null}
          <LanguageSwitch variant="footer" />
        </div>
      </div>
    </footer>
  );
}

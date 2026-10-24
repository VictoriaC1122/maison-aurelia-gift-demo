import Link from "next/link";
import { MessageCircleMore, Phone, Mail } from "lucide-react";
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
  const shopLinks = [
    { href: "/products", label: t.nav.products },
    { href: "/collections/factory", label: t.nav.origin },
    { href: "/custom", label: t.nav.corporate },
    { href: "/about", label: t.nav.about }
  ];
  const serviceLinks = [
    { href: "/track", label: t.nav.track },
    { href: "/ordering", label: t.nav.guide },
    { href: "/shipping", label: t.footer.shipping },
    { href: "/faq", label: t.nav.faq },
    { href: "/returns", label: t.footer.returns },
    { href: "/privacy", label: t.footer.privacy },
    { href: "/contact", label: t.nav.contact }
  ];
  const linkClass = "inline-flex min-h-[36px] items-center text-pearl/70 transition hover:text-pearl md:min-h-0";

  return (
    <footer className="mt-12 border-t border-champagne/20 bg-[#17120f] text-pearl md:mt-16">
      <div className="shell grid gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-16 lg:grid-cols-[1.25fr_0.7fr_0.85fr_1fr]">
        <div className="space-y-4">
          <p className="eyebrow-on-dark">{locale === "en" ? site.brandNameZh : site.brandName}</p>
          <p className="font-display text-[2rem] leading-none md:text-[2.2rem]">{locale === "en" ? site.brandName : site.brandNameZh}</p>
          <p className="max-w-sm text-sm leading-7 text-pearl/70">{locale === "en" ? site.englishSlogan : site.chineseSlogan}</p>
          <ul className="flex flex-wrap gap-2 pt-1 text-[11px] text-pearl/70">
            {t.footer.tags.map((label) => (
              <li key={label} className="rounded-full border border-pearl/15 px-3 py-1">
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* 手機：兩欄連結並排，避免頁尾過長 */}
        <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-2 lg:grid-cols-[0.7fr_0.85fr] lg:gap-12">
          <nav aria-label={t.footer.shop} className="space-y-3">
            <p className="font-display text-lg text-pearl">{t.footer.shop}</p>
            <ul className="space-y-1 text-sm md:space-y-3">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link href={href(item.href)} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footer.service} className="space-y-3">
            <p className="font-display text-lg text-pearl">{t.footer.service}</p>
            <ul className="space-y-1 text-sm md:space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={href(item.href)} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-3">
          <p className="font-display text-lg text-pearl">{t.footer.contactInfo}</p>
          <p className="text-sm text-pearl/70">{contact.name}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="inline-flex min-h-[36px] items-center gap-2.5 text-pearl/75 transition hover:text-pearl">
                <Phone aria-hidden="true" className="h-4 w-4 text-champagne" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-[36px] items-center gap-2.5 break-all text-pearl/75 transition hover:text-pearl">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-champagne" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={`https://line.me/R/ti/p/~${contact.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center gap-2.5 text-pearl/75 transition hover:text-pearl"
              >
                <MessageCircleMore aria-hidden="true" className="h-4 w-4 text-champagne" />
                LINE{colon}{contact.line}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pearl/10">
        <div className="shell flex flex-col gap-3 py-5 text-xs leading-6 text-pearl/55 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.company.legalName || `${site.brandNameZh} ${site.brandName}`}
          </p>
          {legalItems.length > 0 ? (
            <p className="flex flex-wrap gap-x-4">
              {legalItems.map(([label, value]) => (
                <span key={label}>
                  {label}
                  {colon}
                  {value}
                </span>
              ))}
            </p>
          ) : null}
          <LanguageSwitch variant="footer" />
        </div>
      </div>
    </footer>
  );
}

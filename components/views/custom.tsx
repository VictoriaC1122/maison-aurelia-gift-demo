import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { contact } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function customMetadata(locale: Locale) {
  const t = getMessages(locale).custom;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/custom", locale });
}

export function CustomView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).custom;
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="glass-panel grid gap-6 p-5 md:p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-champagne/15 bg-white/65 px-4 py-2 eyebrow">
            {t.badge}
          </div>
          <h2 className="font-display text-[2rem] leading-[1.08] md:text-4xl">{t.heading}</h2>
          <p className="text-base leading-8 text-ink/65">{t.text}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-button-dark min-h-[52px] justify-center gap-2 px-7"
            >
              <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
              {t.ctaLine}
            </a>
            <Link href={localePath(locale, "/contact")} className="hero-button-light min-h-[52px] justify-center px-7">
              {t.ctaContact}
            </Link>
          </div>
        </div>
        <ul className="grid gap-3 text-sm leading-8 text-ink/68">
          {t.items.map((item, index) => (
            <li key={item} className="rounded-[1.3rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-champagne/20 text-[11px] text-gold">
                0{index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

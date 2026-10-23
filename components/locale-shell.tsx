import { CartDrawer } from "@/components/cart-drawer";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { CartProvider } from "@/lib/cart";
import { notoSerifTC } from "@/lib/fonts";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildSiteSchemas } from "@/lib/seo";
import "@/app/globals.css";

/** 中文版與英文版共用的 <html> 外框（各自是獨立的 root layout，lang 屬性才會正確） */
export function LocaleShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getMessages(locale);
  return (
    <html lang={t.htmlLang} className={notoSerifTC.variable}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          {t.common.skipToContent}
        </a>
        <StructuredData data={buildSiteSchemas(locale)} />
        <LocaleProvider locale={locale}>
          <CartProvider>
            <SiteHeader />
            {children}
            <SiteFooter locale={locale} />
            <CartDrawer />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

import { CheckoutForm } from "@/components/checkout-form";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function checkoutMetadata(locale: Locale) {
  const t = getMessages(locale).checkout;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/checkout", noIndex: true, locale });
}

export function CheckoutView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).checkout;
  return (
    <main id="main-content" className="order-page shell space-y-6 py-8 md:py-12">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">{t.eyebrow}</p>
        <h1 className="font-display text-[2.2rem] leading-tight text-ink md:text-[2.8rem]">{t.title}</h1>
      </div>
      <CheckoutForm />
    </main>
  );
}

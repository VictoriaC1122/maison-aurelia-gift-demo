import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "配送與運費",
  description: "查看 Maison Aurelia 的宅配運費、免運門檻與企業多點配送安排。",
  path: "/shipping"
});

export default function ShippingPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Shipping" title="配送與運費" description="依收件地區、訂單內容與指定時段安排配送，讓禮意穩妥送達。" />
      <div className="glass-panel grid gap-4 p-5 md:grid-cols-3 md:gap-6 md:p-8">
        <div className="rounded-[1.35rem] border border-champagne/12 bg-white/58 p-4 md:p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Standard</p>
          <h2 className="mt-3 font-display text-[1.9rem] leading-[1.08] md:text-3xl">宅配運費</h2>
          <p className="mt-3 text-[0.97rem] leading-8 text-ink/68">NT$ {site.shippingPolicy.standardShippingFee}</p>
        </div>
        <div className="rounded-[1.35rem] border border-champagne/12 bg-white/58 p-4 md:p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Free Shipping</p>
          <h2 className="mt-3 font-display text-[1.9rem] leading-[1.08] md:text-3xl">免運門檻</h2>
          <p className="mt-3 text-[0.97rem] leading-8 text-ink/68">訂單滿 NT$ {site.shippingPolicy.freeShippingThreshold}</p>
        </div>
        <div className="rounded-[1.35rem] border border-champagne/12 bg-white/58 p-4 md:p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Custom</p>
          <h2 className="mt-3 font-display text-[1.9rem] leading-[1.08] md:text-3xl">企業與多點配送</h2>
          <p className="mt-3 text-[0.97rem] leading-8 text-ink/68">{site.shippingPolicy.customNotes}</p>
        </div>
      </div>
    </main>
  );
}

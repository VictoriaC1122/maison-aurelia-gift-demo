import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";

export default function ShippingPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Shipping" title="配送與運費" description="依收件地區、訂單內容與指定時段安排配送，讓禮意穩妥送達。" />
      <div className="glass-panel grid gap-6 p-8 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-champagne">Standard</p>
          <h2 className="mt-3 font-display text-3xl">宅配運費</h2>
          <p className="mt-3 text-sm leading-8 text-ink/68">NT$ {site.shippingPolicy.standardShippingFee}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-champagne">Free Shipping</p>
          <h2 className="mt-3 font-display text-3xl">免運門檻</h2>
          <p className="mt-3 text-sm leading-8 text-ink/68">訂單滿 NT$ {site.shippingPolicy.freeShippingThreshold}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-champagne">Custom</p>
          <h2 className="mt-3 font-display text-3xl">企業與多點配送</h2>
          <p className="mt-3 text-sm leading-8 text-ink/68">{site.shippingPolicy.customNotes}</p>
        </div>
      </div>
    </main>
  );
}

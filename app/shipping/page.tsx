import Link from "next/link";
import { Store, Truck, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";
import { formatTWD } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "配送與運費",
  description: "越金燕配送方式與運費：宅配到府、7-11／全家超商取貨，全館滿額免運。",
  path: "/shipping"
});

export default function ShippingPage() {
  const policy = site.shippingPolicy;
  const cards = [
    {
      icon: Truck,
      title: "宅配到府",
      fee: formatTWD(policy.standardShippingFee),
      text: "送到指定地址，下單時可備註希望到貨日。"
    },
    {
      icon: Store,
      title: "7-11／全家超商取貨",
      fee: policy.cvsShippingFee ? formatTWD(policy.cvsShippingFee) : "依門市計算",
      text: "結帳時填寫門市店號，到店後會收到簡訊通知，請於 7 天內取件。"
    },
    {
      icon: Building2,
      title: "企業與多點配送",
      fee: "另行報價",
      text: policy.customNotes
    }
  ];

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Shipping"
        title="配送與運費"
        description={`全館滿 ${formatTWD(policy.freeShippingThreshold)} 免運，宅配與超商取貨皆適用。`}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, fee, text }) => (
          <section key={title} className="paper-panel p-6">
            <Icon aria-hidden="true" className="h-6 w-6 text-champagne" />
            <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
            <p className="mt-2 text-lg text-ink">{fee}</p>
            <p className="mt-3 text-sm leading-7 text-ink/62">{text}</p>
          </section>
        ))}
      </div>
      <div className="paper-panel space-y-2 p-6 text-sm leading-7 text-ink/65">
        <p>・訂單由顧問確認後安排出貨，出貨後可在 <Link href="/track" className="underline underline-offset-4">訂單查詢</Link> 看到物流單號。</p>
        <p>・離島、急件或指定時段配送，請在結帳備註說明，顧問會另行確認。</p>
        <p>・收到商品如有破損，請參考 <Link href="/returns" className="underline underline-offset-4">退換貨說明</Link>。</p>
      </div>
    </main>
  );
}

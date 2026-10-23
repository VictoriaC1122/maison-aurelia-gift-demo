import Link from "next/link";
import { ArrowDown, CreditCard, PackageSearch, ShoppingBag, Truck, UserCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { enabledDeliveryOptions, enabledPaymentOptions } from "@/lib/commerce";
import { site } from "@/lib/content";
import { formatTWD } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo";

const steps = [
  { icon: ShoppingBag, title: "選購商品", text: "挑選燕禮，加入購物車" },
  { icon: Truck, title: "填寫結帳", text: "選擇宅配或超商取貨與付款方式" },
  { icon: UserCheck, title: "顧問確認", text: "確認品項、金額與出貨日" },
  { icon: CreditCard, title: "完成付款", text: "轉帳後回報後五碼，或貨到付款" },
  { icon: PackageSearch, title: "出貨配送", text: "隨時在訂單查詢看進度" }
];

export const metadata = buildMetadata({
  title: "購物說明",
  description: "越金燕的訂購流程、配送方式與付款方式說明：宅配到府、7-11／全家超商取貨、銀行轉帳與貨到付款。",
  path: "/ordering"
});

export default function OrderingPage() {
  const cvsFee = site.shippingPolicy.cvsShippingFee;

  return (
    <main id="main-content" className="shell space-y-12 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="How to Order" title="購物說明" description="五個步驟完成訂購，從下單到收貨都可以隨時查詢進度。" />

      <ol aria-label="訂購流程" className="order-flow">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="order-flow__item">
            <div className="order-flow__card">
              <span className="block text-[11px] tracking-[0.24em] text-champagne">STEP {index + 1}</span>
              <span className="mt-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_rgba(21,18,15,0.06)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-3 block font-display text-lg text-ink">{title}</span>
              <span className="mt-1 block text-sm leading-6 text-ink/60">{text}</span>
            </div>
            {index < steps.length - 1 ? (
              <ArrowDown aria-hidden="true" className="order-flow__arrow-down h-5 w-5 text-champagne" />
            ) : null}
          </li>
        ))}
      </ol>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="paper-panel p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">配送方式</h2>
          <ul className="mt-4 divide-y divide-champagne/12">
            {enabledDeliveryOptions().map((option) => (
              <li key={option.id} className="flex items-start justify-between gap-4 py-3">
                <span>
                  <span className="block text-ink">{option.label}</span>
                  <span className="text-sm leading-6 text-ink/55">{option.description}</span>
                </span>
                <span className="shrink-0 text-sm text-ink/70">
                  {option.id === "home" ? formatTWD(site.shippingPolicy.standardShippingFee) : cvsFee ? formatTWD(cvsFee) : "依門市計算"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink/60">全館滿 {formatTWD(site.shippingPolicy.freeShippingThreshold)} 免運。{site.shippingPolicy.customNotes}</p>
        </div>
        <div className="paper-panel p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">付款方式</h2>
          <ul className="mt-4 divide-y divide-champagne/12">
            {enabledPaymentOptions().map((option) => (
              <li key={option.id} className="py-3">
                <span className="block text-ink">{option.label}</span>
                <span className="text-sm leading-6 text-ink/55">{option.description}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink/60">所有訂單都會先由顧問確認品項與金額，確認前不會扣款。</p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="hero-button-dark min-h-[52px] justify-center px-8">開始選購</Link>
        <Link href="/track" className="hero-button-light min-h-[52px] justify-center px-8">訂單查詢</Link>
        <Link href="/returns" className="hero-button-light min-h-[52px] justify-center px-8">退換貨說明</Link>
      </div>
    </main>
  );
}

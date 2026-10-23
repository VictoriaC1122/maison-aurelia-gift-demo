import { CheckoutForm } from "@/components/checkout-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "結帳",
  description: "填寫收件、配送與付款方式，送出越金燕訂單。",
  path: "/checkout",
  noIndex: true
});

export default function CheckoutPage() {
  return (
    <main id="main-content" className="order-page shell space-y-6 py-8 md:py-12">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">Checkout</p>
        <h1 className="font-display text-[2.2rem] leading-tight text-ink md:text-[2.8rem]">結帳</h1>
      </div>
      <CheckoutForm />
    </main>
  );
}

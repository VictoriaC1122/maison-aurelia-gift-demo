import { CheckoutView, checkoutMetadata } from "@/components/views/checkout";

export const metadata = checkoutMetadata("zh");

export default function Page() {
  return <CheckoutView locale="zh" />;
}

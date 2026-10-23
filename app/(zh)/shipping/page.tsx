import { ShippingView, shippingMetadata } from "@/components/views/shipping";

export const metadata = shippingMetadata("zh");

export default function Page() {
  return <ShippingView locale="zh" />;
}

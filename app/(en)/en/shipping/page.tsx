import { ShippingView, shippingMetadata } from "@/components/views/shipping";

export const metadata = shippingMetadata("en");

export default function Page() {
  return <ShippingView locale="en" />;
}

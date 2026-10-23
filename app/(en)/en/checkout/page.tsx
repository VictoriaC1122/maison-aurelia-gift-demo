import { CheckoutView, checkoutMetadata } from "@/components/views/checkout";

export const metadata = checkoutMetadata("en");

export default function Page() {
  return <CheckoutView locale="en" />;
}

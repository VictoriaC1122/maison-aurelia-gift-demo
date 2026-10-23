import { OrderingView, orderingMetadata } from "@/components/views/ordering";

export const metadata = orderingMetadata("en");

export default function Page() {
  return <OrderingView locale="en" />;
}

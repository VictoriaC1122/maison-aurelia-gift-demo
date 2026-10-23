import { OrderingView, orderingMetadata } from "@/components/views/ordering";

export const metadata = orderingMetadata("zh");

export default function Page() {
  return <OrderingView locale="zh" />;
}

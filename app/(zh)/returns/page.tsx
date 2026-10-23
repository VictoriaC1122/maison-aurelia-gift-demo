import { ReturnsView, returnsMetadata } from "@/components/views/returns";

export const metadata = returnsMetadata("zh");

export default function Page() {
  return <ReturnsView locale="zh" />;
}

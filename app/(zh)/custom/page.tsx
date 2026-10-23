import { CustomView, customMetadata } from "@/components/views/custom";

export const metadata = customMetadata("zh");

export default function Page() {
  return <CustomView locale="zh" />;
}

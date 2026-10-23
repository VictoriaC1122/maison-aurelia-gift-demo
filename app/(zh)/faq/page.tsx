import { FaqView, faqMetadata } from "@/components/views/faq";

export const metadata = faqMetadata("zh");

export default function Page() {
  return <FaqView locale="zh" />;
}

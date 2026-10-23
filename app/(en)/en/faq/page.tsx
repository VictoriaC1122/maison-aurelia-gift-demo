import { FaqView, faqMetadata } from "@/components/views/faq";

export const metadata = faqMetadata("en");

export default function Page() {
  return <FaqView locale="en" />;
}

import { ContactView, contactMetadata } from "@/components/views/contact";

export const metadata = contactMetadata("zh");

export default function Page() {
  return <ContactView locale="zh" />;
}

import { AboutView, aboutMetadata } from "@/components/views/about";

export const metadata = aboutMetadata("zh");

export default function Page() {
  return <AboutView locale="zh" />;
}

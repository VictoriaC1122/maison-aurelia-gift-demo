import { PrivacyView, privacyMetadata } from "@/components/views/privacy";

export const metadata = privacyMetadata("zh");

export default function Page() {
  return <PrivacyView locale="zh" />;
}

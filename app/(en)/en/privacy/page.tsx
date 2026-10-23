import { PrivacyView, privacyMetadata } from "@/components/views/privacy";

export const metadata = privacyMetadata("en");

export default function Page() {
  return <PrivacyView locale="en" />;
}

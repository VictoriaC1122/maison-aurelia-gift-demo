import { CustomView, customMetadata } from "@/components/views/custom";

export const metadata = customMetadata("en");

export default function Page() {
  return <CustomView locale="en" />;
}

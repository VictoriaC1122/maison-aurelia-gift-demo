import { ReturnsView, returnsMetadata } from "@/components/views/returns";

export const metadata = returnsMetadata("en");

export default function Page() {
  return <ReturnsView locale="en" />;
}

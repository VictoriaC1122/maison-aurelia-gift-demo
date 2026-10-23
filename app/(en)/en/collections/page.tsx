import { CollectionsView, collectionsMetadata } from "@/components/views/collections";

export const metadata = collectionsMetadata("en");

export default function Page() {
  return <CollectionsView locale="en" />;
}

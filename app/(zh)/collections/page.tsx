import { CollectionsView, collectionsMetadata } from "@/components/views/collections";

export const metadata = collectionsMetadata("zh");

export default function Page() {
  return <CollectionsView locale="zh" />;
}

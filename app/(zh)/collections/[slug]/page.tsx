import { CollectionDetailView, collectionMetadata, collectionStaticParams } from "@/components/views/collection-detail";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return collectionStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return collectionMetadata(slug, "zh");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CollectionDetailView slug={slug} locale="zh" />;
}

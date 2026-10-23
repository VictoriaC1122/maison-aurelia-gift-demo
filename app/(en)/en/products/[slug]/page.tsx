import { ProductDetailView, productMetadata, productStaticParams } from "@/components/views/product-detail";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return productStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return productMetadata(slug, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} locale="en" />;
}

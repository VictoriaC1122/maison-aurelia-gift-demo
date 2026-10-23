import { ProductsView, productsMetadata } from "@/components/views/products";

export const metadata = productsMetadata("zh");

export default function Page() {
  return <ProductsView locale="zh" />;
}

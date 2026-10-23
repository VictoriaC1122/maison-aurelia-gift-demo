import { ProductsView, productsMetadata } from "@/components/views/products";

export const metadata = productsMetadata("en");

export default function Page() {
  return <ProductsView locale="en" />;
}

import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/content";

export async function GET() {
  return NextResponse.json({
    categories: getCategories(),
    products: getProducts()
  });
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/content";

/** 舊版「下單表單」網址：把指定商品加入購物車後導向結帳頁。 */
export function OrderRedirect() {
  const { add, ready } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const slug = new URLSearchParams(window.location.search).get("product");
    if (slug && getProduct(slug)) add(slug, 1, { open: false });
    router.replace("/checkout");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return <p className="paper-panel p-8 text-center text-sm text-ink/60">正在前往結帳…</p>;
}

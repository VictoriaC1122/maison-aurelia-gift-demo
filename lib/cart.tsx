"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getProducts } from "@/lib/content";
import { summarizeCart, type CartLine, type CartSummary } from "@/lib/pricing";

const STORAGE_KEY = "yjy-cart-v1";
const MAX_QUANTITY = 99;

type CartContextValue = {
  lines: CartLine[];
  summary: CartSummary;
  count: number;
  ready: boolean;
  isOpen: boolean;
  add: (slug: string, quantity?: number, options?: { open?: boolean }) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(value)));
}

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    const validSlugs = new Set(getProducts().map((product) => product.slug));
    return parsed
      .filter((line) => line && validSlugs.has(line.slug))
      .map((line) => ({ slug: line.slug, quantity: clampQuantity(line.quantity) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLines(readStoredCart());
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setLines(readStoredCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // 無痕模式等情況下無法儲存，購物車仍可在本次瀏覽中使用。
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, quantity = 1, options?: { open?: boolean }) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line
        );
      }
      return [...current, { slug, quantity: clampQuantity(quantity) }];
    });
    if (options?.open !== false) setIsOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      current.map((line) => (line.slug === slug ? { ...line, quantity: clampQuantity(quantity) } : line))
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const summary = useMemo(() => summarizeCart(lines, getProducts()), [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      summary,
      count: summary.itemCount,
      ready,
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      open,
      close
    }),
    [lines, summary, ready, isOpen, add, setQuantity, remove, clear, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

import type { Metadata } from "next";
import Link from "next/link";
import { LocaleShell } from "@/components/locale-shell";

export const metadata: Metadata = {
  title: "找不到頁面 Page not found｜越金燕 YUA JIN YAN",
  robots: { index: false, follow: false }
};

export default function GlobalNotFound() {
  return (
    <LocaleShell locale="zh">
      <main id="main-content" className="shell flex min-h-[55vh] flex-col items-center justify-center gap-6 py-16 text-center">
        <p className="text-[11px] tracking-[0.32em] text-champagne">404</p>
        <h1 className="font-display text-[2.2rem] leading-tight text-ink md:text-[2.8rem]">找不到這個頁面</h1>
        <p lang="en" className="font-display text-xl text-ink/60">Sorry, we couldn&apos;t find that page.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="hero-button-dark min-h-[52px] justify-center px-8">回到首頁</Link>
          <Link href="/en" lang="en" className="hero-button-light min-h-[52px] justify-center px-8">English home</Link>
        </div>
      </main>
    </LocaleShell>
  );
}

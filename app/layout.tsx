import type { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";
import { StructuredData } from "@/components/structured-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buildMetadata, buildSiteSchemas } from "@/lib/seo";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-tc",
  fallback: ["Songti TC", "STSong", "PMingLiU", "serif"]
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={notoSerifTC.variable}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          跳至主要內容
        </a>
        <StructuredData data={buildSiteSchemas()} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

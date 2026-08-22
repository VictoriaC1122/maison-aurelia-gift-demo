import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buildMetadata, buildSiteSchemas } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
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

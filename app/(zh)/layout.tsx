import type { Viewport } from "next";
import { LocaleShell } from "@/components/locale-shell";

export const viewport: Viewport = {
  themeColor: "#FCFAF6"
};

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleShell locale="zh">{children}</LocaleShell>;
}

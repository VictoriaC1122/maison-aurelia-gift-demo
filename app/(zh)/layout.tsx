import { LocaleShell } from "@/components/locale-shell";

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleShell locale="zh">{children}</LocaleShell>;
}

import { LocaleShell } from "@/components/locale-shell";

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleShell locale="en">{children}</LocaleShell>;
}

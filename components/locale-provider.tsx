"use client";

import { createContext, useContext, useMemo } from "react";
import { getMessages, localePath, type Locale, type Messages } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: Messages;
  /** 把站內路徑轉成目前語言的網址 */
  href: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  t: getMessages("zh"),
  href: (path) => path
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: getMessages(locale), href: (path: string) => localePath(locale, path) }),
    [locale]
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

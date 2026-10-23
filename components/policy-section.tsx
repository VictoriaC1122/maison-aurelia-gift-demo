import type { ReactNode } from "react";

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-champagne/14 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[1.45rem] leading-tight text-ink md:text-2xl">{title}</h2>
      <div className="space-y-3 text-[0.97rem] leading-8 text-ink/70">{children}</div>
    </section>
  );
}

import { cn } from "@/lib/utils";
import type { ElementType } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  className = ""
}: {
  eyebrow: string;
  title: string;
  description?: string;
  as?: Extract<ElementType, "h1" | "h2" | "h3">;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl space-y-4", className)}>
      <p className="text-[11px] uppercase tracking-[0.32em] text-champagne md:text-xs md:tracking-[0.38em]">{eyebrow}</p>
      <Tag className="font-display text-[1.8rem] leading-[1.1] tracking-[-0.015em] text-ink md:text-[2.35rem] lg:text-[3rem] xl:text-[3.5rem] md:tracking-normal">
        {title}
      </Tag>
      {description ? <p className="max-w-2xl text-[0.97rem] leading-7 text-ink/65 md:text-[1.02rem] md:leading-8">{description}</p> : null}
    </div>
  );
}

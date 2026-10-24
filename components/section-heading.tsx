import type { ElementType } from "react";
import { Phrases } from "@/components/phrases";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "left",
  className = ""
}: {
  eyebrow: string;
  title: string;
  description?: string;
  as?: Extract<ElementType, "h1" | "h2" | "h3">;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl space-y-4", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="section-heading__title font-display text-[1.9rem] leading-[1.18] text-ink md:text-[2.4rem] lg:text-[2.8rem] xl:text-[3.05rem]">
        <Phrases text={title} />
      </Tag>
      {description ? (
        <p className={cn("max-w-2xl text-[0.97rem] leading-7 text-ink/65 md:text-[1.02rem] md:leading-8", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

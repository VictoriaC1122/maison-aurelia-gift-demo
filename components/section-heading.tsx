import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = ""
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl space-y-4", className)}>
      <p className="text-[11px] uppercase tracking-[0.32em] text-champagne md:text-xs md:tracking-[0.38em]">{eyebrow}</p>
      <h2 className="font-display text-[1.8rem] leading-[1.1] tracking-[-0.015em] text-ink md:text-6xl md:tracking-normal">{title}</h2>
      {description ? <p className="max-w-2xl text-[0.97rem] leading-7 text-ink/65 md:text-base md:leading-8">{description}</p> : null}
    </div>
  );
}

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
      <p className="text-xs uppercase tracking-[0.38em] text-champagne">{eyebrow}</p>
      <h2 className="font-display text-[1.9rem] leading-[1.08] text-ink md:text-6xl">{title}</h2>
      {description ? <p className="max-w-2xl text-[15px] leading-7 text-ink/65 md:text-base md:leading-8">{description}</p> : null}
    </div>
  );
}

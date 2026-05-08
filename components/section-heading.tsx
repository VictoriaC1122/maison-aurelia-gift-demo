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
      <h2 className="font-display text-[2rem] leading-[1.08] text-ink md:text-6xl">{title}</h2>
      {description ? <p className="text-[15px] leading-8 text-ink/65 md:text-base">{description}</p> : null}
    </div>
  );
}

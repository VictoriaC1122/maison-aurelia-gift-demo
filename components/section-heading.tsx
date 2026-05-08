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
      <h2 className="font-display text-4xl leading-tight text-ink md:text-6xl">{title}</h2>
      {description ? <p className="text-base leading-8 text-ink/65">{description}</p> : null}
    </div>
  );
}

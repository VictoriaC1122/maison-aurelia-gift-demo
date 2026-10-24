import { Gift, MapPin, ShieldCheck, Truck } from "lucide-react";
import { site } from "@/lib/content";
import { getMessages, type Locale } from "@/lib/i18n";
import { formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function TrustBadges({ className, compact = false, locale = "zh" }: { className?: string; compact?: boolean; locale?: Locale }) {
  const t = getMessages(locale).trust;
  const badges = [
    { icon: MapPin, title: t.origin.title, text: t.origin.text },
    { icon: ShieldCheck, title: t.confirm.title, text: t.confirm.text },
    { icon: Gift, title: t.gift.title, text: t.gift.text },
    { icon: Truck, title: t.delivery.title, text: t.delivery.text(formatTWD(site.shippingPolicy.freeShippingThreshold)) }
  ];

  return (
    <ul className={cn("grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4", className)}>
      {badges.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className={cn(
            "flex flex-col gap-2.5 rounded-2xl border border-champagne/14 bg-white/60 sm:flex-row sm:items-start sm:gap-3",
            compact ? "p-3" : "p-3.5 sm:p-4 md:p-5"
          )}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/14 text-gold">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.92rem] leading-6 text-ink sm:text-sm">{title}</span>
            <span className="text-pretty mt-0.5 block text-xs leading-5 text-ink/60">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

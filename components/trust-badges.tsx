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
    <ul className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {badges.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className={cn(
            "flex items-start gap-3 rounded-2xl border border-champagne/14 bg-white/55",
            compact ? "p-3" : "p-4 md:p-5"
          )}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/12 text-champagne">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-ink">{title}</span>
            <span className="mt-0.5 block text-xs leading-5 text-ink/52">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

import { Gift, MapPin, ShieldCheck, Truck } from "lucide-react";
import { site } from "@/lib/content";
import { formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const badges = [
  { icon: MapPin, title: "越南燕屋溯源", text: "產地、採收到整理全程實拍" },
  { icon: ShieldCheck, title: "專人確認訂單", text: "確認品項與金額後才付款" },
  { icon: Gift, title: "精緻禮盒包裝", text: "送禮不需再另外包裝" },
  { icon: Truck, title: "宅配・超商取貨", text: `滿 ${formatTWD(site.shippingPolicy.freeShippingThreshold)} 免運` }
];

export function TrustBadges({ className, compact = false }: { className?: string; compact?: boolean }) {
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

import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { contact } from "@/lib/content";

export default function ContactPage() {
  return (
    <main className="shell space-y-10 py-16">
      <SectionHeading eyebrow="Contact" title="聯絡我們" description={contact.notes} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel relative min-h-[420px] overflow-hidden">
          <Image src="/assets/brand/brand-card.jpg" alt="contact card" fill className="object-cover" />
        </div>
        <div className="glass-panel grid gap-5 p-8">
          {[
            ["姓名", contact.name],
            ["職稱", contact.title],
            ["電話", contact.phone],
            ["Email", contact.email],
            ["LINE", contact.line],
            ["Instagram", contact.instagram],
            ["地址", contact.address],
            ["營業時間", contact.businessHours]
          ].map(([label, value]) => (
            <div key={label} className="border-b border-mist/40 pb-4 last:border-none">
              <p className="text-xs uppercase tracking-[0.28em] text-champagne">{label}</p>
              <p className="mt-2 text-base text-ink/75">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

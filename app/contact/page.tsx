import { AutoImageRotator } from "@/components/auto-image-rotator";
import { SectionHeading } from "@/components/section-heading";
import { contact, getFeaturedProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "聯絡我們",
  description: "與 Maison Aurelia 顧問聯繫，安排燕禮選品、企業贈禮、配送時程與客製化方案。",
  path: "/contact"
});

export default function ContactPage() {
  const featured = getFeaturedProducts();
  const contactItems = [
    ["姓名", contact.name || "", ""],
    ["職稱", contact.title || "", ""],
    ["電話", contact.phone || "", contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : ""],
    ["Email", contact.email || "", contact.email ? `mailto:${contact.email}` : ""],
    ["LINE", contact.line || "", contact.line ? `https://line.me/R/ti/p/~${contact.line}` : ""],
    ["Instagram", contact.instagram || "", ""],
    ["地址", contact.address || "", ""],
    ["營業時間", contact.businessHours || "", ""]
  ].filter(([, value]) => value && !value.startsWith("待補"));

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Contact" title="聯絡我們" description={contact.notes} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel relative min-h-[300px] overflow-hidden md:min-h-[420px]">
          <AutoImageRotator
            images={featured.flatMap((product) => product.images)}
            alt="Maison Aurelia contact atmosphere"
            priority
            intervalMs={5400}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,18,15,0.45)] via-[rgba(23,18,15,0.12)] to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[1.45rem] border border-white/35 bg-[rgba(248,241,232,0.74)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:rounded-[1.6rem] md:p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Private Concierge</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">
              若需安排贈禮內容、企業禮盒或配送節奏，歡迎直接與我們聯繫。
            </p>
          </div>
        </div>
        <div className="contact-concierge glass-panel grid gap-5 p-5 md:p-8">
          {contactItems.map(([label, value, href]) => {
            const content = (
              <>
                <p className="text-xs uppercase tracking-[0.28em] text-champagne">{label}</p>
                <p className="mt-2 text-base text-ink/75">{value}</p>
              </>
            );

            return href ? (
              <a key={label} href={href} className="contact-row border-b border-mist/40 pb-4 last:border-none" aria-label={`${label}：${value}`}>
                {content}
              </a>
            ) : (
              <div key={label} className="contact-row border-b border-mist/40 pb-4 last:border-none">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

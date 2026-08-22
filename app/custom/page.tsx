import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";

const items = [
  "企業贈禮與品牌聯名禮盒",
  "節慶限定包裝與客製腰封",
  "會員禮、貴賓禮與品牌活動伴手禮",
  "大宗配送、指定時段與多點寄送"
];

export const metadata = buildMetadata({
  title: "客製化方案",
  description: "為企業贈禮、節慶活動與會員經營安排更合適的 Maison Aurelia 客製燕禮方案。",
  path: "/custom"
});

export default function CustomPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Custom Program" title="客製化方案" description="讓高端禮盒可以更貼近企業品牌活動與會員經營需求。" />
      <div className="glass-panel grid gap-6 p-5 md:p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-champagne/15 bg-white/65 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-champagne">
            Bespoke Gift Service
          </div>
          <h2 className="font-display text-[2rem] leading-[1.08] md:text-4xl">企業禮贈與客製規劃</h2>
          <p className="text-base leading-8 text-ink/65">
            無論是節慶贈禮、品牌活動，或重要客戶往來，我們都能依場合與風格調整禮盒內容與呈現方式。
          </p>
        </div>
        <ul className="grid gap-3 text-sm leading-8 text-ink/68">
          {items.map((item, index) => (
            <li key={item} className="rounded-[1.3rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-champagne/20 text-[11px] text-champagne">
                0{index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

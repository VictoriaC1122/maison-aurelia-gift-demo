import { SectionHeading } from "@/components/section-heading";

const items = [
  "企業贈禮與品牌聯名禮盒",
  "節慶限定包裝與客製腰封",
  "會員禮、貴賓禮與品牌活動伴手禮",
  "大宗配送、指定時段與多點寄送"
];

export default function CustomPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Custom Program" title="客製化方案" description="讓高端禮盒可以更貼近企業品牌活動與會員經營需求。" />
      <div className="glass-panel grid gap-6 p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-4xl">Bespoke Gift Service</h2>
          <p className="text-base leading-8 text-ink/65">
            我們提供從品項搭配、包裝視覺、活動檔期到配送安排的完整提案，適合企業贈禮、VIP 關係維護與高端品牌活動。
          </p>
        </div>
        <ul className="space-y-3 text-sm leading-8 text-ink/68">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

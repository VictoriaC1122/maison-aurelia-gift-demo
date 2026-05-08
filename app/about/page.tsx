import Image from "next/image";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

export default function AboutPage() {
  return (
    <main className="shell space-y-10 py-16">
      <SectionHeading eyebrow="About Maison" title="品牌介紹" description="Maison Aurelia 將燕窩從傳統補品語境重新轉譯為精品禮盒與高端品牌體驗。" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="glass-panel p-8">
          <p className="text-lg leading-9 text-ink/70">
            我們希望每一次送禮，都像在遞出一件被妥善設計過的作品。從香檳金色調、奶白紙紋、玻璃感卡片，
            到溯源內容與訂單體驗，都圍繞著同一件事：讓高端感不只在表面，而是在整體接觸點中被感受到。
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-champagne">{site.englishSlogan}</p>
        </FadeIn>
        <FadeIn delay={0.08} className="glass-panel relative min-h-[420px] overflow-hidden">
          <Image src={withBasePath("/assets/brand/brand-card.jpg")} alt="brand card" fill className="object-cover" />
        </FadeIn>
      </div>
    </main>
  );
}

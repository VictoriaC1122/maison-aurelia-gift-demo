import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProducts, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "品牌介紹",
  description: "認識 Maison Aurelia 如何將燕窩送禮轉譯成更克制、精緻且具有品牌質地的精品禮盒體驗。",
  path: "/about"
});

export default function AboutPage() {
  const featured = getFeaturedProducts();

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="About Maison" title="品牌介紹" description="Maison Aurelia 將燕窩從傳統補品語境重新轉譯為精品禮盒與高端品牌體驗。" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="glass-panel p-5 md:p-8">
          <p className="text-base leading-8 text-ink/70 md:text-lg md:leading-9">
            我們希望每一次送禮，都像在遞出一件被妥善設計過的作品。從香檳金色調、奶白紙紋、玻璃感卡片，
            到溯源內容與訂單體驗，都圍繞著同一件事：讓高端感不只在表面，而是在整體接觸點中被感受到。
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-champagne">{site.englishSlogan}</p>
        </FadeIn>
        <FadeIn delay={0.08} className="glass-panel relative min-h-[300px] overflow-hidden md:min-h-[420px]">
          <AutoImageRotator
            images={featured.flatMap((product) => product.images)}
            alt="Maison Aurelia editorial imagery"
            priority
            intervalMs={5200}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,20,15,0.3)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[1.45rem] border border-white/35 bg-[rgba(255,250,245,0.7)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:rounded-[1.6rem] md:p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Brand Language</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">
              不是展示一張名片，而是把名片裡的紙感、金線與留白，轉化成整體品牌表情。
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProducts, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "品牌介紹",
  description: "認識越金燕：專研頂級燕窩，從越南產地到「燕序」系列禮盒的品牌故事。",
  path: "/about"
});

export default function AboutPage() {
  const featured = getFeaturedProducts();

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Our Story" title="品牌介紹" description="越金燕專研頂級燕窩，以越南產地燕盞打造「燕序」系列，讓日常保養與重要贈禮都有一份安心的選擇。" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="glass-panel p-5 md:p-8">
          <p className="text-base leading-8 text-ink/70 md:text-lg md:leading-9">
            從越南燕廠的產地把關，到「燕序」系列的禮盒呈現，我們在意的始終是同一件事：
            讓收到燕窩的人吃得安心，也讓送禮的人送得體面。不論是自己的日常保養，還是給長輩、客戶的重要心意，
            都有顧問陪你確認品項、份量與配送安排。
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-champagne">{site.englishSlogan}</p>
        </FadeIn>
        <FadeIn delay={0.08} className="glass-panel relative min-h-[300px] overflow-hidden md:min-h-[420px]">
          <AutoImageRotator
            images={featured.flatMap((product) => product.images)}
            alt="越金燕燕序系列禮盒"
            priority
            intervalMs={5200}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,20,15,0.3)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[1.45rem] border border-white/35 bg-[rgba(255,250,245,0.7)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:rounded-[1.6rem] md:p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Our Promise</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">
              產地看得見、內容講清楚，讓每一份燕禮都送得從容。
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

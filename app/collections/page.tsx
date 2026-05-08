import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { getCategories } from "@/lib/content";

export default function CollectionsPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Collections" title="商品系列" description="依資料夾自動整理系列與來源內容；後續你可以直接編修 `data/products.json` 補齊名稱與售價。" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {getCategories().map((category) => (
          <Link key={category.slug} href={`/collections/${category.slug}`} className="glass-panel group overflow-hidden">
            <div className="relative aspect-[4/5]">
              <Image src={category.coverImage} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="space-y-2 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-champagne">{category.englishName}</p>
              <h2 className="font-display text-3xl">{category.name}</h2>
              <p className="text-sm leading-7 text-ink/65">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

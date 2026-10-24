"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn, withBasePath } from "@/lib/utils";

export type HeroSlide = {
  image: string;
  name: string;
  spec: string;
  href: string;
};

/** 首頁主視覺：精選商品輪播，圖片與商品卡同步切換 */
export function HeroShowcase({
  slides,
  eyebrow,
  viewLabel,
  intervalMs = 6000
}: {
  slides: HeroSlide[];
  eyebrow: string;
  viewLabel: string;
  intervalMs?: number;
}) {
  const { t } = useLocale();
  const [{ index, previous }, setSlide] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = slides.length;

  useEffect(() => {
    const element = ref.current;
    if (!element || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setAutoplay(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const timer = window.setInterval(() => {
      setSlide((current) => ({ index: (current.index + 1) % count, previous: current.index }));
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, count, intervalMs]);

  if (count === 0) return null;
  const slide = slides[index];
  const next = (index + 1) % count;

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((item, slideIndex) => {
        const isCurrent = slideIndex === index;
        const isPrevious = slideIndex === previous;
        const isNext = autoplay && slideIndex === next;
        if (!isCurrent && !isPrevious && !isNext) return null;
        return (
          <div
            key={item.image}
            aria-hidden={isCurrent ? undefined : true}
            className={cn(
              "absolute inset-0",
              isCurrent ? "z-[2]" : isPrevious ? "z-[1]" : "z-0 opacity-0",
              isCurrent && previous !== null && "rotator-enter"
            )}
          >
            <Image
              src={withBasePath(item.image)}
              alt={isCurrent ? item.name : ""}
              fill
              priority={slideIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1279px) 52vw, 640px"
              className="object-cover"
            />
          </div>
        );
      })}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[rgba(24,16,12,0.42)] via-transparent to-transparent" />

      <Link
        href={slide.href}
        className="group absolute inset-x-3 bottom-3 z-[4] flex items-end justify-between gap-4 rounded-[1.15rem] border border-white/45 bg-[rgba(252,248,242,0.86)] p-4 backdrop-blur-xl transition hover:bg-[rgba(252,248,242,0.95)] md:inset-x-5 md:bottom-5 md:rounded-[1.25rem] md:p-5"
      >
        <span key={slide.href} className={cn("min-w-0", previous !== null && "fade-up-enter")}>
          <span className="eyebrow hidden md:block">{eyebrow}</span>
          <strong className="block truncate font-display text-lg font-medium leading-tight text-ink md:mt-2 md:text-2xl">{slide.name}</strong>
          <span className="mt-1 block text-sm text-ink/60">{slide.spec}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-ink/70 transition group-hover:text-ink">
          <span className="hidden sm:inline">{viewLabel}</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/70 transition group-hover:bg-ink group-hover:text-pearl sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent sm:group-hover:bg-transparent sm:group-hover:text-ink">
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </span>
      </Link>

      {count > 1 ? (
        <div className="absolute right-3 top-3 z-[4] flex items-center rounded-full bg-black/15 px-1.5 backdrop-blur-md md:right-4 md:top-4">
          {slides.map((item, slideIndex) => (
            <button
              key={item.image}
              type="button"
              aria-label={t.home.heroSlide(slideIndex + 1, count)}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() =>
                setSlide((current) => (current.index === slideIndex ? current : { index: slideIndex, previous: current.index }))
              }
              className="inline-flex h-7 min-w-[24px] items-center justify-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500",
                  slideIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

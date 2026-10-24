"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn, withBasePath } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  priority = false
}: {
  images: string[];
  alt: string;
  priority?: boolean;
}) {
  const { t } = useLocale();
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [{ index, previous }, setSlide] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const count = uniqueImages.length;

  if (count === 0) return null;

  const show = (target: number) =>
    setSlide((current) => (target === current.index ? current : { index: (target + count) % count, previous: current.index }));
  const showPrevious = () => show(index - 1);
  const showNext = () => show(index + 1);

  return (
    <div className="product-gallery grid min-w-0 gap-3">
      <div
        className="product-gallery__stage relative aspect-[4/3] min-w-0 touch-pan-y select-none overflow-hidden rounded-[1.7rem] border border-white/58 bg-white/70 md:aspect-[4/4.8]"
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) showNext();
            else showPrevious();
          }
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        {uniqueImages.map((src, imageIndex) => {
          const isCurrent = imageIndex === index;
          const isPrevious = imageIndex === previous;
          return (
            <div
              key={src}
              aria-hidden={isCurrent ? undefined : true}
              className={cn(
                "absolute inset-0",
                isCurrent ? "z-[2]" : isPrevious ? "z-[1]" : "pointer-events-none z-0 opacity-0",
                isCurrent && previous !== null && "gallery-enter"
              )}
            >
              <Image
                src={withBasePath(src)}
                alt={isCurrent ? t.gallery.image(alt, imageIndex + 1) : ""}
                fill
                priority={priority && imageIndex === 0}
                sizes="(max-width: 1024px) 100vw, 610px"
                className="object-cover"
                draggable={false}
              />
            </div>
          );
        })}

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label={t.gallery.previous}
              onClick={showPrevious}
              onPointerDown={(event) => event.stopPropagation()}
              className="product-gallery__arrow absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-pearl/80 text-ink shadow-[0_10px_24px_rgba(22,16,12,0.12)] backdrop-blur-lg transition hover:bg-pearl active:scale-[0.96] md:h-12 md:w-12"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={t.gallery.next}
              onClick={showNext}
              onPointerDown={(event) => event.stopPropagation()}
              className="product-gallery__arrow absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-pearl/80 text-ink shadow-[0_10px_24px_rgba(22,16,12,0.12)] backdrop-blur-lg transition hover:bg-pearl active:scale-[0.96] md:h-12 md:w-12"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <span className="absolute bottom-3 right-3 z-10 rounded-full border border-white/50 bg-ink/68 px-3 py-1.5 text-[11px] tracking-[0.14em] text-pearl backdrop-blur-md">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      {count > 1 ? (
        <div className="product-gallery__thumbs grid grid-cols-3 gap-3" aria-label={t.gallery.pick}>
          {uniqueImages.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              aria-label={t.gallery.show(imageIndex + 1)}
              aria-pressed={imageIndex === index}
              onClick={() => show(imageIndex)}
              className={cn(
                "relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1rem] border bg-white/65 transition active:scale-[0.98]",
                imageIndex === index
                  ? "border-champagne shadow-[0_0_0_2px_rgba(194,164,109,0.14)]"
                  : "border-white/55 opacity-70 hover:opacity-100"
              )}
            >
              <Image src={withBasePath(image)} alt="" fill sizes="(max-width: 768px) 30vw, 200px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {t.gallery.status(index + 1, count)}
      </p>
    </div>
  );
}

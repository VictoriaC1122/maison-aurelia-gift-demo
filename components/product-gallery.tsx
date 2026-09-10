"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (uniqueImages.length === 0) return null;

  const showPrevious = () => {
    setIndex((current) => (current - 1 + uniqueImages.length) % uniqueImages.length);
  };
  const showNext = () => {
    setIndex((current) => (current + 1) % uniqueImages.length);
  };

  return (
    <div className="product-gallery grid min-w-0 gap-3">
      <div className="product-gallery__stage relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1.7rem] border border-white/58 bg-white/70 md:aspect-[4/4.8]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={uniqueImages[index]}
            className="absolute inset-0 touch-pan-y"
            initial={reduceMotion ? false : { opacity: 0.35, scale: 1.012 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0.15, scale: 1.006 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: "easeOut" }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.x < -45) showNext();
              if (info.offset.x > 45) showPrevious();
            }}
          >
            <Image
              src={withBasePath(uniqueImages[index])}
              alt={`${alt}，圖片 ${index + 1}`}
              fill
              priority={priority && index === 0}
              sizes="(max-width: 1024px) 100vw, 610px"
              className="select-none object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {uniqueImages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="上一張商品圖片"
              onClick={showPrevious}
              className="product-gallery__arrow absolute left-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-pearl/80 text-ink shadow-[0_10px_24px_rgba(22,16,12,0.12)] backdrop-blur-lg transition hover:bg-pearl active:scale-[0.96]"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="下一張商品圖片"
              onClick={showNext}
              className="product-gallery__arrow absolute right-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-pearl/80 text-ink shadow-[0_10px_24px_rgba(22,16,12,0.12)] backdrop-blur-lg transition hover:bg-pearl active:scale-[0.96]"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <span className="absolute bottom-3 right-3 z-10 rounded-full border border-white/50 bg-ink/68 px-3 py-1.5 text-[11px] tracking-[0.14em] text-pearl backdrop-blur-md">
          {String(index + 1).padStart(2, "0")} / {String(uniqueImages.length).padStart(2, "0")}
        </span>
      </div>

      {uniqueImages.length > 1 ? (
        <div className="product-gallery__thumbs grid grid-cols-3 gap-3" aria-label="選擇商品圖片">
          {uniqueImages.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              aria-label={`顯示第 ${imageIndex + 1} 張商品圖片`}
              aria-pressed={imageIndex === index}
              onClick={() => setIndex(imageIndex)}
              className={cn(
                "relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1rem] border bg-white/65 transition active:scale-[0.98]",
                imageIndex === index
                  ? "border-champagne shadow-[0_0_0_2px_rgba(194,164,109,0.14)]"
                  : "border-white/55 opacity-72 hover:opacity-100"
              )}
            >
              <Image
                src={withBasePath(image)}
                alt=""
                fill
                sizes="(max-width: 768px) 30vw, 180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        目前顯示第 {index + 1} 張，共 {uniqueImages.length} 張商品圖片。
      </p>
    </div>
  );
}

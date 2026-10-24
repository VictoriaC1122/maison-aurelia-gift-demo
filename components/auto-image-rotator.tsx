"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn, withBasePath } from "@/lib/utils";

/** 自動輪播圖片：淡入切換，只載入目前、上一張與下一張。 */
export function AutoImageRotator({
  images,
  alt,
  priority = false,
  intervalMs = 4200,
  className = "",
  imageClassName = "object-cover",
  sizes = "100vw",
  showDots = true
}: {
  images: string[];
  alt: string;
  priority?: boolean;
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  showDots?: boolean;
}) {
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [{ index, previous }, setSlide] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = uniqueImages.length;

  // 只在畫面附近、且使用者沒有要求減少動態時才輪播
  useEffect(() => {
    const element = containerRef.current;
    if (!element || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "120px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!active || paused || count < 2) return;
    const timer = window.setInterval(() => {
      setSlide((current) => ({ index: (current.index + 1) % count, previous: current.index }));
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [active, paused, count, intervalMs]);

  useEffect(() => {
    setSlide({ index: 0, previous: null });
  }, [uniqueImages]);

  if (count === 0) return null;

  const next = (index + 1) % count;

  return (
    <div
      ref={containerRef}
      className={cn("isolate", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {uniqueImages.map((src, imageIndex) => {
        const isCurrent = imageIndex === index;
        const isPrevious = imageIndex === previous;
        const isNext = active && count > 1 && imageIndex === next;
        if (!isCurrent && !isPrevious && !isNext) return null;
        return (
          <div
            key={src}
            aria-hidden={isCurrent ? undefined : true}
            className={cn(
              "absolute inset-0",
              isCurrent ? "z-[2]" : isPrevious ? "z-[1]" : "z-0 opacity-0",
              isCurrent && previous !== null && "rotator-enter"
            )}
          >
            <Image
              src={withBasePath(src)}
              alt={isCurrent ? alt : ""}
              fill
              priority={priority && imageIndex === 0}
              sizes={sizes}
              className={imageClassName}
            />
          </div>
        );
      })}

      {showDots && count > 1 ? (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {uniqueImages.map((image, imageIndex) => (
            <span
              key={image}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                imageIndex === index ? "w-6 bg-white/90" : "w-1.5 bg-white/45"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

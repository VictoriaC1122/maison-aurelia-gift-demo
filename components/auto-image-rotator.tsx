"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { withBasePath } from "@/lib/utils";

export function AutoImageRotator({
  images,
  alt,
  priority = false,
  intervalMs = 4200,
  className = "",
  imageClassName = "object-cover",
  sizes = "100vw"
}: {
  images: string[];
  alt: string;
  priority?: boolean;
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}) {
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(priority);
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "240px 0px"
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    if (reduceMotion || !isVisible || uniqueImages.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % uniqueImages.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, isVisible, reduceMotion, uniqueImages.length]);

  useEffect(() => {
    setIndex(0);
  }, [uniqueImages]);

  if (uniqueImages.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={className}>
      {reduceMotion || uniqueImages.length < 2 ? (
        <div className="absolute inset-0">
          <Image
            src={withBasePath(uniqueImages[0])}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={imageClassName}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={uniqueImages[index]}
            className="absolute inset-0"
            initial={{ opacity: 0.18, scale: 1.012 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.12, scale: 1.008 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <Image
              src={withBasePath(uniqueImages[index])}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes}
              className={imageClassName}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {uniqueImages.length > 1 && !reduceMotion ? (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {uniqueImages.map((image, imageIndex) => (
            <span
              key={image}
              className={imageIndex === index ? "h-1.5 w-6 rounded-full bg-white/90" : "h-1.5 w-1.5 rounded-full bg-white/45"}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { withBasePath } from "@/lib/utils";

export function AutoImageRotator({
  images,
  alt,
  priority = false,
  intervalMs = 4200,
  className = "",
  imageClassName = "object-cover"
}: {
  images: string[];
  alt: string;
  priority?: boolean;
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
}) {
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (uniqueImages.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % uniqueImages.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, uniqueImages.length]);

  useEffect(() => {
    setIndex(0);
  }, [uniqueImages]);

  if (uniqueImages.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={uniqueImages[index]}
          className="absolute inset-0"
          initial={{ opacity: 0.18, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.14, scale: 1.01 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
        >
          <Image
            src={withBasePath(uniqueImages[index])}
            alt={alt}
            fill
            priority={priority}
            className={imageClassName}
          />
        </motion.div>
      </AnimatePresence>

      {uniqueImages.length > 1 ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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

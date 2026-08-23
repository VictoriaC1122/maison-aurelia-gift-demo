"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function FadeIn({
  children,
  delay = 0,
  className = ""
}: PropsWithChildren<{ delay?: number; className?: string }>) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: [0.86, 1], y: [8, 0] }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.48, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

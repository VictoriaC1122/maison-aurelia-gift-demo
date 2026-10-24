"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

/**
 * 捲動到時淡入。首屏內容直接顯示（不延遲最大內容繪製），
 * 只有一開始在畫面外的區塊才會在出現時輕微淡入上移。
 */
export function FadeIn({
  children,
  delay = 0,
  className = "",
  as: Tag = "div"
}: PropsWithChildren<{ delay?: number; className?: string; as?: Extract<ElementType, "div" | "li" | "section" | "article"> }>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(className, state === "pending" && "reveal-pending", state === "shown" && "reveal-shown")}
      style={state === "shown" && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

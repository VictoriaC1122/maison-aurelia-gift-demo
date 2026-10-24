"use client";

import { useEffect, useState } from "react";

/**
 * 讓彈出層（選單、購物車）有進場／退場動畫：
 * mounted 控制是否渲染，visible 控制 CSS 動畫狀態。
 */
export function usePresence(open: boolean, exitMs = 280) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // 等下一個畫格再切換狀態，transition 才會生效
      const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(() => setVisible(true)));
      return () => window.cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, exitMs]);

  return { mounted, visible };
}

/** 開啟時鎖住背景捲動，並支援 Esc 關閉、關閉後焦點回到原本的按鈕 */
export function useModalBehavior(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);
}

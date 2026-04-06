"use client";

import { useEffect } from "react";

export function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cs-id]")) return;

      const clickedInside = refs.some((ref) => ref.current?.contains(target));

      if (!clickedInside) onOutside();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [refs, onOutside, enabled]);
}
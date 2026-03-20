"use client";

import { useEffect, useState } from "react";

const CARD_HEIGHTS = [
  [80, 56, 72],
  [64, 96, 56, 80],
  [72, 60, 88],
];

interface ColumnSkeletonProps {
  cards: number[];
  animIndex: number;
}

function ColumnSkeleton({ cards, animIndex }: ColumnSkeletonProps) {
  const [phase, setPhase] = useState<"idle" | "stretch" | "shrink" | "done">("idle");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise(r => setTimeout(r, animIndex * 220));
      if (cancelled) return;

      while (!cancelled) {
        setPhase("stretch");
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) break;

        setPhase("shrink");
        await new Promise(r => setTimeout(r, 350));
        if (cancelled) break;

        setPhase("idle");
        await new Promise(r => setTimeout(r, 300));
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [animIndex]);

  const scaleY =
    phase === "idle" ? 1 :
      phase === "stretch" ? 1.22 :
        phase === "shrink" ? 0.88 :
          1;

  const opacity =
    phase === "idle" ? 0.3 :
      phase === "stretch" ? 0.7 :
        phase === "shrink" ? 0.85 :
          1;

  const duration =
    phase === "stretch" ? "0.4s" :
      phase === "shrink" ? "0.35s" :
        "0.3s";

  return (
    <div
      className="shrink-0 w-68 rounded-xl p-3 flex flex-col gap-2"
      style={{
        backgroundColor: "#2d2d2d",
        transformOrigin: "top center",
        transform: `scaleY(${scaleY})`,
        opacity,
        transition: `transform ${duration} cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease`,
      }}
    >
      <div
        className="h-5 rounded-md bg-white/10 animate-pulse mb-1"
        style={{ width: "60%", animationDelay: `${animIndex * 150}ms` }}
      />

      <div className="flex flex-col gap-2">
        {cards.map((h, i) => (
          <div
            key={i}
            className="w-full rounded-lg p-3 flex flex-col gap-2"
            style={{
              backgroundColor: "#1e1e1e",
              height: h,
              transformOrigin: "top center",
              transform: `scaleY(${1 / scaleY})`,
              transition: `transform ${duration} cubic-bezier(0.34, 1.4, 0.64, 1)`,
            }}
          >
            <div className="h-3 rounded-md bg-white/10 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            <div className="h-3 w-3/4 rounded-md bg-white/10 animate-pulse" style={{ animationDelay: `${i * 60 + 40}ms` }} />
            {h > 70 && (
              <div className="flex gap-2 mt-auto">
                <div className="h-4 w-10 rounded-full bg-white/10 animate-pulse" />
                <div className="h-4 w-14 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: "60ms" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="h-8 w-full rounded-md bg-white/5 animate-pulse mt-1"
        style={{
          transformOrigin: "top center",
          transform: `scaleY(${1 / scaleY})`,
          transition: `transform ${duration} cubic-bezier(0.34, 1.4, 0.64, 1)`,
        }}
      />
    </div>
  );
}

export default function Loading() {
  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="px-6 pt-4 pb-3 flex items-center gap-4 shrink-0 border-b border-gray-700">
        <div className="h-7 w-40 rounded-md bg-white/10 animate-pulse" />
        <div className="h-6 w-px bg-white/10" />
        <div className="h-6 w-20 rounded-md bg-white/10 animate-pulse" style={{ animationDelay: "80ms" }} />
        <div className="flex-1" />
        <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: "100ms" }} />
        <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: "100ms" }} />
        <div className="h-7 w-24 rounded-md bg-white/10 animate-pulse" style={{ animationDelay: "120ms" }} />
        <div className="h-6 w-px bg-white/10" />
        <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: "100ms" }} />
        <div className="h-7 w-16 rounded-md bg-white/10 animate-pulse" style={{ animationDelay: "160ms" }} />
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 px-6 py-2 items-start">
          {CARD_HEIGHTS.map((cards, i) => (
            <ColumnSkeleton key={i} cards={cards} animIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

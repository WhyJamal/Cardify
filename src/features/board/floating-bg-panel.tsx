import { useEffect, useRef, useState, RefObject, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { calcFloatingSidePosition } from "@/shared/utils/floatingPosition";
import ColorsView from "./colors-view";
import PhotosView from "./photos-view";
import Image from "next/image";

const PANEL_WIDTH = 320;

const PHOTOS = [
  "https://images.unsplash.com/photo-1574797668796-3c321fee0d01?w=300&q=80",
  "https://images.unsplash.com/photo-1599551528722-6b6d968512a2?w=300&q=80",
  "https://images.unsplash.com/photo-1678393834156-f8aed69b05f2?w=300&q=80",
  "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?w=300&q=80",
  "https://images.unsplash.com/photo-1650234409957-7609e577a0b5?w=300&q=80",
  "https://images.unsplash.com/photo-1668778026441-250fd7fb87f5?w=300&q=80",
];

const GRADIENT_COLORS = [
  { id: "gc1", style: "linear-gradient(135deg, #1a2a4a 0%, #0d1b35 100%)" },
  { id: "gc2", style: "linear-gradient(135deg, #1e90ff 0%, #00bcd4 100%)" },
  { id: "gc3", style: "linear-gradient(135deg, #1a237e 0%, #283593 100%)" },
  { id: "gc4", style: "linear-gradient(135deg, #6a11cb 0%, #b721ff 100%)" },
  { id: "gc5", style: "linear-gradient(135deg, #c850c0 0%, #8d4fc2 100%)" },
  { id: "gc6", style: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)" },
  { id: "gc7", style: "linear-gradient(135deg, #e91e8c 0%, #f06292 100%)" },
  { id: "gc8", style: "linear-gradient(135deg, #00897b 0%, #26a69a 100%)" },
  { id: "gc9", style: "linear-gradient(135deg, #1c2b4a 0%, #263350 100%)" },
  { id: "gc10", style: "linear-gradient(135deg, #7b1212 0%, #b71c1c 100%)" },
];

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
  fallbackRef?: RefObject<HTMLElement | null>;
  selectedBg: string;
  isBgPhoto: boolean;
  onSelectBg: (bg: string, isPhoto: boolean) => void;
  onClose: () => void;
}

export function FloatingBgPanel({
  triggerRef,
  fallbackRef,
  selectedBg,
  isBgPhoto,
  onSelectBg,
  onClose,
}: Props) {
  const [view, setView] = useState<"background" | "colors" | "photos">("background");
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0, maxHeight: 430 });

  const estimatedHeight = view === "colors" ? 560 : 430;

  const computePos = () => {
    if (!triggerRef.current) {
      setPos({ left: 0, top: 0, maxHeight: estimatedHeight });
      return;
    }
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const fallbackRect = fallbackRef?.current?.getBoundingClientRect() ?? null;

    const p = calcFloatingSidePosition(triggerRect, PANEL_WIDTH, estimatedHeight, {
      gap: 8,
      fallbackRect,
      estimatedHeight,
      alignToViewportTop: false,
    });

    setPos(p);
  };

  useLayoutEffect(() => {
    computePos();
    const ro = new ResizeObserver(computePos);
    if (triggerRef.current) ro.observe(triggerRef.current);
    if (panelRef.current) ro.observe(panelRef.current);

    window.addEventListener("resize", computePos);
    window.addEventListener("scroll", computePos, true);

    return () => {
      window.removeEventListener("resize", computePos);
      window.removeEventListener("scroll", computePos, true);
      ro.disconnect();
    };
  }, [triggerRef, view, fallbackRef]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, triggerRef]);

  const panel = (
    <div
      ref={panelRef}
      data-floating-bg-panel
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        maxHeight: pos.maxHeight,
        zIndex: 99999,
      }}
      className="bg-[#2c2c2c] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      {view === "background" && (
        <BackgroundView
          selectedBg={selectedBg}
          isBgPhoto={isBgPhoto}
          onSelectBg={onSelectBg}
          onClose={onClose}
          onShowColors={() => setView("colors")}
          onShowPhotos={() => setView("photos")}
        />
      )}

      {view === "colors" && (
        <ColorsView
          selectedBg={selectedBg}
          isBgPhoto={isBgPhoto}
          onSelectBg={onSelectBg}
          onBack={() => setView("background")}
          onClose={onClose}
        />
      )}

      {view === "photos" && (
        <PhotosView
          selectedBg={selectedBg}
          isBgPhoto={isBgPhoto}
          onSelectBg={onSelectBg}
          onBack={() => setView("background")}
          onClose={onClose}
        />
      )}
    </div>
  );

  return createPortal(panel, document.body);
}

function BackgroundView({
  selectedBg, isBgPhoto, onSelectBg, onClose, onShowColors, onShowPhotos
}: {
  selectedBg: string; isBgPhoto: boolean;
  onSelectBg: (bg: string, isPhoto: boolean) => void;
  onClose: () => void;
  onShowColors: () => void;
  onShowPhotos: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <span className="text-white text-sm">Фон доски</span>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5 overflow-y-auto">
        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm">Фотографии</span>
            <button
              onClick={onShowPhotos}
              className="text-white text-sm hover:text-blue-400 transition-colors"
            >
              Показать больше
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PHOTOS.map((url, i) => (
              <button
                key={i}
                onClick={() => onSelectBg(url, true)}
                className={`relative rounded-lg overflow-hidden h-[75] border-2 transition-all ${selectedBg === url && isBgPhoto
                  ? "border-white"
                  : "border-transparent hover:border-white/40"
                  }`}
              >
                <Image
                  src={url}
                  alt="bg"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 320px) 100vw, 320px"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm">Цвета</span>
            <button
              onClick={onShowColors}
              className="text-white text-sm hover:text-blue-400 transition-colors"
            >
              Показать больше
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GRADIENT_COLORS.slice(0, 6).map((c) => {
              const isSelected = selectedBg === c.style && !isBgPhoto;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectBg(c.style, false)}
                  className={`relative rounded-lg h-17.5 border-2 transition-all overflow-hidden ${isSelected ? "border-white" : "border-transparent hover:border-white/40"
                    }`}
                  style={{ background: c.style }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={16} className="text-white drop-shadow" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}


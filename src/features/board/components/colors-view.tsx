import { GRADIENT_COLORS, SOLID_COLORS } from "@data/colors.data";
import { Check, ChevronLeft, X } from "lucide-react";

export default function ColorsView({
  selectedBg, isBgPhoto, onSelectBg, onBack, onClose,
}: {
  selectedBg: string; isBgPhoto: boolean;
  onSelectBg: (bg: string, isPhoto: boolean) => void;
  onBack: () => void; onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white text-sm">Цвета</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-3 gap-2">
          {GRADIENT_COLORS.map((c) => {
            const isSelected = selectedBg === c.style && !isBgPhoto;
            return (
              <button
                key={c.id}
                onClick={() => onSelectBg(c.style, false)}
                className={`relative rounded-lg h-18 border-2 transition-all overflow-hidden ${isSelected ? "border-white" : "border-transparent hover:border-white/40"
                  }`}
                style={{ background: c.style }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={18} className="text-white drop-shadow" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="my-4 border-t border-white/10" />

        <div className="grid grid-cols-3 gap-2">
          {SOLID_COLORS.map((c) => {
            const isSelected = selectedBg === c.style && !isBgPhoto;
            return (
              <button
                key={c.id}
                onClick={() => onSelectBg(c.style, false)}
                className={`relative rounded-lg h-18 border-2 transition-all overflow-hidden ${isSelected ? "border-white" : "border-transparent hover:border-white/40"
                  }`}
                style={{ background: c.style }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={18} className="text-white drop-shadow" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
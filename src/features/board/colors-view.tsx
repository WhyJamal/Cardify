import { Check, ChevronLeft, X } from "lucide-react";

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

const SOLID_COLORS = [
  { id: "sc1", style: "#1565c0" },
  { id: "sc2", style: "#e65100" },
  { id: "sc3", style: "#2e7d32" },
  { id: "sc4", style: "#c62828" },
  { id: "sc5", style: "#6a1b9a" },
  { id: "sc6", style: "#ad1457" },
  { id: "sc7", style: "#00838f" },
  { id: "sc8", style: "#546e7a" },
  { id: "sc9", style: "#37474f" },
];

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
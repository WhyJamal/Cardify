"use client";

import { X, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { calcBelowPosition } from "@utils/floatingPosition";
import { useOutsideClick } from "@hooks/use-outside-click";
import {
  mergeLabelsWithChecked,
  getCheckedLabels,
  type BoardLabel,
  type SelectedLabel,
  type LabelWithChecked,
  shadeColor,
} from "@utils/labels";
import { Button } from "@components/";

interface LabelsMenuProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  boardLabels: BoardLabel[];
  selectedLabels: SelectedLabel[];
  onClose: () => void;
  onChange?: (labels: LabelWithChecked[]) => void;
  onCreate: () => void;
}

export function LabelsMenu({
  onClose,
  onChange,
  onCreate,
  triggerRef,
  boardLabels = [],
  selectedLabels = [],
}: LabelsMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [labels, setLabels] = useState<LabelWithChecked[]>([]);

  const [hoveredLabels, setHoveredLabels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLabels(mergeLabelsWithChecked(boardLabels, selectedLabels));
  }, [boardLabels, selectedLabels]);

  const PANEL_WIDTH = 320;
  const PANEL_HEIGHT = 260;

  const pos = (() => {
    if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

    return calcBelowPosition(
      triggerRef.current.getBoundingClientRect(),
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
  })();

  const panelRef = useRef<HTMLDivElement>(null);

  useOutsideClick([panelRef, triggerRef], onClose, true);

  const toggleLabel = async (id: string) => {
    const newLabels = labels.map((label) =>
      label.id === id ? { ...label, checked: !label.checked } : label
    );

    setLabels(newLabels);

    const checkedLabels = getCheckedLabels(newLabels);

    onChange?.(checkedLabels);
  };

  const filteredLabels = labels.filter((label) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return String(label.name ?? "").toLowerCase().includes(q);
  });

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        maxHeight: pos.maxHeight,
        zIndex: 99998,
      }}
      className="bg-[#2b2c2f] rounded-lg shadow-xl w-full max-w-[320px] text-white"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="font-medium">Метки</h2>
        <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Искать метки..."
          className="w-full bg-[#1f1f1f] border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 placeholder-gray-500"
        />
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xs text-gray-400 mb-3 uppercase">Метки</h3>
        <div className="space-y-2 overflow-y-auto max-h-[215]">
          {filteredLabels.map((label) => {
            const isHovered = hoveredLabels[label.id] || false;

            return (
              <div key={label.id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={label.checked}
                  onChange={() => toggleLabel(label.id)}
                  className="w-4 h-4 accent-blue-500 shrink-0"
                />
                <div
                  onClick={() => toggleLabel(label.id)}
                  className="flex-1 rounded px-3 py-2 min-h-9 transition-colors hover:ring-2 hover:ring-white"
                  onMouseEnter={() =>
                    setHoveredLabels((prev) => ({ ...prev, [label.id]: true }))
                  }
                  onMouseLeave={() =>
                    setHoveredLabels((prev) => ({ ...prev, [label.id]: false }))
                  }
                  style={{
                    background: isHovered ? shadeColor(label.color, -20) : label.color,
                  }}
                >
                  {label.name}
                </div>
                <button className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 p-1.5 rounded transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button
            variant={"custom"}
            onClick={onCreate} 
            className="w-full"        
        >
          Создать новую метку
        </Button>
      </div>
    </div>,
    document.body
  );
}
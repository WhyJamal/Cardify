import { Button } from '@components/';
import { useOutsideClick } from '@hooks/use-outside-click';
import { calcBelowPosition } from '@utils/floatingPosition';
import { Check, ChevronLeft, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBoardActions } from '@hooks/use-board-actions';
import { BoardLabel } from '@shared/types';

interface CreateLabelMenuProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onBack: () => void;
  onChange: (formData: BoardLabel) => void;
}

export function CreateLabelMenu({ triggerRef, onClose, onBack, onChange }: CreateLabelMenuProps) {
  const { handleCreateLabel } = useBoardActions();

  const [formData, setFormData] = useState<BoardLabel>({
    id: "",
    color: "",
    name: "",
  });

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

  const handleCreate = async () => {
    try {
      const data = await handleCreateLabel(formData);

      onChange(data.label);
      onBack();
    } catch (e) {
      console.error("Create label failed", e);
    }
  };

  const colors = [
    // Row 1 - Darker shades
    '#065f46', // bg-emerald-800
    '#854d0e', // bg-yellow-800
    '#9a3412', // bg-orange-800
    '#991b1b', // bg-red-800
    '#6b21a8', // bg-purple-800

    // Row 2 - Dark shades
    '#047857', // bg-emerald-700
    '#a16207', // bg-yellow-700
    '#c2410c', // bg-orange-700
    '#b91c1c', // bg-red-700
    '#7e22ce', // bg-purple-700

    // Row 3 - Medium bright
    '#10b981', // bg-emerald-500
    '#facc15', // bg-yellow-400
    '#f97316', // bg-orange-500
    '#f87171', // bg-red-400
    '#c084fc', // bg-purple-400

    // Row 4 - Blues and greens
    '#1d4ed8', // bg-blue-700
    '#0f766e', // bg-teal-700
    '#4d7c0f', // bg-lime-700
    '#be123c', // bg-rose-700
    '#4b5563', // bg-gray-600

    // Row 5 - Light blues and pastels
    '#3b82f6', // bg-blue-500
    '#06b6d4', // bg-cyan-500
    '#84cc16', // bg-lime-500
    '#ec4899', // bg-pink-500
    '#6b7280', // bg-gray-500
  ];

  const handleWithoutColor = () => {
    setFormData(prev => ({ ...prev, color: "" }));
  }

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        zIndex: 99998,
      }}
      className="bg-[#2b2b2b] rounded-lg shadow-xl w-full max-w-[320px] text-white"
    > {/* 2b3035 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={onBack}
          className="hover:bg-gray-700 p-1 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">Создание метки</h2>
        <button
          onClick={onClose}
          className="hover:bg-gray-700 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[300]">
        <div 
          className="formData.color rounded px-3 py-3 min-h-12 mb-4 border border-gray-500"
          style={{background: formData.color}}
        >
          {formData.name || ' '}
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Название</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-3 block">Цвет</label>
          <div className="grid grid-cols-5 gap-2 mb-4 overflow-x-hidden overflow-y-hidden">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    color,
                  }))
                }
                className="flex h-10 rounded hover:scale-110 transition-transform items-center justify-center hover:ring-2"
                style={{background: color}}
              >
                {formData.color === color && <Check />}
              </button>
            ))}
          </div>


        </div>
      </div>

      <div className="p-4 pt-0 space-y-1">
        <Button
          variant={"ghost"}
          onClick={handleWithoutColor}
          className="w-full text-sm rounded text-gray-400 hover:text-white flex items-center justify-center gap-2 hover:bg-[#38414a]">
          <X className="w-3 h-3" />
          Без цвета
        </Button>
        <Button
          variant={"custom"}
          onClick={handleCreate}
          className="w-full"
        >
          Создание
        </Button>
      </div>
    </div>,
    document.body
  );
}
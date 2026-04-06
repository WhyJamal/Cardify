"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import CustomSelect from "@/shared/components/ui/custom-select";
import { Button } from "@/shared/components";
import { calcSidePosition } from "@/shared/utils/floatingPosition";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { createPortal } from "react-dom";

type Tab = "Входящие" | "Доска";

interface MoveCardModalProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onMove?: (data: { board: string; list: string; position: string }) => void;
}

const boardOptions = [
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "design", label: "Дизайн" },
  { value: "development", label: "Разработка" },
];

const listOptions = [
  { value: "doing", label: "В процессе" },
  { value: "todo", label: "К выполнению" },
  { value: "done", label: "Готово" },
  { value: "review", label: "На проверке" },
];

const positionOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export default function MoveCardModal({ triggerRef, onClose, onMove }: MoveCardModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Доска");
  const [selectedBoard, setSelectedBoard] = useState("11");
  const [selectedList, setSelectedList] = useState("doing");
  const [selectedPosition, setSelectedPosition] = useState("1");

  const PANEL_WIDTH = 350;
  const PANEL_HEIGHT = 640;

  const pos = (() => {
    if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

    return calcSidePosition(
      triggerRef.current.getBoundingClientRect(),
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
  })();

  const panelRef = useRef<HTMLDivElement>(null);

  useOutsideClick([panelRef, triggerRef], () => onClose(), true);

  const handleMove = () => {
    onMove?.({
      board: selectedBoard,
      list: selectedList,
      position: selectedPosition,
    });
    onClose();
  };

  return createPortal(
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          left: pos.left,
          top: pos.top,
          width: PANEL_WIDTH,
          zIndex: 99999,
        }}
        className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col overflow-hidden"
      >
      <div className="bg-[#] rounded shadow-2xl w-90 overflow-visible text-white font-sans">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Переместить карточку
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-4">
          {(["Доска"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-2 px-1 border-b-2 transition-all ${activeTab === tab
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5 pb-5 pt-4 space-y-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Выберите место назначения
          </p>

          <CustomSelect
            label="Доска"
            options={boardOptions}
            value={selectedBoard}
            onChange={setSelectedBoard}
            placeholder="Выберите доску"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <CustomSelect
                label="Список"
                options={listOptions}
                value={selectedList}
                onChange={setSelectedList}
                placeholder="Выберите список"
              />
            </div>
            <div className="w-24">
              <CustomSelect
                label="Позиция"
                options={positionOptions}
                value={selectedPosition}
                onChange={setSelectedPosition}
                placeholder="№"
              />
            </div>
          </div>

          <Button
            variant={"custom"}
            size={"xl"}
            onClick={handleMove}
          >
            Переместить
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
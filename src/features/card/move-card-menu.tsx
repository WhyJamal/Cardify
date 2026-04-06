"use client";

import { useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import CustomSelect from "@/shared/components/ui/custom-select";
import { Button } from "@/shared/components";
import { calcSidePosition } from "@/shared/utils/floatingPosition";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { useMoveCard } from "@/features/card/hooks/use-move-card";

interface MoveCardModalProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  cardId: string;
  currentColumnId: string;
  currentPosition: number;
}

const PANEL_WIDTH = 350;
const PANEL_HEIGHT = 300;

export default function MoveCardModal({
  triggerRef,
  onClose,
  cardId,
  currentColumnId,
  currentPosition,
}: MoveCardModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    boardOptions,
    columnOptions,
    positionOptions,
    selectedBoardId,
    selectedColumnId,
    selectedPosition,
    setSelectedBoardId,
    setSelectedColumnId,
    setSelectedPosition,
    loadingBoards,
    moving,
    handleMove,
  } = useMoveCard(cardId, currentColumnId, currentPosition);

  const pos = triggerRef.current
    ? calcSidePosition(triggerRef.current.getBoundingClientRect(), PANEL_WIDTH, PANEL_HEIGHT)
    : { left: 0, top: 0 };

  useOutsideClick([panelRef, triggerRef], () => onClose(), true);

  const onMove = async () => {
    const ok = await handleMove();
    if (ok) onClose();
  };

  return createPortal(
    <div
      ref={panelRef}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: PANEL_WIDTH, zIndex: 99999 }}
      className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold tracking-wide">Переместить карточку</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4 space-y-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          Выберите место назначения
        </p>

        {/* Board */}
        {loadingBoards ? (
          <InlineLoader text="Загрузка досок..." />
        ) : (
          <CustomSelect
            label="Доска"
            options={boardOptions}
            value={selectedBoardId}
            onChange={setSelectedBoardId}
            placeholder="Выберите доску"
          />
        )}

        {/* Column + Position */}
        <div className="flex gap-3">
          <div className="flex-1">
              <CustomSelect
                label="Список"
                options={columnOptions}
                value={selectedColumnId}
                onChange={setSelectedColumnId}
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
          variant="custom"
          size="xl"
          onClick={onMove}
          disabled={moving || loadingBoards}
        >
          {moving ? <InlineLoader text="Перемещение..." /> : "Переместить"}
        </Button>
      </div>
    </div>,
    document.body
  );
}

function InlineLoader({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <Loader2 size={14} className="animate-spin" />
      {text}
    </div>
  );
}
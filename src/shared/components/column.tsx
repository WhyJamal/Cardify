"use client";

import { MoreHorizontal, Plus, ExternalLink, X } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDrop, useDrag, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { CustomCard } from "./custom-card";
import { CardData } from "@/shared/types";
import { CardModal } from "@/features/card/card-modal";
import { useBoardView } from "@/app/providers/BoardProvider";
import { useEditableColumnTitle } from "@/features/board/hooks/use-editable-column-title";

interface ColumnProps {
  column: { id: string; title: string; cards: CardData[] };
  onAddCard: (columnId: string, title: string) => void;
  onDropCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    targetCardId?: string | null,
    insertAfter?: boolean
  ) => void;
  onDropColumn: (draggedColumnId: string, targetColumnId: string) => void;
  showLabelName: boolean;
  toggleLabel: () => void;
}

export function Column({
  column,
  onAddCard,
  onDropCard,
  onDropColumn,
  showLabelName,
  toggleLabel,
}: ColumnProps) {
  const { setColumns } = useBoardView();

  const [showCardModal, setshowCardModal] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  const {
    isEditingTitle,
    editableTitle,
    setEditableTitle,
    titleInputRef,
    handleTitleClick,
    handleTitleKeyDown,
    handleTitleBlur,
  } = useEditableColumnTitle({
    columnId: column.id,
    initialTitle: column.title,
    onTitleUpdated: (columnId, title) => {
      setColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, title } : col))
      );
    },
  });

  const [{ isCardOver }, cardDrop] = useDrop({
    accept: "CARD",
    hover: (item: { id: string; columnId: string; index: number }) => {
      if (column.cards.length === 0 && item.columnId !== column.id) {
        onDropCard(item.id, item.columnId, column.id, null);
        item.columnId = column.id;
        item.index = 0;
      }
    },
    drop: (item: { id: string; columnId: string }, monitor) => {
      if (monitor.didDrop()) return;
      if (item.columnId !== column.id) {
        onDropCard(item.id, item.columnId, column.id);
      }
    },
    collect: (monitor) => ({ isCardOver: monitor.isOver() }),
  });

  const [{ isColumnOver }, columnDrop] = useDrop({
    accept: "COLUMN",
    hover: (item: { id: string }) => {
      if (item.id !== column.id) {
        onDropColumn(item.id, column.id);
      }
    },
    collect: (monitor) => ({ isColumnOver: monitor.isOver() }),
  });

  const [, drag, dragPreview] = useDrag({
    type: "COLUMN",
    item: { id: column.id },
    canDrag: () => !isEditingTitle,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const isDragging = useDragLayer(
    (monitor) =>
      monitor.isDragging() &&
      monitor.getItemType() === "COLUMN" &&
      (monitor.getItem() as { id: string })?.id === column.id
  );

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  useEffect(() => {
    if (headerRef.current) drag(headerRef);
  }, [drag]);

  const combinedDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardDrop(node);
      columnDrop(node);
    },
    [cardDrop, columnDrop]
  );

  const handleAddCard = () => {
    const title = newCardTitle.trim();
    if (!title) return;

    onAddCard(column.id, title);
    setNewCardTitle("");
    setAddingCard(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    }

    if (e.key === "Escape") {
      setAddingCard(false);
      setNewCardTitle("");
    }
  };

  const onEdit = () => {
    // unchanged placeholder
  };

  return (
    <div
      ref={combinedDropRef}
      className={`shrink-0 w-64 flex flex-col rounded-xl bg-[#101204] transition-all duration-150 ${
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      } ${isColumnOver ? "ring-2 ring-blue-400/60 scale-[1.01]" : ""} ${
        isCardOver ? "ring-2 ring-blue-400/60 bg-[#161b22]" : ""
      }`}
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
      <div
        ref={headerRef}
        className="flex items-center justify-between px-3 pt-2.5 pb-1 cursor-grab active:cursor-grabbing select-none"
      >
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleBlur}
            autoFocus
            className="flex-1 text-sm font-semibold text-[#b6c2cf] bg-[#232321] border border-[#41423e] outline-none px-1 py-0.5 rounded"
          />
        ) : (
          <h3
            className="text-[#b6c2cf] text-sm font-semibold flex-1 truncate pr-2"
            onClick={handleTitleClick}
          >
            {column.title}
          </h3>
        )}

        <button
          className="p-1 rounded hover:bg-white/10 text-[#9fadbc] transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-2 scrollbar-thin scrollbar-thumb-[#3d4954] scrollbar-track-transparent">
        {column.cards.map((card, index) => (
          <CustomCard
            key={card.id}
            card={card}
            index={index}
            columnId={column.id}
            onEdit={onEdit}
            onDropCard={onDropCard}
            showLabelName={showLabelName}
            toggleLabel={toggleLabel}
          />
        ))}

        {addingCard && (
          <div className="bg-[#22272b] rounded-lg p-2 shadow-md">
            <textarea
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите заголовок карточки..."
              className="w-full bg-transparent text-[#b6c2cf] text-sm resize-none outline-none placeholder-[#9fadbc]/60 min-h-15"
              rows={3}
            />
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleAddCard}
                className="bg-[#579dff] hover:bg-[#388bff] text-[#1d2125] text-xs font-medium px-3 py-1.5 rounded transition-colors"
              >
                Добавить карточку
              </button>
              <button
                onClick={() => {
                  setAddingCard(false);
                  setNewCardTitle("");
                }}
                className="text-[#9fadbc] hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {!addingCard && (
        <div className="px-2 pb-2 pt-1 flex items-center gap-1">
          <button
            onClick={() => setAddingCard(true)}
            className="flex-1 flex items-center gap-2 px-2 py-2 rounded-lg text-[#9fadbc] text-sm hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus size={16} />
            <span>Добавить карточку</span>
          </button>
          <button className="p-2 rounded-lg text-[#9fadbc] hover:bg-white/10 hover:text-white transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>
      )}

      {showCardModal && <CardModal onClose={() => setshowCardModal(false)} />}
    </div>
  );
}
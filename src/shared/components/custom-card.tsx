"use client";

import { Eye, Paperclip, CheckSquare, AlignLeft, ExternalLink, Pencil } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Image from "next/image";
import { CardData } from "@/shared/types";
import { TooltipAction } from "./custom-tooltip";
import Link from "next/link";

interface CardProps {
  card: CardData;
  columnId: string;
  index: number;
  onEdit?: (cardId: string) => void;
  onClickCard?: (cardId: string) => void;
  onDropCard?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    targetCardId: string | null,
    insertAfter?: boolean
  ) => void;
  showLabelName: boolean;
  toggleLabel: () => void;
}

export function CardContent({ card, onClickCard, showLabelName, toggleLabel }: { card: CardData; onClickCard?: (cardId: string) => void, showLabelName: boolean, toggleLabel: () => void }) {
  function handleToggleLabel(e: React.MouseEvent<HTMLSpanElement>) {
    e.preventDefault();     
    e.stopPropagation();    
    toggleLabel();
  }

  return (
    <>
      {card.coverColor && (
        <div className="h-8 rounded-t-lg w-full" style={{ backgroundColor: card.coverColor }} />
      )}

      {card.image && (
        <div className="w-full rounded-t-lg overflow-hidden relative">
          {card.numberBadge !== undefined && (
            <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold z-10">
              {card.numberBadge}
            </div>
          )}
          <Image src={card.image} alt={card.title || ""} width={400} height={200} className="w-full h-36 object-cover" />
        </div>
      )}

      <Link href={`/c/${card.id}/${card.title}`}>
        <div className="p-2 pb-2">
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  onClick={handleToggleLabel}
                  className="min-h-2 min-w-8 text-xs px-1.5 py-0.5 text-white rounded-sm hover:scale-105"
                  style={{ backgroundColor: label.color }}
                >
                  {showLabelName ? label.name : null}
                </span>
              ))}
            </div>
          )}

          {card.title && (
            <div className="relative flex items-start group">
              <div className="round-sm absolute left-0 top-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="relative">
                  <TooltipAction
                    tooltip="Отметь как выполнение"
                    side="top"
                  >
                    <div className="flex items-center">
                      <input type="checkbox" id={`checkbox-${card.id}`} onClick={(e) => e.stopPropagation()} className="peer cursor-pointer" />
                      <label htmlFor={`checkbox-${card.id}`} onClick={(e) => e.stopPropagation()} />
                    </div>
                  </TooltipAction>
                </div>
              </div>
              <p className="text-[#b6c2cf] text-sm leading-snug mb-2 pr-5 transition-all duration-200 group-hover:pl-4">
                {card.title}
              </p>
            </div>
          )}

          {card.links && card.links.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              {card.links.map((link, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[#579dff] text-xs hover:underline cursor-pointer">
                  {link.icon && <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[8px] text-blue-400">✦</span>}
                  <span>{link.text}</span>
                  <ExternalLink size={10} className="opacity-50" />
                </div>
              ))}
            </div>
          )}

          {(card.watching || card.hasDescription || card.checklist || card.attachments || card.assignee) && (
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {card.watching && <span className="flex items-center gap-1 text-[#9fadbc] text-xs"><Eye size={12} /></span>}
                {card.hasDescription && <span className="flex items-center gap-1 text-[#9fadbc] text-xs"><AlignLeft size={12} /></span>}
                {card.attachments && <span className="flex items-center gap-1 text-[#9fadbc] text-xs"><Paperclip size={12} />{card.attachments}</span>}
                {card.checklist && (
                  <span className={`flex items-center gap-1 text-xs px-1 rounded ${card.checklist.done === card.checklist.total && card.checklist.total > 0 ? "bg-green-700/60 text-green-300" : "text-[#9fadbc]"}`}>
                    <CheckSquare size={12} />{card.checklist.done}/{card.checklist.total}
                  </span>
                )}
              </div>
              {card.assignee && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: card.assignee.color }}>
                  {card.assignee.initials}
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </>
  );
}

export function CustomCard({ card, columnId, index, onEdit, onClickCard, onDropCard, showLabelName, toggleLabel }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag, dragPreview] = useDrag({
    type: "CARD",
    item: { id: card.id, columnId, index },
  });

  const isDragging = useDragLayer((monitor) =>
    monitor.isDragging() &&
    monitor.getItemType() === "CARD" &&
    (monitor.getItem() as { id: string })?.id === card.id
  );

  const [, drop] = useDrop({
    accept: "CARD",
    hover(item: { id: string; columnId: string; index: number }, monitor) {
      if (!ref.current || item.id === card.id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (item.columnId === columnId) {
        if (item.index < index && hoverClientY < hoverMiddleY) return;
        if (item.index > index && hoverClientY > hoverMiddleY) return;
      }

      const insertAfter =
        item.columnId === columnId &&
        item.index < index &&
        hoverClientY >= hoverMiddleY;

      onDropCard?.(item.id, item.columnId, columnId, card.id, insertAfter);
      item.columnId = columnId;
      item.index = index;
    },
    drop() {
      return { handled: true };
    },
  });

  drag(drop(ref));

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  return (
    <div
      ref={ref}
      className={`group relative bg-[#22272b] rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:bg-[#282e33] transition-colors ${isDragging ? "opacity-40 scale-95" : "opacity-100"
        }`}
    >
      <button
        onClick={() => onEdit?.(card.id)}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#2c333a] hover:bg-[#3d4954] text-[#9fadbc] transition-all"
      >
        <Pencil size={12} />
      </button>
      <CardContent card={card} onClickCard={onClickCard} showLabelName={showLabelName} toggleLabel={toggleLabel} />
    </div>
  );
}
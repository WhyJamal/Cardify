"use client";

import { useDragLayer } from "react-dnd";
import { MoreHorizontal } from "lucide-react";
import { CardData } from "@shared/types";

export function ColumnDragPreview({
  columns,
}: {
  columns: { id: string; title: string; cards: CardData[] }[];
}) {
  const { offset, isDragging, itemType, item } = useDragLayer((monitor) => ({
    offset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
    item: monitor.getItem() as { id: string } | null,
  }));

  if (!isDragging || !offset || itemType !== "COLUMN" || !item) return null;

  const col = columns.find((c) => c.id === item.id);
  if (!col) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: offset.x,
        top: offset.y,
        width: 256,
        transform: "rotate(3deg)",
        opacity: 0.88,
        filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.5))",
      }}
    >
      <div className="w-64 flex flex-col rounded-xl bg-[#101204]">

        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <h3 className="text-[#b6c2cf] text-sm font-semibold flex-1 truncate pr-2">
            {col.title}
          </h3>
          <div className="p-1 text-[#9fadbc]">
            <MoreHorizontal size={16} />
          </div>
        </div>
        <div className="px-2 py-1 space-y-2 pb-2">
          {col.cards.slice(0, 3).map((card) => (
            <div
              key={card.id}
              className="bg-[#22272b] rounded-lg px-2 py-1.5 text-[#b6c2cf] text-xs truncate"
            >
              {card.title || "· · ·"}
            </div>
          ))}
          {col.cards.length > 3 && (
            <div className="text-[#9fadbc] text-xs px-1">
              +{col.cards.length - 3} ta karta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
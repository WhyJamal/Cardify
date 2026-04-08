"use client";

import { useDragLayer } from "react-dnd";
import { CardData } from "@shared/types";
import { CardContent } from "./custom-card";

export function CardDragPreview({ columns }: { columns: { id: string; title: string; cards: CardData[] }[] }) {
  const { isDragging, item, offset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem() as { id: string; columnId: string } | null,
    offset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item || !offset) return null;

  const card = columns
    .flatMap((col) => col.cards)
    .find((c) => c.id === item.id);

  if (!card) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: offset.x,
        top: offset.y,
        width: "260px",
        transform: "rotate(2deg)",
        opacity: 0.85,
      }}
    >
      <div className="bg-[#22272b] rounded-lg shadow-lg">
        <CardContent card={card} />
      </div>
    </div>
  );
}
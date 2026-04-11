"use client";

import { Eye, Paperclip, CheckSquare, AlignLeft, ExternalLink, Pencil, Clock, Archive, MapPin } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Image from "next/image";
import { CardData } from "@shared/types";
import { TooltipAction } from "./custom-tooltip";
import Link from "next/link";
import { formatDueDate } from "../utils/date";
import { shadeColor } from "../utils/labels";
import { Button } from "./ui/button";
import { getInitials } from "../utils/getInitials";
import CustomCheckbox from "./custom-checkbox";

import { CardContextMenu } from "@features/card/components/card-context-menu";
import { useRouter } from "next/navigation";
import { PAGES } from "@/config/pages.config";
import { slugify } from "../utils/slugify";

interface CardProps {
  card: CardData;
  columnId: string;
  index: number;
  onEdit?: (cardId: string) => void;
  onDropCard?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    targetCardId: string | null,
    insertAfter?: boolean
  ) => void;
  showLabelName: boolean;
  onToggleLabel: () => void;
  onToggleIsCompleted: (cardId: string, isComplate: boolean) => void;
  onToggleArchive: (cardId: string, isArchive: boolean) => void;
}

interface CardContentProps {
  card: CardData;
  onClickCard?: (cardId: string) => void, 
  showLabelName: boolean,
  onToggleLabel: () => void,
  onToggleIsCompleted: (cardId: string, isComplate: boolean) => void
}

export function CardContent({
  card,
  onClickCard,
  showLabelName,
  onToggleLabel,
  onToggleIsCompleted,
}: CardContentProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  function handleToggleLabel(e: React.MouseEvent<HTMLSpanElement>) {
    e.preventDefault();
    e.stopPropagation();
    onToggleLabel();
  }

  function handleToggleIsComplated(cardId: string, isComplate: boolean) {
    // e.preventDefault();
    // e.stopPropagation();
    onToggleIsCompleted(cardId, isComplate);
  }

  return (
    <>
      {card.background && card.size === "WIDE" && (
        <div className="h-8 rounded-t-lg w-full"
          style={{
            background: card && card.size === "WIDE"
              ? card.isImage
                ? `url(${card.background}) center/cover no-repeat`
                : card.background ?? undefined
              : "#000000"
          }}
        />
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

      <Link href={PAGES.CARD(card.id, slugify(card.title))}>
        <div
          className="p-2 pb-2 rounded-md"
          style={{
            background: card && card.size === "TALL"
              ? card.isImage
                ? `url(${card.background}) center/cover no-repeat`
                : card.background ?? undefined
              : "#22272b"
          }}
        >
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  onClick={handleToggleLabel}
                  onMouseEnter={() => setHovered(label.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="min-h-2 min-w-8 text-xs px-1.5 py-0.5 text-white rounded-sm hover:scale-105 border border-gray-700 hover:ring-1"
                  style={{ backgroundColor: hovered === label.id ? shadeColor(label.color, -20) : label.color }}
                >
                  {showLabelName ? label.name : null}
                </span>
              ))}
            </div>
          )}

          {card.title && (
            <div className="relative flex items-start group mb-2">
              <TooltipAction tooltip="Отметь как выполнение" side="top">
                <div
                  className={`round-sm relative flex items-center ${card.isCompleted
                    ? "mr-1"
                    : "absolute opacity-0 group-hover:opacity-100 transition-all duration-200"
                    }`}
                >
                  <CustomCheckbox
                    checked={card.isCompleted}
                    onChange={(value) => handleToggleIsComplated(card.id, value)}
                    className="top-0.5"
                  />
                </div>
              </TooltipAction>

              <p
                className={`absolute text-sm leading-snug ${card.isCompleted ? "left-5" : "left-1 transition-all duration-200 group-hover:pl-4"
                  }`}
                style={{
                  color:
                    card.textColor === "light"
                      ? "#b6c2cf"
                      : card.textColor || "#b6c2cf"
                }}
              >
                {card.title}
              </p>
            </div>
          )}

          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              {card.dueDate && (
                <div className="inline-flex items-center gap-1 bg-green-700 px-1 text-black font-medium rounded-sm">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{formatDueDate(card.dueDate)}</span>
                </div>
              )}

              {card.description && (
                <span className="flex items-center gap-1 text-[#9fadbc] text-xs">
                  <AlignLeft size={12} />
                </span>
              )}

              {card.attachments && card.attachments.length > 0 && (
                <span className="flex items-center gap-1 text-[#9fadbc] text-xs">
                  <Paperclip size={12} />{(card.attachments?.length ?? 0) + (card.links?.length ?? 0)}
                </span>
              )}

              {card.location && (
                <span className="flex items-center gap-1 text-[#9fadbc] text-xs">
                  <MapPin size={12} />
                </span>
              )}

            </div>


            <div className="flex -space-x-1.5">
              {card.members && card.members.length > 0 && (
                card.members.map((member) => (
                  <div
                    key={member.user.id}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-green-700 text-[10px] font-bold text-white">
                    {getInitials(member.user.name || "")}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* {card.links && card.links.length > 0 && (
            <div className="flex gap-2 mt-2">
              {card.links.map((link, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[#579dff] text-xs hover:underline cursor-pointer">
                  {link.icon && <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[8px] text-blue-400">✦</span>}
                  <span>{link.text}</span>
                  <ExternalLink size={10} className="opacity-50" />
                </div>
              ))}
            </div>
          )} */}

          {/* {(card.watching || card.hasDescription || card.checklist || card.attachments) && (
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {card.watching && <span className="flex items-center gap-1 text-[#9fadbc] text-xs"><Eye size={12} /></span>}
                {card.checklist && (
                  <span className={`flex items-center gap-1 text-xs px-1 rounded ${card.checklist.done === card.checklist.total && card.checklist.total > 0 ? "bg-green-700/60 text-green-300" : "text-[#9fadbc]"}`}>
                    <CheckSquare size={12} />{card.checklist.done}/{card.checklist.total}
                  </span>
                )}
              </div>
            </div>
          )} */}

        </div>
      </Link>
    </>
  );
}

export function CustomCard({
  card,
  columnId,
  index,
  onEdit,
  onDropCard,
  showLabelName,
  onToggleLabel,
  onToggleIsCompleted,
  onToggleArchive
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  function handlePencilClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setCardRect(rect);
  }

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

  function onClickCard() {
        router.push(PAGES.CARD(card.id, slugify(card.title)));
    }

  return (
    <div
      ref={ref}
      className={`group relative bg-[#22272b] rounded-lg shadow-sm cursor-grab active:cursor-grabbing 
        hover:bg-[#282e33] transition-colors 
        hover:ring-2 hover:ring-white  
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"
        }`}
    >
      <Button
        size={"icon-sm"}
        variant={"ghost"}
        onClick={handlePencilClick}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 rounded bg-[#2c333a] hover:bg-[#3d4954] text-[#9fadbc] transition-all"
      >
        <Pencil size={12} />
      </Button>
      {card.isCompleted && (
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          onClick={() => onToggleArchive(card.id, true)}
          className="absolute top-2 right-9 z-10 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#2c333a] hover:bg-[#3d4954] text-[#9fadbc] transition-all"
        >
          <Archive size={12} />
        </Button>
      )}

      <CardContent
        card={card}
        onClickCard={onClickCard}
        showLabelName={showLabelName}
        onToggleLabel={onToggleLabel}
        onToggleIsCompleted={onToggleIsCompleted}
      />

      {cardRect && (
        <CardContextMenu
          card={card}
          cardRect={cardRect}
          onClose={() => setCardRect(null)}
          onOpenCard={() => onClickCard()}
          onArchive={() => onToggleArchive(card.id, true)}
          onSaveTitle={(newTitle) => {
            // exp: updateCardTitle(card.id, newTitle)
          }}
        />
      )}

    </div>
  );
}
"use client";

import { createPortal } from "react-dom";
import {
    ExternalLink, Tag, Users, Image, Clock,
    ArrowRight, Copy, Link2, Layers, Archive
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components";
import { useRouter } from "next/navigation";
import { CardData } from "@/shared/types";

interface CardContextMenuProps {
    card: CardData;
    cardRect: DOMRect;
    onClose: () => void;
    onOpenCard: () => void;
    onArchive: () => void;
    onSaveTitle: (newTitle: string) => void;
}

const MENU_ITEMS = [
    { icon: ExternalLink, label: "Open card", action: "open" },
    { icon: Tag, label: "Edit labels", action: "labels" },
    { icon: Users, label: "Change members", action: "members" },
    { icon: Image, label: "Change cover", action: "cover" },
    { icon: Clock, label: "Edit dates", action: "dates" },
    { icon: ArrowRight, label: "Move", action: "move" },
    { icon: Copy, label: "Copy card", action: "copy" },
    { icon: Link2, label: "Copy link", action: "link" },
    { icon: Layers, label: "Mirror", action: "mirror" },
    { icon: Archive, label: "Archive", action: "archive" },
];

export function CardContextMenu({
    card,
    cardRect,
    onClose,
    onOpenCard,
    onArchive,
    onSaveTitle,
}: CardContextMenuProps) {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState(card.title);

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    function handleSave() {
        // if (title.trim()) onSaveTitle(title.trim());
        // onClose();
    }

    function handleAction(action: string) {
        if (action === "open") onOpenCard();
        if (action === "archive") onArchive();
        onClose();
    }

    const MENU_WIDTH = 192;
    const CARD_MENU_GAP = 8;

    const cardTop = cardRect.top;
    const menuLeft = cardRect.right + CARD_MENU_GAP;

    const adjustedLeft =
        menuLeft + MENU_WIDTH > window.innerWidth
            ? cardRect.left - MENU_WIDTH - CARD_MENU_GAP
            : menuLeft;

    return createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/60 z-9998"
                onClick={onClose}
            />

            <div
                style={{
                    position: "fixed",
                    top: cardRect.top,
                    left: cardRect.left,
                    width: cardRect.width,
                    zIndex: 9999,
                }}
            >

                <div
                    className="p-2 pb-2 rounded"
                    style={{
                        background: card
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
                                    className="min-h-1 min-w-9 text-xs px-1.5 py-0.5 text-white rounded-sm hover:scale-105 border border-gray-700 hover:ring-1"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name ? label.name : null}
                                </span>
                            ))}
                        </div>
                    )}
                </div>


                <div className="bg-[#22272b] rounded-lg shadow-xl overflow-hidden">
                    <textarea
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSave();
                            }
                            if (e.key === "Escape") onClose();
                        }}
                        className="w-full bg-[#22272b] text-[#b6c2cf] text-sm resize-none outline-none px-2 pt-2 pb-2 min-h-15 block"
                        rows={3}
                    />
                </div>

                <div className="pt-1 pl-1">
                    <Button
                        variant={"custom"}
                        size={"lg"}
                        onClick={handleSave}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>

            <div
                ref={menuRef}
                style={{
                    position: "fixed",
                    top: cardTop,
                    left: adjustedLeft,
                    width: MENU_WIDTH,
                    zIndex: 9999,
                }}
                className="gap-1 py-1.5 space-y-1"
            >
                {MENU_ITEMS.map((item, i) => {
                    const Icon = item.icon!;
                    return (
                        <button
                            key={i}
                            onClick={() => handleAction(item.action!)}
                            className="flex items-center gap-2.5 px-3 py-1 text-[#b6c2cf] text-sm hover:bg-[#3d4954] transition-colors text-left bg-[#282e33] rounded"
                        >
                            <Icon size={14} className="shrink-0" />
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </>,
        document.body
    );
}
"use client";

import { Clock, AlignJustify, MoreHorizontal, Check, X, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/shared/components";
import { getInitials } from "@/shared/utils/getInitials";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";
import { slugify } from "@/shared/utils/slugify";
import { CardData, CardTimeline } from "@/shared/types";

function CardBg({ board }: { board: CardData["column"]["board"] }) {
    return (
        <div
            className="p-4"
            style={{
                background: board.isPhoto && board.bg
                    ? `url(${board.bg}) center/cover no-repeat`
                    : board.bg || "linear-gradient(135deg, #2c3e50 0%, #1a2533 100%)",
            }}
        >
            <div className="bg-[#2B2C2F] py-3 px-3 rounded-md">
                <div className="w-12 h-3 rounded-full mb-3 bg-[#22c55e]" />
                <div className="flex gap-1 text-white text-sm font-medium mb-3">

                    <div className="checkbox-round">
                        <input type="checkbox" checked readOnly />
                    </div>
                    <div className="line-clamp-2">{board.title}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: "#2d2000", color: "#f59e0b", border: "1px solid #92400e" }}
                    >
                        <Clock size={11} />
                        Срок
                    </span>
                    <AlignJustify size={14} className="text-gray-500" />
                </div>
            </div>
        </div>
    );
}

function CardFooterBreadcrumb({
    board,
    column,
}: {
    board: CardData["column"]["board"];
    column: { title: string };
}) {
    const workspaceName = board.workspace?.name || "Cardify";
    return (
        <div className="px-4 py-2 text-xs" style={{ backgroundColor: "#252629", color: "#6c9bd1" }}>
            <span>Рабочее пространство {workspaceName}</span>
            <span className="text-gray-500 mx-1">|</span>
            <span style={{ color: "#6c9bd1", fontWeight: 600 }}>
                {board.title}: {column.title}
            </span>
        </div>
    );
}

// ─── ATTENTION card ──────────────────────────────────────────────────────────

interface AttentionTaskCardProps {
    card: CardData;
    onComplete: () => void;
    onDismiss: () => void;
}

export function AttentionTaskCard({ card, onComplete, onDismiss }: AttentionTaskCardProps) {
    const { column } = card;
    const { board } = column;
    const members = card.members ?? [];
    const hasMembers = members.length > 0;

    const firstMember = members[0]?.user;
    const displayName = firstMember?.name || "User";
    const initials = getInitials(displayName);

    const openCardPath = PAGES.CARD(
        card.id,
        slugify(card.title || "")
    );

    return (
        <div
            className="rounded-lg overflow-hidden mb-4"
            style={{ backgroundColor: "#2c2e33", border: "1px solid #3d4148" }}
        >
            <Link
                href={{
                    pathname: PAGES.BOARD(board.id, slugify(board.title)),
                    query: { openCardPath },
                }}
            >
                <CardBg board={board} />
            </Link>

            <CardFooterBreadcrumb board={board} column={column} />

            <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: "#2c2e33", borderTop: "1px solid #3d4148" }}
            >
                <div className="flex items-center gap-2 flex-wrap">
                    {hasMembers && (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    )}
                </div>
                <button className="text-gray-500 hover:text-gray-300 ml-2">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="flex gap-3 px-4 pb-4" style={{ backgroundColor: "#2c2e33" }}>
                <button
                    onClick={onComplete}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                >
                    <Check size={14} /> Выполнить
                </button>
                <button
                    onClick={onDismiss}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                >
                    <X size={14} /> Отклонить
                </button>
            </div>
        </div>
    );
}

// ─── HIGHLIGHT card ──────────────────────────────────────────────────────────

interface HighlightTaskCardProps {
    card: CardData;
    onComment: (cardId: string, comment: string) => Promise<CardTimeline>;
}

export function HighlightTaskCard({ card, onComment }: HighlightTaskCardProps) {
    const { column } = card;
    const { board } = column;

    const members = card.members ?? [];
    const firstMember = members[0]?.user;
    const displayName = firstMember?.name || "User";
    const initials = getInitials(displayName);

    const [showReply, setShowReply] = useState(false);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<CardTimeline[]>(card.comments ?? []);

    const handleSave = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        try {
            const created = await onComment(card.id, comment.trim());
            setComments((prev) => [...prev, created]);
            setComment("");
            setShowReply(false);
        } finally {
            setLoading(false);
        }
    };

    const openCardPath = PAGES.CARD(
        card.id,
        slugify(card.title || "")
    );

    return (
        <div
            className="rounded-lg overflow-hidden mb-4"
            style={{ backgroundColor: "#2c2e33", border: "1px solid #3d4148" }}
        >
            <Link
                href={{
                    pathname: PAGES.BOARD(board.id, slugify(board.title)),
                    query: { openCardPath },
                }}
            >
                <CardBg board={board} />
            </Link>

            <CardFooterBreadcrumb board={board} column={column} />

            <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: "#2c2e33", borderTop: "1px solid #3d4148" }}
            >
                <div className="flex gap-3 items-center">
                    {firstMember?.image ? (
                        <Image
                            src={firstMember.image}
                            alt={displayName}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-gray-300 text-sm">{displayName}</span>
                        <span className="text-gray-500 text-xs">выполнено</span>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-300">
                    <MoreHorizontal size={16} />
                </button>
            </div>


            {comments.length > 0 && (
                <div className="px-4 pb-2 flex flex-col gap-2" style={{ backgroundColor: "#2c2e33" }}>
                    {comments.map((c, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5">
                                {initials}
                            </div>
                            <div
                                className="flex-1 rounded-md px-3 py-2 text-sm text-gray-300 items-center"
                            >
                                {c.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="px-4 pb-4 flex flex-col gap-2" style={{ backgroundColor: "#2c2e33" }}>
                {!showReply ? (
                    <button
                        onClick={() => setShowReply(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded text-sm text-gray-300 transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                    >
                        <Send size={14} />
                        Повторить
                    </button>
                ) : (
                    <div
                        className="rounded-lg overflow-hidden"
                        style={{ border: "1px solid #3d4148" }}
                    >
                        <div
                            className="flex items-center gap-1 px-3 py-2 border-b"
                            style={{ backgroundColor: "#252629", borderColor: "#3d4148" }}
                        >
                            <button className="text-gray-400 hover:text-gray-200 px-1 py-0.5 rounded text-xs flex items-center gap-0.5">
                                Tt <span className="text-[10px]">∨</span>
                            </button>
                            <div className="w-px h-4 bg-[#3d4148] mx-1" />
                            <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded font-bold text-sm">B</button>
                            <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded italic text-sm">I</button>
                            <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs">···</button>
                            <div className="w-px h-4 bg-[#3d4148] mx-1" />
                            <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs">☰</button>
                            <div className="ml-auto flex items-center gap-1">
                                <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                                </button>
                            </div>
                        </div>

                        <textarea
                            autoFocus
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a reply..."
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm text-gray-300 resize-none outline-none placeholder-gray-600"
                            style={{ backgroundColor: "#2c2e33" }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
                                if (e.key === "Escape") setShowReply(false);
                            }}
                        />

                        <div
                            className="flex items-center gap-2 px-3 py-2"
                            style={{ backgroundColor: "#252629", borderTop: "1px solid #3d4148" }}
                        >
                            <Button
                                variant={"custom"}
                                onClick={handleSave}
                                disabled={!comment.trim() || loading}
                            >
                                {loading ? "Сохранение..." : "Сохранить"}
                            </Button>
                            <button
                                onClick={() => { setShowReply(false); setComment(""); }}
                                className="px-3 py-1 rounded text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
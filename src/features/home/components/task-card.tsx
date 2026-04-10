"use client";

import { MoreHorizontal, Check, X, Send, Clock } from "lucide-react";
import Image from "next/image";
import { getInitials } from "@utils/getInitials";
import Link from "next/link";
import { PAGES } from "@config/pages.config";
import { slugify } from "@utils/slugify";
import { CardData, CardTimeline } from "@shared/types";
import { useCommentState } from "../hooks/use-comment-state";
import { CardBg } from "./card";
import { CommentList } from "./comment-list";
import { ReplyEditor } from "./reply-editor";
import { formatCardDate } from "@utils/date";

function CardFooterBreadcrumb({ board, column }: { board: CardData["column"]["board"]; column: { title: string } }) {
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

function CardWrapper({ card, children }: { card: CardData; children: React.ReactNode }) {
    const { board } = card.column;
    const openCardPath = PAGES.CARD(card.id, slugify(card.title || ""));
    return (
        <div className="rounded-lg overflow-hidden mb-4" style={{ backgroundColor: "#2c2e33", border: "1px solid #3d4148" }}>
            <Link href={{ pathname: PAGES.BOARD(board.id, slugify(board.title)), query: { openCardPath } }}>
                <CardBg card={card} board={board} />
            </Link>
            <CardFooterBreadcrumb board={board} column={card.column} />
            {children}
        </div>
    );
}

// ─── ATTENTION card ───────────────────────────────────────────────────────────

interface AttentionTaskCardProps {
    card: CardData;
    onComplete: () => void;
    onDismiss: () => void;
    onComment: (cardId: string, comment: string) => Promise<CardTimeline>;
}

export function AttentionTaskCard({ card, onComplete, onDismiss, onComment }: AttentionTaskCardProps) {
    const members = card.members ?? [];
    const firstMember = members[0]?.user;
    const initials = getInitials(firstMember?.name || "User");

    const { showReply, setShowReply, comment, setComment, loading, comments, handleSave } =
        useCommentState(card.comments ?? [], card.id, onComment, onComplete);

    return (
        <CardWrapper card={card}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#2c2e33", borderTop: "1px solid #3d4148" }}>
                <div className="flex items-center gap-2 flex-wrap">
                    {members.length > 0 && (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    )}
                    {card.dueDate && (
                        <span className="flex items-center gap-1.5 rounded text-sm text-white font-bold">
                            <Clock size={16}/>
                            Срок {formatCardDate(card.dueDate)}
                        </span>
                    )}
                </div>
                <button className="text-gray-500 hover:text-gray-300 ml-2">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <CommentList comments={comments} />

            <div className="flex gap-3 px-4 pb-4 bg-[#2c2e33]">
                {card.dueDate ? (
                    <button
                        onClick={onComplete}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                    >
                        <Check size={14} /> Выполнить
                    </button>
                ) : !showReply ? (
                    <button
                        onClick={() => setShowReply(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                    >
                        <Send size={14} /> Ответить
                    </button>
                ) : (
                    <div className="w-full">
                        <ReplyEditor
                            comment={comment}
                            loading={loading}
                            onChange={setComment}
                            onSave={handleSave}
                            onCancel={() => { setShowReply(false); setComment(""); }}
                        />
                    </div>
                )}
                {!showReply && (
                    <button
                        onClick={onDismiss}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                    >
                        <X size={14} /> Отклонить
                    </button>
                )}
            </div>
        </CardWrapper>
    );
}

// ─── HIGHLIGHT card ───────────────────────────────────────────────────────────

interface HighlightTaskCardProps {
    card: CardData;
    onComment: (cardId: string, comment: string) => Promise<CardTimeline>;
}

export function HighlightTaskCard({ card, onComment }: HighlightTaskCardProps) {
    const members = card.members ?? [];
    const firstMember = members[0]?.user;
    const displayName = firstMember?.name || "User";
    const initials = getInitials(displayName);

    const { showReply, setShowReply, comment, setComment, loading, comments, handleSave } =
        useCommentState(card.comments ?? [], card.id, onComment);

    return (
        <CardWrapper card={card}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#2c2e33", borderTop: "1px solid #3d4148" }}>
                <div className="flex gap-3 items-center">
                    {firstMember?.image ? (
                        <Image src={firstMember.image} alt={displayName} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
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

            <CommentList comments={comments} />

            <div className="px-4 pb-4 flex flex-col gap-2" style={{ backgroundColor: "#2c2e33" }}>
                {!showReply ? (
                    <button
                        onClick={() => setShowReply(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded text-sm text-gray-300 transition-colors bg-[#3d4148] border border-[#4a5058] hover:bg-[#4a5058]"
                    >
                        <Send size={14} /> Ответить
                    </button>
                ) : (
                    <ReplyEditor
                        comment={comment}
                        loading={loading}
                        onChange={setComment}
                        onSave={handleSave}
                        onCancel={() => { setShowReply(false); setComment(""); }}
                    />
                )}
            </div>
        </CardWrapper>
    );
}
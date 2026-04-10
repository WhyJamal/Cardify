import { formatDueDate } from "@utils/date";
import { getInitials } from "@shared/utils/getInitials";
import { CardData } from "@shared/types";
import { AlignLeft, Archive, Clock, MessageSquare, Paperclip } from "lucide-react";

function CardBg({ card, board }: { card: CardData; board: CardData["column"]["board"] }) {
    return (
        <div
            className="p-2"
            style={{
                background: board.isPhoto && board.bg
                    ? `url(${board.bg}) center/cover no-repeat`
                    : board.bg || "linear-gradient(135deg, #2c3e50 0%, #1a2533 100%)",
            }}
        >
            <div
                className="bg-[#2B2C2F] py-3 px-3 rounded-md"
                style={{
                    background: card
                        ? card.isImage
                            ? `url(${card.background}) center/cover no-repeat`
                            : card.background ?? undefined
                        : "#2B2C2F",
                }}
            >
                {card.labels && card.labels.length > 0 && (
                    <div className="flex w-full gap-2">
                        {card.labels.map((label) => (
                            <div
                                key={label.id}
                                className="flex w-12 h-4 rounded mb-3 items-center justify-center text-xs text-white"
                                style={{ background: label.color || "#000000" }}
                            >
                                {label.name}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2 text-white text-sm font-medium">
                    {card.isCompleted && (
                        <div className="checkbox-round mt-0.5">
                            <input type="checkbox" id={`checkbox-${card.id}`} checked={card.isCompleted} readOnly className="peer cursor-pointer" />
                            <label htmlFor={`checkbox-${card.id}`} />
                        </div>
                    )}
                    <div className="line-clamp-2" style={{ color: card.textColor === "dark" ? "#000000" : "#fff" }}>
                        {card.title}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className={`flex gap-2 px-2 rounded-md ${card.isImage ? "bg-black/50 text-white" : "text-[#9fadbc]"}`}>
                        {card.dueDate && (
                            <span className="flex items-center gap-1.5 rounded text-xs">
                                <Clock size={11} />
                                {formatDueDate(card.dueDate)}
                            </span>
                        )}
                        {card.description && (
                            <span className="flex items-center gap-1 text-xs"><AlignLeft size={12} /></span>
                        )}
                        {card.attachments && card.attachments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs">
                                <Paperclip size={12} />{card.attachments.length + (card.links?.length ?? 0)}
                            </span>
                        )}
                        {card.comments && card.comments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs">
                                <MessageSquare size={12} />{card.comments.length}
                            </span>
                        )}
                        {card.isArchive && (
                            <span className="flex items-center gap-1 text-xs">
                                <Archive size={12} />Архивировано
                            </span>
                        )}
                    </div>
                    <div className="flex -space-x-1.5">
                        {card.members?.map((member) => (
                            <div
                                key={member.user.id}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-green-700 text-xs font-bold text-white"
                            >
                                {getInitials(member.user.name || "")}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CardBg };
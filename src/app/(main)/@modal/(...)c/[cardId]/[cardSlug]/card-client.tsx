"use client";

import {
    X,
    Eye,
    MoreHorizontal,
    Image,
    Plus,
    Paperclip,
    AlignLeft,
    MessageSquare,
    Smile,
    ChevronDown,
} from "lucide-react";

import type { CardData } from "@/shared/types";
import { Button, DatePicker, AddToCardMenu, LabelsMenu } from "@/shared/components";
import { TooltipAction } from "@/shared/components/custom-tooltip";
import { formatCardDate } from "@/shared/utils/date";
import { useCardClient } from "@/features/card/hooks/use-card-client";

interface Comment {
    id: number;
    author: string;
    initials: string;
    text: string;
    date: string;
    isActivity?: boolean;
    activityText?: string;
}

export default function CardClient({
    cardId,
    initialCard,
}: {
    cardId: string;
    initialCard: CardData;
}) {
    const {
        card,
        isEditingTitle,
        setIsEditingTitle,
        tempTitle,
        setTempTitle,
        titleInputRef,
        handleSaveTitle,
        handleCancelTitle,

        isEditingDesc,
        setIsEditingDesc,
        tempDesc,
        setTempDesc,
        handleSaveDesc,

        comment,
        setComment,
        handleSendComment,
        timeline,

        addBtnRef,
        showMenu,
        addMenu,
        showDatePicker,
        handleOpenDates,
        handleCloseDatePicker,
        showLabels,
        handleOpenLabels,
        handleCloseLabels,

        handleToggleCompleted,
        handleUpdateLabels,
        handleUpdateDueDate,

        status,
        router,
    } = useCardClient(initialCard, cardId);

    const comments: Comment[] = [
        {
            id: 1,
            author: "M. Jamal",
            initials: "JM",
            text: "comment 1",
            date: "16 июн. 2025 г., 14:06",
        },
        {
            id: 2,
            author: "M. Jamal",
            initials: "JM",
            text: "",
            date: "30 мая 2025 г., 10:09",
            isActivity: true,
            activityText: "добавил(а) эту карточку в список 2",
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 grid items-start justify-center z-50 p-4">
            <div className="bg-[#1d2125] top-10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2 text-[#9fadbc] text-sm">
                        <span className="bg-[#2c333a] rounded px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-[#38414a]">
                            {card.column.title} <ChevronDown size={13} />
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#9fadbc]">
                        <Button
                            variant="ghost"
                            className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                        >
                            <Image size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                        >
                            <Eye size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                        >
                            <MoreHorizontal size={18} />
                        </Button>

                        <TooltipAction tooltip="Закрыть" shortcut="Esc" side="bottom">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                            >
                                <X size={18} />
                            </Button>
                        </TooltipAction>
                    </div>
                </div>

                <div className="flex overflow-y-auto h-full">
                    <div className="flex-1 px-6 pb-6 pt-2 min-w-0">
                        <div className="flex items-start gap-3 mb-5">
                            <div className="round-sm top-1.5">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${card.id}`}
                                    checked={card.isCompleted}
                                    onChange={(e) => handleToggleCompleted(e.target.checked)}
                                />
                                <label
                                    htmlFor={`checkbox-${card.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            {isEditingTitle ? (
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={handleSaveTitle}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveTitle();
                                        if (e.key === "Escape") handleCancelTitle();
                                    }}
                                    className="text-white text-xl font-semibold leading-snug bg-[#22272b] px-2 py-1 rounded outline-none"
                                    autoFocus
                                />
                            ) : (
                                <h2
                                    className="text-white text-xl font-semibold leading-snug cursor-text"
                                    onClick={() => {
                                        setTempTitle(card.title);
                                        setIsEditingTitle(true);
                                    }}
                                >
                                    {card.title}
                                </h2>
                            )}
                        </div>

                        <div className="flex gap-2 mb-6 flex-wrap">
                            <button
                                ref={addBtnRef}
                                onClick={addMenu}
                                className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                            >
                                <Plus size={14} />
                                Добавить
                            </button>

                            <button className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors">
                                <Paperclip size={14} />
                                Вложение
                            </button>

                            {showMenu && (
                                <AddToCardMenu
                                    triggerRef={addBtnRef}
                                    onClose={() => addMenu()}
                                    onOpenDates={handleOpenDates}
                                    onOpenLabels={handleOpenLabels}
                                />
                            )}

                            {showDatePicker && (
                                <DatePicker
                                    triggerRef={addBtnRef}
                                    cardId={card.id}
                                    cardDueDate={card.dueDate}
                                    onClose={handleCloseDatePicker}
                                    onChange={handleUpdateDueDate}
                                />
                            )}

                            {showLabels && (
                                <LabelsMenu
                                    triggerRef={addBtnRef}
                                    boardLabels={card.boardLabels ?? []}
                                    selectedLabels={card.labels ?? []}
                                    onChange={handleUpdateLabels}
                                    onClose={handleCloseLabels}
                                />
                            )}
                        </div>

                        <div className="flex gap-6 mb-6 flex-wrap">
                            <div>
                                <p className="text-[#9fadbc] text-xs mb-2">Участники</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold">
                                        SG
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#2c333a] hover:bg-[#38414a] flex items-center justify-center text-[#9fadbc] hover:text-white transition-colors">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {card.labels && card.labels.length > 0 && (
                                <div>
                                    <p className="text-[#9fadbc] text-xs mb-2">Метки</p>
                                    <div
                                        onClick={handleOpenLabels}
                                        className="flex flex-wrap gap-1 max-h-24 px-1 py-1"
                                    >
                                        {card.labels.map((label) => (
                                            <div
                                                key={label.id}
                                                className="flex px-1 py-1 rounded justify-center items-center shrink-0 min-w-14 min-h-8"
                                                style={{ background: label.color }}
                                            >
                                                <span className="text-xs font-bold text-white">
                                                    {label.name}
                                                </span>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleOpenLabels}
                                            className="w-8 h-8 rounded bg-[#2c333a] flex items-center justify-center text-[#9fadbc] hover:text-white hover:bg-[#38414a] shrink-0"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {card.dueDate && (
                                <div>
                                    <p className="text-[#9fadbc] text-xs mb-2">Срок</p>
                                    <div
                                        onClick={() => handleOpenDates()}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] text-sm px-3 py-1.5 rounded transition-colors">
                                            {formatCardDate(card.dueDate)}
                                            <span
                                                className={`${status.color} text-white text-[11px] px-2 rounded flex items-center gap-1`}
                                            >
                                                {status.label}
                                            </span>
                                            <ChevronDown size={11} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-white">
                                    <AlignLeft size={16} className="text-[#9fadbc]" />
                                    <span className="text-sm font-medium">Описание</span>
                                </div>
                                {!isEditingDesc && (
                                    <button
                                        onClick={() => {
                                            setTempDesc(card.description ?? "");
                                            setIsEditingDesc(true);
                                        }}
                                        className="bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                                    >
                                        Изменить
                                    </button>
                                )}
                            </div>

                            {isEditingDesc ? (
                                <div className="ml-6">
                                    <textarea
                                        className="w-full bg-[#22272b] text-[#b6c2cf] text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                                        value={tempDesc ?? ""}
                                        onChange={(e) => setTempDesc(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={handleSaveDesc}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition-colors"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={() => setIsEditingDesc(false)}
                                            className="bg-transparent hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="ml-6 text-[#b6c2cf] text-sm">
                                    {card.description || "Описание отсутствует"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-112.5 shrink-0 border-l border-[#2c333a] px-5 pb-6 pt-2 bg-[#0f1313]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-white text-sm font-medium">
                                <MessageSquare size={15} className="text-[#9fadbc]" />
                                Комментарии и события
                            </div>
                            <button className="bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                                Показать подробности
                            </button>
                        </div>

                        <div className="mb-3">
                            <input
                                placeholder="Напишите комментарий..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendComment();
                                    }
                                }}
                                className="w-full bg-[#22272b] text-[#b6c2cf] placeholder-[#596773] text-sm px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {/* <div className="flex justify-start mt-2">
                                <Button
                                    onClick={handleSendComment}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-black text-sm px-3 py-2 rounded-sm transition-colors"
                                >
                                    Сохранить
                                </Button>
                            </div> */}
                        </div>

                        <div className="space-y-4">
                            {comments.map((c) => (
                                <div key={c.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold shrink-0">
                                        {c.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {c.isActivity ? (
                                            <p className="text-[#b6c2cf] text-sm leading-snug">
                                                <span className="text-white font-medium">
                                                    {c.author}
                                                </span>{" "}
                                                {c.activityText}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-white text-sm font-medium mb-0.5">
                                                    {c.author}
                                                </p>
                                                <div className="bg-[#22272b] text-[#b6c2cf] text-sm px-3 py-2 rounded-lg mb-1">
                                                    {c.text}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-[#9fadbc]">
                                                    <Smile size={12} />
                                                    <span>•</span>
                                                    <button className="hover:text-white hover:underline transition-colors">
                                                        Изменить
                                                    </button>
                                                    <span>•</span>
                                                    <button className="hover:text-white hover:underline transition-colors">
                                                        Удалить
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        <p className="text-[#9fadbc] text-xs mt-0.5 underline decoration-dotted cursor-pointer hover:text-white">
                                            {c.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {timeline.length > 0 && (
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-[#9fadbc] text-xs mb-3">Timeline</p>
                                <div className="space-y-3">
                                    {timeline.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="text-sm text-[#b6c2cf] bg-[#22272b] rounded-lg px-3 py-2"
                                        >
                                            {item.text || item.message || "Событие"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
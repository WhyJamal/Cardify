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
    Dot,
} from "lucide-react";

import type { CardData } from "@/shared/types";
import { Button, DatePicker, AddToCardMenu, LabelsMenu } from "@/shared/components";
import { TooltipAction } from "@/shared/components/custom-tooltip";
import { formatCardDate } from "@/shared/utils/date";
import { useCardClient } from "@/features/card/hooks/use-card-client";
import { InviteMemberMenu } from "@/features/card/invite-member-menu";
import { getInitials } from "@/shared/utils/getInitials";
import AddAttachments from "@/features/card/add-attachments";
import ListAttachments from "@/features/card/list-attachments";
import { CreateLabelMenu } from "@/features/card/create-label-menu";
import CoverSettings from "@/features/card/cover-settings";

export default function CardClient({
    cardId,
    initialCard,
}: {
    cardId: string;
    initialCard: CardData;
}) {
    const {
        card,
        setCard,
        isEditingTitle,
        setIsEditingTitle,
        tempTitle,
        setTempTitle,
        titleInputRef,
        handleSaveTitle,
        handleCancelTitle,

        coverBtnRef,
        showCover,
        setShowCover,
        handleSetBackground,
        handleRemoveBackground,
        handleUploadCover,

        isEditingDesc,
        setIsEditingDesc,
        tempDesc,
        setTempDesc,
        handleSaveDesc,

        showInvite,
        board,

        attachBtnRef,
        showAttach,
        addAttachments,
        handleCloseAttach,

        isAddComment,
        setIsAddComment,
        comment,
        setComment,
        handleSendComment,
        timeline,
        comments,
        handleDeleteComment,
        handleChangeComment,
        editingCommentId,
        setEditingCommentId,
        changeComment,
        setChangeComment,

        inviteDivRef,
        dateBtnRef,
        labelDivRef,

        addBtnRef,
        showMenu,
        addMenu,
        showDatePicker,
        handleOpenDates,
        handleCloseDatePicker,
        showLabels,
        showCreateLabel,
        setShowCreateLabel,
        handleOpenLabels,
        handleCloseLabels,

        handleToggleCompleted,
        handleUpdateLabels,
        handleUpdateDueDate,
        handleOpenInvites,

        handleAddMember,
        handleRemoveMember,
        handleCloseInvites,

        status,
        router,
    } = useCardClient(initialCard, cardId);

    return (
        <div className="fixed inset-0 bg-black/60 grid items-start justify-center z-50 p-4">
            <div className="bg-[#1d2125] top-10 rounded-2xl min-w-5xl max-w-5xl max-h-[60vh] overflow-hidden shadow-2xl relative">
                <div
                    className={`flex flex-col items-start justify-between px-5 pt-4 pb-2 border-b border-white/10 group ${card.background ?
                        "min-h-30"
                        : ""

                        }`}
                    style={{
                        background: card
                            ? card.isImage
                                ? `url(${card.background}) center/cover no-repeat`
                                : card.background ?? undefined
                            : "#000000"
                    }}
                >
                    <div className="flex justify-between w-full">
                        <div className="flex items-center gap-2 text-[#9fadbc] text-sm">
                            <span className="bg-[#2c333a] rounded px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-[#38414a]">
                                {card.column.title} <ChevronDown size={13} />
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-[#9fadbc]">
                            <Button
                                ref={coverBtnRef}
                                variant="ghost"
                                onClick={() => setShowCover(true)}
                                className="bg-[#2c333a] hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                            >
                                <Image size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                className="bg-[#2c333a] hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                            >
                                <Eye size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                className="bg-[#2c333a] hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                            >
                                <MoreHorizontal size={18} />
                            </Button>

                            <TooltipAction tooltip="Закрыть" shortcut="Esc" side="bottom">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="bg-[#2c333a] hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                                >
                                    <X size={18} />
                                </Button>
                            </TooltipAction>
                        </div>
                    </div>
                    {card.background && (
                        <div className="flex w-full justify-end opacity-0 group-hover:opacity-100">
                            <Button
                                variant={"ghost"}
                                onClick={handleRemoveBackground}
                                className="bg-[#2c333a] text-white/80 hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
                            >
                                Удалить обложку
                            </Button>
                        </div>
                    )}
                </div>

                {showCover && (
                    <CoverSettings
                        triggerRef={coverBtnRef}
                        onClose={() => setShowCover(false)}
                        currentBackground={card.background}
                        onSetBackground={handleSetBackground}
                        onRemoveBackground={handleRemoveBackground}
                        onUploadCover={handleUploadCover}
                        card={card}
                    />
                )}

                <div className="flex h-full min-h-0">
                    <div className="flex-1 min-h-0 max-h-100 px-6 pb-6 pt-2 min-w-0 overflow-y-auto">
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

                            <button
                                ref={attachBtnRef}
                                onClick={addAttachments}
                                className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                            >
                                <Paperclip size={14} />
                                Вложение
                            </button>

                            {showAttach && (
                                <AddAttachments
                                    triggerRef={attachBtnRef}
                                    onClose={handleCloseAttach}
                                    cardId={cardId}
                                />
                            )}

                            {showMenu && (
                                <AddToCardMenu
                                    triggerRef={addBtnRef}
                                    onClose={() => addMenu()}
                                    onOpenDates={handleOpenDates}
                                    onOpenLabels={handleOpenLabels}
                                    onOpenInvites={handleOpenInvites}
                                />
                            )}

                            {showDatePicker && (
                                <DatePicker
                                    triggerRef={card.dueDate ? dateBtnRef : addBtnRef}
                                    cardId={card.id}
                                    cardDueDate={card.dueDate ?? undefined}
                                    onClose={handleCloseDatePicker}
                                    onChange={handleUpdateDueDate}
                                />
                            )}

                            {showLabels && (
                                <LabelsMenu
                                    triggerRef={card.labels && card.labels.length > 0 ? labelDivRef : addBtnRef}
                                    boardLabels={card.boardLabels ?? []}
                                    selectedLabels={card.labels ?? []}
                                    onChange={handleUpdateLabels}
                                    onClose={handleCloseLabels}
                                    onCreate={() => {
                                        setShowCreateLabel(true);
                                        handleCloseLabels();
                                    }}
                                />
                            )}

                            {showCreateLabel && (
                                <CreateLabelMenu
                                    triggerRef={card.labels && card.labels.length > 0 ? labelDivRef : addBtnRef}
                                    onChange={(newLabel) => {
                                        setCard((prev) =>
                                            prev
                                                ? {
                                                    ...prev,
                                                    boardLabels: prev.boardLabels
                                                        ? [...prev.boardLabels, newLabel]
                                                        : [newLabel],
                                                }
                                                : prev
                                        );
                                    }}
                                    onClose={() => setShowCreateLabel(false)}
                                    onBack={() => {
                                        setShowCreateLabel(false);
                                        handleOpenLabels();
                                    }}
                                />
                            )}

                            {showInvite && (
                                <InviteMemberMenu
                                    triggerRef={card.members && card.members.length > 0 ? inviteDivRef : addBtnRef}
                                    workspaceId={board?.workspaceId ?? ""}
                                    currentMembers={card.members ?? []}
                                    onAdd={handleAddMember}
                                    onRemove={handleRemoveMember}
                                    onClose={handleCloseInvites}
                                />
                            )}
                        </div>


                        <div className="flex gap-6 mb-6 flex-wrap">
                            {card.members && card.members.length > 0 && (
                                <div>
                                    <p className="text-[#9fadbc] text-xs mb-2">Участники</p>
                                    <div
                                        ref={inviteDivRef}
                                        className="flex items-center gap-1"
                                    >
                                        <div className="flex -space-x-2">
                                            {card.members.map((member) => (
                                                <div
                                                    key={member.user.id}
                                                    className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold border border-green-600"
                                                >
                                                    {getInitials(member.user.name || "")}
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            onClick={handleOpenInvites}
                                            className="w-8 h-8 rounded-full bg-[#2c333a] hover:bg-[#38414a] flex items-center justify-center text-[#9fadbc] hover:text-white transition-colors"
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {card.labels && card.labels.length > 0 && (
                                <div>
                                    <p className="text-[#9fadbc] text-xs mb-2">Метки</p>
                                    <div
                                        ref={labelDivRef}
                                        onClick={handleOpenLabels}
                                        className="flex flex-wrap gap-1 max-h-24 px-1 py-1"
                                    >
                                        {card.labels.map((label) => (
                                            <div
                                                key={label.id}
                                                className="flex px-1 py-1 rounded justify-center items-center shrink-0 min-w-14 min-h-8 border border-gray-700"
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
                                        ref={dateBtnRef}
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

                            {card.attachments && card.attachments.length > 0 && (
                                <ListAttachments initialCard={initialCard} cardId={cardId} />
                            )}

                        </div>
                    </div>

                    <div
                        className="scrollbar-thin w-112.5 shrink-0 border-l border-[#2c333a] px-5 pb-6 pt-2 bg-[#0f1313] max-h-96 overflow-y-auto min-h-0"
                    >
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
                            {isAddComment ? (
                                <div className="ml-6">
                                    <textarea
                                        className="w-full bg-[#22272b] text-[#b6c2cf] text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                                        value={comment}
                                        placeholder="Напишите комментарий..."
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendComment();
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            size={"lg"}
                                            variant={"custom"}
                                            onClick={handleSendComment}
                                        >
                                            Сохранить
                                        </Button>
                                        <button
                                            onClick={() => setIsAddComment(false)}
                                            className="bg-transparent hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <input
                                    placeholder="Напишите комментарий..."
                                    onClick={() => { setIsAddComment(true) }}
                                    className="w-full bg-[#22272b] text-[#b6c2cf] placeholder-[#596773] text-sm px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            {comments.map((c) => (
                                <div key={c.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold shrink-0">
                                        {c.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {c.type === "ACTIVITY" ? (
                                            <p className="text-[#b6c2cf] text-sm leading-snug">
                                                <span className="text-white font-medium">
                                                    {c.authorName}
                                                </span>{" "}
                                                {c.activityText}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-white text-sm font-medium mb-0.5">
                                                    {c.authorName}
                                                </p>

                                                {editingCommentId === c.id ? (
                                                    <div className="ml-6">
                                                        <textarea
                                                            className="w-full bg-[#22272b] text-[#b6c2cf] text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                                                            value={changeComment}
                                                            onChange={(e) => setChangeComment(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleChangeComment(cardId, c.id);
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 mt-2">
                                                            <Button
                                                                size={"lg"}
                                                                variant={"custom"}
                                                                onClick={() => handleChangeComment(cardId, c.id)}
                                                            >
                                                                Сохранить
                                                            </Button>
                                                            <button
                                                                onClick={() => setEditingCommentId(null)}
                                                                className="bg-transparent hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                                                            >
                                                                Отмена
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#22272b] text-[#b6c2cf] text-sm px-3 py-2 rounded-lg mb-1">
                                                        {c.text}
                                                    </div>
                                                )}

                                                {editingCommentId !== c.id && (
                                                    <>
                                                        <div className="flex items-center text-xs text-[#9fadbc]">
                                                            <Smile size={12} />
                                                            <Dot />
                                                            <Button
                                                                variant={"link"}
                                                                onClick={() => {
                                                                    setEditingCommentId(c.id);
                                                                    setChangeComment(c.text ?? "");
                                                                }}
                                                                className="text-white/80 hover:text-white"
                                                            >
                                                                Изменить
                                                            </Button>
                                                            <Dot />
                                                            <Button
                                                                variant={"link"}
                                                                onClick={() => handleDeleteComment(cardId, c.id)}
                                                                className="text-white/80 hover:text-white"
                                                            >
                                                                Удалить
                                                            </Button>
                                                        </div>
                                                        <p className="text-[#9fadbc] text-xs mt-0.5 underline decoration-dotted cursor-pointer hover:text-white">
                                                            {new Date(c.createdAt).toLocaleString("ru-RU")}
                                                        </p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="mt-6 border-t border-white/10 pt-4">
                            <p className="text-[#9fadbc] text-xs mb-3">Действии</p>
                            <div className="space-y-3">
                                <div className="space-y-4">
                                    {timeline.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold shrink-0">
                                                {item.initials ?? "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {item.type === "ACTIVITY" ? (
                                                    <p className="text-[#b6c2cf] text-sm leading-snug">
                                                        <span className="text-white font-medium">{item.authorName}</span>{" "}
                                                        {item.activityText}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="text-white text-sm font-medium mb-0.5">
                                                            {item.authorName}
                                                        </p>
                                                        <div className="bg-[#22272b] text-[#b6c2cf] text-sm px-3 py-2 rounded-lg mb-1">
                                                            {item.text}
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
                                                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
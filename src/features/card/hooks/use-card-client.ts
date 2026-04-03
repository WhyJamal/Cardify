"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CardData, CardMember, CardTimeline, User } from "@/shared/types";
import { cardApi } from "@/features/card/api/card-api";
import { useCardActions } from "@/shared/hooks/use-card-actions";
import { useBoardView } from "@/app/providers/BoardProvider";
import { useEscapeKey } from "@/shared/hooks/use-escape-key";
import { getDueDateStatus } from "@/shared/utils/date";
import { boardApi } from "@/features/board/api/board-api";

export function useCardClient(initialCard: CardData, cardId: string) {
    const router = useRouter();
    const { changeTitleCard, toggleIsCompleted, updateLabels, handleChangeDueDate } = useCardActions();
    const { board, columns, setColumns } = useBoardView();

    const addBtnRef = useRef<HTMLButtonElement>(null);
    const coverBtnRef = useRef<HTMLButtonElement>(null);
    const attachBtnRef = useRef<HTMLButtonElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const inviteDivRef = useRef<HTMLDivElement>(null);
    const dateBtnRef = useRef<HTMLDivElement>(null);
    const labelDivRef = useRef<HTMLDivElement>(null);

    const [card, setCard] = useState<CardData>(initialCard);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(initialCard.title);

    const [showCover, setShowCover] = useState(false);

    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [tempDesc, setTempDesc] = useState(initialCard.description ?? "");

    const [isAddComment, setIsAddComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [changeComment, setChangeComment] = useState("");
    const [timeline, setTimeline] = useState<CardTimeline[]>([]);
    const [comments, setComments] = useState<CardTimeline[]>([]);

    const [showMenu, setShowMenu] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [showCreateLabel, setShowCreateLabel] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    const [showAttach, setShowAttach] = useState(false);

    useEscapeKey(() => router.back(), true);

    useEffect(() => {
        setCard(initialCard);
        setTempTitle(initialCard.title);
        setTempDesc(initialCard.description ?? "");
    }, [initialCard]);

    useEffect(() => {
        cardApi.getTimeline(cardId)
            .then((data: CardTimeline[]) => {
                setTimeline(data.filter((item) => item.type === "ACTIVITY"));
                setComments(data.filter((item) => item.type === "COMMENT"));
            })
            .catch(console.error);
    }, [cardId]);

    useEffect(() => {
        for (const col of columns) {
            const found = col.cards.find((c) => c.id === cardId);
            if (found) {
                setCard((prev) => ({
                    ...prev,
                    ...found,
                    description: prev?.description ?? found.description,
                }));
                return;
            }
        }
    }, [columns, cardId]);

    const status = getDueDateStatus(card.dueDate ? card.dueDate : undefined, card.isCompleted);

    const handleSaveTitle = useCallback(async () => {
        const title = tempTitle ? tempTitle.trim() : null;
        if (!title) return;

        const ok = await changeTitleCard(cardId, title);
        if (ok) {
            setIsEditingTitle(false);
        }
    }, [tempTitle, changeTitleCard, cardId]);

    const handleCancelTitle = useCallback(() => {
        setTempTitle(card.title);
        setIsEditingTitle(false);
    }, [card.title]);

    const handleSaveDesc = useCallback(async () => {
        try {
            const updated = await cardApi.updateDescription(cardId, tempDesc ?? "");
            setCard((prev) => (prev ? { ...prev, description: updated.description } : prev));
            setTempDesc(updated.description ?? "");
            setIsEditingDesc(false);
        } catch (err) {
            console.error("Ошибка при сохранении описания:", err);
        }
    }, [cardId, tempDesc]);

    const handleToggleCompleted = useCallback(
        async (newValue: boolean) => {
            setCard((prev) => (prev ? { ...prev, isCompleted: newValue } : prev));

            try {
                const ok = await toggleIsCompleted(cardId, newValue);
                if (!ok) {
                    setCard((prev) => (prev ? { ...prev, isCompleted: !newValue } : prev));
                }
            } catch (err) {
                console.error("Ошибка при обновлении статуса:", err);
                setCard((prev) => (prev ? { ...prev, isCompleted: !newValue } : prev));
            }
        },
        [toggleIsCompleted, cardId]
    );

    const handleSendComment = useCallback(async () => {
        const text = comment.trim();
        if (!text) return;

        try {
            const created = await cardApi.addTimelineComment(cardId, text);
            //setTimeline((prev) => [...prev, created]);
            setComments((prev) => [...prev, created]);
            setComment("");
            setIsAddComment(false);
        } catch (err) {
            console.error("Ошибка при отправке комментария:", err);
        }
    }, [comment, cardId]);

    const addMenu = useCallback(() => {
        setShowMenu((prev) => !prev);
        setShowDatePicker(false);
    }, []);

    const addAttachments = useCallback(() => {
        setShowAttach(true);
    }, []);

    const handleCloseAttach = useCallback(() => {
        setShowAttach(false);
    }, []);

    const handleOpenDates = useCallback(() => {
        setShowMenu(false);
        setShowDatePicker(true);
    }, []);

    const handleOpenInvites = useCallback(() => {
        setShowMenu(false);
        setShowInvite(true);
    }, []);

    const handleOpenLabels = useCallback(() => {
        setShowLabels(true);
        setShowMenu(false);
    }, []);

    const handleCloseDatePicker = useCallback(() => {
        setShowDatePicker(false);
    }, []);

    const handleCloseLabels = useCallback(() => {
        setShowLabels(false);
    }, []);

    const handleCloseInvites = useCallback(() => {
        setShowInvite(false);
    }, []);


    const handleUpdateLabels = useCallback(
        async (newLabels: CardData["labels"]) => {
            const safeLabels = newLabels ?? [];
            await updateLabels(cardId, safeLabels);
        },
        [updateLabels, cardId]
    );

    const handleUpdateDueDate = useCallback(
        async (newDueDate: string | null) => {
            await handleChangeDueDate(card.id, newDueDate);
        },
        [handleChangeDueDate, card.id]
    );

    const handleAddMember = useCallback(
        async (userId: string, user: User) => {
            try {
                await boardApi.addMember(board!.id, userId);

                const result = await cardApi.addMember(cardId, userId);
                const newMember: CardMember = {
                    id: result.cardMember.id,
                    user,
                };
                setColumns((prev) =>
                    prev.map((col) => ({
                        ...col,
                        cards: col.cards.map((c) =>
                            c.id === cardId
                                ? { ...c, members: [...(c.members ?? []), newMember] }
                                : c
                        ),
                    }))
                );
            } catch { }
        },
        [cardId, setColumns, board]
    );

    const handleRemoveMember = useCallback(
        async (userId: string) => {
            try {
                await cardApi.removeMember(cardId, userId);
                setColumns((prev) =>
                    prev.map((col) => ({
                        ...col,
                        cards: col.cards.map((c) =>
                            c.id === cardId
                                ? { ...c, members: (c.members ?? []).filter((m) => m.user.id !== userId) }
                                : c
                        ),
                    }))
                );
            } catch { }
        },
        [cardId, setColumns]
    );

    const handleDeleteComment = async (cardId: string, commentId: string) => {
        cardApi.deleteComment(cardId, commentId);
        setComments(prev => prev.filter(f => f.id !== commentId));
    };

    const handleChangeComment = async (
        cardId: string,
        commentId: string
    ) => {
        await cardApi.changeComment(cardId, commentId, changeComment);

        setComments(prev =>
            prev.map(c =>
                c.id === commentId
                    ? { ...c, text: changeComment }
                    : c
            )
        );

        setEditingCommentId(null);
    };


    const handleSetBackground = useCallback(
        async (background: string, isImage = false, size: "WIDE" | "TALL" = "WIDE", textColor?: string) => {
            const finalTextColor = textColor ?? "light";
            try {
                await cardApi.updateBackground(card.id, background, isImage, size, finalTextColor);
                setCard((prev) => prev ? { ...prev, background, isImage, size, textColor } : prev);

                setColumns((prev) =>
                    prev.map((col) => ({
                        ...col,
                        cards: col.cards.map((c) =>
                            c.id === cardId ? { ...c, background, isImage, size, textColor } : c
                        ),
                    }))
                );
            } catch (err) {
                console.error("Ошибка обновления обложки:", err);
            }
        },
        [card.id, cardId, setColumns]
    );

    const handleRemoveBackground = useCallback(async () => {
        try {
            await cardApi.removeBackground(card.id);
            setCard((prev) => prev ? { ...prev, background: null, isImage: false } : prev);

            setColumns((prev) =>
                prev.map((col) => ({
                    ...col,
                    cards: col.cards.map((c) =>
                        c.id === cardId ? { ...c, background: null, isImage: false } : c
                    ),
                }))
            );
        } catch (err) {
            console.error("Ошибка удаления обложки:", err);
        }
    }, [card.id, cardId, setColumns]);

    const handleUploadCover = useCallback(
        async (file: File) => {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const result = await cardApi.uploadCover(card.id, formData);
                await handleSetBackground(result.url, true, card.size, card.textColor ?? "light");

                if (result.attachment) {
                    setCard((prev) => prev
                        ? { ...prev, attachments: [...(prev.attachments ?? []), result.attachment] }
                        : prev
                    );
                }
            } catch (err) {
                console.error("Ошибка загрузки изображения:", err);
            }
        },
        [card.id, handleSetBackground]
    );

    return {
        card,
        setCard,

        coverBtnRef,
        showCover,
        setShowCover,
        handleSetBackground,
        handleRemoveBackground,
        handleUploadCover,

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
        handleOpenLabels,
        showCreateLabel,
        setShowCreateLabel,
        handleCloseLabels,
        handleCloseInvites,

        handleToggleCompleted,
        handleUpdateLabels,
        handleUpdateDueDate,
        handleOpenInvites,
        handleAddMember,
        handleRemoveMember,

        status,
        router,
    };
}
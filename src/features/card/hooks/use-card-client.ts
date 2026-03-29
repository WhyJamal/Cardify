"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CardData, CardTimeline } from "@/shared/types";
import { cardApi } from "@/features/card/api/card-api";
import { useCardActions } from "@/shared/hooks/use-card-actions";
import { useBoardView } from "@/app/providers/BoardProvider"; 
import { useEscapeKey } from "@/shared/hooks/use-escape-key";
import { getDueDateStatus } from "@/shared/utils/date";

export function useCardClient(initialCard: CardData, cardId: string) {
    const router = useRouter();
    const { changeTitleCard, toggleIsCompleted, updateLabels, handleChangeDueDate } = useCardActions();
    const { columns } = useBoardView(); 

    const addBtnRef = useRef<HTMLButtonElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const [card, setCard] = useState<CardData>(initialCard);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(initialCard.title);

    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [tempDesc, setTempDesc] = useState(initialCard.description ?? "");

    const [comment, setComment] = useState("");
    const [timeline, setTimeline] = useState<CardTimeline[]>([]);

    const [showMenu, setShowMenu] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLabels, setShowLabels] = useState(false);

    useEscapeKey(() => router.back(), true);

    useEffect(() => {
        setCard(initialCard);
        setTempTitle(initialCard.title);
        setTempDesc(initialCard.description ?? "");
    }, [initialCard]);

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

    const status = getDueDateStatus(card.dueDate, card.isCompleted);

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
            setTimeline((prev) => [...prev, created]);
            setComment("");
        } catch (err) {
            console.error("Ошибка при отправке комментария:", err);
        }
    }, [comment, cardId]);

    const addMenu = useCallback(() => {
        setShowMenu((prev) => !prev);
        setShowDatePicker(false);
    }, []);

    const handleOpenDates = useCallback(() => {
        setShowMenu(false);
        setShowDatePicker(true);
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

    return {
        card,
        setCard,

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
    };
}
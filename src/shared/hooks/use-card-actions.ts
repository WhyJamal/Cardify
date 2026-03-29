"use client";

import { useCallback } from "react";
import { useBoardView } from "@/app/providers/BoardProvider";
import { cardApi } from "@/features/card/api/card-api";
import type { CardData, CardLabel } from "@/shared/types";

export function useCardActions() {
    const { board, setColumns } = useBoardView();

    const syncCardInState = useCallback(
        (cardId: string, patch: Partial<CardData>) => {
            setColumns((prev) =>
                prev.map((col) => ({
                    ...col,
                    cards: col.cards.map((card) =>
                        card.id === cardId ? { ...card, ...patch } : card
                    ),
                }))
            );
        },
        [setColumns]
    );

    const findCard = useCallback(
        (cardId: string) => {
            for (const col of board?.columns ?? []) {
                const found = col.cards.find((c) => c.id === cardId);
                if (found) return found;
            }
            return null;
        },
        [board]
    );

    const changeTitleCard = useCallback(
        async (cardId: string, title: string) => {
            const prevCard = findCard(cardId);
            
            syncCardInState(cardId, { title });

            try {
                const result = await cardApi.updateTitleCard(cardId, title);
                if (!result) throw new Error("Update failed");
                return true;
            } catch (err) {
                console.error(err);
                if (prevCard) syncCardInState(cardId, { title: prevCard.title });
                return false;
            }
        },
        [findCard, syncCardInState]
    );

    const toggleIsCompleted = useCallback(
        async (cardId: string, isComplete: boolean) => {
            const prevCard = findCard(cardId);

            syncCardInState(cardId, { isCompleted: isComplete });

            try {
                const result = await cardApi.updateIsCompleted(cardId, isComplete);
                if (!result) throw new Error("Update failed");
                return true;
            } catch (err) {
                console.error(err);
                if (prevCard) syncCardInState(cardId, { isCompleted: prevCard.isCompleted });
                return false;
            }
        },
        [findCard, syncCardInState]
    );

    const handleChangeDueDate = useCallback(
        async (cardId: string, dueDate: string | null) => {
            const prevCard = findCard(cardId);
    
            syncCardInState(cardId, {
                dueDate: dueDate ? new Date(dueDate) : undefined,
            });

            try {
                const result = await cardApi.updateDueDate(cardId, dueDate);
                if (!result) throw new Error("Update failed");
                return true;
            } catch (err) {
                console.error(err);
                if (prevCard) {
                    syncCardInState(cardId, {
                        dueDate: prevCard.dueDate,
                    });
                }
                return false;
            }
        },
        [findCard, syncCardInState]
    );

    const updateLabels = useCallback(
        async (cardId: string, labels: CardLabel[]) => {
            const prevCard = findCard(cardId);
            syncCardInState(cardId, { labels: labels });

            try {
                const result = await cardApi.updateLabels(
                    cardId,
                    labels.map((label) => ({ id: label.id }))
                );

                if (!result) throw new Error("Update failed");
                return true;
            } catch (err) {
                console.error("Failed to update labels:", err);
                if (prevCard) {
                    syncCardInState(cardId, { labels: prevCard.labels ?? [] });
                }
                return false;
            }
        },
        [findCard, syncCardInState]
    );

    return { changeTitleCard, toggleIsCompleted, handleChangeDueDate, updateLabels };
}
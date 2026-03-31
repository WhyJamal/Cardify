"use client";

import { useCallback, useRef, useState } from "react";
import { useCardActions } from "@/shared/hooks/use-card-actions";

export function useCardTitle(cardId: string, title: string) {
  const { changeTitleCard } = useCardActions();

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSaveTitle = useCallback(async () => {
    const value = tempTitle.trim();
    if (!value) return;

    const ok = await changeTitleCard(cardId, value);
    if (ok) setIsEditingTitle(false);
  }, [tempTitle, cardId, changeTitleCard]);

  const handleCancelTitle = useCallback(() => {
    setTempTitle(title);
    setIsEditingTitle(false);
  }, [title]);

  return {
    titleInputRef,
    isEditingTitle,
    setIsEditingTitle,
    tempTitle,
    setTempTitle,
    handleSaveTitle,
    handleCancelTitle,
  };
}
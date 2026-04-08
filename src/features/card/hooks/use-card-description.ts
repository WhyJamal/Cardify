"use client";

import { useCallback, useState } from "react";
import { cardApi } from "@features/card/api/card-api";

export function useCardDescription(cardId: string, description?: string) {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(description ?? "");

  const handleSaveDesc = useCallback(async () => {
    const updated = await cardApi.updateDescription(cardId, tempDesc);

    setTempDesc(updated.description ?? "");
    setIsEditingDesc(false);

    return updated.description;
  }, [cardId, tempDesc]);

  return {
    isEditingDesc,
    setIsEditingDesc,
    tempDesc,
    setTempDesc,
    handleSaveDesc,
  };
}
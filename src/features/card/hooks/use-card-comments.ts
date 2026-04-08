"use client";

import { useCallback, useState } from "react";
import { cardApi } from "@features/card/api/card-api";
import type { CardTimeline } from "@shared/types";

export function useCardComments(cardId: string) {
  const [comment, setComment] = useState("");
  const [timeline, setTimeline] = useState<CardTimeline[]>([]);

  const handleSendComment = useCallback(async () => {
    const text = comment.trim();
    if (!text) return;

    const created = await cardApi.addTimelineComment(cardId, text);

    setTimeline((prev) => [...prev, created]);
    setComment("");
  }, [comment, cardId]);

  return {
    comment,
    setComment,
    timeline,
    handleSendComment,
  };
}
"use client";

import { useEffect, useState } from "react";
import type { CardData } from "@shared/types";

export function useCardState(initialCard: CardData) {
  const [card, setCard] = useState<CardData>(initialCard);

  useEffect(() => {
    setCard(initialCard);
  }, [initialCard]);

  return {
    card,
    setCard,
  };
}
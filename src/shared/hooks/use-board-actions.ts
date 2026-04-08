"use client";

import { useRef, useState } from "react";
import { useBoardView } from "@/app/providers/BoardProvider";
import { clientFetch } from "@/lib/client-api";
import { boardApi } from "@features/board/api/board-api";
import { Board, BoardLabel, BoardMember, User } from "../types";

export function useBoardActions() {
  const { board, columns, setColumns, setBoard } = useBoardView();
  const lastColumnReorder = useRef<string>("");

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(board?.title);

  // ─── Cards ───────────────────────────────────────────────

  async function dropCard(
    draggedCardId: string,
    fromColumnId: string,
    toColumnId: string,
    targetCardId: string | null = null,
    insertAfter = false
  ) {
    let nextState = columns;
    let changed = false;

    setColumns((prev) => {
      const fromIdx = prev.findIndex((c) => c.id === fromColumnId);
      const toIdx = prev.findIndex((c) => c.id === toColumnId);
      if (fromIdx === -1 || toIdx === -1) return prev;

      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const fromCol = next[fromIdx];
      const toCol = next[toIdx];

      const draggedIndex = fromCol.cards.findIndex((c) => c.id === draggedCardId);
      if (draggedIndex === -1) return prev;

      const [draggedCard] = fromCol.cards.splice(draggedIndex, 1);

      if (fromColumnId === toColumnId) {
        const targetIdx = targetCardId
          ? fromCol.cards.findIndex((c) => c.id === targetCardId)
          : fromCol.cards.length;

        const insertAt =
          targetIdx === -1 ? fromCol.cards.length
            : insertAfter ? targetIdx + 1
              : targetIdx;

        fromCol.cards.splice(insertAt, 0, draggedCard);
      } else {
        const targetIdx = targetCardId
          ? toCol.cards.findIndex((c) => c.id === targetCardId)
          : toCol.cards.length;

        const insertAt = targetIdx === -1 ? toCol.cards.length : targetIdx;
        toCol.cards.splice(insertAt, 0, draggedCard);
      }

      changed = true;
      nextState = next;
      return next;
    });

    if (!changed) return;

    await clientFetch("/api/cards/reorder", {
      method: "PATCH",
      body: JSON.stringify({
        boardId: board?.id,
        movedCardId: draggedCardId,
        toColumnId,
        columns: nextState.map((col) => ({
          columnId: col.id,
          cardIds: col.cards.map((c) => c.id),
        })),
      }),
    }).catch((err) => console.error("Card reorder failed", err));
  }

  async function addCard(columnId: string, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const result = await clientFetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({ columnId, title: trimmed }),
    }).catch((err) => { console.error(err); return null; });

    if (!result) return;

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, result.card] }
          : col
      )
    );
  }

  // ─── Columns ─────────────────────────────────────────────

  async function dropColumn(draggedId: string, targetId: string) {
    const key = `${draggedId}-${targetId}`;
    if (lastColumnReorder.current === key) return;
    lastColumnReorder.current = key;

    let newColumns = columns;

    setColumns((prev) => {
      const dragIdx = prev.findIndex((c) => c.id === draggedId);
      const targetIdx = prev.findIndex((c) => c.id === targetId);
      if (dragIdx === -1 || targetIdx === -1) return prev;

      const next = [...prev];
      const [dragged] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, dragged);

      newColumns = next;
      lastColumnReorder.current = "";
      return next;
    });

    await clientFetch("/api/columns/reorder", {
      method: "PATCH",
      body: JSON.stringify({
        boardId: board?.id,
        columnIds: newColumns.map((c) => c.id),
      }),
    }).catch((err) => console.error("Column reorder failed", err));
  }

  async function addColumn(title: string) {
    const trimmed = title.trim();
    if (!trimmed || !board?.id) return false;

    const result = await clientFetch("/api/columns", {
      method: "POST",
      body: JSON.stringify({ boardId: board.id, title: trimmed }),
    }).catch((err) => { console.error(err); return null; });

    if (!result) return false;

    setColumns((prev) => [...prev, result.column]);
    return true;
  }

  // ─── Members ─────────────────────────────────────────────

  async function addMember(userId: string, user: User) {
    if (!board?.id) return;
    try {
      await boardApi.addMember(board.id, userId);
      setBoard((prev: Board | null) => {
        if (!prev) return prev;
        const already = prev.members?.some((m) => m.userId === userId);
        if (already) return prev;
        return {
          ...prev,
          members: [...(prev.members ?? []), { userId, user, status: "ACCEPTED" } as BoardMember],
        };
      });
    } catch (err) {
      console.error("addMember failed", err);
    }
  }

  async function removeMember(userId: string) {
    if (!board?.id) return;
    try {
      await boardApi.removeMember(board.id, userId);
      setBoard((prev: Board | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: (prev.members ?? []).filter((m) => m.userId !== userId),
        };
      });
    } catch (err) {
      console.error("removeMember failed", err);
    }
  }

  async function handleSaveTitle() {
    const title = tempTitle ? tempTitle.trim() : null;
    if (!title) return;

    try {
      const res = await boardApi.updateTitleBoard(board?.id, title);
      if (res) {
        setBoard((prev: Board | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            title,
          };
        });
        setIsEditingTitle(false);
      }
    } catch (err) {
      console.error("Change title failed", err);
    }
  }

  async function handleCancelTitle() {
    setTempTitle(board?.title);
    setIsEditingTitle(false);
  }

  async function handleCreateLabel(formData: BoardLabel) {
    if (!board?.id) return;

    try {
      const res = await boardApi.createLabel(board?.id, formData);
      return res;
    } catch (err) {
      console.error("Create label failed", err);
    }
  }

  async function handleToggleIsChoosen(boardId: number, isChoosen: boolean) {
    if (!boardId) return;

    try {
      const res = await boardApi.updateIsChoosen(boardId, isChoosen);
      setBoard((prev: Board | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            isChoosen,
          };
        });
      return res;
    } catch (err) {
      console.error("Create label failed", err);
    }
  }

  return {
    dropCard,
    addCard,
    dropColumn,
    addColumn,
    addMember,
    removeMember,
    handleSaveTitle,
    handleCancelTitle,
    tempTitle,
    isEditingTitle,
    setTempTitle,
    setIsEditingTitle,
    handleCreateLabel,
    handleToggleIsChoosen
  };
}


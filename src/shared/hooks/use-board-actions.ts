import { useRef } from "react";
import { useBoardView } from "@/app/providers/BoardProvider";
import { clientFetch } from "@/lib/client-api";
import { cardApi } from "@/features/card/api/card-api";

export function useBoardActions() {
  const { board, columns, setColumns } = useBoardView();
  const lastColumnReorder = useRef<string>("");

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

  async function toggleIsCompleted(cardId: string, isComplete: boolean) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId ? { ...c, isCompleted: isComplete } : c
        ),
      }))
    );

    // 2️⃣ backend update
    try {
      const result = await cardApi.updateIsCompleted(cardId, isComplete);
      if (!result) throw new Error("Update failed");
      return true;
    } catch (err) {
      console.error(err);
      // agar backend xato qaytarsa, rollback qilishingiz mumkin:
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards.map((c) =>
            c.id === cardId ? { ...c, isCompleted: !isComplete } : c
          ),
        }))
      );
      return false;
    }
  }

  return { dropCard, addCard, dropColumn, addColumn, toggleIsCompleted };
}


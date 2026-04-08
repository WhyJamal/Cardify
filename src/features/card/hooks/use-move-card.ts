"use client";

import { useEffect, useState, useCallback } from "react";
import { useBoardView } from "@/app/providers/BoardProvider";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { boardApi } from "@features/board/api/board-api";
import { clientFetch } from "@/lib/client-api";

interface SelectOption {
    value: string;
    label: string;
    group?: string;
}

interface ColumnOption extends SelectOption {
    cardCount: number;
}

interface BoardWithColumns {
    id: number | string;
    title: string;
    columns: {
        id: string;
        title: string;
        _count: { cards: number };
    }[];
}

interface WorkspaceWithBoards {
    id: string;
    name: string;
    boards: BoardWithColumns[];
}

export function useMoveCard(cardId: string, currentColumnId: string, currentPosition: number) {
    const { board, columns, setColumns } = useBoardView();
    const { currentWorkspace } = useWorkspace();

    const [allWorkspacesBoards, setAllWorkspacesBoards] = useState<WorkspaceWithBoards[]>([]);
    const [fetchedBoards, setFetchedBoards] = useState<BoardWithColumns[]>([]);
    const [boardOptions, setBoardOptions] = useState<SelectOption[]>([]);
    const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([]);
    const [positionOptions, setPositionOptions] = useState<SelectOption[]>([]);

    const [selectedBoardId, setSelectedBoardId] = useState<string>(board?.id?.toString() ?? "");
    const [selectedColumnId, setSelectedColumnId] = useState<string>(currentColumnId);
    const [selectedPosition, setSelectedPosition] = useState<string>((currentPosition + 1).toString());

    const [loadingBoards, setLoadingBoards] = useState(true);
    const [moving, setMoving] = useState(false);

    const isSameBoard = selectedBoardId === board?.id?.toString();

    const selectedBoardWorkspaceId = allWorkspacesBoards.find((ws) =>
        ws.boards.some((b) => b.id.toString() === selectedBoardId)
    )?.id;

    const isSameWorkspace = selectedBoardWorkspaceId === currentWorkspace?.id?.toString();

    useEffect(() => {
        setLoadingBoards(true);

        boardApi
            .getAllBoardsWithWorkspaces()
            .then((workspaces: WorkspaceWithBoards[]) => {
                setAllWorkspacesBoards(workspaces);
                setFetchedBoards(workspaces.flatMap((ws) => ws.boards));
                setBoardOptions(
                    workspaces.flatMap((ws) =>
                        ws.boards.map((b) => ({
                            value: b.id.toString(),
                            label: b.title,
                            group: ws.name,
                        }))
                    )
                );
            })
            .catch(console.error)
            .finally(() => setLoadingBoards(false));
    }, []);

    useEffect(() => {
        if (!selectedBoardId) return;

        if (isSameBoard) {
            const opts: ColumnOption[] = columns.map((col) => ({
                value: col.id,
                label: col.title,
                cardCount: col.cards.length,
            }));
            setColumnOptions(opts);

            const exists = opts.find((o) => o.value === selectedColumnId);
            if (!exists && opts.length > 0) setSelectedColumnId(opts[0].value);
        } else {
            const targetBoard = fetchedBoards.find((b) => b.id.toString() === selectedBoardId);
            const opts: ColumnOption[] = (targetBoard?.columns ?? []).map((col) => ({
                value: col.id,
                label: col.title,
                cardCount: col._count.cards,
            }));
            setColumnOptions(opts);
            if (opts.length > 0) setSelectedColumnId(opts[0].value);
        }
    }, [selectedBoardId, isSameBoard, columns, fetchedBoards]);

    useEffect(() => {
        const col = columnOptions.find((c) => c.value === selectedColumnId);
        if (!col) return;

        const isCurrentColumn = selectedColumnId === currentColumnId && isSameBoard;
        const total = Math.max(isCurrentColumn ? col.cardCount : col.cardCount + 1, 1);

        const opts = Array.from({ length: total }, (_, i) => ({
            value: (i + 1).toString(),
            label: (i + 1).toString(),
        }));

        setPositionOptions(opts);
        setSelectedPosition(isCurrentColumn ? (currentPosition + 1).toString() : total.toString());
    }, [selectedColumnId, columnOptions, currentColumnId, currentPosition, isSameBoard]);

    const handleMove = useCallback(async () => {
        const targetPosition = parseInt(selectedPosition, 10) - 1;

        const isCurrentColumn = selectedColumnId === currentColumnId && isSameBoard;
        if (isCurrentColumn && targetPosition === currentPosition) return true;

        setMoving(true);
        try {
            if (isSameBoard && isSameWorkspace) {
                let updatedColumns = columns;
                setColumns((prev) => {
                    const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
                    const fromCol = next.find((c) => c.id === currentColumnId);
                    const toCol = next.find((c) => c.id === selectedColumnId);
                    if (!fromCol || !toCol) return prev;

                    const dragIdx = fromCol.cards.findIndex((c) => c.id === cardId);
                    if (dragIdx === -1) return prev;

                    const [movedCard] = fromCol.cards.splice(dragIdx, 1);

                    if (currentColumnId === selectedColumnId) {
                        const insertAt = Math.min(targetPosition, fromCol.cards.length);
                        fromCol.cards.splice(insertAt, 0, movedCard);
                    } else {
                        const insertAt = Math.min(targetPosition, toCol.cards.length);
                        toCol.cards.splice(insertAt, 0, movedCard);
                    }

                    updatedColumns = next;
                    return next;
                });

                await clientFetch("/api/cards/reorder", {
                    method: "PATCH",
                    body: JSON.stringify({
                        boardId: board?.id,
                        movedCardId: cardId,
                        toColumnId: selectedColumnId,
                        columns: updatedColumns.map((col) => ({
                            columnId: col.id,
                            cardIds: col.cards.map((c) => c.id),
                        })),
                    }),
                });
            } else {
                await clientFetch(`/api/cards/${cardId}/move`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        targetBoardId: selectedBoardId,
                        targetColumnId: selectedColumnId,
                        targetPosition,
                    }),
                });

                setColumns((prev) =>
                    prev.map((col) =>
                        col.id === currentColumnId
                            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
                            : col
                    )
                );
            }

            return true;
        } catch (err) {
            console.error("Ko'chirishda xato:", err);
            return false;
        } finally {
            setMoving(false);
        }
    }, [
        selectedPosition,
        selectedColumnId,
        selectedBoardId,
        currentColumnId,
        currentPosition,
        isSameBoard,
        isSameWorkspace,
        cardId,
        board?.id,
        columns,
        setColumns,
    ]);

    return {
        boardOptions,
        columnOptions,
        positionOptions,
        selectedBoardId,
        selectedColumnId,
        selectedPosition,
        setSelectedBoardId,
        setSelectedColumnId,
        setSelectedPosition,
        loadingBoards,
        moving,
        handleMove,
    };
}
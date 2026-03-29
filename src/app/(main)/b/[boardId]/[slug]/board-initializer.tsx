"use client";

import { useEffect, useRef } from "react";
import { useBoardView } from "@/app/providers/BoardProvider";
import type { Board, ColumnInt } from "@/shared/types";

export function BoardInitializer({
    board,
    columns,
    children,
}: {
    board: Board;
    columns: ColumnInt[];
    children: React.ReactNode;
}) {
    const { setBoard, setColumns } = useBoardView();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current || board.id !== undefined) {
            setBoard(board);
            setColumns(columns);
            initialized.current = true;
        }
    }, [board, columns, setBoard, setColumns]);

    return <>{children}</>;
}
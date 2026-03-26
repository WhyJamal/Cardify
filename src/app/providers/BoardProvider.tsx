"use client";
import { useEffect } from "react";
import { useBoardStore } from "@/app/store/board-store";
import { Board, ColumnInt } from "@/shared/types";

export function BoardProvider({ children, initialBoard, initialColumns }: {
    children: React.ReactNode;
    initialBoard: Board | null;
    initialColumns: ColumnInt[];
}) {
    const { setBoard, setColumns } = useBoardStore();

    useEffect(() => {
        setBoard(initialBoard);
        setColumns(initialColumns);
    }, [initialBoard, initialColumns]);

    return <>{children}</>;
}

export function useBoardView() {
    return useBoardStore();
}
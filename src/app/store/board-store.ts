import { create } from "zustand";
import { Board, ColumnInt } from "@/shared/types";

type BoardStore = {
    board: Board | null;
    columns: ColumnInt[];
    setBoard: (board: Board | null) => void;
    setColumns: (columns: ColumnInt[]) => void;
    updateCardLabels: (cardId: string, labels: any[]) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
    board: null,
    columns: [],
    setBoard: (board) => set({ board }),
    setColumns: (columns) => set({ columns }),
    updateCardLabels: (cardId, labels) =>
        set((state) => ({
            columns: state.columns.map((col) => ({
                ...col,
                cards: col.cards?.map((c) =>
                    c.id === cardId ? { ...c, labels } : c
                ),
            })),
        })),
}));
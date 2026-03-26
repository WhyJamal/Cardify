import { create } from "zustand";
import { Board, ColumnInt, CardLabel } from "@/shared/types";

type BoardStore = {
  board: Board | null;
  columns: ColumnInt[];
  setBoard: (board: Board | null) => void;
  setColumns: (columns: ColumnInt[]) => void;
  updateCardLabels: (cardId: string, labels: CardLabel[]) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  columns: [],
  setBoard: (board) => set({ board }),
  setColumns: (columns) =>
    set({ columns: Array.isArray(columns) ? columns : [] }),
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
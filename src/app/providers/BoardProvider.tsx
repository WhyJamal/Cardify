"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Board, ColumnInt } from "@shared/types";

type BoardViewContextType = {
  board: Board | null;
  setBoard: Dispatch<SetStateAction<Board | null>>;
  columns: ColumnInt[];
  setColumns: Dispatch<SetStateAction<ColumnInt[]>>;
};

const BoardViewContext = createContext<BoardViewContextType | null>(null);

export function BoardProvider({
  children,
  initialBoard,
  initialColumns,
}: {
  children: React.ReactNode;
  initialBoard: Board | null;
  initialColumns: ColumnInt[];
}) {
  const [board, setBoard] = useState<Board | null>(initialBoard);
  const [columns, setColumns] = useState<ColumnInt[]>(initialColumns);

  const value = useMemo(
    () => ({
      board,
      setBoard,
      columns,
      setColumns,
    }),
    [board, columns]
  );

  return (
    <BoardViewContext.Provider value={value}>
      {children}
    </BoardViewContext.Provider>
  );
}

export function useBoardView() {
  const ctx = useContext(BoardViewContext);
  if (!ctx) {
    throw new Error("useBoardView must be used inside BoardProvider");
  }
  return ctx;
}
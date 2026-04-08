"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { BoardCard } from "@components/";
import { Board } from "@shared/types";

interface Props {
  onBoardOpen: (board: Board) => void;
}

export function RecentBoards({ onBoardOpen }: Props) {
  const { data: session } = useSession();
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const saved = localStorage.getItem(`recentBoards_${session.user.id}`);
    if (saved) setRecentBoards(JSON.parse(saved));
  }, [session?.user?.id]);

  const handleBoardOpen = (board: Board) => {
    const updated = [board, ...recentBoards.filter(b => b.id !== board.id)].slice(0, 4);
    setRecentBoards(updated);
    if (session?.user?.id) {
      localStorage.setItem(`recentBoards_${session.user.id}`, JSON.stringify(updated));
    }
    onBoardOpen(board);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={25} className="text-[#b6c2cf]" />
        <h2 className="text-[#b6c2cf] text-md font-bold">Недавно просмотренное</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentBoards.length ? (
          recentBoards.map((board) => (
            <BoardCard key={board.id} board={board} onClick={() => handleBoardOpen(board)} />
          ))
        ) : (
          <p className="text-[#8c9bab] text-sm col-span-full">
            Нет недавно просмотренных досок.
          </p>
        )}
      </div>
    </section>
  );
}
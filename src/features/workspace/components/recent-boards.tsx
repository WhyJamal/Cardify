"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BoardCard } from "@components/";
import { Board } from "@shared/types";

export function RecentBoards() {
  const { data: session } = useSession();
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const saved = localStorage.getItem(`recentBoards_${session.user.id}`);
    if (saved) setRecentBoards(JSON.parse(saved));
  }, [session?.user?.id]);

  function handleBoardOpen(board: Board) {
    if (!session?.user?.id) return;
    const updated = [board, ...recentBoards.filter(b => b.id !== board.id)].slice(0, 4);
    setRecentBoards(updated);
    localStorage.setItem(`recentBoards_${session.user.id}`, JSON.stringify(updated));
  }

  if (!recentBoards.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-[#b6c2cf] text-md font-bold mb-4">Недавние</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentBoards.map((board) => (
          <BoardCard key={board.id} board={board} onClick={() => handleBoardOpen(board)} />
        ))}
      </div>
    </section>
  );
}
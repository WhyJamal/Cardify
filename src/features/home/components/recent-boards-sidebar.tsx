"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Plus } from "lucide-react";
import { useRef } from "react";
import { Board } from "@shared/types";
import { PAGES } from "@/config/pages.config";
import { slugify } from "@utils/slugify";
import { CreateBoardPanel } from "@/features/board/components/create-board-panel";

interface RecentBoardsSidebarProps {
  userId: string;
}

function BoardThumbnail({ board }: { board: Board }) {
  if (board.isPhoto && board.bg) {
    return (
      <Image
        src={board.bg}
        alt={board.title}
        width={50}
        height={50}
        className="w-10 h-8 rounded object-cover shrink-0"
      />
    );
  }
  return (
    <div
      className="w-10 h-8 rounded shrink-0"
      style={{ backgroundColor: board.bg || "#374151" }}
    />
  );
}

export function RecentBoardsSidebar({ userId }: RecentBoardsSidebarProps) {
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    const key = `recentBoards_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setRecentBoards(JSON.parse(saved));
      } catch {}
    }
  }, [userId]);

  return (
    <div className="w-72 shrink-0">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-400" />
        <span className="text-gray-300 text-sm">Недавно просмотренное</span>
      </div>

      <div className="space-y-1 mb-6">
        {recentBoards.length ? (
          recentBoards.map((board) => (
            <Link key={board.id} href={PAGES.BOARD(board.id, slugify(board.title))}>
              <div className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-[#2c2e33]">
                <BoardThumbnail board={board} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate font-medium">{board.title}</div>
                  <div className="text-gray-500 text-xs truncate">
                    Рабочее пространство Cardify
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-[#8c9bab] text-sm">Нет недавно просмотренных досок.</p>
        )}
      </div>

      <div className="mb-3">
        <span className="text-gray-400 text-sm">Ссылки</span>
      </div>

      <div
        ref={triggerRef}
        onClick={() => setShowCreateBoard(true)}
        className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-[#2c2e33]"
      >
        <div className="w-10 h-8 rounded flex items-center justify-center shrink-0 bg-[#3d4148]">
          <Plus size={16} className="text-gray-300" />
        </div>
        <span className="text-white text-sm font-medium">Создать доску</span>
      </div>

      {showCreateBoard && (
        <CreateBoardPanel
          triggerRef={triggerRef}
          onClose={() => setShowCreateBoard(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}
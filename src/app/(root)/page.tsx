"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, AlignJustify, MoreHorizontal, Check, X, Plus } from "lucide-react";
import Image from "next/image";
import { CreateBoardPanel } from "@/features/board/create-board-panel";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { slugify } from "@/shared/utils/slugify";
import { Board } from "@/shared/types";

interface RecentBoardsProps {
  board: Board;
}

function BoardThumbnail({ board }: RecentBoardsProps) {
  if (board.isPhoto) {
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
  if ((board as any).bg) {
    return (
      <div
        className="w-10 h-8 rounded shrink-0"
        style={{ background: (board as any).bg }}
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

export default function RootPage() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [taskDone, setTaskDone] = useState(false);
  const [taskDismissed, setTaskDismissed] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const key = `recentBoards_${session.user.id}`;
    const saved = localStorage.getItem(key);

    if (saved) setRecentBoards(JSON.parse(saved));
  }, [session?.user?.id]);

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center pt-8 px-6 bg-[#1d2125]"
    >
      <div className="w-full max-w-5xl flex gap-12">

        <div className="flex-1 max-w-xl max-h-screen overflow-y-auto">

          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm">Требуют внимания</span>
          </div>


          <div
            className="rounded-lg py-5 mb-4 flex flex-col gap-4 bg-[#2c2e33] justify-center items-center text-white/80 font-medium"
          >
            <h1 className="text-sm text-center">
              Когда вы будете добавлены в контрольный список, он появится здесь.
            </h1>

            <Image
              src="/images/pet/workspace-snow-leopart.webp"
              alt="workspace snow leopard"
              width={420}
              height={220}
              className="w-full"
              priority
            />

            <h1 className="text-md font-semibold">
              Будьте в курсе событий
            </h1>

            <p className="text-xs px-6 text-center text-white/60">
              Приглашайте людей на форумы и открытки, оставляйте комментарии,
              указывайте сроки выполнения, и мы покажем здесь наиболее важные действия.
            </p>
          </div>

          {!dismissed && (
            <div
              className="rounded-lg p-4 mb-4 flex gap-4 items-start"
              style={{ backgroundColor: "#2c2e33" }}
            >
              <Image
                src="/images/87855c9dd4548ab725ac600d9c082b8681ae99cc.png"
                alt="attention"
                width={96}
                height={96}
                className="rounded object-cover shrink-0"
              />
              <div>
                <div className="text-white mb-1" style={{ fontSize: "15px", fontWeight: 600 }}>
                  Требуют внимания
                </div>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  Отслеживайте приближающиеся сроки, упоминания и задачи.
                </p>
                <button
                  onClick={() => setDismissed(true)}
                  className="px-4 py-1.5 rounded text-sm text-white transition-colors"
                  style={{ backgroundColor: "#3d4148" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4a5058")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#3d4148")}
                >
                  Ясно! Отклонить.
                </button>
              </div>
            </div>
          )}

          {!taskDone && !taskDismissed && (
            <div
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: "#2c2e33", border: "1px solid #3d4148" }}
            >
              <div className="p-4">
                <div className="w-12 h-1.5 rounded-full mb-3" style={{ backgroundColor: "#22c55e" }} />

                <div className="text-white text-sm mb-3" style={{ fontWeight: 500 }}>111</div>

                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "#2d2000", color: "#f59e0b", border: "1px solid #92400e" }}
                  >
                    <Clock size={11} />
                    18 мар.
                  </span>
                  <AlignJustify size={14} className="text-gray-500" />
                </div>
              </div>

              <div
                className="px-4 py-2 text-xs"
                style={{ backgroundColor: "#252629", color: "#6c9bd1" }}
              >
                <span>Рабочее пространство Cardify</span>
                <span className="text-gray-500 mx-1">|</span>
                <span style={{ color: "#6c9bd1", fontWeight: 600 }}>test: 11</span>
              </div>

              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: "#2c2e33", borderTop: "1px solid #3d4148" }}
              >
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock size={14} />
                  <span>Срок 18 марта 2026 г. в 10:39</span>
                </div>
                <button className="text-gray-500 hover:text-gray-300 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div
                className="flex gap-3 px-4 pb-4"
                style={{ backgroundColor: "#2c2e33" }}
              >
                <button
                  onClick={() => setTaskDone(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors"
                  style={{ backgroundColor: "#3d4148", border: "1px solid #4a5058" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4a5058")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#3d4148")}
                >
                  <Check size={14} />
                  Выполнить
                </button>
                <button
                  onClick={() => setTaskDismissed(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm text-white transition-colors"
                  style={{ backgroundColor: "#3d4148", border: "1px solid #4a5058" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4a5058")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#3d4148")}
                >
                  <X size={14} />
                  Отклонить
                </button>
              </div>
            </div>
          )}

          {(taskDone || taskDismissed) && (
            <div
              className="rounded-lg p-6 text-center"
              style={{ backgroundColor: "#2c2e33", border: "1px solid #3d4148" }}
            >
              <p className="text-gray-400 text-sm">
                {taskDone ? "Vazifa bajarildi!" : "Vazifa rad etildi."}
              </p>
            </div>
          )}
        </div>

        <div className="w-72 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm">Недавно просмотренное</span>
          </div>

          <div className="space-y-1 mb-6">
            {recentBoards.length ? (
              recentBoards.map((board) => (
                <Link key={board.id} href={`/b/${board.id}/${slugify(board.title)}`}>
                  <div
                    className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-colors"
                    style={{ borderRadius: "6px" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2c2e33")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <BoardThumbnail board={board} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm truncate" style={{ fontWeight: 500 }}>
                          {board.title}
                        </span>
                        {/* {board.isTemplate && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded shrink-0"
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #6b7280",
                              color: "#9ca3af",
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                            }}
                          >
                            ШАБЛОН
                          </span>
                        )} */}
                      </div>
                      <div className="text-gray-500 text-xs truncate">Рабочее пространство Cardify</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[#8c9bab] text-sm col-span-full">Нет недавно просмотренных досок.</p>
            )}
          </div>

          <div className="mb-3">
            <span className="text-gray-400 text-sm">Ссылки</span>
          </div>

          <div
            className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-colors"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2c2e33")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div
              ref={triggerRef}
              onClick={() => setShowCreateBoard(true)}
              className="w-10 h-8 rounded flex items-center justify-center shrink-0 bg-[#3d4148]"
            >
              <Plus size={16} className="text-gray-300" />
            </div>
            <span className="text-white text-sm" style={{ fontWeight: 500 }}>
              Создать доску
            </span>
          </div>

          {showCreateBoard && (
            <CreateBoardPanel
              triggerRef={triggerRef}
              onClose={() => setShowCreateBoard(false)}
              onCreated={() => { }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import { LayoutDashboard, Users, Settings, Lock } from "lucide-react";
import { BoardCard } from "@components/";
import { CreateBoardPanel } from "@features/board/components/create-board-panel";
import { Board, Workspace } from "@shared/types";

type Tab = "boards" | "members" | "settings";

interface Props {
  workspace: Workspace;
  onBoardOpen: (board: Board) => void;
  onBoardCreated: (board: Board, workspaceId: string) => void;
}

export function WorkspaceSection({ workspace, onBoardOpen, onBoardCreated }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("boards");
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "boards", label: "Доски", icon: <LayoutDashboard size={15} /> },
    { key: "members", label: "Участники", icon: <Users size={15} /> },
    { key: "settings", label: "Настройки", icon: <Settings size={15} /> },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#1db954] flex items-center justify-center text-black text-sm font-bold">
            {workspace.name[0].toUpperCase()}
          </div>
          <span className="text-[#b6c2cf] text-md font-bold">{workspace.name}</span>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === key
                  ? "bg-[#a1bdd914] text-[#b6c2cf]"
                  : "hover:bg-[#a1bdd914] text-[#8c9bab]"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
          <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[#7c3aed1a] text-[#9d6fe8] hover:bg-[#7c3aed30] transition-colors">
            <Lock size={15} />
            Повысить
          </button>
        </div>
      </div>

      {activeTab === "boards" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {workspace.boards?.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onClick={() => onBoardOpen(board)}
            />
          ))}

          <div
            ref={triggerRef}
            onClick={() => setShowCreateBoard(true)}
            className="h-25 rounded-lg bg-[#2c333a] hover:bg-[#38414a] transition-colors flex flex-col items-center justify-center gap-1 px-4 py-5 cursor-pointer"
          >
            <span className="text-sm text-[#b6c2cf]">Создать доску</span>
            <span className="text-xs text-[#8c9bab]">Осталось: 6</span>
          </div>

          {showCreateBoard && (
            <CreateBoardPanel
              triggerRef={triggerRef}
              onClose={() => setShowCreateBoard(false)}
              onCreated={(newBoard) => {
                onBoardCreated(newBoard, workspace.id);
                setShowCreateBoard(false);
              }}
              workspaceId={workspace.id}
            />
          )}
        </div>
      )}

      {/* futures: activeTab === "members" | "settings" */}
    </section>
  );
}
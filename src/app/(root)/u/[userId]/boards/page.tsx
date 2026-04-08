"use client";

import { Board } from "@shared/types";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { RecentBoards } from "@features/board/components/recent-boards";
import { WorkspaceSection } from "@features/board/components/workspace-section";

export default function BoardsPage() {
  const { workspaces, updateWorkspace } = useWorkspace();

  const handleBoardCreated = (newBoard: Board, workspaceId: string) => {
    const ws = workspaces.find((ws) => ws.id === workspaceId);
    if (!ws) return;
    updateWorkspace({
      ...ws,
      boards: [newBoard, ...(ws.boards || [])],
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#1d2125] text-[#b6c2cf] overflow-hidden">
      <main className="flex-1 overflow-y-auto px-32 py-10">

        <RecentBoards onBoardOpen={() => {}} />

        <div className="border-t border-[#2c333a] mb-8" />

        {workspaces.map((ws) => (
          <WorkspaceSection
            key={ws.id}
            workspace={ws}
            onBoardOpen={() => {}}
            onBoardCreated={handleBoardCreated}
          />
        ))}

      </main>
    </div>
  );
}
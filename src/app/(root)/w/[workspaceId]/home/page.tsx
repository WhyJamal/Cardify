import { WorkspaceHeader } from "@features/workspace/components/workspace-header";
import { RecentBoards } from "@features/workspace/components/recent-boards";
import { BoardsList } from "@features/workspace/components/boards-list";
import { getWorkspaceServer } from "@/features/workspace/api/workspace-server-api";

export default async function WorkspaceHomePage({ params }: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceServer(workspaceId);
  
  return (
    <div className="flex h-screen w-full bg-[#1d2125] text-[#b6c2cf] overflow-hidden">
      <main className="flex-1 overflow-y-auto px-32 py-10">

        <WorkspaceHeader name={workspace.name} />

        <div className="border-t border-[#2c333a] mb-8" />

        <RecentBoards />

        <BoardsList
          initialBoards={workspace.boards ?? []}
          workspaceId={workspaceId}
        />

      </main>
    </div>
  );
}
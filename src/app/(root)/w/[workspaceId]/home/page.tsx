import { RecentBoards } from "@features/workspace/components/recent-boards";
import { BoardsList } from "@features/workspace/components/boards-list";
import { getWorkspaceServer } from "@/features/workspace/api/workspace-server-api";
import { WorkspaceSmallCard } from "@/shared/components/workspace-small-card";

export default async function WorkspaceHomePage({ params }: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceServer(workspaceId);

  return (
    <div className="flex h-screen w-full bg-[#1d2125] text-[#b6c2cf] overflow-hidden">
      <main className="flex-1 overflow-y-auto px-32 py-10">

        <div className="flex items-center gap-2 mb-4 pl-10">
          <div className="flex items-center gap-3">
            <WorkspaceSmallCard
              size={"md"}
              isLogo={workspace.logo ? true : false}
              logo={workspace.logo}
              name={workspace.name}
            />
            <span className="text-[#b6c2cf] text-md font-bold">{workspace.name}</span>
          </div>
        </div>

        <div className="border-t border-[#2c333a] mb-8" />

        {/* <RecentBoards /> */}

        <BoardsList
          initialBoards={workspace.boards ?? []}
          workspaceId={workspaceId}
        />

      </main>
    </div>
  );
}
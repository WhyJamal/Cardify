import { MembersSearchList } from "@features/workspace/components/members-search-list";
import { InviteButton } from "@features/workspace/components/invite-button";
import { serverFetch } from "@/lib/server-api";

export default async function MembersPage({
    params,
}: {
    params: Promise<{ workspaceId: string }>;
}) {
    const { workspaceId } = await params;

    const res = await serverFetch(`/api/workspaces/${workspaceId}/members`);

    const members = res.members;

    return (
        <div className="min-h-screen bg-[#1f1f23] text-white p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Участники с правом управления
                        <span className="ml-2 text-sm text-gray-400">{members.length}</span>
                    </h1>
                </div>

                <div className="flex gap-6 border-b border-white/10 pb-3 text-sm">
                    <button className="text-blue-400 border-b-2 border-blue-400 pb-2">
                        Участники ({members.length})
                    </button>
                </div>

                <InviteButton workspaceId={workspaceId} />

                <MembersSearchList members={members} workspaceId={workspaceId} />

            </div>
        </div>
    );
}
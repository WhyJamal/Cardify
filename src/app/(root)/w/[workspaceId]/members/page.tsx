"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Search, SquareArrowRightExit, Trash2, UserPlus, X } from "lucide-react";
import { Button } from "@/shared/components";
import { ConfirmDialog } from "@/shared/components/ui/confirm-diolog";
import InviteWorkspaceCard from "@/features/workspace/components/invite-workspace-card";
import WorkspaceModal from "@/features/workspace/modal/workpace-modal";
import { useParams } from "next/navigation";
import { useWorkspaceActions } from "@/features/workspace/hooks/use-workspace-actions";
import { WorkspaceMember } from "@/shared/types";
import { workspaceApi } from "@/features/workspace/api/workspace-api";

export default function MembersPage() {
    const params = useParams<{ workspaceId: string }>();
    const workspaceId = params.workspaceId;

    const { loadMembers } = useWorkspaceActions();
    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [loading, setLoading] = useState(false);

    const [countMembers, setCountMembers] = useState(0);
    const [search, setSearch] = useState("");
    const [showInviteWorkspace, setShowInviteWorkspace] = useState(false);

    const filtered = members.filter((m) => {
        if (!m.user) return false;

        return (
            m.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.user.email?.toLowerCase().includes(search.toLowerCase())
        );
    });

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        const data = await loadMembers(workspaceId);
        if (data) {
            setMembers(data);
            setCountMembers(data.length);
        }
        setLoading(false);
    }, [workspaceId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleRemoveMember = async (userId: string) => {
        try {
            await workspaceApi.removeMembersFromWorkspace(workspaceId, userId);
            setMembers((prev) => prev.filter((m) => m.userId !== userId));
            setCountMembers((prev) => prev - 1);
        } catch (error) {
            console.error("Remove member error:", error);
        } finally {
        }
    };

    return (
        <div className="min-h-screen bg-[#1f1f23] text-white p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Участники с правом управления
                        <span className="ml-2 text-sm text-gray-400">{countMembers}</span>
                    </h1>
                </div>

                {/* <div className="bg-[#2a2a2f] rounded-xl p-5 text-sm text-gray-300">
                        <p className="font-medium">
                            Чтобы управлять правами доступа, оформите подписку.
                        </p>
                        <p className="text-gray-400 mt-1">
                            Решайте, кто может отправлять приглашения и изменять настройки
                            рабочего пространства с Premium.
                        </p>

                        <button className="mt-3 underline text-blue-400">
                            Узнать больше
                        </button>
                    </div> 
                */}

                <div className="flex gap-6 border-b border-white/10 pb-3 text-sm">
                    <button className="text-blue-400 border-b-2 border-blue-400 pb-2">
                        Участники ({countMembers})
                    </button>
                    {/* <button className="text-gray-400">Гости одной доски (0)</button>
                        <button className="text-gray-400">Гости нескольких досок (0)</button>
                        <button className="text-gray-400">
                            Запросы на присоединение (0)
                        </button> 
                    */}
                </div>

                <Button
                    size={"xl"}
                    variant={"custom"}
                    onClick={() => setShowInviteWorkspace(true)}
                    className="flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    Пригласите пользователей в рабочее пространство
                </Button>

                <div className="relative max-w-sm">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Фильтровать по именам"
                        className="w-full bg-[#2a2a2f] border border-white/10 rounded pl-10 pr-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="divide-y divide-white/10 rounded  overflow-hidden">

                    {loading ? (
                        <div className="flex w-full justify-center mt-5">
                            <svg className="spinner" viewBox="25 25 50 50">
                                <circle className="spinner-circle" r="20" cy="50" cx="50"></circle>
                            </svg>
                        </div>
                    ) : (
                        filtered.map((member) => (
                            <div
                                key={member.id}
                                className="grid grid-cols-[320px_240px_120px_130px_120px] items-center gap-4 px-6 py-2 hover:bg-white/3 transition-colors"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-semibold shrink-0">
                                        {member.user.name?.charAt(0)}
                                    </div>

                                    <div className="truncate">
                                        <p className="font-medium text-md leading-none truncate">
                                            {member.user.name}
                                        </p>
                                        <p className="text-gray-400 text-sm truncate">
                                            {member.user.email}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-xs">
                                    Последняя активность: {member.lastActive ? new Date(member.lastActive).toLocaleDateString("ru-RU", { month: "short", year: "numeric" }) : new Date().toLocaleDateString("ru-RU", { month: "short", year: "numeric" })}
                                </p>

                                <div>
                                    <Button
                                        size={"sm"}
                                        className="w-full bg-[#2a2a2f] hover:bg-white/10 transition py-4 text-xs"
                                    >
                                        Доски ({Array.isArray(member.boards) ? member.boards.length : 0})
                                        <ChevronDown />
                                    </Button>
                                </div>


                                <div>
                                    <Button
                                        size={"sm"}
                                        className="w-full bg-[#2a2a2f] py-4 hover:bg-white/10 text-xs text-gray-200"
                                    >
                                        {member.role}
                                        <ChevronDown />
                                    </Button>
                                </div>

                                <div>
                                    {member.role === "OWNER" ? (
                                        <ConfirmDialog
                                            title="Покинуть рабочее пространство?"
                                            desc="Вы потеряете доступ ко всем доскам и данным этого рабочего пространства. Чтобы вернуться, вам потребуется новое приглашение."
                                            onConfirm={() => handleRemoveMember(member.user.id)}
                                        >
                                            <Button
                                                className="w-full bg-[#2a2a2f] p-4 hover:bg-white/10 transition rounded-md text-sm"
                                            >
                                                <SquareArrowRightExit />
                                                Покинуть
                                            </Button>
                                        </ConfirmDialog>
                                    ) : (
                                        <ConfirmDialog
                                            title="Удалить участника?"
                                            desc="Пользователь потеряет доступ к этому рабочему пространству и всем связанным доскам. Это действие можно отменить только повторным приглашением."
                                            onConfirm={() => handleRemoveMember(member.user.id)}
                                        >
                                            <Button
                                                className="w-full bg-[#2a2a2f] p-4 gap-3 hover:bg-white/10 transition rounded-md text-sm"
                                            >
                                                <Trash2 />
                                                Удалить
                                            </Button>
                                        </ConfirmDialog>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            <WorkspaceModal
                title={"Пригласить в рабочее пространство"}
                open={showInviteWorkspace}
                onClose={() => setShowInviteWorkspace(false)}
            >
                <InviteWorkspaceCard
                    workspaceId={workspaceId}
                    onSuccess={() => {
                        setShowInviteWorkspace(false);
                        fetchMembers();
                    }}
                />
            </WorkspaceModal>

        </div>
    );
}
"use client";

import { useState } from "react";
import { Search, SquareArrowRightExit, UserPlus, X } from "lucide-react";
import { Button } from "@/shared/components";
import InviteWorkspaceCard from "@/features/workspace/invite-workspace-card";
import WorkspaceModal from "@/features/workspace/modal/workpace-modal";

type Member = {
    id: number;
    name: string;
    username: string;
    lastActive: string;
    role: "admin" | "member";
    boards: number;
};

const membersMock: Member[] = [
    {
        id: 1,
        name: "Sayyodbee Gulomov",
        username: "@sayyodbeegulomov",
        lastActive: "Mar 2026",
        role: "admin",
        boards: 8,
    },
    {
        id: 2,
        name: "Jamal",
        username: "@jamal",
        lastActive: "Aug 2013",
        role: "admin",
        boards: 0,
    },
];

export default function MembersPage() {
    const [search, setSearch] = useState("");
    const [showInviteWorkspace, setShowInviteWorkspace] = useState(false);

    const filtered = membersMock.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#1f1f23] text-white p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Участники с правом управления
                        <span className="ml-2 text-sm text-gray-400">2 / 10</span>
                    </h1>

                    <button className="p-2 hover:bg-white/10 rounded-lg">
                        <X size={20} />
                    </button>
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
        </div> */}

                <div className="flex gap-6 border-b border-white/10 pb-3 text-sm">
                    <button className="text-blue-400 border-b-2 border-blue-400 pb-2">
                        Участники (2)
                    </button>
                    {/* <button className="text-gray-400">Гости одной доски (0)</button>
          <button className="text-gray-400">Гости нескольких досок (0)</button>
          <button className="text-gray-400">
            Запросы на присоединение (0)
          </button> */}
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

                    {filtered.map((member) => (
                        <div
                            key={member.id}
                            className="grid grid-cols-[320px_240px_120px_130px_120px] items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-semibold shrink-0">
                                    {member.name.charAt(0)}
                                </div>

                                <div className="truncate">
                                    <p className="font-medium leading-none truncate">
                                        {member.name}
                                    </p>
                                    <p className="text-gray-400 text-sm truncate">
                                        {member.username}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm">
                                Последняя активность: {member.lastActive}
                            </p>

                            <div>
                                <button className="w-full bg-[#2a2a2f] hover:bg-white/10 transition px-3 py-1.5 rounded-md text-sm text-center">
                                    Доски ({member.boards})
                                </button>
                            </div>


                            <div>
                                <span className="block w-full text-center bg-[#2a2a2f] px-3 py-1.5 rounded-md text-sm text-gray-200">
                                    Администратор
                                </span>
                            </div>

                            <div>
                                {member.id === 1 ? (
                                    <Button className="w-full bg-[#2a2a2f] hover:bg-red-500/20 transition rounded-md text-sm">
                                        <SquareArrowRightExit />
                                        Покинуть
                                    </Button>
                                ) : (
                                    <Button className="w-full bg-[#2a2a2f] hover:bg-red-500/20 transition rounded-md text-sm">
                                        Удалить
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <WorkspaceModal
                title={"Пригласить в рабочее пространство"}
                open={showInviteWorkspace}
                onClose={() => setShowInviteWorkspace(false)}
            >
                <InviteWorkspaceCard />
            </WorkspaceModal>

        </div>
    );
}
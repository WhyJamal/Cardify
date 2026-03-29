"use client";

import { useRef, useState, useEffect } from "react";
import { BoardCard, Spinner } from "@/shared/components";
import { CreateBoardPanel } from "@/features/board/create-board-panel";
import { useSession } from "next-auth/react";
import { Board } from "@/shared/types";

export default function WorcspaceHomePage() {
    const { data: session } = useSession();
    const [showCreateBoard, setShowCreateBoard] = useState(false);
    const [workspaceBoards, setWorkspaceBoards] = useState<any[]>([]);
    const [recentBoards, setRecentBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function fetchBoards() {
            try {
                const res = await fetch("/api/boards");
                const data = await res.json();

                if (res.ok) {
                    setWorkspaceBoards(data.boards);
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchBoards();
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;

        const key = `recentBoards_${session.user.id}`;
        const saved = localStorage.getItem(key);

        if (saved) setRecentBoards(JSON.parse(saved));
    }, [session?.user?.id]);

    function handleBoardOpen(board: any) {
        const updated = [board, ...recentBoards.filter(b => b.id !== board.id)].slice(0, 4);
        setRecentBoards(updated);
        const key = `recentBoards_${session?.user?.id}`;
        localStorage.setItem(key, JSON.stringify(updated));
    }

    const handleBoardCreated = (newBoard: any) => {
        setWorkspaceBoards(prev => [newBoard, ...prev]);
        //handleBoardOpen(newBoard); 
    };

    return (
        <div className="flex h-screen w-full bg-[#1d2125] text-[#b6c2cf] overflow-hidden">
            <main className="flex-1 overflow-y-auto px-32 py-10">

                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4 pl-10">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-md bg-[#1db954] flex items-center justify-center text-black text-2xl font-bold">
                                P
                            </div>
                            <span className="text-[#b6c2cf] text-md font-bold">
                                Рабочее пространство Cardify
                            </span>
                        </div>
                    </div>
                </section>

                <div className="border-t border-[#2c333a] mb-8" />

                <section>
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[#b6c2cf] text-md font-bold">
                                Доски
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Spinner className="size-5" />
                        </div>
                    ):(
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {workspaceBoards.map((board) => (
                                <BoardCard
                                    key={board.id}
                                    board={board}
                                    onClick={() => handleBoardOpen(board)}
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
                                    onCreated={handleBoardCreated}
                                />
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
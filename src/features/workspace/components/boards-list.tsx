"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { BoardCard } from "@components/";
import { CreateBoardPanel } from "@/features/board/components/create-board-panel";
import { Board } from "@shared/types";

interface Props {
    initialBoards: Board[];
    workspaceId: string;
}

export function BoardsList({ initialBoards, workspaceId }: Props) {
    const { data: session } = useSession();
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [showCreateBoard, setShowCreateBoard] = useState(false);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    function handleBoardOpen(board: Board) {
        if (!session?.user?.id) return;
    }

    const handleBoardCreated = (newBoard: Board) => {
        setBoards(prev => [newBoard, ...prev]);
    };

    return (
        <section>
            <span className="text-[#b6c2cf] text-md font-bold mb-5 block">Доски</span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
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
                    {/* <span className="text-xs text-[#8c9bab]">Осталось: 6</span> */}
                </div>

                {showCreateBoard && (
                    <CreateBoardPanel
                        triggerRef={triggerRef}
                        onClose={() => setShowCreateBoard(false)}
                        onCreated={handleBoardCreated}
                        workspaceId={workspaceId}
                    />
                )}
            </div>
        </section>
    );
}
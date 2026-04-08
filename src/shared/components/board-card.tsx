import Link from "next/link";
import { Card, CardHeader } from "@components/ui/card";
import { slugify } from "@utils/slugify";
import { Board } from "../types";
import ToggleChoosen from "./toggle-choosen";
import { useBoardActions } from "../hooks/use-board-actions";
import { PAGES } from "@/config/pages.config";

interface BoardCardProps {
    board: Board;
    onClick: () => void;
}

export function BoardCard({ board, onClick }: BoardCardProps) {
    const { handleToggleIsChoosen } = useBoardActions();

    return (
        <div onClick={onClick}>
            <Link key={board.id} href={PAGES.BOARD(board.id, slugify(board.title))}>
                <Card
                    className="py-0 rounded-sm overflow-hidden cursor-pointer bg-[#1d2125] shadow-md hover:shadow-lg transition-all duration-200 groupborder-0 group"
                >
                    <CardHeader
                        className="h-16.25 w-full group-hover:brightness-110 transition-all duration-200 justify-end"
                        style={{
                            background: board.isPhoto ? `url(${board.bg}) center/cover no-repeat` : board.bg,
                        }}
                    >
                        <ToggleChoosen 
                            boardId={board.id}
                            onToggle={handleToggleIsChoosen}
                            initialPressed={board.isChoosen}
                        />
                    </CardHeader>

                    <div className="px-2">
                        <p className="text-[15px] font-semibold text-[#b6c2cf] truncate">
                            {board.title}
                        </p>
                    </div>
                    
                </Card>
            </Link>
        </div>
    );
}
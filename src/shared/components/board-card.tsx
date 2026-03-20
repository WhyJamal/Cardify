import Link from "next/link";
import { Card, CardHeader } from "@/shared/components/ui/card";
import { slugify } from "@/shared/utils/slugify";
import { Board } from "../types";

interface BoardCardProps {
    board: Board;
    onClick: () => void;
}

export function BoardCard({ board, onClick }: BoardCardProps) {
    return (
        <div onClick={onClick}>
            <Link key={board.id} href={`/b/${board.id}/${slugify(board.title)}`}>
                <Card
                    className="py-0 rounded-sm overflow-hidden cursor-pointer bg-[#1d2125] shadow-md hover:shadow-lg transition-all duration-200 groupborder-0"
                >
                    <CardHeader
                        className="h-16.25 w-full group-hover:brightness-110 transition-all duration-200"
                        style={{
                            background: board.isPhoto ? `url(${board.bg}) center/cover no-repeat` : board.bg,
                        }}
                    >
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
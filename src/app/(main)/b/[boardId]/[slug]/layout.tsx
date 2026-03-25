import { Suspense } from "react";
import { Header, SubHeader } from "@/shared/components";
import { BoardProvider } from "@/app/providers/BoardProvider";
import { serverFetch } from "@/lib/server-api";
import Loading from "./loading";

async function fetchBoardView(boardId: number) {
    const [board, columns] = await Promise.all([
        serverFetch(`/api/boards/${boardId}`),
        serverFetch(`/api/columns?boardId=${boardId}`),
    ]);

    return {
        board: board.board ?? board,
        columns: columns.columns ?? [],
    };
}

export default async function BoardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { boardId: string; slug: string };
}) {
    const { boardId } = await params;
    const id = Number(boardId);

    return (
        <Suspense fallback={<Loading />}>
            <BoardDataLoader boardId={id}>
                {children}
            </BoardDataLoader>
        </Suspense>
    );
}

async function BoardDataLoader({
    boardId,
    children,
}: {
    boardId: number;
    children: React.ReactNode;
}) {
    const data = await fetchBoardView(boardId);

    return (
        <BoardProvider initialBoard={data.board} initialColumns={data.columns}>
            <div className="h-screen w-screen flex flex-col overflow-hidden">
                <Header />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <SubHeader />
                    {children}
                </div>
            </div>
        </BoardProvider>
    );
}
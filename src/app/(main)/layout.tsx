import { BoardProvider } from "../providers/BoardProvider";

export default function MainBoardLayout({
    children,
    modal
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <BoardProvider
            initialBoard={null}
            initialColumns={[]}
        >
            {children}
            {modal}
        </BoardProvider>
    );
}
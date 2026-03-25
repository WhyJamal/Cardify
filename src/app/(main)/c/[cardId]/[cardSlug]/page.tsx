import { redirect, notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-api";

async function getCardById(cardId: string) {
    const res = await serverFetch(`/api/cards/${cardId}/location`);
    return res; // { boardId, boardSlug }
}

export default async function CardDeepLinkPage({
    params,
}: {
    params: Promise<{ cardId: string; cardSlug: string }>;
}) {
    const { cardId, cardSlug } = await params;

    try {
        const card = await serverFetch(`/api/cards/${cardId}/location`);

        if (!card?.boardId || !card?.boardSlug) {
            notFound();
        }

        redirect(
            `/b/${card.boardId}/${card.boardSlug}?openCardPath=/c/${cardId}/${cardSlug}`
        );
    } catch {
        notFound();
    }
}
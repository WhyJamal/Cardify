import { redirect, notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-api";
import { PAGES } from "@/config/pages.config";
import { slugify } from "@utils/slugify";

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

    const card = await serverFetch(`/api/cards/${cardId}/location`);

    if (!card?.boardId || !card?.boardSlug) {
        notFound();
    }

    redirect(
        `${PAGES.BOARD(card.boardId, slugify(card.boardSlug))}?openCardPath=${PAGES.CARD(cardId, slugify(cardSlug))}`
    );
}
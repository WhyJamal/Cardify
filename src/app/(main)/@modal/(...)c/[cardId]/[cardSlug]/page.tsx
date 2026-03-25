import CardClient from "./card-client";
import { CardData } from "@/shared/types";
import { serverFetch } from "@/lib/server-api";

export default async function CardMoadal(
    { params }: { params: Promise<{ cardId: string; cardSlug: string }>; 
}) {
    const { cardId } = await params;

    const card: CardData = await serverFetch(`/api/cards/${cardId}`);

    return <CardClient cardId={cardId} initialCard={card}/>    
}
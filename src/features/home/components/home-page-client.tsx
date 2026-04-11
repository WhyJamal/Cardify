"use client";

import { useState } from "react";
import { Clock, Heart, ChevronDown } from "lucide-react";
import { CardData, TaskActionStatus } from "@shared/types";
import { AttentionTaskCard, HighlightTaskCard } from "./task-card";
import { RecentBoardsSidebar } from "./recent-boards-sidebar";
import { clientFetch } from "@/lib/client-api";
import Image from "next/image";
import { cardApi } from "@/features/card/api/card-api";
import { useCardActions } from "@/shared/hooks/use-card-actions";

const INITIAL_VISIBLE = 1;

interface HomePageClientProps {
    userId: string;
    initialAttentionCards: CardData[];
    initialHighlightCards: CardData[];
}

export function HomePageClient({
    userId,
    initialAttentionCards,
    initialHighlightCards,
}: HomePageClientProps) {
    const [attentionCards, setAttentionCards] = useState<CardData[]>(initialAttentionCards);
    const [highlightCards, setHighlightCards] = useState<CardData[]>(initialHighlightCards);
    const [showAllAttention, setShowAllAttention] = useState(false);
    const { toggleIsCompleted } = useCardActions();

    const handleTaskAction = async (cardId: string, status: TaskActionStatus) => {
        try {
            await clientFetch(`/api/user/tasks/${cardId}`, {
                method: "POST",
                body: JSON.stringify({ status }),
            });

            if (status === "COMPLETED") {
                await toggleIsCompleted(cardId, true);
            }

            if (status === "DISMISSED") {
                setAttentionCards((prev) => prev.filter((c) => c.id !== cardId));
            }
            if (status === "PENDING") {
                const res = await clientFetch("/api/user/tasks?type=highlights");
                const data = await res.json();
                setHighlightCards(data.cards || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRepeatSubmit = async (cardId: string, comment: string) => {
        const newComment = await cardApi.addTimelineComment(cardId, comment);
        return newComment;
    };

    const visibleAttention = showAllAttention
        ? attentionCards
        : attentionCards.slice(0, INITIAL_VISIBLE);

    const hiddenCount = attentionCards.length - INITIAL_VISIBLE;

    return (
        <div className="h-screen w-full pb-10 flex items-start justify-center pt-8 px-10 bg-[#1d2125] overflow-y-auto">
            <div className="w-full max-w-5xl flex gap-32">

                <div className="flex-1 max-w-xl max-h-screen pb-24 px-2">
                    <div className="flex flex-col space-y-4">

                        {attentionCards.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-gray-300 text-sm">Требуют внимания</span>
                                </div>

                                {visibleAttention.map((card) => (
                                    <AttentionTaskCard
                                        key={card.id}
                                        card={card}
                                        onComplete={() => handleTaskAction(card.id, "COMPLETED")}
                                        onDismiss={() => handleTaskAction(card.id, "DISMISSED")}
                                        onComment={handleRepeatSubmit}
                                    />
                                ))}

                                {!showAllAttention && hiddenCount > 0 && (
                                    <button
                                        onClick={() => setShowAllAttention(true)}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#2c2e33] transition-colors border border-dashed border-[#3d4148]"
                                    >
                                        <ChevronDown size={15} />
                                        Показать ещё {hiddenCount}{" "}
                                        {hiddenCount === 1 ? "задачу" : hiddenCount < 5 ? "задачи" : "задач"}
                                    </button>
                                )}

                                {showAllAttention && attentionCards.length > INITIAL_VISIBLE && (
                                    <button
                                        onClick={() => setShowAllAttention(false)}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#2c2e33] transition-colors"
                                    >
                                        Свернуть
                                    </button>
                                )}
                            </section>
                        )}

                        {highlightCards.length > 0 && (
                            <section className="flex flex-col pb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart size={16} className="text-gray-400" />
                                    <span className="text-gray-300 text-sm">Основные моменты</span>
                                </div>

                                {highlightCards.map((card) => (
                                    <HighlightTaskCard
                                        key={card.id}
                                        card={card}
                                        onComment={handleRepeatSubmit}
                                    />
                                ))}
                            </section>
                        )}

                        {attentionCards.length === 0 && highlightCards.length === 0 && (
                            <div
                                className="rounded-lg py-5 mb-4 flex flex-col gap-4 bg-[#2c2e33] justify-center items-center text-white/80 font-medium"
                            >
                                <h1 className="text-sm text-center">
                                    Когда вы будете добавлены в контрольный список, он появится здесь.
                                </h1>

                                <Image
                                    src="/images/pet/workspace-snow-leopart.webp"
                                    alt="workspace snow leopard"
                                    width={420}
                                    height={220}
                                    className="w-full"
                                    priority
                                />

                                <h1 className="text-md font-semibold">
                                    Будьте в курсе событий
                                </h1>

                                <p className="text-xs px-6 text-center text-white/60">
                                    Приглашайте людей на форумы и открытки, оставляйте комментарии,
                                    указывайте сроки выполнения, и мы покажем здесь наиболее важные действия.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <RecentBoardsSidebar userId={userId} />
            </div>


        </div>
    );
}
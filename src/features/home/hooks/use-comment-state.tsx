import { CardTimeline } from "@/shared/types";
import { useState } from "react";

function useCommentState(
    initialComments: CardTimeline[],
    cardId: string,
    onComment: (cardId: string, comment: string) => Promise<CardTimeline>,
    onSuccess?: () => void,
) {
    const [showReply, setShowReply] = useState(false);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<CardTimeline[]>(initialComments);

    const handleSave = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        try {
            const created = await onComment(cardId, comment.trim());
            setComments((prev) => [...prev, created]);
            setComment("");
            setShowReply(false);
            onSuccess?.();
        } finally {
            setLoading(false);
        }
    };

    return {
        showReply, setShowReply,
        comment, setComment,
        loading, comments,
        handleSave,
    };
}

export { useCommentState };
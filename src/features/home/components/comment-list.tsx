import { CardTimeline } from "@shared/types";
import { useSession } from "next-auth/react";

function CommentList({ comments }: { comments: CardTimeline[] }) {
    const { data: session } = useSession();
    if (comments.length === 0) return null;

    return (
        <div className="px-4 pb-2 flex flex-col gap-3 bg-[#2c2e33]">
            {comments.map((c, i) => {
                const isOwner = session?.user?.id === c.user?.id;
                return (
                    <div key={i} className={`flex w-full gap-2 ${isOwner ? "justify-end" : "justify-start"}`}>
                        {!isOwner && (
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-1">
                                {c.initials || "CC"}
                            </div>
                        )}
                        <div className="max-w-[70%] px-3 py-2 rounded-lg text-gray-200 text-sm min-w-0 wrap-break-word whitespace-pre-wrap">
                            <div>{c.text || c.activityText}</div>
                            <div className={`text-[10px] opacity-60 mt-1 ${isOwner ? "text-right" : "text-left"}`}>
                                {c.authorName}
                            </div>
                        </div>
                        {isOwner && (
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-1">
                                {c.initials || "CC"}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export { CommentList };
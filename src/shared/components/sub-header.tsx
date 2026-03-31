"use client";

import {
  Activity,
  Filter,
  Zap,
  Star,
  Users,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { useBoardView } from "@/app/providers/BoardProvider";
import { Spinner } from "./ui/spinner";
import { darkenHex, getTopPixelAverageColor, getContrastColor } from "../utils/getColor";
import { useEffect, useState } from "react";
import { getInitials } from "../utils/getInitials";

interface BoardSubHeaderProps {
  onAddColumn?: () => void;
}

export function SubHeader({ onAddColumn }: BoardSubHeaderProps) {
  const { board } = useBoardView();
  const [textColor, setTextColor] = useState("black");

  useEffect(() => {
    if (board?.isPhoto && board.bg) {
      getTopPixelAverageColor(board.bg).then(color => setTextColor(color));
    } else if (board?.bg) {
      setTextColor(getContrastColor(board.bg));
    }
  }, [board]);

  function darkenGradient(gradient: string, percent: number) {
    return gradient.replace(/#([0-9a-fA-F]{6})/g, (match) =>
      darkenHex(match, percent)
    );
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 shrink-0 backdrop-blur-xl absolute w-full
        ${board?.isPhoto ? `text-${textColor} border border-black/10` : "text-white"}
      `}
      style={{
        background: board?.bg
          ? darkenGradient(board?.bg ?? "linear-gradient(135deg, #1a2a4a 0%, #0d1b35 100%)", 10)
          : "",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="flex items-center gap-2"
      >
        <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors">
          <span className="font-semibold text-base">
            {board ? board.title : <Spinner />}
          </span>
        </button>
        <div className="w-px h-5 bg-white/20" />
        <button className="p-1.5 rounded hover:bg-white/10 text-white/80 transition-colors">
          <Activity size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">

        {board?.members && board.members.length > 0 && (
          <div className="flex -space-x-2">
            {board.members.map((member) => (
              <div
                key={member.id}
                className="w-7 h-7 rounded-full bg-green-700 flex justify-center items-center text-xs font-medium border border-green-800"
              >
                {getInitials(member.user.name || "")}
              </div>
            ))}
          </div>
        )}


        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
          <Star size={14} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
          <Zap size={14} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
          <Filter size={14} />
          <span className="hidden md:inline">Фильтры</span>
        </button>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
          <Users size={14} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 text-sm transition-colors">
          <Share2 size={14} />
          <span className="hidden md:inline">Поделиться</span>
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
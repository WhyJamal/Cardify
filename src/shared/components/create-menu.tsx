"use client";

import { useEffect, useRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { LayoutDashboard, Users, Copy } from "lucide-react";
import { calcBelowPosition } from "@utils/floatingPosition";

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 240;

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
  onCreateBoard: () => void;
  onCreateWorkspace: () => void;
  onClose: () => void;
}

export function CreateMenu({ triggerRef, onCreateBoard, onCreateWorkspace, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  const pos = (() => {
    if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };
    return calcBelowPosition(triggerRef.current.getBoundingClientRect(), PANEL_WIDTH, PANEL_HEIGHT);
  })();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, triggerRef]);

  return createPortal(
    <div
      ref={panelRef}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: PANEL_WIDTH, zIndex: 99998 }}
      className="bg-[#282e33] rounded-lg shadow-2xl border border-white/10 overflow-hidden py-2"
    >
      <p className="px-4 py-1.5 text-[11px] text-white/40 uppercase tracking-wider">Создать</p>

      <button
        onClick={onCreateBoard}
        className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors text-left"
      >
        <div className="mt-0.5 w-8 h-6 rounded bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
          <LayoutDashboard size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm">Доска</p>
          <p className="text-white/50 text-xs mt-0.5 leading-4">Доска — это место для организации задач и отслеживания проекта.</p>
        </div>
      </button>

      <button 
        onClick={onCreateWorkspace}
        className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors text-left"
      >
        <div className="mt-0.5 w-8 h-6 rounded bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          <Users size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm">Рабочее пространство</p>
          <p className="text-white/50 text-xs mt-0.5 leading-4">Совместная работа с командой в одном пространстве.</p>
        </div>
      </button>

      <button className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors text-left">
        <div className="mt-0.5 w-8 h-6 rounded bg-linear-to-br from-emerald-500 to-teal-400 flex items-center justify-center shrink-0">
          <Copy size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm">Начать с шаблона</p>
          <p className="text-white/50 text-xs mt-0.5 leading-4">Быстрый старт с готовым шаблоном сообщества.</p>
        </div>
      </button>
    </div>,
    document.body
  );
}

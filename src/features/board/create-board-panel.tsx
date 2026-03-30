"use client";

import { useEffect, useRef, useState, RefObject, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingBag } from "lucide-react";
import { FloatingBgPanel } from "./floating-bg-panel";
import { calcSidePosition } from "@/shared/utils/floatingPosition";
import { useRouter } from "next/navigation";
import { slugify } from "@/shared/utils/slugify";
import { clientFetch } from "@/lib/client-api";
import CustomSelect from "@/shared/components/ui/custom-select";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";

const PANEL_WIDTH = 370;
const PANEL_HEIGHT = 590;

const PHOTO_THUMBS = [
  "/images/board-backgrounds/tropical-beach-samoa.webp",
  "/images/board-backgrounds/laptop-coffee-cups-notepads-black-background-top-view.webp",
  "/images/board-backgrounds/beautiful-shot-himalayas-mountains-clouds.webp",
  "/images/board-backgrounds/messy-office-desk-still-life.webp",
];

const GRADIENT_COLORS = [
  { id: "g1", style: "linear-gradient(135deg, #2c3e50 0%, #1a2533 100%)" },
  { id: "g2", style: "linear-gradient(135deg, #5a2d82 0%, #7b3fa0 25%, #9b4db5 45%, #c762c8 70%, #d97bb6 100%)" },
  { id: "g3", style: "linear-gradient(135deg, #2c3e6e 0%, #1a237e 100%)" },
  { id: "g4", style: "linear-gradient(135deg, #7c4dff 0%, #651fff 100%)" },
  { id: "g5", style: "linear-gradient(135deg, #e040fb 0%, #7c4dff 100%)" },
];

interface BoardForm {
  title: string;
  bg: string;
  isBgPhoto: boolean;
  workspaceId: string | null;
}

const INITIAL_FORM: BoardForm = {
  title: "",
  bg: PHOTO_THUMBS[1],
  isBgPhoto: true,
  workspaceId: null,
};

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onCreated: (board: any) => void;
}

export function CreateBoardPanel({ triggerRef, onClose, onCreated }: Props) {
  const { workspaces } = useWorkspace();
  const [form, setForm] = useState<BoardForm>(INITIAL_FORM);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const router = useRouter();

  const panelRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLDivElement>(null);

  const setField = <K extends keyof BoardForm>(key: K, value: BoardForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectBg = (bg: string, isBgPhoto: boolean) => {
    setForm((prev) => ({ ...prev, bg, isBgPhoto }));
  };

  const workspaceOptions = workspaces.map((ws) => ({
    value: ws.id,
    label: ws.name,
  }));

  const [pos, setPos] = useState({ left: 0, top: 0, maxHeight: PANEL_HEIGHT });

  useLayoutEffect(() => {
    const compute = () => {
      const triggerEl = triggerRef?.current;
      if (!triggerEl) {
        setPos({ left: 0, top: 0, maxHeight: PANEL_HEIGHT });
        return;
      }
      const rect = triggerEl.getBoundingClientRect();
      const fallbackRect = panelRef.current?.getBoundingClientRect();

      const calculated = calcSidePosition(rect, PANEL_WIDTH, PANEL_HEIGHT, { fallbackRect });
      const dynamicMaxHeight = window.innerHeight - calculated.top - 12;

      setPos({
        ...calculated,
        top: 12,
        maxHeight: Math.max(320, dynamicMaxHeight),
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (triggerRef.current) ro.observe(triggerRef.current);
    if (panelRef.current) ro.observe(panelRef.current);

    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
      ro.disconnect();
    };
  }, [triggerRef]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const floatingBgEl = document.querySelector("[data-floating-bg-panel]") as HTMLElement | null;

      const insidePanel = panelRef.current?.contains(target) || floatingBgEl?.contains(target);
      const insideTrigger =
        triggerRef.current?.contains(target) || moreButtonRef.current?.contains(target);

      if (!insidePanel && !insideTrigger) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, triggerRef]);

  const handleCreateBoard = async () => {
    if (!form.title.trim()) return;

    const res = await clientFetch("/api/boards", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        bg: form.bg,
        isPhoto: form.isBgPhoto,
        workspaceId: form.workspaceId ?? "",
      }),
    });

    router.push(`/b/${res.board.id}/${slugify(res.board.title)}`);
    onCreated(res.board);
    onClose();
    setForm(INITIAL_FORM);
  };

  const panel = (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        maxHeight: pos.maxHeight,
        zIndex: 99998,
      }}
      className="bg-[#2c2c2c] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      <div
        ref={moreButtonRef}
        className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0"
      >
        <span className="text-white text-sm">Создать доску</span>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="overflow-y-scroll max-h-[600] flex-1">
        <div className="mx-5 mt-4 rounded-lg overflow-hidden h-35 relative">
          {form.isBgPhoto ? (
            <img src={form.bg} alt="bg" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: form.bg }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-14 bg-white/30 rounded p-1.5 flex flex-col gap-1">
                  <div className="h-1.5 bg-white/60 rounded" />
                  <div className="h-1 bg-white/40 rounded w-3/4" />
                  <div className="h-1 bg-white/40 rounded w-1/2" />
                  <div className="mt-1 h-1.5 bg-white/60 rounded" />
                  <div className="h-1 bg-white/40 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 mt-4">
          <span className="text-white/70 text-xs">Фон</span>
          <div className="mt-2 flex gap-2 items-center">
            {PHOTO_THUMBS.map((url, i) => (
              <button
                key={i}
                onClick={() => handleSelectBg(url, true)}
                className={`w-10 h-8 rounded overflow-hidden border-2 transition-all ${
                  form.bg === url && form.isBgPhoto ? "border-white" : "border-transparent"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setShowBgPanel((v) => !v)}
              className={`w-10 h-8 rounded transition-colors flex items-center justify-center text-white/70 text-xs font-bold ${
                showBgPanel ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              •••
            </button>
          </div>
          <div className="mt-2 flex gap-2 items-center">
            {GRADIENT_COLORS.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelectBg(g.style, false)}
                className={`w-10 h-8 rounded border-2 transition-all ${
                  form.bg === g.style && !form.isBgPhoto ? "border-white" : "border-transparent"
                }`}
                style={{ background: g.style }}
              />
            ))}
          </div>
        </div>

        <div className="px-5 mt-4">
          <label className="text-white/90 text-xs">
            Заголовок доски <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            className="mt-1.5 w-full bg-transparent border-2 border-red-400/70 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-400 transition-colors"
          />
          {!form.title && (
            <p className="mt-1.5 text-white/80 text-xs">👋 Укажите название доски.</p>
          )}
        </div>

        <div className="px-5 mt-4">
          <CustomSelect
            label="Рабочее пространство"
            options={workspaceOptions}
            value={form.workspaceId}
            onChange={(val) => setField("workspaceId", val)}
          />
        </div>

        <div className="px-5 mt-4">
          <p className="text-white/60 text-xs leading-5">
            В рабочее пространство можно добавить еще несколько досок — 3 доски. В бесплатной версии
            в рабочих пространствах может быть до 10 открытых досок. Чтобы добавить больше, оформите
            подписку.
          </p>
        </div>

        <div className="px-5 mt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#3a3a3a] hover:bg-[#444] border border-white/10 rounded-lg py-2.5 text-white text-sm transition-colors">
            <ShoppingBag size={14} className="text-purple-400" />
            Улучшить
          </button>
        </div>

        <div className="px-5 py-5">
          <button
            onClick={handleCreateBoard}
            disabled={!form.title}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2.5 text-white text-sm font-medium transition-colors"
          >
            Создать доску
          </button>
          <p className="text-center text-white/40 text-xs mt-2">Осталось: 10</p>
        </div>
      </div>

      {showBgPanel && (
        <FloatingBgPanel
          triggerRef={moreButtonRef}
          fallbackRef={panelRef}
          selectedBg={form.bg}
          isBgPhoto={form.isBgPhoto}
          onSelectBg={handleSelectBg}
          onClose={() => setShowBgPanel(false)}
        />
      )}
    </div>
  );

  return createPortal(panel, document.body);
}
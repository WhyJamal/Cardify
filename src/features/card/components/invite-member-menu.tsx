"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@hooks/use-outside-click";
import { calcBelowPosition } from "@utils/floatingPosition";
import { workspaceApi } from "@features/workspace/api/workspace-api";
import type { CardMember, User, WorkspaceMember } from "@shared/types";
import { Spinner } from "@components/";
import { getInitials } from "@utils/getInitials";

interface InviteMemberMenuProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  workspaceId: string;
  currentMembers: CardMember[];
  onAdd: (userId: string, user: User) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onClose: () => void;
}

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 320;

export function InviteMemberMenu({
  triggerRef,
  workspaceId,
  currentMembers,
  onAdd,
  onRemove,
  onClose,
}: InviteMemberMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useOutsideClick([panelRef, triggerRef], onClose, true);

  const pos = (() => {
    if (!triggerRef.current) return { left: 0, top: 0 };
    return calcBelowPosition(
      triggerRef.current.getBoundingClientRect(),
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
  })();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    workspaceApi
      .getWorkspaceMembers(workspaceId)
      .then((data) => setMembers(data.members ?? data))
      .catch(() => setError("Ошибка загрузки участников"))
      .finally(() => setLoadingMembers(false));
  }, [workspaceId]);

  const filtered = members.filter((m) => {
    const q = query.toLowerCase();
    return (
      m.user?.name?.toLowerCase().includes(q) ||
      m.user?.email?.toLowerCase().includes(q)
    );
  });

  async function handleToggle(wMember: WorkspaceMember) {
    const uid = wMember.user.id;
    const isAdded = currentMembers.some((m) => m.user.id === uid);
    setActing(uid);
    setError(null);
    try {
      if (isAdded) {
        await onRemove(uid);
      } else {
        await onAdd(uid, wMember.user);
      }
    } catch {
      setError("Ошибка. Попробуйте снова");
    } finally {
      setActing(null);
    }
  }

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        zIndex: 99998,
      }}
      className="bg-[#2b3035] rounded-lg shadow-xl text-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-medium">Участники</span>
        <button
          onClick={onClose}
          className="hover:bg-[#3d4954] p-1 rounded transition-colors text-[#9fadbc] hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-3 border-b border-white/10">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          placeholder="Поиск участников"
          className="w-full bg-transparent border border-[#388bff] rounded px-3 py-2 text-sm outline-none placeholder-[#9fadbc] focus:border-[#388bff]"
        />
      </div>

      <div className="max-h-52 overflow-y-auto p-2 flex flex-col gap-1">
        {loadingMembers && (
          <p className="text-xs text-[#9fadbc] text-center py-4">Загрузка...</p>
        )}

        {!loadingMembers && filtered.length === 0 && (
          <p className="text-xs text-[#9fadbc] text-center py-4">Не найдено</p>
        )}

        {filtered.map((m) => {
          const uid = m.user.id;
          const isAdded = currentMembers.some((cm) => cm.user.id === uid);
          const isLoading = acting === uid;

          return (
            <div
              key={uid}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#3d4954] transition-colors"
            >
              <button
                onClick={() => !isLoading && !isAdded && handleToggle(m)}
                disabled={isLoading}
                className="flex items-center gap-3 flex-1 min-w-0 text-left disabled:opacity-60"
              >
                <div className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center text-xs font-semibold shrink-0">
                  {getInitials(m.user?.name ?? m.user?.email ?? "?")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isAdded ? "text-white" : "text-[#9fadbc]"}`}>
                    {m.user?.name ?? "—"}
                  </p>
                  <p className="text-xs text-[#9fadbc] truncate">{m.user?.email}</p>
                </div>
              </button>
              {!isLoading && (
                <button
                  onClick={() => !isLoading && isAdded && handleToggle(m)}
                  disabled={isLoading || !isAdded}
                  className={`shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${isAdded
                    ? "text-[#9fadbc] hover:text-red-400"
                    : "text-transparent"
                    }`}
                >
                  <X size={13} />
                </button>
              )}
              {isLoading && (
                <Spinner />
              )}

            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400 px-4 pb-3">{error}</p>}
    </div>,
    document.body
  );
}
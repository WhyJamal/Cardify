"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { calcBelowPosition } from "@/shared/utils/floatingPosition";

interface InviteMemberMenuProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  boardId: number | undefined;
  onClose: () => void;
}

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 200;

export function InviteMemberMenu({
  triggerRef,
  boardId,
  onClose,
}: InviteMemberMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useOutsideClick([panelRef, triggerRef], onClose, true);

  const pos = (() => {
    if (!triggerRef.current)
      return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };
    return calcBelowPosition(
      triggerRef.current.getBoundingClientRect(),
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
  })();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  async function handleInvite() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/boards/${boardId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Xatolik yuz berdi");
      } else {
        setSuccess(true);
        setEmail("");
        setTimeout(onClose, 1200);
      }
    } catch {
      setError("Tarmoq xatosi");
    } finally {
      setLoading(false);
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

      <div className="p-3">
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInvite();
            if (e.key === "Escape") onClose();
          }}
          placeholder="Поиск участников"
          className="w-full bg-transparent border border-[#388bff] rounded px-3 py-2 text-sm outline-none placeholder-[#9fadbc] focus:border-[#388bff]"
        />

        {error && (
          <p className="text-xs text-red-400 mt-2 px-1">{error}</p>
        )}

        {success && (
          <p className="text-xs text-green-400 mt-2 px-1">
            Приглашение отправлено
          </p>
        )}

        {email.trim() && !success && (
          <button
            onClick={handleInvite}
            disabled={loading}
            className="mt-2 w-full bg-[#0052cc] hover:bg-[#0065ff] disabled:opacity-50 text-white text-sm py-2 rounded transition-colors"
          >
            {loading ? "Отправка..." : "Пригласить"}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
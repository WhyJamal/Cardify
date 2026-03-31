"use client";

import { X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { calcBelowPosition } from "@/shared/utils/floatingPosition";
import Image from "next/image";
import { Switch } from "./ui/switch";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data: string | null;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

const PANEL_WIDTH = 360;
const PANEL_HEIGHT = 480;

export function NotificationDropdown({
  triggerRef,
  onClose,
}: NotificationDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(true);

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
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications ?? []);
        setLoading(false);
      });
  }, []);

  async function respond(id: string, action: "accept" | "decline" | "dismiss") {
    await fetch(`/api/notifications/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const visible = onlyUnread
    ? notifications.filter((n) => !n.isRead)
    : notifications;

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
      className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-medium text-sm">Уведомления</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-[#9fadbc] cursor-pointer select-none">
            <span>Только непрочитанные</span>
            <Switch />
          </label>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 max-h-100">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[#9fadbc] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 gap-3 text-[#9fadbc]">
            <Image
              src={"/images/empty/sleeping-snow-leopard.png"}
              alt="empty"
              width={200}
              height={50}
            />
            <p className="text-sm">Нет непрочитанных уведомлений</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {visible.map((n) => (
              <NotificationItem key={n.id} notification={n} onRespond={respond} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function NotificationItem({
  notification: n,
  onRespond,
}: {
  notification: Notification;
  onRespond: (id: string, action: "accept" | "decline" | "dismiss") => void;
}) {
  const data = (() => {
    try {
      return JSON.parse(n.data ?? "{}");
    } catch {
      return {};
    }
  })();

  const isBoardInvite = n.type === "BOARD_INVITE";

  return (
    <div
      className={`rounded-lg p-3 transition-colors ${
        n.isRead ? "bg-transparent" : "bg-[#1d2125]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {data.boardBg && (
          <div
            className="w-8 h-8 rounded shrink-0 mt-0.5"
            style={
              data.boardIsPhoto
                ? {
                    backgroundImage: `url(${data.boardBg})`,
                    backgroundSize: "cover",
                  }
                : { background: data.boardBg }
            }
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white leading-snug">{n.title}</p>
          {n.body && (
            <p className="text-xs text-[#9fadbc] mt-0.5">{n.body}</p>
          )}

          {/* {isBoardInvite && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onRespond(n.id, "accept")}
                className="flex items-center gap-1 bg-[#1f845a] hover:bg-[#216e4e] text-white text-xs px-3 py-1.5 rounded transition-colors"
              >
                <Check size={12} />
                Принять
              </button>
              <button
                onClick={() => onRespond(n.id, "decline")}
                className="bg-[#3d4954] hover:bg-[#4c5b67] text-[#9fadbc] hover:text-white text-xs px-3 py-1.5 rounded transition-colors"
              >
                Отклонить
              </button>
            </div>
          )} */}
        </div>

        {/* × dismiss */}
        <button
          onClick={() => onRespond(n.id, "dismiss")}
          className="text-[#9fadbc] hover:text-white hover:bg-[#3d4954] p-1 rounded transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState, useRef } from "react";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { calcSidePosition } from "@/shared/utils/floatingPosition";
import { createPortal } from "react-dom";
import { KanbanSquare, X } from "lucide-react";

interface RecentLink {
    id: string;
    title: string;
    workspace: string;
    viewedAt: string;
}

const recentLinks: RecentLink[] = [
    { id: "1", title: "ads", workspace: "Моя доска Trello", viewedAt: "17 часов назад" },
    { id: "2", title: "Моя доска Trello", workspace: "Рабочее простра...", viewedAt: "17 часов назад" },
    { id: "3", title: "asd", workspace: "Моя доска Trello", viewedAt: "17 часов назад" },
    { id: "4", title: "sas", workspace: "11", viewedAt: "3 дня назад" },
    { id: "5", title: "sas", workspace: "11", viewedAt: "3 дня назад" },
    { id: "6", title: "sas", workspace: "11", viewedAt: "3 дня назад" },
    { id: "7", title: "sas", workspace: "11", viewedAt: "3 дня назад" },
];

interface AddAttachmentsProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    onClose?: () => void;
    onChange?: () => void;
}

export default function AddAttachments({ triggerRef, onClose }: AddAttachmentsProps) {
    const [link, setLink] = useState("");
    const [displayText, setDisplayText] = useState("");
    const [linkError, setLinkError] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const PANEL_WIDTH = 350;
    const PANEL_HEIGHT = 640;

    const pos = (() => {
        if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

        return calcSidePosition(
            triggerRef.current.getBoundingClientRect(),
            PANEL_WIDTH,
            PANEL_HEIGHT
        );
    })();

    const panelRef = useRef<HTMLDivElement>(null);

    useOutsideClick([panelRef, triggerRef], () => onClose?.(), true);

    const handleInsert = () => {
        if (!link.trim()) { setLinkError(true); return; }
        onClose?.();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onClose?.();
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleRecent = (item: RecentLink) => {
        setLink(`https://trello.com/${item.title}`);
        setDisplayText(item.title);
        setLinkError(false);
    };

    return createPortal(
        <div
            ref={panelRef}
            style={{
                position: "fixed",
                left: pos.left,
                top: pos.top,
                width: PANEL_WIDTH,
                maxHeight: Math.max(240, pos.maxHeight - 80),
                zIndex: 99999,
            }}
            className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col"
        > {/* 1d2125 */}

            <div className="relative flex items-center justify-center border-b border-[#38414a] px-4 py-3">
                <span className="text-[14px] font-semibold text-[#b6c2cf]">
                    Прикрепить
                </span>
                <button
                    onClick={() => onClose?.()}
                    className="absolute right-3 flex h-7 w-7 items-center justify-center rounded text-[#b6c2cf] hover:bg-[#38414a]"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="px-4 py-3 overflow-y-auto">

                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
                <p className="text-[14px] font-bold text-[#b6c2cf]">
                    Прикрепить файл с компьютера
                </p>
                <p className="mt-0.5 text-[12px] text-[#8c9bab]">
                    Вы также можете перетащить файлы для загрузки.
                </p>
                <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 w-full rounded bg-[#38414a] py-2.25 text-[14px] font-medium text-[#b6c2cf] hover:bg-[#454f59]"
                >
                    Выбрать файл
                </button>

                <div className="my-3 h-px bg-[#38414a]" />

                <label className="text-[14px] font-bold text-[#b6c2cf]">
                    Найти или вставить ссылку{" "}
                    <span className="text-[#f87168]">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Найдите последние ссылки или вставьте новую"
                    value={link}
                    onChange={(e) => { setLink(e.target.value); setLinkError(false); }}
                    className={[
                        "mt-1.5 w-full rounded bg-[#22272b] px-3 py-2 text-[13px] text-[#b6c2cf] outline-none placeholder:text-[#596773]",
                        linkError
                            ? "border border-[#f87168]"
                            : "border border-[#738496] focus:border-[#579dff]",
                    ].join(" ")}
                />
                {linkError && (
                    <p className="mt-1 text-[12px] text-[#f87168]">
                        Введите корректную ссылку
                    </p>
                )}

                <label className="mt-3 block text-[14px] font-bold text-[#b6c2cf]">
                    Отображаемый текст (необязательно)
                </label>
                <input
                    type="text"
                    placeholder="Текст для отображения"
                    value={displayText}
                    onChange={(e) => setDisplayText(e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#38414a] bg-[#22272b] px-3 py-2 text-[13px] text-[#b6c2cf] outline-none placeholder:text-[#596773] focus:border-[#579dff]"
                />
                <p className="mt-1 text-[12px] text-[#8c9bab]">
                    Дайте ссылке название или описание
                </p>

                <p className="mt-3 text-[14px] font-bold text-[#b6c2cf]">
                    Недавно просмотренные
                </p>
                <div className="mt-1 flex flex-col">
                    {recentLinks.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleRecent(item)}
                            className="flex items-center gap-3 rounded px-1 py-2 text-left hover:bg-[#38414a]"
                        >
                            <span className="shrink-0 text-[#579dff]">
                                <KanbanSquare />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[14px] font-medium text-[#b6c2cf] truncate">
                                    {item.title}
                                </p>
                                <p className="text-[12px] text-[#8c9bab]">
                                    {item.workspace}
                                    <span className="mx-1">·</span>
                                    {item.viewedAt}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#38414a] px-4 py-3">
                <button
                    onClick={() => onClose?.()}
                    className="rounded px-4 py-1.75 text-[14px] font-medium text-[#b6c2cf] hover:bg-[#38414a]"
                >
                    Отмена
                </button>
                <button
                    onClick={handleInsert}
                    className="rounded bg-[#579dff] px-4 py-1.75 text-[14px] font-bold text-[#1d2125] hover:bg-[#85b8ff]"
                >
                    Вставить
                </button>
            </div>

        </div>,
        document.body
    );
}
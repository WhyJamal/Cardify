"use client";

import { useState, useRef, useEffect } from "react";
import AddAttachments from "./add-attachments";
import { useCardClient } from "@features/card/hooks/use-card-client";
import { CardAttachment, CardData, CardLink } from "@shared/types";
import { Ellipsis, ExternalLinkIcon, Paperclip, SearchIcon, Trash2 } from "lucide-react";
import { cardApi } from "@features/card/api/card-api";
import { formatCardDate } from "@utils/date";
import { Button } from "@/shared/components";

interface ListAttachmentsProps {
    initialCard: CardData;
    cardId: string;
}

export default function ListAttachments({ initialCard, cardId }: ListAttachmentsProps) {
    const {
        showAttach,
        attachBtnRef,
        addAttachments,
        handleCloseAttach,
    } = useCardClient(initialCard, cardId);

    const [links, setLinks] = useState<CardLink[]>(initialCard.links ?? []);
    const [files, setFiles] = useState<CardAttachment[]>(initialCard.attachments ?? []);

    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;

    const handleDeleteAttachment = async (attachmentId: string) => {
        await cardApi.deleteAttachment(cardId, attachmentId);
        setFiles(prev => prev.filter(f => f.id !== attachmentId));
    };

    const handleDeleteLink = async (linkId: string) => {
        await cardApi.deleteLink(cardId, linkId);
        setLinks(prev => prev.filter(l => l.id !== linkId));
    };

    const getExt = (fileName: string) => {
        const parts = fileName.split(".");
        return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-[#1d2125] pt-20">

            <div className="w-full">

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#b6c2cf]">
                        <Paperclip className="w-5 h-5" />
                        <span className="text-[16px] font-semibold text-[#b6c2cf]">Вложения</span>
                    </div>
                    <Button
                        size={"xl"}
                        ref={attachBtnRef}
                        onClick={addAttachments}
                    >
                        Добавить
                    </Button>
                </div>

                {hasLinks && (
                    <div className="mb-5">
                        <p className="mb-2 text-[13px] font-bold text-[#b6c2cf]">Ссылки</p>
                        <div className="overflow-hidden rounded-lg border border-[#38414a]">
                            {links.map((link, i) => (
                                <div
                                    key={link.id}
                                    className={`flex items-center gap-3 bg-[#22272b] px-4 py-3 ${i < links.length - 1 ? "border-b border-[#38414a]" : ""
                                        }`}
                                >
                                    <span className="shrink-0 text-[#579dff]"><SearchIcon className="w-4 h-4" /></span>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 truncate text-[14px] text-[#579dff] hover:underline"
                                    >
                                        {link.text}
                                    </a>
                                    <DotMenu onDelete={() => handleDeleteLink(link.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasFiles && (
                    <div className="mb-5">
                        <p className="mb-2 text-[13px] font-bold text-[#b6c2cf]">Файлы</p>
                        <div className="flex flex-col gap-2">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-4 rounded-lg bg-[#22272b] px-4 py-3">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#2c333a] text-[11px] font-bold text-[#b6c2cf]">
                                        {getExt(file.fileName)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[14px] font-semibold text-[#b6c2cf]">{file.fileName}</p>
                                        <p className="text-[12px] text-[#8c9bab]">{formatCardDate(file.createdAt)}</p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-7 w-7 items-center justify-center rounded text-[#8c9bab] hover:bg-[#38414a] hover:text-[#b6c2cf]"
                                        >
                                            <ExternalLinkIcon className="w-4 h-4" />
                                        </a>
                                        <DotMenu onDelete={() => handleDeleteAttachment(file.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAttach && (
                <AddAttachments
                    triggerRef={attachBtnRef}
                    onClose={handleCloseAttach}
                    cardId={cardId}
                    onSuccess={(att) => setFiles(prev => [...prev, att])}
                    onSuccessLink={(link) => setLinks(prev => [...prev, link])}
                />
            )}

        </div>
    );
}

function DotMenu({ onDelete }: { onDelete: () => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-7 w-7 items-center justify-center rounded text-[#8c9bab] hover:bg-[#38414a] hover:text-[#b6c2cf]"
            >
                <Ellipsis className="w-4 h-4" />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-20 w-36 rounded bg-[#2c333a] py-1 shadow-xl">
                    <button
                        onClick={() => { onDelete(); setOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-[#f87168] hover:bg-[#38414a]"
                    >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
}
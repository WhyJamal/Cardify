"use client";

import { useState, useRef, useEffect } from "react";

interface LinkItem {
    id: string;
    title: string;
    url: string;
    addedAt: string;
}

interface FileItem {
    id: string;
    name: string;
    ext: string;
    url: string;
    addedAt: string;
}

const PaperclipIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const DotsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
);

const ExternalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

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
                <DotsIcon />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-20 w-36 rounded-md bg-[#2c333a] py-1 shadow-xl ring-1 ring-black/30">
                    <button
                        onClick={() => { onDelete(); setOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-[#f87168] hover:bg-[#38414a]"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ListAttachments() {
    const [links, setLinks] = useState<LinkItem[]>([
        { id: "1", title: "czxcczxc", url: "https://czxcczxc.com", addedAt: "17 часов назад" },
        { id: "2", title: "photo - Bing", url: "https://bing.com/images", addedAt: "17 часов назад" },
        { id: "3", title: "photo - Bing", url: "https://bing.com/images", addedAt: "17 часов назад" },
    ]);
    const [files, setFiles] = useState<FileItem[]>([
        { id: "1", name: "employees.txt", ext: "TXT", url: "#", addedAt: "Только что добавлено" },
        { id: "2", name: "employees.txt", ext: "TXT", url: "#", addedAt: "Только что добавлено" },
    ]);

    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;

    return (
        <div className="flex min-h-screen items-start justify-center bg-[#1d2125] pt-20">

            <div className="w-full">

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#b6c2cf]">
                        <PaperclipIcon />
                        <span className="text-[16px] font-semibold text-[#b6c2cf]">Вложения</span>
                    </div>
                    <button
                        onClick={() => { }}
                        className="bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                    >
                        Добавить
                    </button>
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
                                    <span className="shrink-0 text-[#579dff]"><SearchIcon /></span>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 truncate text-[14px] text-[#579dff] hover:underline"
                                    >
                                        {link.title}
                                    </a>
                                    <DotMenu onDelete={() => { }} />
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
                                        {file.ext}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[14px] font-semibold text-[#b6c2cf]">{file.name}</p>
                                        <p className="text-[12px] text-[#8c9bab]">{file.addedAt}</p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-7 w-7 items-center justify-center rounded text-[#8c9bab] hover:bg-[#38414a] hover:text-[#b6c2cf]"
                                        >
                                            <ExternalIcon />
                                        </a>
                                        <DotMenu onDelete={() => { }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { calcSidePosition } from "@utils/floatingPosition";
import { useOutsideClick } from "@hooks/use-outside-click";
import { Button } from "@components";
import { CardData, SizeOption } from "@shared/types";
import { UNSPLASH_PHOTOS } from "@data/photos.data";
import { COVER_COLORS } from "@data/colors.data";



interface CoverSettingsProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
    currentBackground?: string | null;
    onSetBackground: (background: string, isImage?: boolean, size?: "WIDE" | "TALL", textColor?: string) => void;
    onRemoveBackground: () => void;
    onUploadCover: (file: File) => void;
    card: CardData;
}

export default function CoverSettings({
    triggerRef,
    onClose,
    currentBackground,
    onSetBackground,
    onRemoveBackground,
    onUploadCover,
    card
}: CoverSettingsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const initialColorId =
        COVER_COLORS.find((c) => c.hex === currentBackground)?.id ?? "green";

    const [selectedColor, setSelectedColor] = useState<string>(initialColorId);
    const [selectedSize, setSelectedSize] = useState<SizeOption>(card.size ?? "WIDE");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

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

    useOutsideClick([panelRef, triggerRef], () => onClose?.());

    const handleColorClick = (colorId: string) => {
        const found = COVER_COLORS.find((c) => c.id === colorId);
        if (!found) return;
        setSelectedColor(colorId);
        onSetBackground(found.hex, false, selectedSize, card.textColor ?? "light");
    };

    const handlePhotoClick = (url: string) => {
        onSetBackground(url, true, selectedSize, card.textColor ?? "light");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadCover(file);
            onClose();
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 1000);
    };

    const currentColorObj = COVER_COLORS.find((c) => c.id === selectedColor) ?? COVER_COLORS[0];

    return createPortal(
        <div
            ref={panelRef}
            style={{
                position: "fixed",
                left: pos.left,
                top: pos.top,
                width: PANEL_WIDTH,
                maxHeight: Math.max(240, pos.maxHeight - 90),
                zIndex: 99999,
            }}
            className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-white text-sm font-semibold tracking-wide">Обложка</span>
                <button
                    onClick={onClose}
                    className="text-white/40 hover:text-white/80 transition-COVER_COLORS text-lg leading-none"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-3 space-y-4 overflow-y-auto">
                <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-medium">
                        Размер
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedSize("WIDE");
                                if (currentBackground) {
                                    onSetBackground(currentBackground, card?.isImage ?? false, "WIDE", "light");
                                }
                            }}
                            className={`flex-1 h-16 rounded-md flex items-end transition-all border hover:ring-1 ${selectedSize === "WIDE"
                                ? "border-white/70 ring-2 ring-white"
                                : "border-white/10 hover:border-white/30"
                                } ${currentColorObj.bg}`}
                        >
                            <div className="flex flex-col gap-1 w-full bg-[#160d0d] justify-start h-8 rounded-md p-1">
                                <div className="h-0.75 rounded-full bg-white/60 w-3/4" />
                                <div className="h-0.75 rounded-full bg-white/40 w-2/3" />
                                <div className="flex justify-between">
                                    <div className="flex gap-1">
                                        <div className="h-1.25 w-4 rounded bg-white/40" />
                                        <div className="h-1.25 w-4 rounded bg-white/40" />
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-white/40" />
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                setSelectedSize("TALL");
                                if (currentBackground) {
                                    onSetBackground(currentBackground, card?.isImage ?? false, "TALL", card.textColor ?? "light");
                                }
                            }}
                            className={`flex-1 h-16 rounded-md flex justify-start items-end transition-all border p-1 hover:ring-2 ${selectedSize === "TALL"
                                ? "border-white/70 ring-1 ring-white/40"
                                : "border-white/10 hover:border-white/30"
                                } ${currentColorObj.bg}`}
                        >
                            <div className="flex flex-col mr-10 gap-1 w-[90%]">
                                <div className="h-0.75 rounded-full bg-white/70" />
                                <div className="h-0.75 rounded-full bg-white/40 w-3/4" />
                            </div>
                        </button>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => { onRemoveBackground(); onClose(); }}
                    className="w-full text-sm rounded text-gray-400 hover:text-white flex items-center justify-center gap-2 hover:bg-[#38414a] border border-[#696b6d]"
                >
                    Удалить обложку
                </Button>

                {((card.isImage || card.background?.startsWith("/uploads"))) && card.size === "TALL" && (
                    <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-medium">
                            Цвет текста
                        </p>
                        <div className="flex gap-2">

                            <button
                                onClick={() => onSetBackground(card.background ?? "#000000", card?.isImage ?? false, card.size, "light")}
                                className={`flex-1 h-9 rounded-md border flex items-center justify-start gap-2 text-md font-medium transition-all px-2 overflow-hidden relative
                                    ${(card.textColor ?? "light") === "light"
                                        ? "border-white ring-1 ring-white"
                                        : "border-white/10 hover:border-white/30 hover:text-white/80"
                                    }`}
                                style={{ background: `url(${card.background}) center/cover no-repeat` }}
                            >
                                <div className="absolute inset-0 bg-black/40" />
                                <span className="relative z-10 text-white">{card.title}</span>
                            </button>

                            <button
                                onClick={() => onSetBackground(card.background ?? "#000000", card?.isImage ?? false, card.size, "dark")}
                                className={`flex-1 h-9 rounded-md border flex items-center justify-start text-black gap-2 text-md font-medium transition-all px-2
                                    ${card.textColor === "dark"
                                        ? "border-white ring-1 ring-white"
                                        : "border-white/10 hover:border-white/30"
                                    }`}
                                style={{ background: `url(${card.background}) center/cover no-repeat` }}
                            >
                                {card.title}
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-medium">
                        Цвета
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                        {COVER_COLORS.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => handleColorClick(color.id)}
                                className={`h-9 rounded-md ${color.bg} transition-all flex items-center justify-center border ${selectedColor === color.id
                                    ? "border-white scale-105 shadow-lg"
                                    : "border-transparent hover:scale-105 hover:border-white/30"
                                    }`}
                            >
                                {selectedColor === color.id && (
                                    <svg
                                        className="w-3.5 h-3.5 text-white drop-shadow"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full text-sm rounded text-gray-400 hover:text-white flex items-center justify-center gap-2 hover:bg-[#38414a] border border-[#696b6d]"
                >
                    Включить режим для дальтоников
                </Button>

                <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-medium">
                        Вложения
                    </p>

                    {card.attachments?.filter(a => a.mimeType?.startsWith("image/")).length > 0 && (
                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                            {card.attachments
                                .filter(a => a.mimeType?.startsWith("image/"))
                                .map((attachment) => (
                                    <button
                                        key={attachment.id}
                                        onClick={() => onSetBackground(attachment.fileUrl, true, selectedSize, card.textColor ?? "light")}
                                        className="relative h-16 rounded-md overflow-hidden hover:ring-2 hover:ring-white/50 transition-all group"
                                        title={attachment.fileName}
                                    >
                                        <img
                                            src={attachment.fileUrl}
                                            alt={attachment.fileName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {card.background === attachment.fileUrl && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))
                            }
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-sm rounded text-gray-400 hover:text-white flex items-center justify-center gap-2 hover:bg-[#38414a] border border-[#696b6d]"
                    >
                        Загрузить изображение обложки
                    </Button>
                    <p className="text-white/30 text-xs mt-2">
                        💡 Совет: Перетащите изображение на карточку, чтобы загрузить его.
                    </p>
                </div>

                <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-medium">
                        Фото из Unsplash
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {UNSPLASH_PHOTOS.map((photo) => (
                            <button
                                key={photo.id}
                                onClick={() => handlePhotoClick(photo.url)}
                                className="relative h-16 rounded-md overflow-hidden hover:ring-2 hover:ring-white/50 transition-all group"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.alt}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Поиск фото..."
                            className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs transition-all disabled:opacity-50"
                        >
                            {isSearching ? "..." : "Найти"}
                        </button>
                    </div>

                    <p className="text-white/25 text-[10px] mt-2 leading-relaxed">
                        Используя изображения Unsplash, вы соглашаетесь с их{" "}
                        <a href="#" className="underline hover:text-white/50 transition-COVER_COLORS">
                            лицензией
                        </a>{" "}
                        и{" "}
                        <a href="#" className="underline hover:text-white/50 transition-COVER_COLORS">
                            Условиями использования
                        </a>
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
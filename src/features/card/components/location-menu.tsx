"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import type { Location } from "@shared/types";
import { calcBelowPosition } from "@/shared/utils/floatingPosition";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";

interface LocationResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface LocationEditMenuProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    currentLocation?: Location | null;
    onSave: (location: Location) => void;
    onClose: () => void;
}

export function LocationEditMenu({
    triggerRef,
    currentLocation,
    onSave,
    onClose,
}: LocationEditMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const PANEL_WIDTH = 320;
    const PANEL_HEIGHT = 260;

    const pos = (() => {
        if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

        return calcBelowPosition(
            triggerRef.current.getBoundingClientRect(),
            PANEL_WIDTH,
            PANEL_HEIGHT
        );
    })();

    const panelRef = useRef<HTMLDivElement>(null);

    useOutsideClick([panelRef, triggerRef], onClose, true);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const t = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6`,
                    { headers: { "Accept-Language": "ru,en" } }
                );
                setResults(await res.json());
            } catch { setResults([]); }
            finally { setIsSearching(false); }
        }, 400);
        return () => clearTimeout(t);
    }, [query]);

    const handleSelect = (r: LocationResult) => {
        const parts = r.display_name.split(",");
        onSave({
            name: parts[0].trim(),
            fullAddress: r.display_name,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
        });
    };

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) onClose();
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [onClose, triggerRef]);

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
            className="bg-[#2b2c2f] rounded-lg shadow-xl text-white"
        >
            <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10">
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 text-[#9fadbc] hover:text-white transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-white text-sm font-semibold flex-1 text-center">
                    Изменить местоположение
                </span>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 text-[#9fadbc] hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="px-3 pt-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={currentLocation?.name ?? "Поиск..."}
                    className="w-full bg-[#1d2125] border border-white/20 text-[#b6c2cf] placeholder-[#596773] text-sm px-3 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="py-2 max-h-64 overflow-y-auto">
                {isSearching && (
                    <div className="flex justify-center py-4">
                        <Loader2 size={16} className="animate-spin text-[#9fadbc]" />
                    </div>
                )}

                {!isSearching && results.length === 0 && query.length > 1 && (
                    <p className="text-center text-[#9fadbc] text-xs py-4">Ничего не найдено</p>
                )}

                {results.map((r) => {
                    const parts = r.display_name.split(",");
                    const name = parts[0].trim();
                    const rest = parts.slice(1).join(",").trim();
                    return (
                        <button
                            key={r.place_id}
                            onClick={() => handleSelect(r)}
                            className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                        >
                            <p className="text-[#b6c2cf] text-sm">{name}{rest ? `, ${rest}` : ""}</p>
                        </button>
                    );
                })}
            </div>
        </div>,
        document.body
    );
}
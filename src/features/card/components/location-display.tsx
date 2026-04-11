"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, MapPin, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Location } from "@shared/types";

interface LocationDisplayProps {
    location: Location;
    boardId: number;
    boardSlug: string;
    onEdit: () => void;
    onRemove: () => void;
}

export function LocationDisplay({
    location,
    boardId,
    boardSlug,
    onEdit,
    onRemove,
}: LocationDisplayProps) {
    const router = useRouter();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const zoom = 14;
    const mapUrl = `/b/${boardId}/${boardSlug}/map/${location.lat}/${location.lng}/${zoom}`;

    useEffect(() => {
        const loadMap = async () => {
            if (!mapRef.current || mapInstanceRef.current) return;
            if (!(window as any).L) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
                await new Promise<void>((resolve) => {
                    const s = document.createElement("script");
                    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                    s.onload = () => resolve();
                    document.head.appendChild(s);
                });
            }
            const L = (window as any).L;
            const map = L.map(mapRef.current, {
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                keyboard: false,
                attributionControl: false,
            }).setView([location.lat, location.lng], zoom);

            // Google Maps ga o'xshash ochiq tile
            const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
            L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
                attribution: '© <a href="https://www.maptiler.com/">MapTiler</a>',
                maxZoom: 20,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);

            const icon = L.divIcon({
                html: `<div style="width:28px;height:36px"><svg viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="#1a73e8"/><circle cx="14" cy="14" r="6" fill="white"/><circle cx="14" cy="14" r="3.5" fill="#1a73e8"/></svg></div>`,
                className: "",
                iconSize: [28, 36],
                iconAnchor: [14, 36],
            });

            L.marker([location.lat, location.lng], { icon }).addTo(map);
            mapInstanceRef.current = map;
        };
        loadMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location.lat, location.lng]);

    useEffect(() => {
        if (!showMore) return;
        const handler = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node))
                setShowMore(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showMore]);

    return (
        <>
            <div className="flex items-center gap-2 text-[#b6c2cf] mt-5">
                <MapPin className="w-5 h-5" />
                <span className="text-[16px] font-semibold text-[#b6c2cf]">Вложения</span>
            </div>

            <div className="rounded overflow-hidden border border-white/10 mt-4 bg-[#1d2125]">
                <div
                    className="relative cursor-pointer"
                    style={{ height: 160 }}
                    onClick={() => router.push(mapUrl)}
                >
                    <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
                    <div className="absolute inset-0" />
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                    <div className="min-w-0">
                        <p className="text-white text-sm font-semibold leading-snug">
                            {location.name}
                        </p>
                        <p className="text-[#9fadbc] text-xs truncate mt-0.5">
                            {location.fullAddress}
                        </p>
                    </div>

                    <div className="flex items-center gap-0.5 ml-3 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); router.push(mapUrl); }}
                            className="p-1.5 rounded hover:bg-white/10 text-[#9fadbc] hover:text-white transition-colors"
                        >
                            <ExternalLink size={15} />
                        </button>

                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMore((v) => !v); }}
                                className="p-1.5 rounded hover:bg-white/10 text-[#9fadbc] hover:text-white transition-colors"
                            >
                                <MoreHorizontal size={15} />
                            </button>

                            {showMore && (
                                <div className="absolute right-0 top-full mt-1 bg-[#282e33] border border-white/10 rounded-xl shadow-xl z-50 min-w-40 py-1 overflow-hidden">
                                    <button
                                        onClick={() => { setShowMore(false); onEdit(); }}
                                        className="w-full text-left px-4 py-2 text-[#b6c2cf] text-sm hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => { setShowMore(false); onRemove(); }}
                                        className="w-full text-left px-4 py-2 text-red-400 text-sm hover:bg-white/10 hover:text-red-300 transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
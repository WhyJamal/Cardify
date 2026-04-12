"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Inbox, CalendarDays, LayoutDashboard, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/shared/components";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;

export default function MapPage() {
    const router = useRouter();
    const params = useParams();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    const lat = parseFloat(params.lat as string) || 41.2995;
    const lng = parseFloat(params.lng as string) || 69.2401;
    const zoom = parseInt(params.zoom as string) || 13;

    const [mapType, setMapType] = useState<"streets" | "satellite">("streets");

    const boardId = params.boardId as string;
    const boardSlug = params.boardSlug as string;

    const TILES = {
        streets: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
        satellite: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
    };

    useEffect(() => {
        const load = async () => {
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

            if (mapInstanceRef.current || !mapRef.current) return;

            const L = (window as any).L;
            const map = L.map(mapRef.current, {
                zoomControl: true,
                attributionControl: false,
            }).setView([lat, lng], zoom);

            L.tileLayer(TILES.streets, {
                attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

            L.marker([lat, lng], { icon }).addTo(map);
            mapInstanceRef.current = map;
        };

        load();
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !(window as any).L) return;
        const L = (window as any).L;

        map.eachLayer((layer: any) => {
            if (layer instanceof L.TileLayer) map.removeLayer(layer);
        });

        L.tileLayer(TILES[mapType], {
            attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);
    }, [mapType]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => router.back()}
            />

            <div className="relative w-[98%] h-[80%] rounded overflow-hidden shadow-2xl">

                <div className="absolute top-3 left-14 z-1000 flex rounded-lg overflow-hidden border border-white/20 shadow-lg">
                    {([
                        { label: "Карта", value: "streets" },
                        { label: "Спутник", value: "satellite" },
                    ] as const).map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setMapType(value)}
                            className={`px-4 py-1.5 text-sm font-medium transition-colors ${mapType === value
                                ? "bg-white text-[#1d2125]"
                                : "bg-[#282e33] text-[#9fadbc] hover:text-white"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <Button
                    variant={"default"}
                    onClick={() => router.back()}
                    className="absolute top-3 right-3 z-1000"
                >
                    ✕
                </Button>

                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}

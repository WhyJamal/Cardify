import { Check, ChevronLeft, X } from "lucide-react";
import Image from "next/image";

const PHOTOS = [
    "/images/board-backgrounds/tropical-beach-samoa.webp",
    "/images/board-backgrounds/messy-office-desk-still-life.webp",
    "/images/board-backgrounds/beautiful-shot-himalayas-mountains-clouds.webp",
    "/images/board-backgrounds/laptop-coffee-cups-notepads-black-background-top-view.webp",
    "/images/board-backgrounds/nature-landscape-with-black-sand-beach.webp",
];

export default function PhotosView({
    selectedBg, isBgPhoto, onSelectBg, onBack, onClose,
}: {
    selectedBg: string; isBgPhoto: boolean;
    onSelectBg: (bg: string, isPhoto: boolean) => void;
    onBack: () => void; onClose: () => void;
}) {
    return (
        <>
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
                <button
                    onClick={onBack}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="text-white text-sm">Фотографии</span>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-3 gap-2">
                    {PHOTOS.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => onSelectBg(url, true)}
                            className={`relative rounded-lg overflow-hidden h-[75] border-2 transition-all ${selectedBg === url && isBgPhoto
                                ? "border-white"
                                : "border-transparent hover:border-white/40"
                                }`}
                        >
                            <Image
                                src={url}
                                alt="bg"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 320px) 100vw, 320px"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
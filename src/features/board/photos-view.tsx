import { Check, ChevronLeft, X } from "lucide-react";
import Image from "next/image";

const PHOTOS = [
    "https://images.unsplash.com/photo-1574797668796-3c321fee0d01?w=300&q=80",
    "https://images.unsplash.com/photo-1599551528722-6b6d968512a2?w=300&q=80",
    "https://images.unsplash.com/photo-1678393834156-f8aed69b05f2?w=300&q=80",
    "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?w=300&q=80",
    "https://images.unsplash.com/photo-1650234409957-7609e577a0b5?w=300&q=80",
    "https://images.unsplash.com/photo-1668778026441-250fd7fb87f5?w=300&q=80",
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
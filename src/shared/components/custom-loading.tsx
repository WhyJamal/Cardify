import Image from "next/image";
import CardifyLogo from "./logo";

function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`relative overflow-hidden bg-[#e2e8f0] rounded ${className}`}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
        </div>
    );
}

export default function CustomLoading() {
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <style>{`
                @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
                }
            `}
            </style>
            <nav className="h-14 bg-white/10 backdrop-blur-sm flex items-center px-3 gap-2 shrink-0">
                <div className="flex items-center gap-2">
                    <Shimmer className="h-7 w-9 rounded" />
                    <div className="flex items-center gap-1">
                        <Image
                            src={'/cardify11.png'}
                            alt="cardify"
                            width={50}
                            height={50}
                            className="h-9 w-9 rounded filter grayscale"
                        />
                        <CardifyLogo size="sm"/>
                        {/* <span className="text-gray-300 font-bold">Cardify</span> */}
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-center relative w-full mx-auto">
                    <div className="h-8 w-full max-w-xl rounded-sm border border-gray-200" />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Shimmer className="h-8 w-24 rounded" />
                    <Shimmer className="h-7 w-7 rounded" />
                    <Shimmer className="h-7 w-7 rounded" />
                    <Shimmer className="h-7 w-7 rounded-full" />
                </div>
            </nav>

            <div className="flex items-center justify-center mx-auto min-h-screen">
                <svg className="spinner" viewBox="25 25 50 50">
                    <circle className="spinner-circle" r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        </div>
    );
}
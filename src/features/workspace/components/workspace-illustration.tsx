function Sparkle({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
            <path
                d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z"
                fill="#5BC4D4"
            />
        </svg>
    );
}

function BoardIllustration({ showFriends }: { showFriends: boolean }) {
    return (
        <div className="relative inline-block">
            <Sparkle size={18} style={{ position: "absolute", top: -28, left: "40%" }} />
            <Sparkle size={13} style={{ position: "absolute", top: 10, right: -30 }} />
            <Sparkle size={11} style={{ position: "absolute", bottom: showFriends ? 30 : -10, right: -24 }} />
            <Sparkle size={14} style={{ position: "absolute", bottom: showFriends ? 20 : -20, left: -28 }} />

            <div
                className="w-69.5 h-42.5 rounded-lg overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #4EC8D4 0%, #66C98A 100%)",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
                }}
            >
                <div className="bg-black/12 flex items-center gap-1.5 px-2 py-1.25">
                    <div className="w-4 h-4 bg-white/85 rounded-[3px] flex gap-0.5 items-end p-[2px_3px]">
                        {/* <div className="flex-1 bg-[#5BC4D4] rounded-[1px] h-[65%]" />
                        <div className="flex-1 bg-[#5BC4D4] rounded-[1px] h-full" /> */}
                    </div>
                    <div className="w-6 h-1.5 bg-white/45 rounded-[3px]" />
                    <div className="w-4.5 h-1.5 bg-white/35 rounded-[3px]" />
                    <div className="flex-1" />
                    <div className="w-4 h-4 bg-white/85 rounded-full flex gap-0.5 items-end p-[2px_3px]"/>
                </div>

                <div className="flex gap-1.25 p-[5px_6px]">
                    <CardColumn>
                        <CardLine width="100%" />
                        <CardLine width="80%" />
                        <CardLine width="90%" />
                        <div className="flex gap-0.75 my-1">
                            <div className="w-3.5 h-1.5 bg-[#FF5630] rounded-xs" />
                            <div className="w-3.5 h-1.5 bg-[#36B37E] rounded-xs" />
                        </div>
                        <CardLine width="100%" faint />
                        <CardLine width="65%" faint />
                    </CardColumn>

                    <CardColumn>
                        <CardLine width="100%" />
                        <CardLine width="75%" />
                        <CardLine width="85%" faint />
                        <div className="my-1">
                            <div className="w-3.5 h-1.5 bg-[#FF8B00] rounded-xs" />
                        </div>
                        <CardLine width="100%" faint />
                        <CardLine width="55%" faint />
                    </CardColumn>

                    <CardColumn>
                        <CardLine width="100%" />
                        <CardLine width="70%" />
                        <CardLine width="90%" />
                        <CardLine width="80%" faint />
                        <CardLine width="100%" faint />
                        <CardLine width="60%" faint />
                    </CardColumn>
                </div>
            </div>
        </div>
    );
}

function CardColumn({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 bg-white rounded-lg p-1.25 min-h-31.25">
            {children}
        </div>
    );
}

function CardLine({ width, faint }: { width: string; faint?: boolean }) {
    return (
        <div
            className={`h-1.25 rounded-xs mb-0.75 ${faint ? "bg-[#F0F1F3]" : "bg-[#DFE1E6]"}`}
            style={{ width }}
        />
    );
}

export { BoardIllustration }
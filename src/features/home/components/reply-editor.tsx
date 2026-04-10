import { Button } from "@components/";

interface ReplyEditorProps {
    comment: string;
    loading: boolean;
    onChange: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function ReplyEditor({ comment, loading, onChange, onSave, onCancel }: ReplyEditorProps) {
    return (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #3d4148" }}>
            <div className="flex items-center gap-1 px-3 py-2 border-b" style={{ backgroundColor: "#252629", borderColor: "#3d4148" }}>
                <button className="text-gray-400 hover:text-gray-200 px-1 py-0.5 rounded text-xs flex items-center gap-0.5">
                    Tt <span className="text-[10px]">∨</span>
                </button>
                <div className="w-px h-4 bg-[#3d4148] mx-1" />
                <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded font-bold text-sm">B</button>
                <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded italic text-sm">I</button>
                <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs">···</button>
                <div className="w-px h-4 bg-[#3d4148] mx-1" />
                <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs">☰</button>
                <div className="ml-auto flex items-center gap-1">
                    <button className="text-gray-400 hover:text-gray-200 w-6 h-6 flex items-center justify-center rounded">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>
                </div>
            </div>

            <textarea
                autoFocus
                value={comment}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm text-gray-300 resize-none outline-none placeholder-gray-600"
                style={{ backgroundColor: "#2c2e33" }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSave();
                    if (e.key === "Escape") onCancel();
                }}
            />

            <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#252629", borderTop: "1px solid #3d4148" }}>
                <Button variant={"custom"} onClick={onSave} disabled={!comment.trim() || loading}>
                    {loading ? "Сохранение..." : "Сохранить"}
                </Button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1 rounded text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}

export { ReplyEditor };
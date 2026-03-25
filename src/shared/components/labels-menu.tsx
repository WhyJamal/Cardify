import { X, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { calcBelowPosition } from '../utils/floatingPosition';
import { createPortal } from 'react-dom';
import { clientFetch } from '@/lib/client-api';

interface LabelsMenuProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    cardId: string;
    boardLabels: { id: string; color: string; name: string | null }[];
    selectedLabels: { id: string }[];
    onClose: () => void;
    onChange?: (labels: { id: string; color: string; name: string | null; checked: boolean }[]) => void;
    //   onCreateNew: () => void;
}

export function LabelsMenu({ onClose, onChange, triggerRef, cardId, boardLabels = [], selectedLabels = [] }: LabelsMenuProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [labels, setLabels] = useState<any[]>([]);

    useEffect(() => {
        setLabels(
            boardLabels.map((label) => ({
                ...label,
                checked: selectedLabels.some((s) => s.id === label.id),
            }))
        );
    }, [boardLabels, selectedLabels]);

    const PANEL_WIDTH = 320;
    const PANEL_HEIGHT = 260;

    const pos = (() => {
        if (!triggerRef.current)
            return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

        return calcBelowPosition(
            triggerRef.current.getBoundingClientRect(),
            PANEL_WIDTH,
            PANEL_HEIGHT
        );
    })();

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const t = e.target as Node;

            if (
                !panelRef.current?.contains(t) &&
                !triggerRef.current?.contains(t)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose, triggerRef]);

    const toggleLabel = async (id: string) => {
        const newLabels = labels.map((label) =>
            label.id === id ? { ...label, checked: !label.checked } : label
        );

        setLabels(newLabels);
        onChange?.(newLabels);

        await clientFetch(`/api/cards/${cardId}`, {
            method: "PATCH",
            body: JSON.stringify({
                labels: newLabels.filter((l) => l.checked).map((l) => ({ id: l.id })),
            }),
        });
    };

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
            className="bg-[#2b3035] rounded-lg shadow-xl w-full max-w-[320px] text-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="font-medium">Метки</h2>
                <button
                    onClick={onClose}
                    className="hover:bg-gray-700 p-1 rounded transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 pb-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Искать метки..."
                    className="w-full bg-[#1f1f1f] border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 placeholder-gray-500"
                />
            </div>

            <div className="px-4 pb-4">
                <h3 className="text-xs text-gray-400 mb-3 uppercase">Метки</h3>
                <div className="space-y-2">
                    {labels.map((label) => (
                        <div key={label.id} className="flex items-center gap-2 group">
                            <input
                                type="checkbox"
                                checked={label.checked}
                                onChange={() => toggleLabel(label.id)}
                                className="w-4 h-4 accent-blue-500 shrink-0"
                            />
                            <div
                                className="flex-1 rounded px-3 py-2 min-h-9"
                                style={{
                                    background: label.color,
                                }}
                            >
                                {label.name}
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 p-1.5 rounded transition-all">
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 pb-4">
                <button
                    //onClick={onCreateNew}
                    className="w-full bg-[#343938] hover:bg-gray-600 text-white py-1 rounded transition-colors"
                >
                    Создать новую метку
                </button>
            </div>

            {/* <div className="p-4 pt-0">
                <button className="w-full bg-transparent hover:bg-gray-700 border border-gray-600 text-white py-1 rounded transition-colors text-sm">
                    Включить режим для дальтоников
                </button>
            </div> */}
        </div>,
        document.body
    );
}

"use client"

import { X, Tag, Clock, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { calcBelowPosition } from '@/shared/utils/floatingPosition';
import { createPortal } from "react-dom";

interface MenuItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

interface AddToCardMenuProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
    onOpenDates: () => void;
    onOpenLabels: () => void;
    onOpenInvites: () => void;
}

export function AddToCardMenu({ triggerRef, onClose, onOpenDates, onOpenLabels, onOpenInvites }: AddToCardMenuProps) {

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

    const menuItems: MenuItem[] = [
        {
            icon: <Tag className="w-5 h-5" />,
            title: 'Метки',
            description: 'Организуйте, разделяйте на категории и расставляйте приоритеты',
            onClick: onOpenLabels,
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: 'Даты',
            description: 'Даты начала, даты выполнения и напоминания',
            onClick: onOpenDates,
        },
        {
            icon: <User className="w-5 h-5" />,
            title: 'Участники',
            description: 'Назначайте участников',
            onClick: onOpenInvites,
        },
    ];

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
            className="bg-[#2b3035] rounded-lg shadow-xl w-full max-w-[320px] text-white z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-sm text-gray-300">Добавить на карточку</h2>
                <button
                    onClick={onClose}
                    className="hover:bg-gray-700 p-1 rounded transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="w-full flex items-start gap-3 p-3 hover:bg-gray-700 rounded transition-colors text-left"
                    >
                        <div className="text-gray-400 mt-0.5">
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium mb-0.5">{item.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );
}

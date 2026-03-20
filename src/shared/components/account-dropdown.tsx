"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, ChevronRight, Layout } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export function AccountDropdown({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name?: string | null) => {
        if (!name) return "U";

        const parts = name.trim().split(" ");

        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>

            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {children}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#282e33] rounded-lg shadow-2xl py-2 border border-[#3c4449] z-50">

                    <div className="px-3 py-2">
                        <div className="text-[#9fadbc] text-xs uppercase mb-3">
                            УЧЕТНАЯ ЗАПИСЬ
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {getInitials(session.user?.name)}
                                </span>
                            </div>

                            <div>
                                <div className="text-white text-sm">
                                    {session.user?.name}
                                </div>
                                <div className="text-[#9fadbc] text-xs">
                                    {session.user?.email}
                                </div>
                            </div>
                        </div>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors">
                            Переключение аккаунтов
                        </button>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors flex items-center justify-between group">
                            <span>Управление аккаунтом</span>
                            <ExternalLink className="w-4 h-4 opacity-70" />
                        </button>
                    </div>

                    <div className="h-px bg-[#3c4449] my-2"></div>

                    <div className="px-3 py-2">
                        <div className="text-[#9fadbc] text-xs tracking-wide uppercase mb-2">
                            CARDIFY
                        </div>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors">
                            Профиль и доступ
                        </button>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors">
                            Карточки
                        </button>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors">
                            Настройки
                        </button>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors flex items-center justify-between">
                            <span>Выбор темы</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-px bg-[#3c4449] my-2"></div>

                    <div className="px-3 py-2">
                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors flex items-center gap-3">
                            <Layout className="w-4 h-4" />
                            <span>Создать рабочее пространство</span>
                        </button>
                    </div>

                    <div className="h-px bg-[#3c4449] my-2"></div>

                    <div className="px-3 py-2">
                        <div className="text-[#9fadbc] text-xs tracking-wide uppercase mb-2">
                            Помощь
                        </div>

                        <button className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded transition-colors">
                            Горячие клавиши
                        </button>
                    </div>

                    <div className="h-px bg-[#3c4449] my-2"></div>

                    <div className="px-3 py-2">
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-3 py-2 text-[#b6b6b6] text-sm hover:bg-[#343a40] rounded"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
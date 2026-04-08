"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@components";

interface Props {
    children: React.ReactNode;
    title: string;
    open: boolean;
    onClose: () => void;
}

export default function WorkspaceModal({ children, title, open, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        const click = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", click);
        return () => document.removeEventListener("mousedown", click);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">

            <div
                ref={ref}
                className="w-full max-w-xl rounded-xl bg-[#1e1f25] shadow-2xl p-6 text-white"
            >

                <div className="flex justify-between mb-5">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>

                    <Button
                        variant={"ghost"}
                        onClick={onClose}
                        className="px-2 rounded hover:bg-white/10"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {children}

            </div>
        </div>

    )
}
"use client";

import { Button } from "@components/";
import { Label } from "./workspace-ui";
import { Link, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { workspaceApi } from "@features/workspace/api/workspace-api";
import { User } from "@shared/types";

interface Step2Props {
    workspaceId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

function Step2({ workspaceId, onClose, onSuccess }: Step2Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<User[]>([]);
    const [results, setResults] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const q = query.trim();

        if (!q) {
            setResults([]);
            setSearching(false);
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {
            setSearching(true);

            try {
                const res = await workspaceApi.searchUsers({
                    q,
                    workspaceId,
                });

                if (!cancelled) {
                    setResults(Array.isArray(res) ? res : []);
                }
            } catch (error) {
                if (!cancelled) {
                    setResults([]);
                }
                console.error(error);
            } finally {
                if (!cancelled) {
                    setSearching(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query, workspaceId]);

    const filtered = results.filter(
        (u) => !selected.some((s) => s.id === u.id)
    );

    const addUser = (user: User) => {
        if (selected.length < 9) {
            setSelected((prev) => [...prev, user]);
            setQuery("");
            setResults([]);
            setOpen(false);
            inputRef.current?.focus();
        }
    };

    const removeUser = (id: string) => {
        setSelected((prev) => prev.filter((u) => u.id !== id));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !query && selected.length) {
            setSelected((prev) => prev.slice(0, -1));
        }

        if (e.key === "Escape") {
            setOpen(false);
        }

        if (e.key === "Enter" && filtered.length > 0) {
            e.preventDefault();
            addUser(filtered[0]);
        }
    };

    const handleSend = async () => {
        if (!selected.length) return;

        setSending(true);
        try {
            await workspaceApi.addMembersToWorkspace(
                workspaceId,
                selected.map((u) => u.id)
            );

            setSelected([]);
            setQuery("");
            setResults([]);
            setOpen(false);

            onSuccess?.();
        } catch (error) {
            console.error("Invite error:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-100 justify-center items-center">
            <h2 className="text-[#B6C2CF] m-0 mb-2 text-[22px] font-bold">
                Пригласите вашу команду
            </h2>
            <p className="text-[#8C9BAB] text-sm m-0 mb-6 leading-relaxed">
                Пригласите до 9 человек по ссылке или введя их имя или email.
            </p>

            <div className="flex items-center justify-between mb-1.5">
                <Label>Участники рабочего пространства</Label>
                <button className="bg-transparent border-none text-[#388BFF] text-[13px] cursor-pointer flex items-center gap-1 p-0 hover:underline">
                    <Link size={13} />
                    Пригласить по ссылке
                </button>
            </div>

            <div className="relative">
                <div className="bg-[#22272B] border-2 border-[#388BFF] rounded p-[6px_10px] flex flex-wrap gap-1.25 items-center min-h-11 box-border cursor-text focus-within:ring-1 focus-within:ring-[#388BFF]">
                    {selected.map((user) => (
                        <span
                            key={user.id}
                            className="inline-flex items-center gap-1 bg-[#3B4654] rounded-[3px] px-2 py-0.5 text-[#B6C2CF] text-sm"
                        >
                            {user.name}
                            <button
                                type="button"
                                onClick={() => removeUser(user.id)}
                                className="bg-transparent border-none text-[#8C9BAB] cursor-pointer text-sm p-0 leading-none hover:text-white"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={onKeyDown}
                        placeholder={selected.length === 0 ? "Имя или email..." : ""}
                        className="bg-transparent border-none outline-none text-[#B6C2CF] text-sm flex-1 min-w-20 placeholder:text-[#596773]"
                        disabled={selected.length >= 9}
                    />
                </div>

                {open && query.trim() && (
                    <div className="absolute w-full bg-[#22272B] border border-[#388BFF]/30 rounded overflow-hidden shadow-xl z-10">
                        {searching ? (
                            <div className="px-4 py-3 text-sm text-[#8C9BAB] flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Поиск...
                            </div>
                        ) : filtered.length > 0 ? (
                            filtered.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => addUser(user)}
                                    className="w-full text-left px-4 py-2 hover:bg-[#3B4654] flex flex-col"
                                >
                                    <span className="text-[#B6C2CF]">{user.name}</span>
                                    <span className="text-xs text-[#8C9BAB]">{user.email}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-[#8C9BAB]">
                                Никто не найден
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selected.length > 0 && (
                <p className="text-xs text-[#8C9BAB] mb-4 mt-2">
                    Выбрано: {selected.length}/9
                </p>
            )}

            <Button
                variant={"custom"}
                size={"lg"}
                className="flex w-full py-5 text-sm mt-4"
                onClick={handleSend}
                disabled={!selected.length || sending}
            >
                {sending ? "Отправка..." : "Пригласить в рабочее пространство"}
            </Button>

            <Button
                variant={"link"}
                size={"lg"}
                onClick={onClose}
                className="flex w-full border-none text-[#8C9BAB] text-sm cursor-pointer underline hover:text-[#B6C2CF] transition-colors"
            >
                Сделаю это позже
            </Button>
        </div>
    );
}

export { Step2 };
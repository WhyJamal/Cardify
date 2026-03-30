"use client";

import { Button } from "@/shared/components";
import { workspaceApi } from "@/features/workspace/api/workspace-api";
import { X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  workspaceId: string;
  onSuccess?: () => void;
};

export default function InviteWorkspaceCard({
  workspaceId,
  onSuccess,
}: Props) {
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
    setSelected((prev) => [...prev, user]);
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
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
    <>
      <div className="relative">
        <div className="flex flex-wrap gap-2 items-center border border-blue-400 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          {selected.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1 bg-[#2a2a2f] px-2 py-1 rounded text-sm"
            >
              <span>{user.name}</span>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                className="opacity-70 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Поиск по электронной почте или имени"
            className="flex-1 bg-transparent outline-none text-sm min-w-30"
          />
        </div>

        {open && query.trim() && (
          <div className="absolute mt-2 w-full bg-[#22232a] border border-white/10 rounded-md overflow-hidden shadow-xl z-10">
            {searching ? (
              <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                поиск...
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addUser(user)}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 flex flex-col"
                >
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                Никто не найден
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end items-center mt-5">
        <Button
          size="xl"
          variant="custom"
          onClick={handleSend}
          disabled={!selected.length || sending}
        >
          {sending ? "Отправка..." : "Отправить предложение"}
        </Button>
      </div>
    </>
  );
}
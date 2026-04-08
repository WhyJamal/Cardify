"use client";

import { useState, useTransition } from "react";
import { Search, ChevronDown, SquareArrowRightExit, Trash2 } from "lucide-react";
import { Button } from "@components/";
import { ConfirmDialog } from "@components/ui/confirm-diolog";
import { WorkspaceMember } from "@shared/types";
import { removeMember } from "../actions/members-actions";

interface Props {
  members: WorkspaceMember[];
  workspaceId: string;
}

export function MembersSearchList({ members, workspaceId }: Props) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = members.filter((m) => {
    if (!m.user) return false;
    return (
      m.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRemove = (userId: string) => {
    startTransition(() => removeMember(workspaceId, userId));
  };

  return (
    <>
      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Фильтровать по именам"
          className="w-full bg-[#2a2a2f] border border-white/10 rounded pl-10 pr-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="divide-y divide-white/10 rounded overflow-hidden">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-[320px_240px_120px_130px_120px] items-center gap-4 px-6 py-2 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-semibold shrink-0">
                {member.user.name?.charAt(0)}
              </div>
              <div className="truncate">
                <p className="font-medium text-md leading-none truncate">{member.user.name}</p>
                <p className="text-gray-400 text-sm truncate">{member.user.email}</p>
              </div>
            </div>

            <p className="text-gray-400 text-xs">
              Последняя активность:{" "}
              {new Date(member.lastActive ?? Date.now()).toLocaleDateString("ru-RU", {
                month: "short",
                year: "numeric",
              })}
            </p>

            <Button size="sm" className="w-full bg-[#2a2a2f] hover:bg-white/10 py-4 text-xs">
              Доски ({Array.isArray(member.boards) ? member.boards.length : 0})
              <ChevronDown />
            </Button>

            <Button size="sm" className="w-full bg-[#2a2a2f] py-4 hover:bg-white/10 text-xs text-gray-200">
              {member.role}
              <ChevronDown />
            </Button>

            <div>
              {member.role === "OWNER" ? (
                <ConfirmDialog
                  title="Покинуть рабочее пространство?"
                  desc="Вы потеряете доступ ко всем доскам и данным этого рабочего пространства."
                  onConfirm={() => handleRemove(member.user.id)}
                >
                  <Button
                    disabled={isPending}
                    className="w-full bg-[#2a2a2f] p-4 hover:bg-white/10 transition rounded-md text-sm"
                  >
                    <SquareArrowRightExit />
                    Покинуть
                  </Button>
                </ConfirmDialog>
              ) : (
                <ConfirmDialog
                  title="Удалить участника?"
                  desc="Пользователь потеряет доступ к этому рабочему пространству."
                  onConfirm={() => handleRemove(member.user.id)}
                >
                  <Button
                    disabled={isPending}
                    className="w-full bg-[#2a2a2f] p-4 gap-3 hover:bg-white/10 transition rounded-md text-sm"
                  >
                    <Trash2 />
                    Удалить
                  </Button>
                </ConfirmDialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
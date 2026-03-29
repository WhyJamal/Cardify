"use client";

import { Button } from "@/shared/components";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
  username: string;
};

const MOCK_USERS: User[] = [
  { id: 1, name: "Jamal", username: "@jamal" },
  { id: 2, name: "Sayyodbee Gulomov", username: "@sayyodbee" },
  { id: 3, name: "Ali Valiyev", username: "@ali" },
  { id: 4, name: "John Carter", username: "@john" },
  { id: 5, name: "Sarah Connor", username: "@sarah" },
];

export default function InviteWorkspaceCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = MOCK_USERS.filter(
    (u) =>
      !selected.find((s) => s.id === u.id) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase()))
  );

  const addUser = (user: User) => {
    setSelected((prev) => [...prev, user]);
    setQuery("");
    inputRef.current?.focus();
  };

  const removeUser = (id: number) => {
    setSelected((prev) => prev.filter((u) => u.id !== id));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !query && selected.length) {
      setSelected((prev) => prev.slice(0, -1));
    }
  };

  return (
    <>
      <div className="relative">
        <div
          className="
              flex flex-wrap gap-2 items-center
              border border-blue-400
              rounded-md px-3 py-2
              focus-within:ring-2 focus-within:ring-blue-500
            "
        >
          {selected.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1 bg-[#2a2a2f] px-2 py-1 rounded text-sm"
            >
              {user.name}

              <button
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
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={onKeyDown}
            placeholder="Адрес электронной почты или имя"
            className="flex-1 bg-transparent outline-none text-sm min-w-30"
          />
        </div>

        {showDropdown && query && filtered.length > 0 && (
          <div className="absolute mt-2 w-full bg-[#22232a] border border-white/10 rounded-md overflow-hidden shadow-xl z-10">
            {filtered.map((user) => (
              <button
                key={user.id}
                onClick={() => addUser(user)}
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex flex-col"
              >
                <span>{user.name}</span>
                <span className="text-xs text-gray-400">
                  {user.username}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGE */}
      {/* <textarea
          className="
            w-full mt-4
            bg-[#202127]
            border border-white/10
            rounded-md
            p-3
            text-sm
            outline-none
            resize-none
            h-24
          "
          defaultValue="Приглашаю в рабочее пространство Trello — давайте работать с ним вместе!"
        /> */}

      <div className="flex justify-end items-center mt-5">
        {/* <button className="text-blue-400 text-sm hover:underline">
            Отключить ссылку
          </button> */}
        <Button size={"xl"} variant={"custom"}>
          Отправить приглашение
        </Button>

      </div>
    </>
  );
}
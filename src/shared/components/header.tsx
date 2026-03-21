"use client";

import { Search, Bell, HelpCircle, LayoutGrid, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AccountDropdown } from "./account-dropdown";
import { CreateMenu } from "./create-menu";
import { CreateBoardPanel } from "@/features/board/create-board-panel";
import { TooltipAction } from "./custom-tooltip";

type PanelState = "closed" | "menu" | "createBoard";

export function Header() {
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [searchVal, setSearchVal] = useState("");
  const createBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleCreateBtnClick = () => {
    setPanelState((s) => (s === "closed" ? "menu" : "closed"));
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  };

  const initials = session?.user?.name ? getInitials(session.user.name) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus(); 
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="flex items-center h-12 px-1 gap-2 bg-[#1d2125] border-b border-[#2c333a] shrink-0">

      <div className="flex">
        <button className="flex items-center gap-1 px-2 py-2 rounded hover:bg-white/10 transition-colors">
          <LayoutGrid size={18} className="text-[#9fadbc]" />
        </button>

        <Link href={'/'}>
          <button className="flex items-center gap-1 px-1 py-1 rounded hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <Image
                src="/cardify11.png"
                alt="cardify"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="text-white font-semibold text-[15px]">Cardify</span>
            </div>
          </button>
        </Link>
      </div>

      {/* <nav className="hidden md:flex items-center gap-1 ml-1">
        {["Рабочие пространства", "Последние", "Помеченные", "Шаблоны"].map((item) => (
          <button
            key={item}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-[#9fadbc] text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {item}
            <ChevronDown size={14} />
          </button>
        ))}
      </nav> */}

      <div className="flex-1 flex justify-center mx-2 gap-3">
        <TooltipAction
          tooltip="Поиск"
          shortcut="/"
          side="bottom"
        >
          <div className="sm:flex hidden relative w-full max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9fadbc]" />
            <input
              ref={inputRef}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Поиск"
              className="w-full bg-[#2c333a] border border-[#3d4954] rounded pl-9 pr-3 py-1.5 text-sm text-white placeholder-[#9fadbc] focus:outline-none focus:border-[#388bff] focus:bg-[#1d2125] transition-colors"
            />
          </div>
        </TooltipAction>
      </div>

      <div className="flex items-center gap-1">
        <button
          ref={createBtnRef}
          onClick={handleCreateBtnClick}
          className={`bg-[#0052cc] text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors ${panelState !== "closed"
            ? "bg-blue-400 text-white"
            : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
        >
          <Plus size={16} />
          <span className="hidden sm:inline font-bold">Создать</span>
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 text-[#9fadbc] transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 text-[#9fadbc] transition-colors">
          <HelpCircle size={18} />
        </button>

        {panelState === "menu" && (
          <CreateMenu
            triggerRef={createBtnRef}
            onCreateBoard={() => setPanelState("createBoard")}
            onClose={() => setPanelState("closed")}
          />
        )}
        {panelState === "createBoard" && (
          <CreateBoardPanel
            triggerRef={createBtnRef}
            onClose={() => setPanelState("closed")}
            onCreated={() => setPanelState("closed")}
          />
        )}

        {session?.user ? (
          <div className="size-full flex items-center justify-center bg-[#1d2125]">
            <div className="relative">
              <TooltipAction
                tooltip="Учетная запись"
                side="bottom"
              >
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-8 h-8 rounded-full bg-linear-to-br from-[#4bce97] to-[#0052cc] flex items-center justify-center text-white text-xs font-bold ml-1"
                >
                  {initials}
                </button>
              </TooltipAction>
              {dropdownOpen && (
                <AccountDropdown session={session} onClose={() => setDropdownOpen(false)} />
              )}
            </div>

          </div>
        ) : (
          <Link
            href={'/auth/sign-in'}
            className="bg-[#0052cc] hover:bg-[#0065ff] text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Войти
          </Link>
        )
        }
      </div>
    </header>
  );
}

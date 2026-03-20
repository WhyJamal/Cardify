"use client";

import { useState } from "react";
import { LayoutDashboard, FileText, Home, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  id: string;
  label: string;
  icon: any;
  url?: string;
};

const navItems: NavItem[] = [
  { id: "boards", label: "Доски", icon: LayoutDashboard, url: `/u/user/boards` },
  { id: "templates", label: "Шаблоны", icon: FileText, url: "/templates" },
  { id: "home", label: "Главная страница", icon: Home, url: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();              // Current URL
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  return (
    <aside className="w-[320px] bg-[#1d2125] flex flex-col py-10 px-8 overflow-y-auto">
      <nav className="mb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.url === pathname;  

          return (
            <Link key={item.id} href={item.url || "/"}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-sm transition-all
                  ${isActive
                    ? "bg-[#579dff26] text-[#579dff]"
                    : "text-[#b6c2cf] hover:bg-[#a1bdd914]"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#2c333a] mx-2 mb-4" />

      <div>
        <p className="text-xs text-[#8c9bab] mb-2 px-2 tracking-wide">
          Рабочие пространства
        </p>

        <button
          onClick={() => setWorkspaceOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#a1bdd914] transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="w-9 h-8 rounded-md bg-[#1db954] flex items-center justify-center text-black text-md font-bold">
              P
            </div>
            <span className="text-sm text-[#b6c2cf] leading-tight">
              Рабочее пространство Cardify
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`text-[#8c9bab] transition-transform duration-200 ${
              workspaceOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>

        {workspaceOpen && (
          <div className="mt-2 pl-10 text-sm text-[#b6c2cf] space-y-4">
            <p className="hover:text-white cursor-pointer transition">Доски</p>
            <p className="hover:text-white cursor-pointer transition">Участники</p>
            <p className="hover:text-white cursor-pointer transition">Настройки</p>
          </div>
        )}
      </div>
    </aside>
  );
}
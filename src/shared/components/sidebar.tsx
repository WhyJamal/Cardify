"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Home, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TooltipAction } from "./custom-tooltip";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput = active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";

      if (!isInput && e.code === "BracketLeft") {
        e.preventDefault(); 
        setCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <aside
        className={`min-h-screen bg-[#1d2125] flex flex-col py-10 overflow-y-auto transition-all duration-300 ease-in-out
      ${collapsed ? "w-23 px-4" : "w-[320px] px-8"}`}
      >
        <nav className="mb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.url === pathname;

            return (
              <Link key={item.id} href={item.url || "/"} className="block">
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-sm transition-all
                  ${collapsed ? "justify-center px-0" : ""}
                  ${isActive
                      ? "bg-[#579dff26] text-[#579dff]"
                      : "text-[#b6c2cf] hover:bg-[#a1bdd914]"
                    }`}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2c333a] mx-2 mb-4" />

        <div>
          {!collapsed && (
            <p className="text-xs text-[#8c9bab] mb-2 px-2 tracking-wide">
              Рабочие пространства
            </p>
          )}

          <button
            onClick={() => setWorkspaceOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#a1bdd914] transition-all
          ${collapsed ? "justify-center px-0" : ""}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-8 rounded-md bg-[#1db954] flex items-center justify-center text-black font-bold">
                P
              </div>

              {!collapsed && (
                <span className="text-sm text-[#b6c2cf] leading-tight">
                  Рабочее пространство Cardify
                </span>
              )}
            </div>

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`text-[#8c9bab] transition-transform duration-200 ${workspaceOpen ? "rotate-0" : "-rotate-90"
                  }`}
              />
            )}
          </button>

          {workspaceOpen && !collapsed && (
            <div className="mt-2 pl-10 text-sm text-[#b6c2cf] space-y-4">
              <p className="hover:text-white cursor-pointer transition">Доски</p>
              <p className="hover:text-white cursor-pointer transition">
                Участники
              </p>
              <p className="hover:text-white cursor-pointer transition">
                Настройки
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-24 -right-3 z-60">
          <TooltipAction
            tooltip={collapsed ? "Показать панель" : "Скрыть панель"}
            shortcut="["
            side="bottom"
          >
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setCollapsed((p) => !p)}
              className="w-5 h-5 rounded-full bg-[#2c333a] border-none hover:bg-[#3b444c] text-[#b6c2cf] shadow-md"
            >
              <ChevronRight
                className={`text-white transition-transform duration-200 ${collapsed ? "rotate-180" : "rotate-0"
                  }`}
              />
            </Button>
          </TooltipAction>
        </div>
      </aside>
    </div>
  );
}
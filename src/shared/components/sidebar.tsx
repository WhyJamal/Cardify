"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Home, Plus } from "lucide-react";

import { usePathname } from "next/navigation";
import { TooltipAction, Button, WorkspaceSidebar } from "./";
import { ChevronRight } from "lucide-react";
import { Workspace } from "../types";

import CreateWorkspaceCard from "@/features/workspace/create-workspace-card";
import WorkspaceModal from "@/features/workspace/modal/workpace-modal";

import { useWorkspace } from "@/app/providers/WorkspaceProvider";

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
  const { workspaces, refresh } = useWorkspace();
  const pathname = usePathname();
  const [showCreateWorksppace, setShowCreateWorksppace] = useState(false);
  const [collapsed, setCollapsed] = useState(false);


  useEffect(() => {
    refresh();
  }, []);

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
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8c9bab] mb-2 px-2 tracking-wide">
                Рабочие пространства
              </p>
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={() => setShowCreateWorksppace(true)}
                className="rounded-full text-[#8c9bab] hover:bg-[#a1bdd914]"
              >
                <Plus />
              </Button>
            </div>
          )}

          {workspaces.map((ws) => (
            <WorkspaceSidebar
              key={ws.id}
              workspace={ws}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="absolute top-24 -right-3 z-10">
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

      <WorkspaceModal
        title={"Новый рабочего пространство"}
        open={showCreateWorksppace}
        onClose={() => setShowCreateWorksppace(false)}
      >
        <CreateWorkspaceCard
          onCreate={() => setShowCreateWorksppace(false)}
        />
      </WorkspaceModal>

    </div>
  );
}
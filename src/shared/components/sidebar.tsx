"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { usePathname } from "next/navigation";
import { TooltipAction, Button, WorkspaceSidebar, Spinner } from "./";
import { ChevronRight } from "lucide-react";

import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { CustomWorkspaceModal } from "@features/workspace/modal/custom-workpace-modal";
import { sidebarItems } from "../config/navigation";
import { SidebarItem } from "./sidebar-item";


export default function Sidebar() {
  const { workspaces, refresh, loading } = useWorkspace();
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
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={item.url === pathname}
              collapsed={collapsed}
            />
          ))}
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

          {loading ? (
            <div className="flex mt-2 w-full justify-center">
              <Spinner />
            </div>
          ) : (
            workspaces.map((ws) => (
              <WorkspaceSidebar
                key={ws.id}
                workspace={ws}
                collapsed={collapsed}
              />
            )))}
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

      {showCreateWorksppace && (
        <CustomWorkspaceModal onClose={() => setShowCreateWorksppace(false)} />
      )}

    </div>
  );
}
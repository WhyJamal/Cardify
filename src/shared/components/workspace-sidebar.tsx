"use client";

import { useState, useEffect } from "react";
import WorkspaceItem from "./workspace-item";
import { Users, Settings, SquareKanban, ChevronDown } from "lucide-react";
import { Workspace } from "../types";
import { PAGES } from "@/config/pages.config";
import { WorkspaceSmallCard } from "./workspace-small-card";
import { usePathname } from "next/navigation";

interface WorkspaceSidebarProps {
  workspace: Workspace;
  collapsed: boolean;
}

export default function WorkspaceSidebar({ workspace, collapsed }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const workspaceLinks = [
    PAGES.WORKSPACE_HOME(workspace.id),
    PAGES.WORKSPACE_MEMBERS(workspace.id),
    PAGES.WORKSPACE_ACCOUNT(workspace.id),
  ];

  const isWorkspaceActive = workspaceLinks.some((link) => pathname.startsWith(link));

  const [workspaceOpen, setWorkspaceOpen] = useState(isWorkspaceActive);

  useEffect(() => {
    if (isWorkspaceActive) setWorkspaceOpen(true);
  }, [pathname]);

  return (
    <div>
      <button
        onClick={() => setWorkspaceOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-all
          ${isWorkspaceActive ? "text-[#579dff]" : "hover:bg-[#a1bdd914]"}
          ${collapsed ? "justify-center px-0" : ""}`}
      >
        <div className="flex items-center gap-2">
          <WorkspaceSmallCard
            isLogo={workspace.logo ? true : false}
            name={workspace.name}
            logo={workspace.logo}
          />
          {!collapsed && (
            <span className="text-sm text-[#b6c2cf] leading-tight">
              {workspace?.name || null}
            </span>
          )}
        </div>

        {!collapsed && (
          <ChevronDown
            size={16}
            className={`text-[#8c9bab] transition-transform duration-200 ${workspaceOpen ? "rotate-0" : "-rotate-90"}`}
          />
        )}
      </button>

      {workspaceOpen && (
        <nav className="mt-3 pl-2 text-sm mb-2">
          <ul className="space-y-1 overflow-x-hidden">
            <WorkspaceItem
              href={PAGES.WORKSPACE_HOME(workspace.id)}
              label={!collapsed ? "Доски" : ""}
              icon={<SquareKanban size={16} />}
            />
            <WorkspaceItem
              href={PAGES.WORKSPACE_MEMBERS(workspace.id)}
              label={!collapsed ? "Участники" : ""}
              icon={<Users size={16} />}
              hasChevron
            />
            <WorkspaceItem
              href={PAGES.WORKSPACE_ACCOUNT(workspace.id)}
              label={!collapsed ? "Настройки" : ""}
              icon={<Settings size={16} />}
              hasChevron
            />
          </ul>
        </nav>
      )}
    </div>
  );
}
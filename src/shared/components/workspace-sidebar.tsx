"use client";

import { useState } from "react";
import WorkspaceItem from "./workspace-item";
import { Users, Settings, SquareKanban, ChevronDown } from "lucide-react";
import { Workspace } from "../types";
import { PAGES } from "@/config/pages.config";

interface WorkspaceSidebarProps {
    workspace: Workspace;
    collapsed: boolean;
}

export default function WorkspaceSidebar({ workspace, collapsed }: WorkspaceSidebarProps) {
    const [workspaceOpen, setWorkspaceOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setWorkspaceOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#a1bdd914] transition-all
                ${collapsed ? "justify-center px-0" : ""}`}
            >

                <div className="flex items-center gap-2">
                    <div className="w-9 h-8 rounded-md bg-[#1db954] flex items-center justify-center text-black font-bold">
                        {workspace?.name?.[0].toUpperCase() || ""}
                    </div>

                    {!collapsed && (
                        <span className="text-sm text-[#b6c2cf] leading-tight">
                            {workspace?.name || null}
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

            {workspaceOpen && (
                <nav className="mt-3 pl-2 text-sm">
                    <ul className="space-y-1">
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
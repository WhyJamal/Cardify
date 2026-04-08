"use client";

import { useRef, useState, useTransition } from "react";
import { updateWorkspaceLogo, removeWorkspaceLogo } from "@features/workspace/actions";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import type { Workspace } from "@shared/types";
import { Button } from "@shared/components";
import { Trash2, X } from "lucide-react";
import { WorkspaceSmallCard } from "@/shared/components/workspace-small-card";

interface Props {
    workspace: Workspace;
}

export function WorkspaceLogoButton({ workspace }: Props) {
    const { updateWorkspace: updateWorkspaceState } = useWorkspace();
    const [showPanel, setShowPanel] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("logo", file);

        startTransition(async () => {
            const updated = await updateWorkspaceLogo(workspace.id, formData);
            updateWorkspaceState(updated);
            setShowPanel(false);
        });
    };

    const handleRemoveLogo = () => {
        startTransition(async () => {
            const updated = await removeWorkspaceLogo(workspace.id);
            updateWorkspaceState(updated);
            setShowPanel(false);
        });
    };

    return (
        <div className="relative">
            <div
                className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setShowPanel((prev) => !prev)}
            >
                <WorkspaceSmallCard
                    size={"lg"}
                    isLogo={workspace.logo ? true : false}
                    logo={workspace.logo}
                    name={workspace.name}
                />

                {hovered && (
                    <div className="absolute inset-0 bg-black/50 flex items-end justify-center pb-1 rounded-lg">
                        <span className="text-white text-[10px] font-medium">Изменить</span>
                    </div>
                )}

                {isPending && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                        <svg className="spinner" viewBox="25 25 50 50">
                            <circle className="spinner-circle" r="20" cy="50" cx="50" />
                        </svg>
                    </div>
                )}
            </div>

            {showPanel && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPanel(false)}
                    />

                    <div className="absolute left-0 top-18 z-20 rounded shadow-xl overflow-hidden min-w-[300] bg-[#2b2c2f]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <span className="text-white text-sm font-medium text-center">Изменить логотип</span>
                            <Button
                                size={"icon-sm"}
                                onClick={() => setShowPanel(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        <div className="flex flex-col py-2 px-4 space-y-1">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isPending}
                            >
                                <UsersIcon />
                                Загрузите новый логотип
                            </Button>

                            {workspace.logo && (
                                <Button
                                    onClick={handleRemoveLogo}
                                    disabled={isPending}
                                    className="w-40"
                                >
                                    <Trash2 className="w-2 h-2" />
                                    Удалить логотип
                                </Button>
                            )}
                        </div>
                    </div>
                </>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

function UsersIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
"use client";

import { useCallback, useState } from "react";
import { workspaceApi } from "@/features/workspace/api/workspace-api";
import { Workspace } from "@/shared/types";

type WorkspaceActions = {
    listWorkspaces: () => Promise<Workspace[]>;
    createWorkspace:(name: string) => Promise<Workspace>;
    loading: boolean;
};

export function useWorkspaceActions(): WorkspaceActions {
    const [loading, setLoading] = useState(false);

    const listWorkspaces = async (): Promise<Workspace[]> => {
        setLoading(true);

        try {
            const res = await workspaceApi.getWorkspaces();
            return Array.isArray(res) ? res : [];
        } finally {
            setLoading(false);
        }
    };

    const createWorkspace = async (name: string) => {
        setLoading(true);
        try {
            const ws = await workspaceApi.createWorkspace(name); 
            return ws.workspace;
        } finally {
            setLoading(false);
        }
    };

    return {
        listWorkspaces,
        createWorkspace,
        loading,
    };
}
"use client";

import { useState } from "react";
import { workspaceApi } from "@features/workspace/api/workspace-api";
import { Workspace, WorkspaceMember } from "@shared/types";

export interface WorkspaceForm {
    name: string;
    type: string;
    description?: string;
}

type WorkspaceActions = {
    listWorkspaces: () => Promise<Workspace[]>;
    createWorkspace: (form: WorkspaceForm) => Promise<Workspace>;
    loadMembers: (workspaceId: string) => Promise<WorkspaceMember[] | undefined>;
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

    const createWorkspace = async (form: { name: string; type: string; description?: string }) => {
        setLoading(true);
        try {
            const ws = await workspaceApi.createWorkspace(form);
            return ws.workspace;
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async (workspaceId: string) => {
        if (!workspaceId) return;

        try {
            setLoading(true);

            const data = await workspaceApi.getWorkspaceMembers(workspaceId);

            return data.members;
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return {
        listWorkspaces,
        createWorkspace,
        loadMembers,
        loading,
    };
}
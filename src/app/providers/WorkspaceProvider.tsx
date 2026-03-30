"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { Workspace } from "@/shared/types";
import { workspaceApi } from "@/features/workspace/api/workspace-api";

type WorkspaceContextType = {
  workspaces: Workspace[];
  loading: boolean;
  refresh: () => Promise<void>;
  addWorkspace: (ws: Workspace) => void;
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (ws: Workspace | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspaceApi.getWorkspaces();
      
      setWorkspaces(Array.isArray(data) ? data : []);

      const wsArray = Array.isArray(data) ? data : [];
      setWorkspaces(wsArray);

      if (!currentWorkspace && wsArray.length > 0) {
        setCurrentWorkspace(wsArray[0]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addWorkspace = (ws: Workspace) => {
    setWorkspaces((prev) => [ws, ...prev]);
    setCurrentWorkspace(ws);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        loading,
        refresh,
        addWorkspace,
        currentWorkspace,
        setCurrentWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be inside provider");
  return ctx;
};
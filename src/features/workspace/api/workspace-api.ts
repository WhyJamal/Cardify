import { clientFetch } from "@/lib/client-api";
import { WorkspaceForm } from "../hooks/use-workspace-actions";

export const workspaceApi = {
  createWorkspace: (form: WorkspaceForm) =>
    clientFetch(`/api/workspaces`, {
      method: "POST",
      body: JSON.stringify(form),
    }),

  getWorkspaces: async () => {
    const res = await clientFetch("/api/workspaces");
    return res.workspaces ?? res;
  },

  getWorkspace: async (workspaceId: string) => {
    const res = await clientFetch(`/api/workspaces/${workspaceId}`);
    return res.workspace;
  },

  getWorkspaceTypes: async () => {
    const res = await clientFetch("/api/workspaces/types");
    return res.types;
  },

  searchUsers: async (params: { q: string; workspaceId?: string }) => {
    const query = new URLSearchParams();
    query.set("q", params.q);

    if (params.workspaceId) {
      query.set("workspaceId", params.workspaceId);
    }

    const res = await clientFetch(`/api/users/search?${query.toString()}`);
    return res.users ?? res;
  },

  addMembersToWorkspace: async (workspaceId: string, userIds: string[]) => {
    const res = await clientFetch(`/api/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: JSON.stringify({ userIds }),
    });

    return res;
  },

  removeMembersFromWorkspace: async (workspaceId: string, userId: string) => {
    const res = await clientFetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
      method: "DELETE",
    });

    return res;
  },

  getWorkspaceMembers: async (workspaceId: string) => {
    const res = await clientFetch(`/api/workspaces/${workspaceId}/members`)
    return res;
  }

};
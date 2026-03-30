import { clientFetch } from "@/lib/client-api";

export const workspaceApi = {
  createWorkspace: (name: string) =>
    clientFetch(`/api/workspaces`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  getWorkspaces: async () => {
    const res = await clientFetch("/api/workspaces");
    return res.workspaces ?? res;
  },

  getWorkspace: async (workspaceId: string) => {
    const res = await clientFetch(`/api/workspaces/${workspaceId}`);
    return res.workspace;
  }
};
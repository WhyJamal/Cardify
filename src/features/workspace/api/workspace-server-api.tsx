"use server";

import { serverFetch } from "@/lib/server-api";

async function getWorkspaceServer(workspaceId: string){
  const res = await serverFetch(`/api/workspaces/${workspaceId}`);
  return res.workspace;
}

export { getWorkspaceServer };
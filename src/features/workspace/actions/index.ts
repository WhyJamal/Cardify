"use server";

import { serverFetch } from "@/lib/server-api";
import { Workspace } from "@shared/types";
import { revalidatePath } from "next/cache";

export type UpdateWorkspaceDto = {
  name: string;
  shortName: string;
  website: string;
  description: string;
};

export async function updateWorkspace(
  workspaceId: string,
  data: UpdateWorkspaceDto
): Promise<Workspace> {
  const res = await serverFetch(`/api/workspaces/${workspaceId}`, {
    method: "PATCH",
    body: data, 
  });

  revalidatePath(`/workspace/${workspaceId}/account`);

  return res.workspace; 
}

export async function deleteWorkspace(workspaceId: string) {
  await serverFetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
  });

  return { success: true };
}

export async function updateWorkspaceLogo(
  workspaceId: string,
  formData: FormData
): Promise<Workspace> {
  const res = await serverFetch(`/api/workspaces/${workspaceId}/logo`, {
    method: "POST",
    body: formData, 
  });

  revalidatePath(`/w/${workspaceId}/account`);
  return res.workspace;
}

export async function removeWorkspaceLogo(workspaceId: string): Promise<Workspace> {
  const res = await serverFetch(`/api/workspaces/${workspaceId}/logo`, {
    method: "DELETE",
  });

  revalidatePath(`/w/${workspaceId}/account`);
  return res.workspace;
}
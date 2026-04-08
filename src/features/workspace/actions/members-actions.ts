"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-api";

export async function removeMember(workspaceId: string, userId: string) {
  await serverFetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
    method: "DELETE",
  });

  revalidatePath(`/w/${workspaceId}/members`);
}
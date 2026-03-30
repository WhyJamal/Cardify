import { clientFetch } from "@/lib/client-api";

export const boardApi = {
  updateColumnTitle: (columnId: string, title: string) =>
    clientFetch(`/api/columns/${columnId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  addMember: (boardId: number, userId: string) =>
    clientFetch(`/api/boards/${boardId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  removeMember: (boardId: number, userId: string) =>
    clientFetch(`/api/boards/${boardId}/members/${userId}`, {
      method: "DELETE",
    }),
};
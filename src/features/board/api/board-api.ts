import { clientFetch } from "@/lib/client-api";
import { BoardLabel } from "@/shared/types";

export const boardApi = {
  updateColumnTitle: (columnId: string, title: string) =>
    clientFetch(`/api/columns/${columnId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  addMember: (boardId: number, userId: string) =>
    clientFetch(`/api/boards/${boardId}/invite`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  removeMember: (boardId: number, userId: string) =>
    clientFetch(`/api/boards/${boardId}/invite/${userId}`, {
      method: "DELETE",
    }),

  updateTitleBoard: (boardId: number | undefined, title: string) =>
    clientFetch(`/api/boards/${boardId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  createLabel: (boardId: number, formData: BoardLabel) => {
    if (!formData) return;

    return clientFetch(`/api/boards/${boardId}/label`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },
};
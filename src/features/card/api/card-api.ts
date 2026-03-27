import { clientFetch } from "@/lib/client-api";

export const cardApi = {
  updateDescription: (cardId: string, description: string) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ description }),
    }),

  updateLabels: (cardId: string, labels: { id: string }[]) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ labels }),
    }),

  updateDueDate: (cardId: string, dueDate: string | null) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ dueDate }),
    }),

  addTimelineComment: (cardId: string, text: string) =>
    clientFetch(`/api/cards/${cardId}/timeline`, {
      method: "POST",
      body: JSON.stringify({ text }),
  }),

  updateIsCompleted: (cardId: string, isCompleted: boolean) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ isCompleted }),
  }),

  updateTitleCard: (cardId: string, title: string) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
  }),
};
import { clientFetch } from "@/lib/client-api";
import { Location } from "@/shared/types";

export const cardApi = {
  getTimeline: (cardId: string) =>
    clientFetch(`/api/cards/${cardId}/timeline`, {
      method: "GET",
    }),

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

  deleteComment: (cardId: string, commentId: string) =>
    clientFetch(`/api/cards/${cardId}/timeline/${commentId}`, {
      method: "DELETE",
    }),

  changeComment: (cardId: string, commentId: string, comment: string) =>
    clientFetch(`/api/cards/${cardId}/timeline/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ comment }),
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

  addMember: (cardId: string, userId: string) =>
    clientFetch(`/api/cards/${cardId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  removeMember: (cardId: string, userId: string) =>
    clientFetch(`/api/cards/${cardId}/members/${userId}`, {
      method: "DELETE",
    }),

  uploadAttachment: (cardId: string, formData: FormData) =>
    clientFetch(`/api/cards/${cardId}/attachments`, {
      method: "POST",
      body: formData,
    }),

  deleteAttachment: (cardId: string, attachmentId: string) =>
    clientFetch(`/api/cards/${cardId}/attachments/${attachmentId}`, {
      method: "DELETE",
    }),

  addLink: (cardId: string, url: string, text: string) =>
    clientFetch(`/api/cards/${cardId}/links`, {
      method: "POST",
      body: JSON.stringify({ url, text }),
    }),

  deleteLink: (cardId: string, linkId: string) =>
    clientFetch(`/api/cards/${cardId}/links/${linkId}`, {
      method: "DELETE",
    }),

  updateBackground: (cardId: string, background: string, isImage: boolean, size: "WIDE" | "TALL" = "WIDE", textColor: string) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ background, isImage, size, textColor }),
    }),

  removeBackground: (cardId: string) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ background: null, isImage: false, textColor: "light" }),
    }),

  uploadCover: (cardId: string, formData: FormData) =>
    clientFetch(`/api/cards/${cardId}/cover`, {
      method: "POST",
      body: formData,
    }),

  updateIsArchive: (cardId: string, isArchive: boolean) =>
    clientFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ isArchive }),
    }),

  addLocation: (cardId: string, location: Location) =>
    clientFetch(`/api/cards/${cardId}/map-location`, {
      method: "POST",
      body: JSON.stringify({ location })
    }),

  removeLocation: (cardId: string) =>
    clientFetch(`/api/cards/${cardId}/map-location`, {
      method: "DELETE"
    }),
};
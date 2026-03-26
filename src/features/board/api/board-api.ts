import { clientFetch } from "@/lib/client-api";

export const boardApi = {
  updateColumnTitle: (columnId: string, title: string) =>
    clientFetch(`/api/columns/${columnId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
};
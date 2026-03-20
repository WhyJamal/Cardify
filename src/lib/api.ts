import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const session = await getSession();
  const token = session?.user?.id;

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
      redirect("/"); 
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}
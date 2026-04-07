import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, any> | null; 
}

export async function serverFetch(path: string, options: ServerFetchOptions = {}) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}${path}`, {
    cache: "no-store",
    headers: {
      "cookie": h.get("cookie") ?? "",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    redirect("/"); 
  }

  if (!res.ok) {
    const text = await res.text();
    notFound();
    // throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}
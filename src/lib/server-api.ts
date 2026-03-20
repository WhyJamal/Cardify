import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function serverFetch(path: string) {
  const h = await headers();

  const host = h.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}${path}`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
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
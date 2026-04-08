import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface ServerFetchOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, any> | FormData | null;
}

export async function serverFetch(path: string, options: ServerFetchOptions = {}) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const isFormData = options.body instanceof FormData;

  let body: BodyInit | null | undefined;
  if (isFormData) {
    body = options.body as FormData;
  } else if (options.body) {
    body = JSON.stringify(options.body);
  } else {
    body = undefined;
  }

  const res = await fetch(`${protocol}://${host}${path}`, {
    cache: "no-store",
    headers: {
      "cookie": h.get("cookie") ?? "",
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    method: options.method || "GET",
    body,
  });

  if (res.status === 401) {
    redirect("/");
  }

  if (!res.ok) {
    notFound();
  }

  return res.json();
}
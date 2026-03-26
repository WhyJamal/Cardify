"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useOpenCardFromQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const openCardPath = searchParams.get("openCardPath");
    if (openCardPath) router.replace(openCardPath);
  }, [router, searchParams]);
}
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGES } from "@/config/pages.config";

export function useOpenQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const openCardPath = searchParams.get("openCardPath");
    const openMap = searchParams.get("openMap");

    // CARD redirect
    if (openCardPath) {
      router.replace(openCardPath);
      return;
    }

    // MAP redirect
    if (openMap) {
      const [lat, lng, zoom] = openMap.split(",");

      const boardId = searchParams.get("boardId");
      const slug = searchParams.get("slug");

      if (boardId && slug && lat && lng && zoom) {
        router.replace(
          PAGES.MAP(parseFloat(boardId), slug, lat, lng, zoom)
        );
      }
    }
  }, [router, searchParams]);
}
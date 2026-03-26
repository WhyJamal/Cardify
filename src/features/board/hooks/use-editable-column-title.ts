"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { boardApi } from "../api/board-api";

type UseEditableColumnTitleParams = {
  columnId: string;
  initialTitle: string;
  onTitleUpdated: (columnId: string, title: string) => void;
};

export function useEditableColumnTitle({
  columnId,
  initialTitle,
  onTitleUpdated,
}: UseEditableColumnTitleParams) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(initialTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditableTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleClick = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditableTitle(initialTitle);
    setIsEditingTitle(false);
  }, [initialTitle]);

  const saveTitle = useCallback(async () => {
    const nextTitle = editableTitle.trim();

    if (!nextTitle) {
      cancelEdit();
      return;
    }

    if (nextTitle === initialTitle) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const res = await boardApi.updateColumnTitle(columnId, nextTitle);
      const title = res?.column?.title ?? nextTitle;

      onTitleUpdated(columnId, title);
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Failed to update column title:", err);
      cancelEdit();
    }
  }, [editableTitle, initialTitle, columnId, onTitleUpdated, cancelEdit]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") void saveTitle();
      if (e.key === "Escape") cancelEdit();
    },
    [saveTitle, cancelEdit]
  );

  const handleTitleBlur = useCallback(() => {
    void saveTitle();
  }, [saveTitle]);

  return {
    isEditingTitle,
    editableTitle,
    setEditableTitle,
    titleInputRef,
    handleTitleClick,
    handleTitleKeyDown,
    handleTitleBlur,
    saveTitle,
    cancelEdit,
  };
}
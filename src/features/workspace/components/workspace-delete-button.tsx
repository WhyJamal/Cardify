"use client";

import { ConfirmDialog } from "@components/ui/confirm-diolog";
import { deleteWorkspace } from "../actions";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { useRouter } from "next/navigation";
import { PAGES } from "@/config/pages.config";

interface Props {
  workspaceId: string;
}

export function WorkspaceDeleteButton({ workspaceId }: Props) {
  const { removeWorkspace } = useWorkspace();
  const router = useRouter();

  async function handleDelete() {
    await deleteWorkspace(workspaceId);
    
    removeWorkspace(workspaceId); 
    router.push(PAGES.HOME);
  }

  return (
    <ConfirmDialog
      title="Удалить рабочее пространство?"
      desc="Это действие нельзя отменить. Все доски и данные будут удалены."
      onConfirm={handleDelete}
    >
      <button
        style={{ color: "#f87168", fontSize: 14 }}
        className="hover:underline"
      >
        Удалить это рабочее пространство?
      </button>
    </ConfirmDialog>
  );
}
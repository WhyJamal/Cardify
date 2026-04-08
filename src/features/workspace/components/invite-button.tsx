"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@components/";
import InviteWorkspaceCard from "@features/workspace/components/invite-workspace-card";
import WorkspaceModal from "@features/workspace/modal/workpace-modal";

interface Props {
  workspaceId: string;
}

export function InviteButton({ workspaceId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="xl" variant="custom" onClick={() => setOpen(true)} className="flex items-center gap-2">
        <UserPlus size={18} />
        Пригласите пользователей в рабочее пространство
      </Button>

      <WorkspaceModal
        title="Пригласить в рабочее пространство"
        open={open}
        onClose={() => setOpen(false)}
      >
        <InviteWorkspaceCard
          workspaceId={workspaceId}
          onSuccess={() => setOpen(false)}
        />
      </WorkspaceModal>
    </>
  );
}
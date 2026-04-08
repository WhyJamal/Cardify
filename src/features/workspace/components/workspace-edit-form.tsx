"use client";

import { useState, useTransition } from "react";
import {
  updateWorkspace as updateWorkspaceAction,
  type UpdateWorkspaceDto
} from "@features/workspace/actions";
import type { Workspace } from "@shared/types";
import { FormInput, Button, FormTextarea } from "@components/";
import { PencilIcon } from "lucide-react";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { WorkspaceLogoButton } from "./workspace-logo-button";

interface Props {
  workspace: Workspace;
}

export function WorkspaceEditForm({ workspace }: Props) {
  const { updateWorkspace: updateWorkspaceState } = useWorkspace();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<UpdateWorkspaceDto>({
    name: workspace.name,
    shortName: workspace.shortName ?? "",
    website: workspace.website ?? "",
    description: workspace.description ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: workspace.name,
      shortName: workspace.shortName ?? "",
      website: workspace.website ?? "",
      description: workspace.description ?? "",
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      const updated = await updateWorkspaceAction(
        workspace.id,
        form
      );

      updateWorkspaceState(updated);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  /* ===================================================== */

  if (isEditing) {
    return (
      <div className="mb-8 max-w-sm space-y-3">

        <p className="text-sm text-gray-400">
          Обязательные поля отмечены <span className="text-red-400">*</span>
        </p>

        <FormInput
          label="Название"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />

        <FormInput
          label="Краткое название"
          name="shortName"
          required
          value={form.shortName}
          onChange={handleChange}
        />

        <FormInput
          label="Веб-сайт"
          name="website"
          value={form.website}
          onChange={handleChange}
        />

        <FormTextarea
          label="Описание"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="flex gap-2 pt-2">
          <Button
            variant={"custom"}
            size={"lg"}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            size={"lg"}
            onClick={handleCancel}
            disabled={isPending}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-8">
      <WorkspaceLogoButton workspace={workspace} />

      <div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">
            {workspace.name}
          </span>

          <Button
            variant={"ghost"}
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>

        <span className="text-sm text-gray-400">
          Приватное
        </span>
      </div>
    </div>
  );
}
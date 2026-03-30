"use client";

import { useState } from "react";
import { Label, Button } from "@/shared/components";
import { useWorkspaceActions } from "@/features/workspace/hooks/use-workspace-actions";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";

export default function CreateWorkspaceCard({ onCreate }: {onCreate: () => void}) {
  const { createWorkspace, loading } = useWorkspaceActions();
  const { addWorkspace } = useWorkspace();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    
    const ws = await createWorkspace(form.name);
    
    addWorkspace(ws);
    onCreate();
    // reset
    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <>
      <div className="relative space-y-4">
        <Label className="text-sm" required>
          Обязательные поля отмечены
        </Label>

        <div className="space-y-2">
          <Label className="text-sm" required>
            Название
          </Label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Название рабочего пространство"
            className="w-full bg-transparent outline-none text-sm border
            border-gray-700 rounded-md px-3 py-2
            focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">
            Описание (опционально)
          </Label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Описание рабочего пространство..."
            className="w-full resize-none bg-transparent outline-none text-sm border
            border-gray-700 rounded-md px-3 py-2
            focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <Button
          onClick={handleCreate}
          disabled={!form.name.trim() || loading}
          size="xl"
          variant="custom"
        >
          {loading ? "Создание..." : "Сохранить"}
        </Button>
      </div>
    </>
  );
}
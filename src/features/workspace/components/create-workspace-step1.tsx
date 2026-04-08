import { Button } from "@components";
import { HelperText, Label } from "./workspace-ui";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/app/providers/WorkspaceProvider";
import { useWorkspaceActions } from "../hooks/use-workspace-actions";
import CustomSelect from "@components/ui/custom-select";
import { workspaceApi } from "../api/workspace-api";

interface Step1Props {
    onContinue: (workspaceId: string) => void;
}

function Step1({
    onContinue,
}: Step1Props) {
    const { createWorkspace, loading } = useWorkspaceActions();
    const { addWorkspace } = useWorkspace();
    const [options, setOptions] = useState<{ key: string; label: string; group?: string }[]>([]);

    const [form, setForm] = useState({
        name: "",
        type: "",
        description: "",
    });

    useEffect(() => {
        async function fetchTypes() {
            try {
                const res = await workspaceApi.getWorkspaceTypes();
                
                setOptions(res || []);
            } catch (err) {
                console.error(err);
                setOptions([]);
            }
        }
        fetchTypes();
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleTypeChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            type: value,
        }));
    };

    const handleCreate = async () => {
        if (!form.name.trim()) return;

        const ws = await createWorkspace(form);
        
        addWorkspace(ws);
        // reset
        setForm({
            name: "",
            type: "",
            description: "",
        });

        onContinue(ws.id);
    };


    return (
        <div>
            <h2 className="text-[#B6C2CF] m-0 mb-2 text-[22px] font-bold">
                Давайте создадим Рабочее пространство
            </h2>
            <p className="text-[#8C9BAB] text-sm m-0 mb-6 leading-relaxed">
                Повысьте продуктивность, упростив доступ ко всем доскам в одном месте.
            </p>

            <Label>Название рабочего пространства</Label>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nova co."
                className="w-full bg-[#22272B] border-2 border-[#388BFF] rounded px-3 py-2 text-[#B6C2CF] text-[15px] outline-none box-border mt-1"
            />
            <HelperText>Это название вашей компании, команды или организации.</HelperText>

            <Label className="mt-4">Тип рабочего пространства</Label>

            <div className="mt-1">
                <CustomSelect
                    options={options.map(o => ({ value: o.key, label: o.label, group: o.group }))}
                    value={form.type}
                    onChange={handleTypeChange}
                    placeholder="Выберите..."
                />
            </div>

            <div className="flex items-baseline gap-2 mt-4">
                <Label>Описание рабочего пространства</Label>
                <span className="text-[#596773] text-[13px]">Необязательно</span>
            </div>
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Наша команда организует всё здесь."
                rows={4}
                className="w-full bg-[#22272B] border border-[#3B4654] rounded px-3 py-2 text-[#B6C2CF] text-sm outline-none resize-none box-border mt-1 leading-relaxed"
            />
            <HelperText>Расскажите участникам о вашем рабочем пространстве в нескольких словах.</HelperText>

            <Button
                variant="custom"
                size="lg"
                onClick={form.name.trim() ? handleCreate : undefined}
                className={`w-full mt-10 px-10 py-5 text-sm ${form.name.trim()
                    ? "cursor-pointer bg-[#388BFF]"
                    : "cursor-default bg-[#2C333A] hover:bg-[#2C333A] text-[#596773]"
                    }`}
            >
                Продолжить
            </Button>
        </div>
    );
}

export { Step1 }
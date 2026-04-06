import { Button } from "@/shared/components";
import { HelperText, Label } from "./workspace-ui";

interface Step1Props {
    workspaceName: string;
    setWorkspaceName: (v: string) => void;
    workspaceType: string;
    setWorkspaceType: (v: string) => void;
    workspaceDesc: string;
    setWorkspaceDesc: (v: string) => void;
    onContinue: () => void;
}

function Step1({
    workspaceName, setWorkspaceName,
    workspaceType, setWorkspaceType,
    workspaceDesc, setWorkspaceDesc,
    onContinue,
}: Step1Props) {
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
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#22272B] border-2 border-[#388BFF] rounded px-3 py-2 text-[#B6C2CF] text-[15px] outline-none box-border mt-1"
            />
            <HelperText>Это название вашей компании, команды или организации.</HelperText>

            <Label className="mt-4">Тип рабочего пространства</Label>
            <div className="relative mt-1">
                <select
                    value={workspaceType}
                    onChange={(e) => setWorkspaceType(e.target.value)}
                    className={`w-full bg-[#22272B] border border-[#3B4654] rounded py-2 pl-3 pr-8 text-[15px] outline-none appearance-none cursor-pointer box-border ${workspaceType ? "text-[#B6C2CF]" : "text-[#596773]"}`}
                >
                    <option value="" disabled className="text-[#596773]">Выберите...</option>
                    <option value="engineering">Инженерия / ИТ</option>
                    <option value="marketing">Маркетинг</option>
                    <option value="education">Образование</option>
                    <option value="sales">Продажи</option>
                    <option value="hr">Кадры</option>
                    <option value="other">Другое</option>
                </select>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <path d="M1 1L6 6L11 1" stroke="#596773" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
                <Label>Описание рабочего пространства</Label>
                <span className="text-[#596773] text-[13px]">Необязательно</span>
            </div>
            <textarea
                value={workspaceDesc}
                onChange={(e) => setWorkspaceDesc(e.target.value)}
                placeholder="Наша команда организует всё здесь."
                rows={4}
                className="w-full bg-[#22272B] border border-[#3B4654] rounded px-3 py-2 text-[#B6C2CF] text-sm outline-none resize-none box-border mt-1 leading-relaxed"
            />
            <HelperText>Расскажите участникам о вашем рабочем пространстве в нескольких словах.</HelperText>

            <Button
                variant="custom"
                size="lg"
                onClick={workspaceName.trim() ? onContinue : undefined}
                className={`w-full mt-10 px-10 py-5 text-sm ${workspaceName.trim()
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
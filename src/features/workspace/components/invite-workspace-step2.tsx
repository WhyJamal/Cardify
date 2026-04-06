import { Button } from "@/shared/components";
import { Label } from "./workspace-ui";
import { Link } from "lucide-react";

interface Step2Props {
    members: string[];
    memberInput: string;
    setMemberInput: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    removeMember: (name: string) => void;
    onClose: () => void;
}

function Step2({ members, memberInput, setMemberInput, onKeyDown, removeMember, onClose }: Step2Props) {
    return (
        <div className="min-h-100 justify-center items-center">
            <h2 className="text-[#B6C2CF] m-0 mb-2 text-[22px] font-bold">
                Пригласите вашу команду
            </h2>
            <p className="text-[#8C9BAB] text-sm m-0 mb-6 leading-relaxed">
                Пригласите до 9 человек по ссылке или введя их имя или email.
            </p>

            <div className="flex items-center justify-between mb-1.5">
                <Label>Участники рабочего пространства</Label>
                <button className="bg-transparent border-none text-[#388BFF] text-[13px] cursor-pointer flex items-center gap-1 p-0 hover:underline">
                    <Link size={13} />
                    Пригласить по ссылке
                </button>
            </div>

            <div className="bg-[#22272B] border-2 border-[#388BFF] rounded p-[6px_10px] flex flex-wrap gap-1.25 items-center min-h-11 box-border mb-4 cursor-text">
                {members.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 bg-[#3B4654] rounded-[3px] px-2 py-0.5 text-[#B6C2CF] text-sm">
                        {m}
                        <button
                            onClick={() => removeMember(m)}
                            className="bg-transparent border-none text-[#8C9BAB] cursor-pointer text-sm p-0 leading-none hover:text-white"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={members.length === 0 ? "Имя или email..." : ""}
                    className="bg-transparent border-none outline-none text-[#B6C2CF] text-sm flex-1 min-w-20 placeholder:text-[#596773]"
                />
            </div>

            <Button
                variant={"custom"}
                size={"lg"}
                className="flex w-full py-5 text-sm"
            >
                Пригласить в рабочее пространство
            </Button>

            <Button
                variant={"link"}
                size={"lg"}
                onClick={onClose}
                className="flex w-full border-none text-[#8C9BAB] text-sm cursor-pointer underline hover:text-[#B6C2CF] transition-colors"
            >
                Сделаю это позже
            </Button>
        </div>
    );
}

export { Step2 }
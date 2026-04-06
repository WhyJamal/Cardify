"use client";

import { useState, useRef, useEffect } from "react";
import { BoardIllustration } from "./components/workspace-illustration";
import { Step1 } from "./components/create-workspace-step1";
import { Step2 } from "./components/invite-workspace-step2";

interface WorkspaceModalProps {
    onClose: () => void;
}

export function WorkspaceModal1({ onClose }: WorkspaceModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [workspaceName, setWorkspaceName] = useState("Taco's Co.");
    const [workspaceType, setWorkspaceType] = useState("");
    const [workspaceDesc, setWorkspaceDesc] = useState("");
    const [members, setMembers] = useState<string[]>(["Sayyodbee Gulomov"]);
    const [memberInput, setMemberInput] = useState("");

    const leftRef = useRef<HTMLDivElement>(null);
    const [panelH, setPanelH] = useState(500);

    useEffect(() => {
        const el = leftRef.current;
        if (!el) return;
        const obs = new ResizeObserver(() => setPanelH(el.offsetHeight));
        obs.observe(el);
        setPanelH(el.offsetHeight);
        return () => obs.disconnect();
    }, [step]);

    const W = 600;
    const dip = W - 30;
    const mid = panelH / 2;
    const c1y = panelH * 0.30;
    const c2y = panelH * 0.30;
    const c3y = panelH * 0.61;
    const c4y = panelH * 0.80;
    const clipPath = `path('M 0 0 L ${W} 0 C ${W} ${c1y}, ${dip} ${c2y}, ${dip} ${mid} C ${dip} ${c3y}, ${W} ${c4y}, ${W} ${panelH + 50} L 0 ${panelH} Z')`;

    const removeMember = (name: string) => setMembers((p) => p.filter((m) => m !== name));

    const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && memberInput.trim()) {
            setMembers((p) => [...p, memberInput.trim()]);
            setMemberInput("");
        }
        if (e.key === "Backspace" && !memberInput && members.length > 0) {
            setMembers((p) => p.slice(0, -1));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
            <div className="relative flex w-[1100] rounded-xl overflow-hidden bg-[#DCF2F8]">

                <div
                    ref={leftRef}
                    style={{ width: W, clipPath, flexShrink: 0 }}
                    className="bg-[#1D2125] px-14 py-10 relative"
                >
                    {step === 1 ? (
                        <Step1
                            workspaceName={workspaceName}
                            setWorkspaceName={setWorkspaceName}
                            workspaceType={workspaceType}
                            setWorkspaceType={setWorkspaceType}
                            workspaceDesc={workspaceDesc}
                            setWorkspaceDesc={setWorkspaceDesc}
                            onContinue={() => setStep(2)}
                        />
                    ) : (
                        <Step2
                            members={members}
                            memberInput={memberInput}
                            setMemberInput={setMemberInput}
                            onKeyDown={handleMemberKeyDown}
                            removeMember={removeMember}
                            onClose={onClose}
                        />
                    )}
                </div>

                <div className="flex-1 bg-[#DCF2F8] flex items-center justify-center px-5 py-10 relative">
                    <BoardIllustration showFriends={step === 2} />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-4.5 bg-transparent border-none cursor-pointer text-[#8C9BAB] text-lg leading-none p-1 z-10 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}






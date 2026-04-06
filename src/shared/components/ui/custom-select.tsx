"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type SelectOption = {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownId = useRef(`cs-${Math.random().toString(36).slice(2)}`);

  const selected = options.find((o) => o.value === value);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 999999,
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (wrapperRef.current?.contains(target)) return;
      if (target.closest(`[data-cs-id="${dropdownId.current}"]`)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    updatePosition();
    setOpen((v) => !v);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <span className="block text-xs font-medium text-slate-400 mb-1 tracking-wide">
          {label}
        </span>
      )}

      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`mt-1.5 w-full flex items-center justify-between bg-[#3a3a3a] border border-white/10 rounded px-3 py-2.5 text-white text-sm hover:bg-[#404040] transition-colors
          ${open ? "border-blue-500 ring-2 ring-blue-500" : ""}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected?.icon && <span className="text-base">{selected.icon}</span>}
          <span className="truncate text-slate-200">
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        createPortal(
          <div
            data-cs-id={dropdownId.current}
            style={dropdownStyle}
            className="bg-[#3a3a3a] border border-white/10 rounded shadow-2xl py-1 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors
                  ${
                    opt.value === value
                      ? "bg-blue-500/20 text-white border-l-2 border-blue-500"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="truncate font-medium">{opt.label}</span>
                  {opt.subtitle && (
                    <span
                      className={`text-xs ${
                        opt.value === value ? "text-blue-400" : "text-slate-500"
                      }`}
                    >
                      {opt.subtitle}
                    </span>
                  )}
                </div>
                {opt.value === value && (
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
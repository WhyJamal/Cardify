"use client";

import { useState, useRef, useEffect } from "react";

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
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <span className="block text-xs font-medium text-slate-400 mb-1 tracking-wide">
          {label}
        </span>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
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

        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full bg-[#3a3a3a] border border-white/10 rounded shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors border-blue-500 
              ${
                opt.value === value
                  ? "bg-blue-500/20 text-white border-l-3"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt.icon && <span className="text-base">{opt.icon}</span>}

              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="truncate font-medium">
                  {opt.label}
                </span>
                {opt.subtitle && (
                  <span
                    className={`text-xs ${
                      opt.value === value
                        ? "text-blue-400"
                        : "text-slate-500"
                    }`}
                  >
                    {opt.subtitle}
                  </span>
                )}
              </div>

              {opt.value === value && (
                <svg
                  className="w-4 h-4 text-blue-400"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


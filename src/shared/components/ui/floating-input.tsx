"use client";

import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps {
  label: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (value: string) => void;
  id: string;
  error?: string;
}

export function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  id,
  error
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative w-full">
      <div
        className="relative w-full"
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className={`
            relative flex items-center w-full rounded-lg border transition-all duration-200
            ${error
              ? "border-[#f28b82] shadow-[0_0_0_1px_#f28b82]"
              : focused
                ? "border-[#1a73e8] shadow-[0_0_0_1px_#1a73e8]"
                : "border-[#5f6368] hover:border-[#e8eaed]"
            }
            bg-transparent
          `}
          style={{ minHeight: "56px" }}
        >
          <label
            htmlFor={id}
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none select-none
              ${isFloating
                ? `top-0 -translate-y-1/2 px-1 text-[12px] 
                ${error
                  ? "text-[#f28b82]"
                  : focused
                    ? "text-[#8ab4f8]"
                    : "text-[#9aa0a6]"
                }`
                : "top-1/2 -translate-y-1/2 text-[16px] text-[#9aa0a6]"
              }
            `}
            style={{
              backgroundColor: isFloating ? "#202124" : "transparent",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {label}
          </label>

          <input
            ref={inputRef}
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            className={`
              w-full bg-transparent outline-none text-[#e8eaed] text-[16px]
              px-3 py-4
              ${isPassword ? "pr-12" : ""}
            `}
            style={{ caretColor: "#8ab4f8" }}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((v) => !v);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#e8eaed] transition-colors duration-150 p-1 rounded-full focus:outline-none"
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={1.8} />
              ) : (
                <Eye size={20} strokeWidth={1.8} />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[12px] text-[#f28b82] px-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

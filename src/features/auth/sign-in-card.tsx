"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { Button, FloatingInput } from "@/shared/components";
import { PAGES } from "@/config/pages.config";

export function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Введите Email";
    if (!password.trim()) newErrors.password = "Введите пароль";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!validateStep()) return;

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    setLoading(false);

    if (res?.error) {
      setError("Неверный email или пароль");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="w-full rounded-[28px] bg-[#151414] shadow-2xl overflow-hidden">
      <div className="relative grid grid-cols-1 lg:grid-cols-2">

        {loading && (
          <div className="absolute top-0 left-0 right-0 h-0.75 z-50 overflow-hidden">
            <div className="h-full w-full bg-[#8ab4f8] animate-loading-bar" />
          </div>
        )}

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-10">
            <Image src="/cardify11.png" alt="cardify" width={50} height={50} />
          </div>

          <h1 className="text-[40px] text-white mb-6">Вход</h1>

          <p className="text-white/90 max-w-md">
            Войдите в свой аккаунт, чтобы управлять задачами,
            проектами и работать вместе с командой.
          </p>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <form onSubmit={onSubmit} className="space-y-4">

            <FloatingInput
              id="email"
              label="Имя пользователя или Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={touched.email ? errors.email : undefined}
            />

            <FloatingInput
              id="password"
              label="Пароль"
              type="password"
              value={password}
              onChange={setPassword}
              error={touched.password ? errors.password : undefined}
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Link
              href={PAGES.SIGN_UP}
              className="inline-block text-[#8ab4f8] text-sm hover:underline"
            >
              Создать аккаунт
            </Link>

            <div className="flex items-center justify-between gap-3 pt-6">
              <Button
                type="button"
                variant="link"
                className="text-white"
                onClick={() =>
                  signIn("google", { callbackUrl: "/" })
                }
              >
                <FcGoogle size={18} />
                Sign in with Google
              </Button>

              <button
                type="submit"
                className="bg-[#8ab4f8] text-[#202124] px-7 py-3 rounded-full font-medium hover:bg-[#aecbfa]"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
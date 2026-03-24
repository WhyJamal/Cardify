"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { Button, FloatingInput } from "@/shared/components";

export function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    setLoading(false);
  };

  return (
    <div className="w-full rounded-[28px] bg-[#151414] shadow-2xl overflow-hidden">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">

        {loading && (
          <div className="absolute top-0 left-0 right-0 h-0.75 z-50 overflow-hidden">
            <div className="h-full w-full bg-[#8ab4f8] animate-loading-bar" />
          </div>
        )}

        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-start">
          <div className="mb-10">
            <Image
              src={'/cardify11.png'}
              alt="cardify"
              width={50}
              height={50}
            />
          </div>

          <h1 className="text-[40px] leading-tight font-normal text-white mb-6">
            Вход
          </h1>

          <p className="text-[16px] leading-7 text-white/90 max-w-md">
            Войдите в свой аккаунт, чтобы управлять задачами, проектами и работать
            вместе с командой в одном удобном пространстве.
          </p>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <FloatingInput
                id="Email"
                label="Имя пользователя или Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
            </div>

            <div>
              <FloatingInput
                id="password"
                label="Пароль"
                type="password"
                value={password}
                onChange={setPassword}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <div className="pt-2">
              <Link
                href="/auth/sign-up"
                className="inline-block text-[#8ab4f8] text-sm hover:underline"
              >
                Создать аккаунт
              </Link>
            </div>


            <div className="flex items-center justify-between gap-3 pt-6">

              <Button
                variant={"link"}
                className="text-white"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <FcGoogle size={18} />
                Sign in with Google
              </Button>

              <button
                type="submit"
                className="bg-[#8ab4f8] text-[#202124] px-7 py-3 rounded-full font-medium hover:bg-[#aecbfa] transition-colors"
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
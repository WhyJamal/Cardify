"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FloatingInput } from "@/shared/components";
import { signIn } from "next-auth/react";

export function SignUpCard() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim())
      newErrors.firstName = "Введите имя";

    if (!form.lastName.trim())
      newErrors.lastName = "Введите фамилию";

    if (!form.email.trim())
      newErrors.email = "Введите email";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!form.password)
      newErrors.password = "Введите пароль";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
      });

      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    setTouched({
      password: true,
      confirmPassword: true,
    });

    if (!validateStep2()) return;

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
      }),
    });

    if (!res.ok) {
      setErrors({ email: "Пользователь уже существует" });
      return;
    }

    setLoading(false);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setErrors({ email: "Ошибка входа" });
      return;
    }

    router.push("/");
    router.refresh();
  };

  const updateField =
    (field: keyof typeof form) =>
      (value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));

        setTouched((prev) => ({ ...prev, [field]: true }));

        setErrors((prev) => ({ ...prev, [field]: "" }));
      };

  return (
    <div className="w-full rounded-[28px] bg-[#151414] shadow-2xl overflow-hidden min-h-[455]">
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
            Создание аккаунта
          </h1>

          <p className="text-[16px] leading-7 text-white/90 max-w-md">
            Заполните данные для регистрации. Сначала имя, фамилия и email,
            затем пароль.
          </p>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <form onSubmit={nextStep} className="space-y-5">
            {step === 1 ? (
              <>
                <FloatingInput
                  id="firstName"
                  label="Введите имя"
                  type="text"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  error={touched.firstName ? errors.firstName : undefined}
                />

                <FloatingInput
                  id="fullName"
                  label="Введите фамилию"
                  type="text"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                />

                <FloatingInput
                  id="email"
                  label="Введите email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  error={touched.email ? errors.email : undefined}
                />

                <div className="flex items-center justify-end gap-3 pt-6">
                  <Link
                    href="/auth/sign-in"
                    className="text-[#8ab4f8] px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
                  >
                    У меня есть аккаунт
                  </Link>

                  <button
                    type="submit"
                    className="bg-[#8ab4f8] text-[#202124] px-7 py-3 rounded-full font-medium hover:bg-[#aecbfa] transition-colors"
                  >
                    Далее
                  </button>
                </div>
              </>
            ) : (
              <>
                <FloatingInput
                  id="password"
                  label="Введите пароль"
                  type="password"
                  value={form.password}
                  onChange={updateField("password")}
                  error={touched.password ? errors.password : undefined}
                />

                <FloatingInput
                  id="confirmPassword"
                  label="Повторите пароль"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                />

                <div className="flex items-center justify-between gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#8ab4f8] px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
                  >
                    Назад
                  </button>

                  <button
                    type="submit"
                    className="bg-[#8ab4f8] text-[#202124] px-7 py-3 rounded-full font-medium hover:bg-[#aecbfa] transition-colors"
                  >
                    Создать аккаунт
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterButton } from "@/components/register/ButtonsRegisterPage";

import { useFormState, Lang } from "@/hooks/useFormState";
import { RegisterTitleText } from "@/components/register/TextRegister";
import { checkAuth } from "@/utils/auth";
import { getLangPath } from "@/utils/linkHelper";
import { useTranslation } from "@/translations";

type Props = {
  lang: Lang;
};

export function RegisterForms({ lang }: Props) {
  const formState = useFormState(lang);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const t = useTranslation(lang);

  const {
    name,
    email,
    password,
    errors,
    handleChange,
    handleSubmit,
    inputClass,
    serverError,
    language,
  } = formState;

  useEffect(() => {
    (async () => {
      const auth = await checkAuth();
      setIsAuth(auth);
      if (auth) router.push(getLangPath("/", lang));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (isAuth === null) return null;

  return (
    <div className="flex justify-center items-center px-4 min-h-screen w-full">
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            console.log("🎯 Form submit event triggered");
            handleSubmit(e);
          }}
          className="flex flex-col items-center justify-center gap-2 w-full"
        >
          <RegisterTitleText lang={language} />

          <div className="w-full max-w-[260px] [@media(min-width:375px)]:max-w-[300px] [@media(min-width:480px)]:max-w-[400px]">
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("name")}
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass(
                "name"
              )}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="w-full max-w-[260px] [@media(min-width:375px)]:max-w-[300px] [@media(min-width:480px)]:max-w-[400px]">
            <input
              type="email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("email")}
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass(
                "email"
              )}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="w-full max-w-[260px] [@media(min-width:375px)]:max-w-[300px] [@media(min-width:480px)]:max-w-[400px]">
            <input
              type="password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={t("password")}
              minLength={8}
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass(
                "password"
              )}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <RegisterButton lang={language} name="reg" />
          {serverError && (
            <p className="text-red-500 text-sm mt-2">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
}

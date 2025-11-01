"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterButton } from "@/components/register/ButtonsRegisterPage";

import { useFormState, Lang } from "@/hooks/useFormState";
import { RegisterTitleText } from "@/components/register/TextRegister";
import { CountryCitySelector } from "@/components/register/CountryCitySelector";
import { API_ENDPOINTS } from "@/config/api";
import { checkAuth } from "@/utils/auth";

type Props = {
  lang: Lang;
};

export function RegisterForms({ lang }: Props) {
  const formState = useFormState(lang); // 👈 передаём сюда lang
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const {
    name,
    email,
    password,
    city,
    country,
    errors,
    fadeOut,
    handleChange,
    handleSubmit,
    inputClass,
    serverError,
    setLang,
    language,
  } = formState;

  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const auth = await checkAuth();
      setIsAuth(auth);
      if (auth) router.push("/");
    })();
  }, [router]);

  useEffect(() => {
    async function fetchCitiesAndCountries() {
      try {
        const [cityRes, countryRes] = await Promise.all([
          fetch(API_ENDPOINTS.cities),
          fetch(API_ENDPOINTS.countries),
        ]);

        if (!cityRes.ok || !countryRes.ok) {
          throw new Error("Ошибка при загрузке городов или стран");
        }

        const citiesJson = await cityRes.json();
        const countriesJson = await countryRes.json();

        setCities(citiesJson);
        setCountries(countriesJson);
      } catch (err) {
        console.error("Ошибка загрузки городов или стран:", err);
      }
    }

    fetchCitiesAndCountries();
  }, []);

  if (isAuth === null) return null;

  return (
    <div className="flex justify-center items-center px-4 min-h-screen">
      <div className="container mx-auto sm:w-xl">
        <form
          onSubmit={(e) => {
            console.log("🎯 Form submit event triggered");
            handleSubmit(e);
          }}
          className="flex flex-col items-center justify-center gap-2"
        >
          <RegisterTitleText lang={language} />

          <div className="w-full max-w-[260px] [@media(min-width:375px)]:max-w-[300px] [@media(min-width:480px)]:max-w-[400px]">
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Name"
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass("name")}`}
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
              placeholder="Email"
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass("email")}`}
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
              placeholder="Password"
              minLength={8}
              required
              className={`w-full px-4 py-2 border rounded-lg ${inputClass("password")}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="max-w-lg mx-auto w-[260px] [@media(min-width:375px)]:w-[300px] [@media(min-width:480px)]:w-[400px]">
            <CountryCitySelector
              lang={language}
              country={country}
              city={city}
              handleChange={handleChange}
              inputClass={inputClass}
            />
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

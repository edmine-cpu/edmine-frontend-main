"use client";

import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";

type Country = {
  id: number;
  name_uk: string;
  name_en: string;
  name_pl: string;
  name_fr: string;
  name_de: string;
};

type City = {
  id: number;
  country_id: number;
  name_uk: string;
  name_en: string;
  name_pl: string;
  name_fr: string;
  name_de: string;
};

type Props = {
  lang: "uk" | "en" | "pl" | "fr" | "de";
  country: string;
  city: string;
  handleChange: (field: string, value: string) => void;
  inputClass: (field: string) => string;
};

export function CountryCitySelector({
  lang,
  country,
  city,
  handleChange,
  inputClass,
}: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [countryRes, cityRes] = await Promise.all([
          fetch(API_ENDPOINTS.countries),
          fetch(API_ENDPOINTS.cities),
        ]);

        const countryJson = await countryRes.json();
        const cityJson = await cityRes.json();

        setCountries(countryJson);
        setCities(cityJson);
      } catch (err) {
        console.error("Ошибка загрузки стран или городов:", err);
      }
    }

    fetchData();
  }, []);

  const getLocalizedName = (item: any): string =>
    item?.[`name_${lang}`] ??
    item?.name_en ??
    Object.values(item).find((v) => typeof v === "string") ??
    "";

  const filteredCities = cities.filter((c) => String(c.country_id) === country);

  return (
    <div className="w-full max-w-lg flex flex-col gap-2">
      <select
        value={country}
        onChange={(e) => handleChange("country", e.target.value)}
        className={`${inputClass("country")} border-1 rounded-md p-2`}
      >
        <option value="">
          -- {lang === "uk" ? "Оберіть країну" : "Select country"} --
        </option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {getLocalizedName(c)}
          </option>
        ))}
      </select>

      <select
        value={city}
        onChange={(e) => handleChange("city", e.target.value)}
        className={`${inputClass("city")} border-1 rounded-md p-2`}
        disabled={!country}
      >
        <option value="">
          -- {lang === "uk" ? "Оберіть місто" : "Select city"} --
        </option>
        {filteredCities.map((c) => (
          <option key={c.id} value={getLocalizedName(c)}>
            {getLocalizedName(c)}
          </option>
        ))}
      </select>
    </div>
  );
}

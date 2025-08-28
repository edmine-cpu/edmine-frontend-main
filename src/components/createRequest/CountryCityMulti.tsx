'use client';

import React from 'react';

type Country = { id: number } & Record<string, string>;
type City = { id: number; country_id: number } & Record<string, string>;

interface Props {
  lang: 'uk' | 'en' | 'pl' | 'fr' | 'de';
  countries: Country[];
  filteredCities: City[];
  country: number | '';
  onCountryChange: (country: number | '') => void;
  city: number | '';
  onCityChange: (city: number | '') => void;
  labels: { country: string; city: string; select: string };
}

export default function CountryCityMulti({ lang, countries, filteredCities, country, onCountryChange, city, onCityChange, labels }: Props) {
  return (
    <div className="flex gap-6 flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">{labels.country}</label>
        <select
          value={country}
          onChange={e => onCountryChange(Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="">Всі регіони</option>
          {countries.map(c => (
            <option key={c.id} value={c.id}>
              {(c as any)[`name_${lang}`] || c.name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">{labels.city}</label>
        <select
          value={city}
          onChange={e => onCityChange(Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
          disabled={!country}
        >
          <option value="">{labels.select}</option>
          {filteredCities.map(c => (
            <option key={c.id} value={c.id}>
              {(c as any)[`name_${lang}`] || (c as any).name_en}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}



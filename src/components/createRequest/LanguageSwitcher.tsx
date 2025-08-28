'use client';

import React from 'react';

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

export const LANG_LABELS: Record<Lang, string> = {
  uk: 'UA',
  en: 'EN',
  pl: 'PL',
  fr: 'FR',
  de: 'DE',
};

interface Props {
  current: Lang;
  onChange: (lang: Lang) => void;
}

export default function LanguageSwitcher({ current, onChange }: Props) {
  return (
    <div className="mb-6 flex gap-4 text-gray-500 text-sm select-none">
      {Object.entries(LANG_LABELS).map(([langKey, label]) => (
        <button
          key={langKey}
          type="button"
          onClick={() => onChange(langKey as Lang)}
          className={`font-semibold ${current === langKey ? 'text-red-600' : 'hover:text-red-600'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}



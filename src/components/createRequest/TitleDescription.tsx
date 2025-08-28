'use client';

import React from 'react';
import { Lang, LANG_LABELS } from './LanguageSwitcher';

interface Props {
  editLang: Lang;
  title: Partial<Record<Lang, string>>;
  description: Partial<Record<Lang, string>>;
  onChange: (field: 'title' | 'description', lang: Lang, value: string) => void;
  labels: { title: string; description: string };
}

export default function TitleDescription({ editLang, title, description, onChange, labels }: Props) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.title} ({LANG_LABELS[editLang]})
        </label>
        <input
          type="text"
          value={title[editLang] || ''}
          onChange={e => onChange('title', editLang, e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.description} ({LANG_LABELS[editLang]})
        </label>
        <textarea
          value={description[editLang] || ''}
          onChange={e => onChange('description', editLang, e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>
    </>
  );
}



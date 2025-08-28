'use client';

import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function ContactEmail({ label, value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        required
      />
    </div>
  );
}



'use client';

import React from 'react';

interface Props {
  budget: string;
  currency: string;
  onBudgetChange: (v: string) => void;
  onCurrencyChange: (v: string) => void;
  currencies: { code: string; label: string }[];
  labels: { budget: string; currency: string };
}

export default function BudgetCurrency({ budget, currency, onBudgetChange, onCurrencyChange, currencies, labels }: Props) {
  return (
    <div className="flex gap-4 flex-wrap items-center">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">{labels.budget}</label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={budget}
          onChange={e => onBudgetChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>
      <div className="min-w-[120px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">{labels.currency}</label>
        <select
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.label} ({c.code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}



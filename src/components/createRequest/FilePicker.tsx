'use client';

import React, { useRef } from 'react';

interface Props {
    label: string;
    files: File[];
    onChange: (files: File[]) => void;
    hint?: string;
}

export default function FilePicker({ label, files, onChange, hint }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files ? Array.from(e.target.files).slice(0, 3) : [];
        onChange(list);
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {/* Кастомная кнопка для выбора файлов */}
            <button
                type="button"
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
                onClick={() => inputRef.current?.click()}
            >
                {files.length > 0
                    ? `${files.length} файл${files.length > 1 ? 'ів' : ''} вибрано`
                    : 'Оберіть файл'}
            </button>

            <input
                type="file"
                multiple
                ref={inputRef}
                onChange={handleFilesChange}
                className="hidden"
                accept="*"
            />

            {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}

            {files.length > 0 && (
                <div className="mt-2 space-y-1">
                    {files.map((f, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between bg-white rounded px-3 py-2 border border-gray-200"
                        >
                            <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
                            <button
                                type="button"
                                onClick={() => onChange(files.filter((_, index) => index !== i))}
                                className="ml-2 text-red-500 hover:text-red-700 font-medium text-sm"
                                title="Видалити файл"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

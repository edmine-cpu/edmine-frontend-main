'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';

type Lang = 'en' | 'de' | 'fr' | 'pl' | 'uk';

interface SearchHeaderProps {
    lang: Lang;
}

export function SearchHeader({ lang }: SearchHeaderProps) {
    const { t } = useTranslation(lang);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Редирект на каталог с параметром поиска
            router.push(`/${lang}/categories?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative">
            {/* Desktop версия */}
            <div className="hidden md:flex items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile версия */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* Expandable search for mobile */}
                {isExpanded && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-200 rounded-lg mt-2 p-4 z-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                autoFocus
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                {t('search')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

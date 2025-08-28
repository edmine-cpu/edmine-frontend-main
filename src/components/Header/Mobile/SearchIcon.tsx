'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

type Lang = 'en' | 'de' | 'fr' | 'pl' | 'uk';

interface SearchResult {
    id: number;
    title: string;
    description: string;
    type: 'bid' | 'user';
}

interface SearchIconProps {
    lang: Lang;
}

export function SearchIcon({ lang }: SearchIconProps) {
    const { t } = useTranslation(lang);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Логика подсказок
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Закрытие подсказок при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Поиск подсказок
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `${API_ENDPOINTS.bids}?search=${encodeURIComponent(searchQuery.trim())}&limit=5`
                );
                if (response.ok) {
                    const data = await response.json();
                    let results: SearchResult[] = [];
                    if (Array.isArray(data)) {
                        results = data.slice(0, 5).map((item: any) => ({
                            id: item.id,
                            title: item.title_uk || item.title_en || item.title || 'Заявка',
                            description: item.description_uk || item.description_en || item.description || 'Опис відсутній',
                            type: 'bid' as const,
                        }));
                    }
                    setSuggestions(results);
                    setShowSuggestions(results.length > 0);
                } else {
                    // fallback предложения
                    const smartSuggestions = [
                        { id: 1, title: `"${searchQuery}" - веб-розробка`, description: 'Створення сайтів та додатків', type: 'bid' as const },
                        { id: 2, title: `"${searchQuery}" - дизайн`, description: 'Графічний дизайн та брендинг', type: 'bid' as const },
                        { id: 3, title: `"${searchQuery}" - копірайтинг`, description: 'Написання текстів та контенту', type: 'bid' as const },
                        { id: 4, title: `"${searchQuery}" - перекладу`, description: 'Переклад документів та текстів', type: 'bid' as const },
                        { id: 5, title: `"${searchQuery}" - маркетинг`, description: 'Просування та реклама', type: 'bid' as const },
                    ];
                    setSuggestions(smartSuggestions);
                    setShowSuggestions(true);
                }
            } catch {
                const localSuggestions = [
                    { id: 1, title: `Шукати "${searchQuery}"`, description: 'Знайти заявки за вашим запитом', type: 'bid' as const },
                    { id: 2, title: 'Веб-розробка', description: 'Створення сайтів та веб-додатків', type: 'bid' as const },
                    { id: 3, title: 'Мобільні додатки', description: 'Розробка iOS та Android', type: 'bid' as const },
                    { id: 4, title: 'Дизайн логотипу', description: 'Створення фірмового стилю', type: 'bid' as const },
                ];
                setSuggestions(localSuggestions);
                setShowSuggestions(true);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/${lang}/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setIsExpanded(false);
            setSearchQuery('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
        if (e.key === 'Escape') setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: SearchResult) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        setIsExpanded(false);
        router.push(`/${lang}/catalog?search=${encodeURIComponent(suggestion.title)}`);
    };

    return (
        <div className="relative" ref={searchRef}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 cursor-pointer hover:opacity-80"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                    />
                </svg>
            </button>

            {isExpanded && (
                <div className="fixed top-16 left-2 right-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                            {loading ? '...' : t('search')}
                        </button>
                    </div>

                    {/* Подсказки */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="mt-2 border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto bg-white">
                            {suggestions.map((s) => (
                                <div
                                    key={s.id}
                                    onClick={() => handleSuggestionClick(s)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                    <p className="text-sm font-medium truncate">{s.title}</p>
                                    {s.description && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {s.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

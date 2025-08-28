'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/translations';
import { API_ENDPOINTS } from '@/config/api';

type Lang = 'en' | 'de' | 'fr' | 'pl' | 'uk';

interface SearchResult {
    id: number;
    title: string;
    description: string;
    category: string;
    budget: string;
    location: string;
    created_at: string;
}

interface SearchComponentProps {
    lang: Lang;
}

export function SearchComponent({ lang }: SearchComponentProps) {
    const t = useTranslation(lang);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Загружаем категории при монтировании
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.categories);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Функция поиска
    const handleSearch = async () => {
        if (!searchQuery.trim() && !selectedCategory) return;
        
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            
            const response = await fetch(`${API_ENDPOINTS.bids}?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data.results || data || []);
            }
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    // Поиск при нажатии Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Поисковая форма */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">{t('searchRequests')}</h2>
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Поле поиска */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Выбор категории */}
                    <div className="md:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">{t('allCategories')}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category[`name_${lang}`] || category.name_en || category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Кнопка поиска */}
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition duration-200 md:w-auto w-full"
                    >
                        {loading ? t('searching') : t('search')}
                    </button>
                </div>
            </div>

            {/* Результаты поиска */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{t('searchResults')} ({results.length})</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((result) => (
                            <div key={result.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
                                <h4 className="font-semibold text-lg mb-2 line-clamp-2">{result.title}</h4>
                                <p className="text-gray-600 mb-3 line-clamp-3">{result.description}</p>
                                
                                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
                                    {result.category && (
                                        <span className="bg-gray-100 px-2 py-1 rounded">{result.category}</span>
                                    )}
                                    {result.budget && (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{result.budget}</span>
                                    )}
                                    {result.location && (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{result.location}</span>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        {new Date(result.created_at).toLocaleDateString()}
                                    </span>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 text-sm">
                                        {t('viewDetails')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Пустые результаты */}
            {!loading && results.length === 0 && searchQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">{t('noResultsFound')}</p>
                </div>
            )}
        </div>
    );
}

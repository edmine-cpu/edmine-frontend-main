"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header/Header';
import { API_ENDPOINTS } from '@/config/api';

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

interface Bid {
    id: number;
    title_uk?: string;
    title_en?: string;
    title_pl?: string;
    title_fr?: string;
    title_de?: string;
    description_uk?: string;
    description_en?: string;
    description_pl?: string;
    description_fr?: string;
    description_de?: string;
    city_id?: number;
    country_id?: number;
    category_ids?: number[];
    under_category_ids?: number[];
    email?: string;
    files?: string[];
    budget?: string;
    currency?: string;
    slug_uk?: string;
    slug_en?: string;
    slug_pl?: string;
    slug_fr?: string;
    slug_de?: string;
    created_at?: string;
    updated_at?: string;
}

interface Category {
    id: number;
    name_uk: string;
    name_en: string;
    name_pl: string;
    name_fr: string;
    name_de: string;
}

interface Subcategory {
    id: number;
    name_uk: string;
    name_en: string;
    name_pl: string;
    name_fr: string;
    name_de: string;
}

interface Country {
    id: number;
    name_uk: string;
    name_en: string;
    name_pl: string;
    name_fr: string;
    name_de: string;
}

interface City {
    id: number;
    name_uk: string;
    name_en: string;
    name_pl: string;
    name_fr: string;
    name_de: string;
}

const T = {
    uk: {
        title: 'Деталі заявки',
        back: '← Назад до категорії',
        category: 'Категорія',
        location: 'Локація',
        contact: 'Контакти',
        budget: 'Бюджет',
        created: 'Створено',
        files: 'Файли',
        noFiles: 'Файлів немає'
    },
    en: {
        title: 'Bid Details',
        back: '← Back to category',
        category: 'Category',
        location: 'Location',
        contact: 'Contact',
        budget: 'Budget',
        created: 'Created',
        files: 'Files',
        noFiles: 'No files'
    },
    pl: {
        title: 'Szczegóły zlecenia',
        back: '← Powrót do kategorii',
        category: 'Kategoria',
        location: 'Lokalizacja',
        contact: 'Kontakt',
        budget: 'Budżet',
        created: 'Utworzono',
        files: 'Pliki',
        noFiles: 'Brak plików'
    },
    fr: {
        title: 'Détails de la demande',
        back: '← Retour à la catégorie',
        category: 'Catégorie',
        location: 'Localisation',
        contact: 'Contact',
        budget: 'Budget',
        created: 'Créé',
        files: 'Fichiers',
        noFiles: 'Aucun fichier'
    },
    de: {
        title: 'Angebotsdetails',
        back: '← Zurück zur Kategorie',
        category: 'Kategorie',
        location: 'Standort',
        contact: 'Kontakt',
        budget: 'Budget',
        created: 'Erstellt',
        files: 'Dateien',
        noFiles: 'Keine Dateien'
    },
} as const;

export default function BidPage({ params }: {
    params: Promise<{ lang: string; categorySlug: string; bidSlug: string }>
}) {
    const resolvedParams = React.use(params);
    const lang = ((resolvedParams.lang as string) || 'en') as Lang;
    const categorySlug = resolvedParams.categorySlug;
    const bidSlug = resolvedParams.bidSlug;
    const t = T[lang];

    const [bid, setBid] = useState<Bid | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [catsRes, subcatsRes, countriesRes, citiesRes] = await Promise.all([
                    fetch(API_ENDPOINTS.categories),
                    fetch(API_ENDPOINTS.subcategories),
                    fetch(API_ENDPOINTS.countries),
                    fetch(API_ENDPOINTS.cities)
                ]);

                if (!catsRes.ok || !subcatsRes.ok || !countriesRes.ok || !citiesRes.ok) {
                    throw new Error('Failed to fetch reference data');
                }

                setCategories(await catsRes.json());
                setSubcategories(await subcatsRes.json());
                setCountries(await countriesRes.json());
                setCities(await citiesRes.json());
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.bids);
                if (!response.ok) throw new Error('Failed to fetch bids');
                const bids: Bid[] = await response.json();

                const foundBid = bids.find(b =>
                    (b.slug_uk === bidSlug) ||
                    (b.slug_en === bidSlug) ||
                    (b.slug_pl === bidSlug) ||
                    (b.slug_fr === bidSlug) ||
                    (b.slug_de === bidSlug) ||
                    (String(b.id) === bidSlug)
                );

                if (foundBid) {
                    setBid(foundBid);
                } else {
                    const idMatch = bidSlug.match(/^bid-(\d+)$/);
                    if (idMatch) {
                        const bidId = parseInt(idMatch[1]);
                        const bidRes = await fetch(API_ENDPOINTS.bidById(bidId));
                        if (bidRes.ok) setBid(await bidRes.json());
                        else setError('Bid not found');
                    } else {
                        setError('Bid not found');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load bid');
            } finally {
                setLoading(false);
            }
        };

        if (bidSlug) fetchBid();
    }, [bidSlug]);

    const getTitle = (b: Bid) => b[`title_${lang}` as keyof Bid] || b.title_en || b.title_uk || 'No title';
    const getDescription = (b: Bid) => b[`description_${lang}` as keyof Bid] || b.description_en || b.description_uk || 'No description';

    const getCategoryNames = (ids?: number[]) => {
        if (!ids) return '—';
        return ids
            .map(id => {
                const cat = categories.find(c => c.id === id);
                if (!cat) return '';
                const key = `name_${lang}` as keyof Category;
                return cat[key] || '';
            })
            .filter(Boolean)
            .join(', ');
    };

    const getSubcategoryNames = (ids?: number[]) => {
        if (!ids) return '—';
        return ids
            .map(id => {
                const sub = subcategories.find(s => s.id === id);
                if (!sub) return '';
                const key = `name_${lang}` as keyof Subcategory;
                return sub[key] || '';
            })
            .filter(Boolean)
            .join(', ');
    };

    const getCountryName = (id?: number) => {
        if (!id) return '—';
        const c = countries.find(c => c.id === id);
        if (!c) return '—';
        const key = `name_${lang}` as keyof Country;
        return c[key] || '—';
    };

    const getCityName = (id?: number) => {
        if (!id) return '—';
        const c = cities.find(c => c.id === id);
        if (!c) return '—';
        const key = `name_${lang}` as keyof City;
        return c[key] || '—';
    };

    if (loading) return (
        <div className="min-h-screen">
            <Header lang={lang} />
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        </div>
    );

    if (error || !bid) return (
        <div className="min-h-screen">
            <Header lang={lang} />
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">{error || 'Bid not found'}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <Header lang={lang} />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <a href={`/${lang}/catalog/${categorySlug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                    {t.back}
                </a>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{getTitle(bid)}</h1>

                    <div className="prose max-w-none mb-8">
                        <p className="text-gray-700 text-lg leading-relaxed">{getDescription(bid)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.category}</h3>
                            <p className="text-gray-700">{getCategoryNames(bid.category_ids)}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.category} (Sub)</h3>
                            <p className="text-gray-700">{getSubcategoryNames(bid.under_category_ids)}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.location}</h3>
                            <p className="text-gray-700">
                                {getCityName(bid.city_id)}, {getCountryName(bid.country_id)}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.budget}</h3>
                            <p className="text-gray-700">
                                {bid.budget && bid.currency ? `${bid.budget} ${bid.currency}` : '—'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.contact}</h3>
                            <p className="text-gray-700">{bid.email || '—'}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.created}</h3>
                            <p className="text-gray-700">
                                {bid.created_at ? new Date(bid.created_at).toLocaleDateString() : '—'}
                            </p>
                        </div>
                    </div>

                    {bid.files && bid.files.length > 0 ? (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.files}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {bid.files.map((file, index) => {
                                    const fileName = file.split('/').pop() || '';
                                    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                                    const isImage = ['jpg','jpeg','png','gif','webp','svg','bmp'].includes(fileExt);
                                    return (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            {isImage ? (
                                                <button
                                                    onClick={() => {
                                                        const overlay = document.createElement('div');
                                                        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                                                        overlay.onclick = () => document.body.removeChild(overlay);

                                                        const img = document.createElement('img');
                                                        img.src = `${API_ENDPOINTS.static}/${file}`;
                                                        img.className = 'max-w-full max-h-full object-contain';
                                                        img.onclick = e => e.stopPropagation();

                                                        const closeBtn = document.createElement('button');
                                                        closeBtn.innerHTML = '✕';
                                                        closeBtn.className = 'absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75';
                                                        closeBtn.onclick = () => document.body.removeChild(overlay);

                                                        overlay.appendChild(img);
                                                        overlay.appendChild(closeBtn);
                                                        document.body.appendChild(overlay);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 break-all w-full text-left"
                                                >
                                                    🖼️ {fileName}
                                                </button>
                                            ) : (
                                                <a
                                                    href={`${API_ENDPOINTS.static}/${file}`}
                                                    download={fileName}
                                                    className="text-blue-600 hover:text-blue-800 break-all"
                                                >
                                                    📎 {fileName}
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : <p>{t.noFiles}</p>}
                </div>
            </div>
        </div>
    );
}

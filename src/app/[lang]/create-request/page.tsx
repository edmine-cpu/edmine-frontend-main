'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LanguageSwitcher, { LANG_LABELS, Lang } from '@/components/createRequest/LanguageSwitcher';
import TitleDescription from '@/components/createRequest/TitleDescription';
import CountryCityMulti from '@/components/createRequest/CountryCityMulti';
import BudgetCurrency from '@/components/createRequest/BudgetCurrency';
import FilePicker from '@/components/createRequest/FilePicker';
import ContactEmail from '@/components/createRequest/ContactEmail';
import { Header } from '@/components/Header/Header';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import { TRANSLATIONS } from '@/translations/create-request';
import { checkAuth } from '@/utils/auth';

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
    country_id: number;
    name_uk: string;
    name_en: string;
    name_pl: string;
    name_fr: string;
    name_de: string;
}

interface Category {
    id: number;
    name: string;
}

const CURRENCIES = [
    { code: 'UAH', label: '₴' },
    { code: 'PLN', label: 'zł' },
    { code: 'EUR', label: '€' },
    { code: 'USD', label: '$' },
];

export default function CreateBidPage() {
    const params = useParams();
    const router = useRouter();
    const langFromUrl = (params.lang as Lang) ?? 'en';
    const lang = LANG_LABELS[langFromUrl] ? langFromUrl : 'en';
    const t = TRANSLATIONS[lang];

    const [editLang, setEditLang] = useState<Lang>(lang);
    const [submitting, setSubmitting] = useState(false);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const [formState, setFormState] = useState<{
        title: Partial<Record<Lang, string>>;
        description: Partial<Record<Lang, string>>;
        files: File[];
        categories: number[];
        subcategories: number[];
        country: number | '';
        city: number | '';
        budget: string;
        currency: string;
        contacts: string;
    }>({
        title: {},
        description: {},
        files: [],
        categories: [],
        subcategories: [],
        country: '',
        city: '',
        budget: '',
        currency: 'UAH',
        contacts: '',
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [filteredCities, setFilteredCities] = useState<City[]>([]);

    const [categoryBlocks, setCategoryBlocks] = useState<{ category: number | ''; subcategory: number | '' }[]>([
        { category: '', subcategory: '' },
    ]);

    useEffect(() => {
        (async () => {
            const auth = await checkAuth();
            setIsAuth(auth);

            if (!auth) {
                // Если пользователь не авторизован, перенаправляем на логин
                router.push(`/${lang}/login`);
                return;
            }

            // Если авторизован, получаем данные пользователя
            try {
                const res = await fetch(API_ENDPOINTS.me, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.email);
                }
            } catch (err) {
                console.error('Ошибка при запросе /me:', err);
            }
        })();
    }, [lang, router]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [catRes, subcatRes, countryRes, cityRes] = await Promise.all([
                    fetch(API_ENDPOINTS.categories),
                    fetch(API_ENDPOINTS.subcategories),
                    fetch(API_ENDPOINTS.countries),
                    fetch(API_ENDPOINTS.cities),
                ]);

                if (!catRes.ok || !subcatRes.ok || !countryRes.ok || !cityRes.ok) {
                    throw new Error('Failed to load reference data');
                }

                const catData: Category[] = await catRes.json();
                const subcatData: any[] = await subcatRes.json();
                const countryData: Country[] = await countryRes.json();
                const cityData: City[] = await cityRes.json();

                setCategories(catData);
                setSubcategories(subcatData);
                setCountries(countryData);
                setCities(cityData);
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }

        // Загружаем данные только если пользователь авторизован
        if (isAuth === true) {
            fetchData();
        }
    }, [isAuth]);

    useEffect(() => {
        if (formState.country) {
            const filtered = cities.filter((c) => c.country_id === formState.country);
            setFilteredCities(filtered);
            setFormState((s) => ({ ...s, city: filtered.some((c) => c.id === Number(s.city)) ? s.city : '' }));
        } else {
            setFilteredCities([]);
            setFormState((s) => ({ ...s, city: '' }));
        }
    }, [formState.country, cities]);

    function handleLangFieldChange(field: 'title' | 'description', langKey: Lang, value: string) {
        setFormState((prev) => ({ ...prev, [field]: { ...(prev[field] || {}), [langKey]: value } }));
    }

    function handleChange<K extends keyof typeof formState>(key: K, value: typeof formState[K]) {
        setFormState((prev) => ({ ...prev, [key]: value }));
    }

    function handleCategoryChange(index: number, value: number | '') {
        setCategoryBlocks((prev) =>
            prev.map((block, i) => (i === index ? { ...block, category: value, subcategory: '' } : block))
        );
        setFormState((prev) => {
            const newCategories = [...prev.categories];
            newCategories[index] = value || undefined;
            return { ...prev, categories: newCategories.filter(Boolean) };
        });
    }

    function handleSubcategoryChange(index: number, value: number | '') {
        setCategoryBlocks((prev) =>
            prev.map((block, i) => (i === index ? { ...block, subcategory: value } : block))
        );
        setFormState((prev) => {
            const newSubcats = [...prev.subcategories];
            newSubcats[index] = value || undefined;
            return { ...prev, subcategories: newSubcats.filter(Boolean) };
        });
    }

    function addCategoryBlock() {
        setCategoryBlocks((prev) => [...prev, { category: '', subcategory: '' }]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const hasTitle = Object.values(formState.title).some((v) => v && v.trim());
        const hasDescription = Object.values(formState.description).some((v) => v && v.trim());

        if (!hasTitle) {
            alert('Будь ласка, заповніть назву заявки хоча б однією мовою');
            return;
        }

        if (!hasDescription) {
            alert('Будь ласка, заповніть опис заявки хоча б однією мовою');
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();

            if (formState.categories.length > 0) {
                data.append('category', formState.categories.join(','));
            }

            data.append('under_category', formState.subcategories.length > 0 ? formState.subcategories.join(',') : '');
            data.append('country', formState.country ? String(formState.country) : '');
            data.append('city', formState.city ? String(formState.city) : '');
            data.append('budget', formState.budget.trim() || '');
            data.append('budget_type', formState.currency.trim() || '');

            // JWT токен будет автоматически отправлен через куки с credentials: 'include'

            (['title', 'description'] as const).forEach((field) => {
                const val = formState[field];
                Object.entries(val).forEach(([langKey, text]) => {
                    if (text && text.trim()) {
                        data.append(`${field}_${langKey}`, text);
                    }
                });
            });

            formState.files.slice(0, 3).forEach((f) => data.append('files', f));

            const res = await fetch(`${API_BASE_URL}/api/${lang}/create-request-fast`, {
                method: 'POST',
                body: data,
                credentials: 'include', // включаем куки для аутентификации
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to create request');

            // Для авторизованных пользователей сразу редиректим в каталог
            router.push(`/${lang}/catalog`);
        } catch (e) {
            console.error('Error creating request:', e);
        } finally {
            setSubmitting(false);
        }
    }

    // Показываем загрузку пока проверяется авторизация
    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    // Если не авторизован, компонент не рендерится (произойдет редирект)
    if (isAuth === false) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <div className="pb-8">
                <Header lang={lang as any} />
            </div>
            <div className="flex items-center justify-center px-4 pb-10">
                <section className="max-w-150 bg-white rounded-md shadow-md p-8">
                    <div className="mb-4">
                        <LanguageSwitcher current={editLang} onChange={(l) => setEditLang(l)} />
                    </div>
                    <h1 className="text-2xl font-semibold mb-6 text-red-600 text-center">{t.title}</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <TitleDescription
                            editLang={editLang}
                            title={formState.title}
                            description={formState.description}
                            onChange={handleLangFieldChange}
                            labels={{ title: t.bidTitle, description: t.description }}
                        />

                        <FilePicker
                            label={t.addFile}
                            files={formState.files}
                            onChange={(fs) => handleChange('files', fs)}
                            hint={'До 3 файлів'}
                        />

                        <div>
                            <label className="block font-medium mb-2">{t.category}</label>
                            {categoryBlocks.map((block, index) => (
                                <div key={index} className="mb-4 space-y-2">
                                    <select
                                        value={block.category}
                                        onChange={(e) => handleCategoryChange(index, Number(e.target.value) || '')}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">{t.select}</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {(cat as any)[`name_${lang}`] || cat.name_en || cat.name}
                                            </option>
                                        ))}
                                    </select>

                                    {block.category && (
                                        <select
                                            value={block.subcategory}
                                            onChange={(e) => handleSubcategoryChange(index, Number(e.target.value) || '')}
                                            className="border p-2 rounded w-full"
                                        >
                                            <option value="">{t.select}</option>
                                            {subcategories
                                                .filter(
                                                    (sc) =>
                                                        (sc as any).category_id === block.category ||
                                                        (sc as any).full_category_id === block.category
                                                )
                                                .map((sc) => (
                                                    <option key={sc.id} value={sc.id}>
                                                        {(sc as any)[`name_${lang}`] || sc.name_en || sc.name}
                                                    </option>
                                                ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCategoryBlock}
                                className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                ➕ {t.addCategory || 'Выбрать ещё одну категорию'}
                            </button>
                        </div>

                        <CountryCityMulti
                            lang={lang as Lang}
                            countries={countries as any}
                            filteredCities={filteredCities as any}
                            country={formState.country}
                            onCountryChange={(v) => handleChange('country', v as any)}
                            city={formState.city}
                            onCityChange={(v) => handleChange('city', v)}
                            labels={{ country: t.country, city: t.city, select: t.select }}
                        />

                        <BudgetCurrency
                            budget={formState.budget}
                            currency={formState.currency}
                            onBudgetChange={(v) => handleChange('budget', v)}
                            onCurrencyChange={(v) => handleChange('currency', v)}
                            currencies={CURRENCIES}
                            labels={{ budget: t.budget, currency: t.currency }}
                        />

                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`button-inverse-Head ${
                                    submitting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                } transition`}
                            >
                                {submitting ? t.submitting : t.submit}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}3
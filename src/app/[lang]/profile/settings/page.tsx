'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {Header} from "@/components/Header/Header";
import { API_ENDPOINTS } from '@/config/api';

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const LANG_LABELS: Record<Lang, string> = {
    uk: 'Українська',
    en: 'English',
    pl: 'Polski',
    fr: 'Français',
    de: 'Deutsch',
}

const TRANSLATIONS = {
    uk: {
        name: "Ім'я",
        email: 'Email',
        city: 'Місто',
        country: 'Країна',
        companyName: 'Назва компанії',
        companyDescription: 'Опис компанії',
        saveBtn: 'Зберегти',
        editingLangLabel: 'Редагування мовою',
    },
    en: {
        name: 'Name',
        email: 'Email',
        city: 'City',
        country: 'Country',
        companyName: 'Company Name',
        companyDescription: 'Company Description',
        saveBtn: 'Save',
        editingLangLabel: 'Editing language',
    },
    pl: {
        name: 'Imię',
        email: 'Email',
        city: 'Miasto',
        country: 'Kraj',
        companyName: 'Nazwa firmy',
        companyDescription: 'Opis firmy',
        saveBtn: 'Zapisz',
        editingLangLabel: 'Edytuj w języku',
    },
    fr: {
        name: 'Nom',
        email: 'Email',
        city: 'Ville',
        country: 'Pays',
        companyName: "Nom de l'entreprise",
        companyDescription: "Description de l'entreprise",
        saveBtn: "Enregistrer",
        editingLangLabel: "Langue d'édition",
    },
    de: {
        name: 'Name',
        email: 'Email',
        city: 'Stadt',
        country: 'Land',
        companyName: 'Firmenname',
        companyDescription: 'Firmenbeschreibung',
        saveBtn: 'Speichern',
        editingLangLabel: 'Bearbeitungssprache',
    },
}

interface Country {
    id: number
    name_uk: string
    name_en: string
    name_pl: string
    name_fr: string
    name_de: string
}

interface City {
    id: number
    country_id: number
    name_uk: string
    name_en: string
    name_pl: string
    name_fr: string
    name_de: string
}

interface UserResponse {
    id: number
    name: string
    email: string
    city: number // city id
    country: number // country id
    company_name: Partial<Record<Lang, string | null>>
    company_description: Partial<Record<Lang, string | null>>
    language: Lang
}

export default function ProfilePage() {
    const params = useParams()
    const router = useRouter()
    const langFromUrl = (params.lang as Lang) ?? 'en'
    const lang = LANG_LABELS[langFromUrl] ? langFromUrl : 'en'

    const [editLang, setEditLang] = useState<Lang>(lang)
    const [user, setUser] = useState<UserResponse | null>(null)
    const [formState, setFormState] = useState<Partial<UserResponse>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isAuth, setIsAuth] = useState(false)

    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [filteredCities, setFilteredCities] = useState<City[]>([])

    const t = TRANSLATIONS[lang]

    useEffect(() => {
        async function loadCountries() {
            try {
                const res = await fetch(API_ENDPOINTS.countries)
                const data: Country[] = await res.json()
                setCountries(data)
            } catch (e) {
                console.error('Failed to load countries', e)
            }
        }
        async function loadCities() {
            try {
                const res = await fetch(API_ENDPOINTS.cities)
                const data: City[] = await res.json()
                setCities(data)
            } catch (e) {
                console.error('Failed to load cities', e)
            }
        }
        loadCountries()
        loadCities()
    }, [])

    // Фильтруем города при смене страны или загрузке пользователя
    useEffect(() => {
        if (formState.country) {
            setFilteredCities(cities.filter(c => c.country_id === formState.country))
            // Если выбранный город не относится к выбранной стране — сбрасываем
            if (formState.city && !cities.find(c => c.id === formState.city && c.country_id === formState.country)) {
                setFormState(prev => ({ ...prev, city: undefined }))
            }
        } else {
            setFilteredCities([])
            setFormState(prev => ({ ...prev, city: undefined }))
        }
    }, [formState.country, cities])

    useEffect(() => {
        async function init() {
            // Проверка авторизации через запрос /api/me
            const meRes = await fetch(API_ENDPOINTS.me, {
                credentials: 'include',
            })
            if (meRes.status === 401) {
                setIsAuth(false)
                router.push(`/${lang}/login`)
                return
            }
            setIsAuth(true)
            const meData = await meRes.json()
            await fetchUser(meData.id)
            setLoading(false)
        }
        init()
    }, [])

    async function fetchUser(userId: number) {
        try {
                    const res = await fetch(`${API_ENDPOINTS.profileById(userId)}`, {
            credentials: 'include',
        })
            if (!res.ok) throw new Error('Failed to fetch user profile')
            const data: UserResponse = await res.json()

            // Разворачиваем company_name и company_description из отдельных полей
            const company_name: Partial<Record<Lang, string | null>> = {}
            const company_description: Partial<Record<Lang, string | null>> = {}
            ;(['uk', 'en', 'pl', 'fr', 'de'] as Lang[]).forEach(l => {
                company_name[l] = (data as any)[`company_name_${l}`] ?? null
                company_description[l] = (data as any)[`company_description_${l}`] ?? null
            })

            setUser(data)
            setFormState({
                ...data,
                company_name,
                company_description,
            })
        } catch (error) {
            console.error(error)
        }
    }

    function handleInputChange<K extends keyof UserResponse>(key: K, value: UserResponse[K]) {
        setFormState(prev => ({ ...prev, [key]: value }))
    }

    function handleCompanyFieldChange(field: 'company_name' | 'company_description', langKey: Lang, value: string) {
        setFormState(prev => ({
            ...prev,
            [field]: {
                ...(prev[field] || {}),
                [langKey]: value,
            },
        }))
    }

    function preparePayload(state: Partial<UserResponse>) {
        const payload: any = { ...state }

        // Разворачиваем company_name и company_description
        if (state.country) {
            payload.country_id = state.country
        }
        delete payload.country

        // Разворачиваем company_name и company_description
        if (state.company_name) {
            ;(['uk', 'en', 'pl', 'fr', 'de'] as Lang[]).forEach(l => {
                payload[`company_name_${l}`] = state.company_name?.[l] ?? null
            })
            delete payload.company_name
        }

        if (state.company_description) {
            ;(['uk', 'en', 'pl', 'fr', 'de'] as Lang[]).forEach(l => {
                payload[`company_description_${l}`] = state.company_description?.[l] ?? null
            })
            delete payload.company_description
        }

        // Убираем поля, которые сервер не ожидает
        delete payload.id

        return payload
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return
        setSaving(true)
        try {
            const payload = preparePayload(formState)

            const res = await fetch(`${API_ENDPOINTS.profileById(userId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('Failed to save')
            const updatedUser = await res.json()

            // Разворачиваем обратно для локального состояния
            const company_name: Partial<Record<Lang, string | null>> = {}
            const company_description: Partial<Record<Lang, string | null>> = {}
            ;(['uk', 'en', 'pl', 'fr', 'de'] as Lang[]).forEach(l => {
                company_name[l] = (updatedUser as any)[`company_name_${l}`] ?? null
                company_description[l] = (updatedUser as any)[`company_description_${l}`] ?? null
            })

            setUser(updatedUser)
            setFormState({
                ...updatedUser,
                company_name,
                company_description,
            })
            alert('Дані збережено успішно!')
        } catch (e) {
            console.error(e)
            alert('Помилка при збереженні')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="min-h-screen flex justify-center items-center">Завантаження...</div>
    if (!isAuth) return null

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header lang={lang}/>

            <main className="flex-grow flex justify-center items-start pt-12 px-4 sm:px-6 lg:px-8">
                <section className="w-full max-w-3xl bg-white rounded-md shadow-md p-8">
                    <div className="mb-6 flex gap-2 flex-wrap">
                        <span className="self-center font-semibold text-red-600">{t.editingLangLabel}:</span>
                        {Object.entries(LANG_LABELS).map(([langKey, label]) => (
                            <button
                                key={langKey}
                                onClick={() => setEditLang(langKey as Lang)}
                                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                                    editLang === langKey
                                        ? 'bg-red-600 text-white border-red-600'
                                        : 'bg-white text-red-600 border-red-600 hover:bg-red-100'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.name}
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formState.name ?? ''}
                                onChange={e => handleInputChange('name', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.email}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formState.email ?? ''}
                                onChange={e => handleInputChange('email', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.country}
                            </label>
                            <select
                                id="country"
                                value={formState.country ?? ''}
                                onChange={e => handleInputChange('country', Number(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                            >
                                <option value="" disabled>
                                    -- {t.country} --
                                </option>
                                {countries.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {(c as any)[`name_${lang}`] || c.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.city}
                            </label>
                            <select
                                id="city"
                                value={formState.city ?? ''}
                                onChange={e => handleInputChange('city', Number(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                                disabled={!formState.country}
                            >
                                <option value="" disabled>
                                    -- {t.city} --
                                </option>
                                {filteredCities.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {(c as any)[`name_${lang}`] || c.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.companyName} ({LANG_LABELS[editLang]})
                            </label>
                            <input
                                id="company_name"
                                type="text"
                                value={(formState.company_name?.[editLang] ?? '') as string}
                                onChange={e => handleCompanyFieldChange('company_name', editLang, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="company_description" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.companyDescription} ({LANG_LABELS[editLang]})
                            </label>
                            <textarea
                                id="company_description"
                                value={(formState.company_description?.[editLang] ?? '') as string}
                                onChange={e => handleCompanyFieldChange('company_description', editLang, e.target.value)}
                                rows={4}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`text-white px-4 py-2 rounded-md font-semibold ${
                                    saving ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                } transition`}
                            >
                                {saving ? 'Збереження...' : t.saveBtn}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}

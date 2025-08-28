'use client'

import { useState, useEffect } from 'react'
import { Lang } from '@/app/(types)/lang'

const texts = {
    uk: { placeholder: 'Пошук...', searchBtn: 'Шукати' },
    en: { placeholder: 'Search...', searchBtn: 'Search' },
    pl: { placeholder: 'Szukaj...', searchBtn: 'Szukaj' },
    fr: { placeholder: 'Recherche...', searchBtn: 'Rechercher' },
    de: { placeholder: 'Suche...', searchBtn: 'Suchen' },
} as const

interface SearchInputProps {
    lang: Lang
}

export function SearchInput({ lang }: SearchInputProps) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 640)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Search:', query)
        setIsOpen(false)
    }

    const t = texts[lang]

    return (
        <div className="relative">
            {/* Кнопка лупы на мобилках */}
            {!isDesktop && (
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="sm:hidden"
                    aria-label="Open search"
                >
                    <svg
                        className="w-6 h-6 font-bold text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                        />
                    </svg>
                </button>
            )}

            {/* Поле поиска для десктопа */}
            {isDesktop && (
                <form onSubmit={handleSubmit} className="relative max-w-xs sm:flex">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={t.placeholder}
                        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none"
                    />
                    <svg
                        className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none dark:text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                        />
                    </svg>
                </form>
            )}

            {/* Выпадающее окно поиска на мобилках с анимацией */}
            <div
                className={`fixed top-[10%] bg-white rounded-md shadow-md z-50 p-3
                transition-opacity duration-300 ease-in-out
                ${isOpen && !isDesktop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{
                    width: '90vw',
                    maxWidth: 370,
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                {/* Кнопка закрытия */}
                <button
                    aria-label="Close search"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-800 mb-2 self-end text-2xl font-bold"
                    style={{ lineHeight: 1 }}
                >
                    ×
                </button>

                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={t.placeholder}
                        className="flex-grow border border-black rounded-l-md text-black focus:outline-none focus:ring-0"
                    />
                    <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-r-md font-semibold transition"
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 100 }}
                    >
                        {t.searchBtn}
                    </button>
                </form>
            </div>
        </div>
    )
}

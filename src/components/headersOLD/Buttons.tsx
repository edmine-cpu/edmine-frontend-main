'use client'

import { useState } from "react";
import Link from "next/link";
import { UrlObject } from "url";

interface TabLinkProps {
    href: string | UrlObject;
    name: string;
    mobile?: boolean;
}

export function TabLink({ href, name, mobile = false }: TabLinkProps) {
    if (mobile) {
        return (
            <Link
                href={href}
                className="text-center px-3 py-4 font-semibold text-blue-900 hover:bg-gray-100 rounded-md"
            >
                {name}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className="hidden sm:inline font-semibold text-blue-900"
        >
            {name}
        </Link>
    );
}

type Lang = "uk" | "en" | "pl" | "fr" | "de";

const texts = {
    uk: {
        addTask: "ДОДАТИ ЗАВДАННЯ",
        login: "УВІЙТИ",
        howItWorks: "ЯК ЦЕ ПРАЦЮЄ",
        catalog: "КАТАЛОГ",
        blog: "БЛОГ",
        chats: "ЧАТИ",
        profile: "ПРОФІЛЬ",
    },
    en: {
        addTask: "ADD TASK",
        login: "LOGIN",
        howItWorks: "HOW IT WORKS",
        catalog: "CATALOG",
        blog: "BLOG",
        chats: "CHATS",
        profile: "PROFILE",
    },
    pl: {
        addTask: "DODAJ ZADANIE",
        login: "ZALOGUJ SIĘ",
        howItWorks: "JAK TO DZIAŁA",
        catalog: "KATALOG",
        blog: "BLOG",
        chats: "CZATY",
        profile: "PROFIL",
    },
    fr: {
        addTask: "AJOUTER UNE TÂCHE",
        login: "SE CONNECTER",
        howItWorks: "COMMENT ÇA MARCHE",
        catalog: "CATALOGUE",
        blog: "BLOG",
        chats: "CHATS",
        profile: "PROFIL",
    },
    de: {
        addTask: "AUFGABE HINZUFÜGEN",
        login: "ANMELDEN",
        howItWorks: "WIE ES FUNKTIONIERT",
        catalog: "KATALOG",
        blog: "BLOG",
        chats: "CHATS",
        profile: "PROFIL",
    },
};


interface HeaderButtonsProps {
    lang: Lang;
}

export function HeaderButtons({ lang }: HeaderButtonsProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const t = texts[lang];

    return (
        <div className="ml-10">
            {/* Верхняя строка кнопок */}
            <div>
                <button
                    className="hidden sm:inline cursor-pointer bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm font-medium"
                    style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}
                >
                    {t.addTask}
                </button>
                <button className="inline sm:hidden cursor-pointer text-red-600 text-4xl">
                    +
                </button>
                <button className="hidden sm:inline cursor-pointer text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-100 transition duration-200 text-sm font-medium">
                    {t.login}
                </button>
                <button
                    aria-label="Menu"
                    className="inline sm:hidden px-3 py-1 text-4xl cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Выпадающее меню - абсолютное позиционирование с анимацией */}
            <div
                className={`absolute right-0 mt-2 bg-white shadow-md rounded-md p-3 border border-gray-200 min-w-[200px]
          transition-opacity duration-300 ease-in-out
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{ zIndex: 1000 }}
            >
                {/* Кнопка закрытия */}
                <button
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-800 mb-2 self-end text-2xl font-bold"
                >
                    ✕
                </button>

                <TabLink href="/how_it_work" name={t.howItWorks} mobile />
                <TabLink href="/catalog" name={t.catalog} mobile />
                <TabLink href="/blog" name={t.blog} mobile />
            </div>
        </div>
    );
}

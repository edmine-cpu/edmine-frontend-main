'use client'

import { SearchInput } from "@/components/headersOLD/Search";
import { Utext } from "@/components/headersOLD/Lang";
import { TabLink } from "@/components/Header/TabNav";
import { HeaderButtons } from "@/components/headersOLD/Buttons";
import Link from "next/link";
import { Lang } from "@/app/(types)/lang";
import { useState, useEffect } from "react";

interface HeaderProps {
  lang: Lang;
}

const texts = {
  uk: {
    addTask: 'ДОДАТИ ЗАВДАННЯ',
    login: 'УВІЙТИ',
    howItWorks: 'ЯК ЦЕ ПРАЦЮЄ',
    catalog: 'КАТЕГОРІЇ',
    blog: 'БЛОГ',
  },
  en: {
    addTask: 'ADD TASK',
    login: 'LOGIN',
    howItWorks: 'HOW IT WORKS',
    catalog: 'CATEGORIES',
    blog: 'BLOG',
  },
  pl: {
    addTask: 'DODAJ ZADANIE',
    login: 'ZALOGUJ SIĘ',
    howItWorks: 'JAK TO DZIAŁA',
    catalog: 'KATEGORIE',
    blog: 'BLOG',
  },
  fr: {
    addTask: 'AJOUTER UNE TÂCHE',
    login: 'SE CONNECTER',
    howItWorks: 'COMMENT ÇA MARCHE',
    catalog: 'CATÉGORIES',
    blog: 'BLOG',
  },
  de: {
    addTask: 'AUFGABE HINZUFÜGEN',
    login: 'ANMELDEN',
    howItWorks: 'WIE ES FUNKTIONIERT',
    catalog: 'KATEGORIEN',
    blog: 'BLOG',
  },
} as const;

export function Header({ lang }: HeaderProps) {
  const t = texts[lang];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container sm:max-w/1600 mx-auto ml-4">
      <header className="pt-3 flex justify-start gap-15 items-center flex-wrap sm:gap-15">
        <Link href="/">
          <span className="">
            <span className="inline sm:hidden text-3xl font-bold text-red-600">М</span>
            <span className="hidden sm:inline text-3xl font-bold text-red-600">MAKE</span>
            <span className="hidden sm:inline italic uppercase font-medium text-3xl text-red-600">ASAP</span>
          </span>
        </Link>
        <Utext />
        {mounted ? <SearchInput lang={lang} /> : <div style={{ width: '200px', height: '40px' }} />}
        <div className="hidden sm:flex gap-5">
          <TabLink href="/how_it_work" name={t.howItWorks} />
          <TabLink href="/catalog" name={t.catalog} />
          <TabLink href="/blog" name={t.blog} />
        </div>
        <HeaderButtons lang={lang} />
      </header>
    </div>
  );
}

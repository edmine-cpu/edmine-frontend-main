import {TitleName} from "@/components/Header/Desktop/TitleName";
import {LanguageSwitcher} from "@/components/Header/LanguageSwitcher";
import {SearchBid} from "@/components/Header/Desktop/SearchBid";
import {TabLink} from "@/components/headersOLD/Buttons";
import {HeaderButtons} from "@/components/Header/Desktop/Buttons";
import {Lang} from "@/app/(types)/lang";


interface HeaderProps {
    lang: Lang;
}

export const texts = {
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

export function DesktopHeader({lang}: HeaderProps) {

    const t = texts[lang] || texts.uk; // fallback to Ukrainian

    return (
        <header className="flex items-center justify-between container mx-auto mt-3">
            <TitleName lang={lang} />
            <LanguageSwitcher currentLang={lang} />
            <SearchBid lang={lang}/>
            <TabLink href={`/${lang || 'en'}/catalog`} name={t.catalog} mobile />
            <TabLink href={`/${lang || 'en'}/blog`} name={t.blog} mobile />
            <HeaderButtons lang={lang || 'en'}/> 

        </header>
    )
}

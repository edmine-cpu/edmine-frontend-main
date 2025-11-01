import Link from "next/link"
import './main.css';

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const texts = {
    uk: {
        addTask: 'ДОДАТИ ЗАВДАННЯ',
        becomeExecutor: 'СТАТИ ВИКОНАВЦЕМ',
    },
    en: {
        addTask: 'ADD TASK',
        becomeExecutor: 'BECOME AN EXECUTOR',
    },
    pl: {
        addTask: 'DODAJ ZADANIE',
        becomeExecutor: 'ZOSTAŃ WYKONAWCĄ',
    },
    fr: {
        addTask: 'AJOUTER UNE TÂCHE',
        becomeExecutor: 'DEVENIR PRESTATAIRE',
    },
    de: {
        addTask: 'AUFGABE HINZUFÜGEN',
        becomeExecutor: 'AUFTRAGNEHMER WERDEN',
    },
} as const

interface IndexButtonsProps {
    lang: Lang
}

export function IndexButtons({ lang }: IndexButtonsProps) {
    const t = texts[lang]

    return (
        <div className="flex justify-center items-center gap-4 flex-wrap">
                <Link href={`/${lang}/create-request`}>
                     <button className="button-inverse">
                 {t.addTask}
                   </button>
            </Link>
            <Link href={`/${lang}/register`}>
                <button className="button">
                    {t.becomeExecutor}
                </button>
            </Link>
        </div>
    )
}

import {IndexButtons} from "@/components/indexMain/ButtonsIndexPage"
type Lang = 'en' | 'de' | 'fr' | 'pl' | 'uk';


const texts = {
    uk: {
        headline: 'Будь-які послуги та виробництво по всьому світу',
        subhead: 'Без посередників, переплат і втрат часу',
        paragraph1: 'В нашій базі - перевірені виробники, студії дизайну, розробники, 3D-друкарні, текстильні фабрики, фрилансери та агенції з усього',
        paragraph2: 'світу. Розміщуйте заявку і отримуйте вигідні пропозиції напряму.',
    },
    en: {
        headline: 'Any services and manufacturing around the world',
        subhead: 'No intermediaries, overpayments or time loss',
        paragraph1: 'Our database includes verified manufacturers, design studios, developers, 3D printing services, textile factories, freelancers, and agencies from all over the',
        paragraph2: 'world. Submit a request and receive profitable offers directly.',
    },
    pl: {
        headline: 'Wszelkie usługi i produkcja na całym świecie',
        subhead: 'Bez pośredników, przepłat i straty czasu',
        paragraph1: 'W naszej bazie znajdują się zweryfikowani producenci, studia projektowe, programiści, drukarnie 3D, fabryki tekstyliów, freelancerzy i agencje z całego',
        paragraph2: 'świata. Złóż zapytanie i otrzymuj korzystne oferty bezpośrednio.',
    },
    fr: {
        headline: 'Tous les services et fabrications dans le monde entier',
        subhead: 'Sans intermédiaires, surcoûts ni perte de temps',
        paragraph1: 'Notre base comprend des fabricants vérifiés, des studios de design, des développeurs, des imprimeries 3D, des usines textiles, des freelances et des agences de tout le',
        paragraph2: 'monde. Déposez une demande et recevez des offres avantageuses directement.',
    },
    de: {
        headline: 'Alle Dienstleistungen und Produktionen weltweit',
        subhead: 'Ohne Zwischenhändler, Überzahlungen und Zeitverlust',
        paragraph1: 'In unserer Datenbank befinden sich geprüfte Hersteller, Designstudios, Entwickler, 3D-Druckereien, Textilfabriken, Freiberufler und Agenturen aus der ganzen',
        paragraph2: 'Welt. Stellen Sie eine Anfrage und erhalten Sie direkte, günstige Angebote.',
    },
} as const

interface MainPageProps {
    lang: Lang
}


export function MainPage({ lang }: MainPageProps) {
    const t = texts[lang]

    return (
        <div className="min-h-screen container mx-auto flex flex-col justify-center items-center text-center px-4">
            <div className="w-full">
                <h1 className="font-black text-2xl lg:text-3xl mb-6">
                    {t.headline}
                </h1>
                <p className="mb-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    {t.subhead}
                </p>
                <div className="mb-8">
                    <IndexButtons lang={lang}/>
                </div>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-gray-700 leading-relaxed mb-4">{t.paragraph1}</h2>
                    <p className="text-gray-700 leading-relaxed">{t.paragraph2}</p>
                </div>
            </div>
        </div>
    )
}



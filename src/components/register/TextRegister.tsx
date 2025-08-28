type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

const registerTexts = {
    uk: 'Реєстрація користувача',
    en: 'User Registration',
    pl: 'Rejestracja użytkownika',
    fr: "Inscription de l'utilisateur",
    de: 'Benutzerregistrierung',
};

export function RegisterTitleText({ lang }: { lang: Lang }) {
    return (
        <span className="mb-4 text-xl font-bold">
            {registerTexts[lang]}
        </span>
    );
}

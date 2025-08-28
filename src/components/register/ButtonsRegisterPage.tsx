type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';
type BtnType = 'reg' | 'lgn';

const texts = {
    reg: {
        uk: 'Зареєструватись',
        en: 'Register',
        pl: 'Zarejestruj się',
        fr: "S'inscrire",
        de: 'Registrieren',
    },
    lgn: {
        uk: 'Увійти',
        en: 'Login',
        pl: 'Zaloguj się',
        fr: 'Connexion',
        de: 'Anmelden',
    },
};

type Props = {
    lang: Lang;
    name: BtnType;
};

export function RegisterButton({ lang, name }: Props) {
    return (
        <button
            type="submit"
            onClick={() => console.log('🔘 Register button clicked')}
            className="button-register"
        >
            {texts[name][lang] || texts[name].en}
        </button>
    );
}

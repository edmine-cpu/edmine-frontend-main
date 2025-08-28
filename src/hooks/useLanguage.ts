import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export type Language = 'uk' | 'en' | 'pl' | 'fr' | 'de';

const supportedLanguages: Language[] = ['uk', 'en', 'pl', 'fr', 'de'];
const defaultLanguage: Language = 'en';

export function useLanguage() {
    const params = useParams();
    const router = useRouter();
    
    const currentLanguage = useMemo(() => {
        const lang = params?.lang as Language;
        return supportedLanguages.includes(lang) ? lang : defaultLanguage;
    }, [params?.lang]);

    const changeLanguage = (newLanguage: Language) => {
        if (!supportedLanguages.includes(newLanguage)) {
            return;
        }

        const currentPath = window.location.pathname;
        const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}/, '');
        const newPath = `/${newLanguage}${pathWithoutLang}`;
        
        router.push(newPath);
    };

    return {
        currentLanguage,
        changeLanguage,
        supportedLanguages,
        defaultLanguage
    };
}


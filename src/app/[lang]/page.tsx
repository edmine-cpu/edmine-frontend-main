import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLanguage } from "@/utils/getLang";
import { Header } from "@/components/Header/Header";
import { MainPage } from "@/components/indexMain/MainPageComponent";

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

const supportedLanguages: Lang[] = ['en', 'de', 'fr', 'pl', 'uk'];

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const { lang } = resolvedParams;

    if (!supportedLanguages.includes(lang as Lang)) {
        const cookieStore = await cookies();
        const jwt = cookieStore.get("jwt_token")?.value;

        const fallbackLang = getLanguage(jwt) as Lang;
        const safeLang = supportedLanguages.includes(fallbackLang) ? fallbackLang : 'en';
        return redirect(`/${safeLang}`);
    }

    const typedLang = lang as Lang;

    return (
        <div>
            <Header lang={typedLang} />
            <MainPage lang={typedLang} />
        </div>
    );
}

'use client';

import React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { RegisterForms } from "@/components/register/RegisterForms";
import { Lang } from "@/app/(types)/lang";

const supportedLanguages: Lang[] = ['en', 'de', 'fr', 'pl', 'uk'];

export default function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = React.use(params);
    const { lang } = resolvedParams;

    if (!supportedLanguages.includes(lang as Lang)) {
        // For client components, we'll use English as fallback
        const safeLang = 'en';
        return redirect(`/${safeLang}/register`);
    }

    const typedLang = lang as Lang;

    return (
        <div>
            <Header lang={typedLang} />
            <RegisterForms lang={typedLang}/>
        </div>
    );
}

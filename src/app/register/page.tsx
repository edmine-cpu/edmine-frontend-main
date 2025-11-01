import { Header } from "@/components/Header/Header";
import { RegisterForms } from "@/components/register/RegisterForms";
import { Lang } from "@/app/(types)/lang";
import { headers } from "next/headers";

export default async function RegisterPage() {
    const headersList = await headers();
    const lang = (headersList.get('x-locale') || 'en') as Lang;

    return (
        <div>
            <Header lang={lang} />
            <RegisterForms lang={lang} />
        </div>
    );
}

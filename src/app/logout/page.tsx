import { Lang } from '@/app/(types)/lang';
import LogoutForm from '@/components/logout/LogoutForm';
import { headers } from 'next/headers';

export default async function LogoutPage() {
    const headersList = await headers();
    const lang = (headersList.get('x-locale') || 'en') as Lang;

    return <LogoutForm lang={lang} />;
}

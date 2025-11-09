import { Lang } from '@/app/(types)/lang';
import ForgotPasswordForm from '@/components/forgotPassword/ForgotPasswordForm';
import { headers } from 'next/headers';

export default async function ForgotPasswordPage() {
    const headersList = await headers();
    const lang = (headersList.get('x-locale') || 'en') as Lang;

    return <ForgotPasswordForm lang={lang} />;
}

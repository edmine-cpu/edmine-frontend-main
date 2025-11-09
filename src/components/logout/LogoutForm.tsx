'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';
import { getLangPath } from '@/utils/linkHelper';
import { useTranslation, type Lang } from '@/translations';

interface Props {
    lang: Lang;
}

export default function LogoutForm({ lang }: Props) {
    const router = useRouter();
    const t = useTranslation(lang);

    useEffect(() => {
        async function logout() {
            try {
                const res = await fetch(API_ENDPOINTS.logout, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    router.push(getLangPath('/', lang));
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        logout();
    }, [router, lang]);

    return <p>{t('loading')}</p>;
}

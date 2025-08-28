'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import { checkAuth, setAuthCache } from '@/utils/auth';
import { useTranslation, type Lang } from '@/translations';
import { API_ENDPOINTS } from '@/config/api';

interface Props {
    lang: Lang;
}

export default function LoginForm({ lang }: Props) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const router = useRouter();
    const t = useTranslation(lang);

    const validateEmail = (email: string): boolean => {
        if (!email.trim()) {
            setEmailError(true);
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return false;
        }
        setEmailError(false);
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password.trim() || password.length < 6) {
            setPasswordError(true);
            return false;
        }
        setPasswordError(false);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            setIsLoading(false);
            return;
        }

        const payload = { email: email.trim().toLowerCase(), password };

        try {
            const res = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setAuthCache(true);
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('auth-changed'));
                }
                router.push(`/${lang}`);
            } else {
                setError(data.detail || t('invalidCredentials'));
            }
        } catch {
            setError(t('invalidCredentials'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const auth = await checkAuth();
            setIsAuth(auth);
            if (auth) router.push(`/${lang}`);
        })();
    }, [lang, router]);

    if (isAuth === null) {
        return <div>{t('loading')}</div>;
    }

    if (isAuth) {
        return null;
    }

    return (
        <>
            <Header lang={lang} />
            <div className="flex justify-center items-center min-h-screen px-4">
                <div className="sm:w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-8 text-center sm:ml-5 ">
                        {t('login')}
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateEmail(email)}
                            placeholder={t('email')}
                            required
                            disabled={isLoading}
                            className={`${emailError ? 'border-red-500' : ''}`}
                        />


                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => validatePassword(password)}
                            placeholder={t('password')}
                            required
                            disabled={isLoading}
                            className={`${passwordError ? 'border-red-500' : ''}`}
                        />


                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <div className="flex justify-between text-sm">
                            <Link
                                href={`/${lang}/forgot-password`}
                                className="text-red-600 hover:text-red-800"
                            >
                                {t('forgotPassword')}
                            </Link>
                            <Link
                                href={`/${lang}/register`}
                                className="text-blue-500"
                            >
                                {t('noAccount')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="button-login"
                        >
                            {isLoading ? t('loading') : t('login')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}


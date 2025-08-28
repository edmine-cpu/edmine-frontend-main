'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header/Header";
import Link from "next/link";
import { API_ENDPOINTS } from '@/config/api';
import { VerificationCodeInput, Lang } from '@/components/common/VerificationCodeInput';



const supportedLanguages: Lang[] = ['en', 'de', 'fr', 'pl', 'uk'];

const translations: Record<Lang, Record<string, string>> = {
    uk: {
        loading: "Завантаження...",
        noEmail: "Помилка: email не знайдено. Будь ласка, спочатку зареєструйтесь.",
        title: "Підтвердження Email",
        enterCode: "Введіть код, надісланий на email:",
        success: "Вітаємо! Користувача успішно підтверджено. Перенаправлення...",
        codePlaceholder: "Код підтвердження",
        wrongCode: "Невірний код підтвердження",
        connectionError: "Помилка з’єднання з сервером",
        checking: "Перевірка...",
        checkCode: "Перевірити код"
    },
    en: {
        loading: "Loading...",
        noEmail: "Error: email not found. Please register first.",
        title: "Email Verification",
        enterCode: "Enter the code sent to email:",
        success: "Congratulations! User successfully verified. Redirecting...",
        codePlaceholder: "Verification code",
        wrongCode: "Invalid verification code",
        connectionError: "Connection error with server",
        checking: "Checking...",
        checkCode: "Verify code"
    },
    pl: {
        loading: "Ładowanie...",
        noEmail: "Błąd: email nie znaleziony. Proszę najpierw się zarejestrować.",
        title: "Potwierdzenie Email",
        enterCode: "Wprowadź kod wysłany na email:",
        success: "Gratulacje! Użytkownik został pomyślnie zweryfikowany. Przekierowywanie...",
        codePlaceholder: "Kod weryfikacyjny",
        wrongCode: "Nieprawidłowy kod weryfikacyjny",
        connectionError: "Błąd połączenia z serwerem",
        checking: "Sprawdzanie...",
        checkCode: "Sprawdź kod"
    },
    fr: {
        loading: "Chargement...",
        noEmail: "Erreur : email introuvable. Veuillez d'abord vous inscrire.",
        title: "Vérification de l'email",
        enterCode: "Entrez le code envoyé à l'email :",
        success: "Félicitations ! Utilisateur vérifié avec succès. Redirection...",
        codePlaceholder: "Code de vérification",
        wrongCode: "Code de vérification invalide",
        connectionError: "Erreur de connexion au serveur",
        checking: "Vérification...",
        checkCode: "Vérifier le code"
    },
    de: {
        loading: "Laden...",
        noEmail: "Fehler: E-Mail nicht gefunden. Bitte zuerst registrieren.",
        title: "E-Mail-Bestätigung",
        enterCode: "Geben Sie den an die E-Mail gesendeten Code ein:",
        success: "Glückwunsch! Benutzer erfolgreich verifiziert. Weiterleitung...",
        codePlaceholder: "Bestätigungscode",
        wrongCode: "Ungültiger Bestätigungscode",
        connectionError: "Verbindungsfehler mit dem Server",
        checking: "Überprüfung...",
        checkCode: "Code überprüfen"
    }
};

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default function VerifyCodePage({ params }: PageProps) {
    const resolvedParams = React.use(params);
    const langRaw = resolvedParams.lang;
    const lang = supportedLanguages.includes(langRaw as Lang) ? (langRaw as Lang) : 'en';
    const t = translations[lang];

    const [email, setEmail] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        function getCookie(name: string) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
            return null;
        }
        setEmail(getCookie('email'));
    }, []);

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                setRedirecting(true);
                window.location.href = `/${lang}/`;
                document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [success, lang]);

    if (email === null) {
        return <p>{t.loading}</p>;
    }

    if (!email) {
        return <p className="text-red-600">{t.noEmail}</p>;
    }

    const handleVerification = async (verificationCode: string) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.verifyCode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, code: verificationCode }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Verification successful:', result);
                
                // Если есть токен в ответе, обновляем кэш авторизации
                if (result.token) {
                    // Импортируем функции авторизации
                    const { setAuthCache } = await import('@/utils/auth');
                    setAuthCache(true);
                    
                    // Уведомляем компоненты об изменении авторизации
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('auth-changed'));
                    }
                }
                
                setSuccess(true);
                
                // Показываем уведомление об успехе
                if (typeof window !== 'undefined') {
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
                    notification.textContent = result.message || t.success;
                    document.body.appendChild(notification);
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }
                
                return { success: true, message: result.message || t.success };
            } else {
                const result = await response.json();
                return { success: false, message: result.error || t.wrongCode };
            }
        } catch (err) {
            console.error('Verification error:', err);
            return { success: false, message: t.connectionError };
        }
    };
    
    const handleResend = async () => {
        try {
            // Повторная отправка кода регистрации
            // Используем тот же endpoint что и для верификации, но с параметром resend
            const response = await fetch(`${API_ENDPOINTS.verifyCode}?resend=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            
            if (response.ok) {
                const result = await response.json();
                return { success: true, message: result.message || 'Код надіслано повторно' };
            } else {
                const result = await response.json();
                return { success: false, message: result.error || 'Помилка при надсиланні коду' };
            }
        } catch (err) {
            console.error('Resend error:', err);
            return { success: false, message: 'Помилка при надсиланні коду' };
        }
    };

    return (
        <div className="min-h-screen">
            <Header lang={lang} />
            
            <div className="flex items-center justify-center min-h-screen px-4 py-12">
            
                <div className="max-w-md w-full">
                    <VerificationCodeInput
                        lang={lang}
                        email={email || ''}
                        onVerify={handleVerification}
                        onResend={handleResend}
                        title={t.title}
                        instruction={`${t.enterCode} ${email}`}
                        showEmail={false}
                        autoFocus={true}
                    />
                    
                    {success && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                            {redirecting ? `${t.success} Перенаправлення...` : t.success}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link href={`/${lang}/register`} className="text-red-600 hover:text-red-700 text-sm">
                            ← Повернутися до реєстрації
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

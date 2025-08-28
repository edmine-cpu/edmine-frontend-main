'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

export type Lang = "uk" | "en" | "pl" | "de" | "fr";

export function useFormState(initialLang: Lang = 'uk') {
    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('6'); // Украина по умолчанию
    const [language, setLang] = useState<Lang>(initialLang); // 🔄



    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [fadeOut, setFadeOut] = useState<{ [key: string]: boolean }>({});

    function triggerError(field: string) {
        setErrors(prev => ({ ...prev, [field]: true }));
        setFadeOut(prev => ({ ...prev, [field]: false }));

        setTimeout(() => {
            setFadeOut(prev => ({ ...prev, [field]: true }));
            setTimeout(() => {
                setErrors(prev => ({ ...prev, [field]: false }));
                setFadeOut(prev => ({ ...prev, [field]: false }));
            }, 500);
        }, 5000);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('🔍 Registration form submitted');

        const requiredFields = { name, email, password, city };
        let hasError = false;

        Object.entries(requiredFields).forEach(([field, value]) => {
            if (value.trim() === '') {
                console.log(`❌ Field ${field} is empty`);
                triggerError(field);
                hasError = true;
            }
        });

        // Дополнительная валидация пароля
        if (password.length < 8) {
            console.log('❌ Password too short');
            triggerError('password');
            hasError = true;
        }

        if (hasError) {
            console.log('❌ Validation failed, stopping submission');
            return;
        }

        const data: Record<string, any> = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            city: city.trim(),
            country: parseInt(country) || 6, // По умолчанию Украина
            role: 'user',
            language,

        };

        console.log('📤 Sending registration data:', data);

        try {
            const response = await fetch(`${API_ENDPOINTS.register}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('✅ Registration successful');
                const result = await response.json();
                console.log('📥 Response:', result);
                
                // Сохраняем email для верификации
                document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
                
                // При регистрации токена НЕТ - он будет только после верификации
                console.log('🔄 Redirecting to verify-code page');
                router.push(`/${language}/register/verify-code`);
            } else {
                const errorJson = await response.json();
                setServerError(errorJson.detail || `Ошибка регистрации (код ${response.status})`);
                if (response.status === 401) {
                    setServerError(errorJson.detail);
                }            }
        } catch (error) {
            console.error('🚨 Fetch error:', error);
        }
    }


    const handleChange = (field: string, value: string) => {
        const setterMap: { [key: string]: (v: string) => void } = {
            name: setName,
            email: setEmail,
            password: setPassword,
            city: setCity,
            country: setCountry,
        };

        setterMap[field]?.(value);

        if (value.trim() !== '') {
            setErrors(prev => ({ ...prev, [field]: false }));
            setFadeOut(prev => ({ ...prev, [field]: false }));
        }
    };

    const inputClass = (field: string) =>
        `w-full border p-2 rounded-md transition-all duration-500 ${
            errors[field]
                ? fadeOut[field]
                    ? 'border-gray-300'
                    : 'border-red-500'
                : 'border-gray-300'
        }`;

    return {
        name, email, password, city, country, language,
        errors, fadeOut,
        handleChange, handleSubmit, inputClass,
        setLang,
        serverError,
    };
}

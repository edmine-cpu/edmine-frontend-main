import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';
import { useTranslation } from '@/translations';
import { getLangPath } from '@/utils/linkHelper';

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

export interface FormState {
	name: string;
	email: string;
	password: string;
	errors: Record<string, string>;
	fadeOut: boolean;
	serverError: string;
	language: Lang;
	handleChange: (field: string, value: string) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	inputClass: (field: string) => string;
	setLang: (lang: Lang) => void;
}

export function useFormState(initialLang: Lang): FormState {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [fadeOut, setFadeOut] = useState(false);
	const [serverError, setServerError] = useState('');
	const [language, setLanguage] = useState<Lang>(initialLang);
	const t = useTranslation(language);

	const handleChange = (field: string, value: string) => {
		switch (field) {
			case 'name':
				setName(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
		}
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError('');

		const newErrors: Record<string, string> = {};

		if (!name) newErrors.name = t('nameRequired');
		if (!email) {
			newErrors.email = t('emailRequired');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = t('emailInvalid');
		}
		if (!password) newErrors.password = t('passwordRequired');
		if (password && password.length < 8) newErrors.password = t('passwordMinLength');

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const response = await fetch(API_ENDPOINTS.register, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || t('registrationFailed'));
			}

			// Registration successful
			// Set email cookie for verification page
			document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=3600; SameSite=Lax`;

			setFadeOut(true);
			setTimeout(() => {
				router.push(getLangPath('/register/verify-code', language));
			}, 300);
		} catch (error: any) {
			console.error('Registration error:', error);
			setServerError(error.message || t('registrationFailed'));
		}
	};

	const inputClass = (field: string) => {
		return errors[field] ? 'border-red-500' : '';
	};

	const setLang = (lang: Lang) => {
		setLanguage(lang);
	};

	return {
		name,
		email,
		password,
		errors,
		fadeOut,
		serverError,
		language,
		handleChange,
		handleSubmit,
		inputClass,
		setLang,
	};
}

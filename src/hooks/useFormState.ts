import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

export interface FormState {
	name: string;
	email: string;
	password: string;
	city: string;
	country: string;
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
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [fadeOut, setFadeOut] = useState(false);
	const [serverError, setServerError] = useState('');
	const [language, setLanguage] = useState<Lang>(initialLang);

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
			case 'city':
				setCity(value);
				break;
			case 'country':
				setCountry(value);
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

		if (!name) newErrors.name = 'Name is required';
		if (!email) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Invalid email format';
		}
		if (!password) newErrors.password = 'Password is required';
		if (password && password.length < 8) newErrors.password = 'Password must be at least 8 characters';

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('email', email);
			formData.append('password', password);
			if (city) formData.append('city', city);
			if (country) formData.append('country', country);

			const response = await fetch(API_ENDPOINTS.register, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Registration failed');
			}

			// Registration successful
			// Set email cookie for verification page
			document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=3600; SameSite=Lax`;

			setFadeOut(true);
			setTimeout(() => {
				router.push('/register/verify-code');
			}, 300);
		} catch (error: any) {
			console.error('Registration error:', error);
			setServerError(error.message || 'Registration failed. Please try again.');
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
		city,
		country,
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

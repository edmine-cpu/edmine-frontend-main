'use client'

import { Header } from '@/components/Header/Header'
import {
	Lang,
	VerificationCodeInput,
} from '@/components/common/VerificationCodeInput'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

const translations = {
	uk: {
		title: 'Підтвердження заявки',
		instruction:
			'Введіть код підтвердження, який був відправлений на ваш email:',
		code: 'Код підтвердження',
		verify: 'Підтвердити',
		success: 'Заявка успішно створена!',
		error: 'Неправильний код підтвердження',
		loading: 'Підтвердження...',
		email: 'Email',
	},
	en: {
		title: 'Verify Request',
		instruction: 'Enter the verification code sent to your email:',
		code: 'Verification Code',
		verify: 'Verify',
		success: 'Request created successfully!',
		error: 'Invalid verification code',
		loading: 'Verifying...',
		email: 'Email',
	},
	pl: {
		title: 'Potwierdzenie zgłoszenia',
		instruction: 'Wprowadź kod weryfikacyjny wysłany na Twój email:',
		code: 'Kod weryfikacyjny',
		verify: 'Potwierdź',
		success: 'Zgłoszenie zostało pomyślnie utworzone!',
		error: 'Nieprawidłowy kod weryfikacyjny',
		loading: 'Weryfikacja...',
		email: 'Email',
	},
	fr: {
		title: 'Vérification de la demande',
		instruction: 'Entrez le code de vérification envoyé à votre email:',
		code: 'Code de vérification',
		verify: 'Vérifier',
		success: 'Demande créée avec succès!',
		error: 'Code de vérification invalide',
		loading: 'Vérification...',
		email: 'Email',
	},
	de: {
		title: 'Anfrage bestätigen',
		instruction:
			'Geben Sie den Bestätigungscode ein, der an Ihre E-Mail gesendet wurde:',
		code: 'Bestätigungscode',
		verify: 'Bestätigen',
		success: 'Anfrage erfolgreich erstellt!',
		error: 'Ungültiger Bestätigungscode',
		loading: 'Bestätigung...',
		email: 'E-Mail',
	},
} as const

function VerifyRequestContent({
	params,
}: {
	params: Promise<{ lang: string }>
}) {
	const { lang } = React.use(params)
	const searchParams = useSearchParams()
	const router = useRouter()

	const t = translations[lang as Lang] || translations.uk

	const [email, setEmail] = useState('')
	const [isAuth, setIsAuth] = useState<boolean | null>(null)

	// 1️⃣ Проверяем auth + тянем email если авторизован
	useEffect(() => {
		const init = async () => {
			try {
				const res = await fetch(API_ENDPOINTS.me, {
					credentials: 'include',
				})

				if (res.ok) {
					const data = await res.json()
					setIsAuth(true)
					setEmail(data.email)
				} else {
					setIsAuth(false)
					const emailParam = searchParams.get('email')
					if (emailParam) setEmail(emailParam)
				}
			} catch {
				setIsAuth(false)
				const emailParam = searchParams.get('email')
				if (emailParam) setEmail(emailParam)
			}
		}

		init()
	}, [searchParams])

	const handleVerification = async (code: string) => {
		try {
			const formData = new FormData()
			formData.append('email', email)
			formData.append('code', code)

			const response = await fetch(`${API_ENDPOINTS.verifyBid(lang)}`, {
				method: 'POST',
				body: formData,
			})

			const result = await response.json()

			if (response.ok) {
				if (typeof window !== 'undefined') {
					const notification = document.createElement('div')
					notification.className =
						'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50'
					notification.textContent = t.success
					document.body.appendChild(notification)
					setTimeout(() => {
						notification.remove()
					}, 3000)
				}

				setTimeout(() => {
					router.push(`/${lang}/zayavki`)
				}, 1500)

				return { success: true, message: result.message || t.success }
			} else {
				return { success: false, message: result.error || t.error }
			}
		} catch (error) {
			console.error('Verification error:', error)
			return { success: false, message: t.error }
		}
	}

	const handleResend = async () => {
		try {
			const response = await fetch(
				`${API_ENDPOINTS.createBid(lang).replace(
					'/create-request',
					'/resend-request-verification-code'
				)}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				}
			)

			const result = await response.json()

			if (response.ok && result.success) {
				return {
					success: true,
					message: result.message || 'Код надіслано повторно',
				}
			} else {
				return {
					success: false,
					message: result.error || 'Помилка при надсиланні коду',
				}
			}
		} catch (error) {
			console.error('Resend error:', error)
			return { success: false, message: 'Помилка при надсиланні коду' }
		}
	}

	return (
		<div className='min-h-screen'>
			<Header lang={lang as Lang} />

			<div className='max-w-124 mx-auto py-12 px-4'>
				<VerificationCodeInput
					lang={lang as Lang}
					email={email}
					onVerify={handleVerification}
					onResend={handleResend}
					title={t.title}
					instruction={t.instruction}
					showEmail={true}
					autoFocus={true}
				/>
			</div>
		</div>
	)
}

export default function VerifyRequestPage({
	params,
}: {
	params: Promise<{ lang: string }>
}) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyRequestContent params={params} />
		</Suspense>
	)
}

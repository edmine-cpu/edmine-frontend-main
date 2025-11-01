import { Lang } from '@/app/(types)/lang'
import LoginForm from '@/components/login/LoginForm'
import { headers } from 'next/headers'

export default async function LoginPage() {
	const headersList = await headers();
	const lang = (headersList.get('x-locale') || 'en') as Lang;

	return <LoginForm lang={lang} />
}

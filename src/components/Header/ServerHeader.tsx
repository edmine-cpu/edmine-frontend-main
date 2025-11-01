import { Header } from '@/components/Header/Header'
import { type Lang } from '@/hooks/headerTranslation'
import { getServerAuthStatus } from '@/utils/serverAuth'

interface ServerHeaderProps {
	lang: Lang
}

/**
 * Server-side Header wrapper для использования в server components
 * Получает auth статус на сервере и передает в client Header
 */
export async function ServerHeader({ lang }: ServerHeaderProps) {
	// Получаем статус аутентификации на сервере из middleware headers
	const isAuth = await getServerAuthStatus()

	return <Header lang={lang} initialAuth={isAuth} />
}

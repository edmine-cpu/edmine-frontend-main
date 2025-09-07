export function getLanguage(JWTToken?: string): string {
	if (!JWTToken) {
		return 'uk'
	}

	try {
		const payload = JSON.parse(atob(JWTToken.split('.')[1]))
		const userLang = payload.language // Предположим, у тебя в токене ключ 'language'

		const supportedLangs = ['uk', 'en', 'pl', 'fr', 'de']
		if (supportedLangs.includes(userLang)) {
			return userLang
		}
	} catch (error) {
		console.warn('Ошибка декодирования JWT:', error)
	}

	return 'uk'
}

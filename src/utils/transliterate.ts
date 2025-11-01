/**
 * Утилита для транслитерации текста разных языков в латиницу для SEO-friendly URL
 */

/**
 * Карта транслитерации украинского языка
 */
const ukrainianMap: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'h',
	ґ: 'g',
	д: 'd',
	е: 'e',
	є: 'ye',
	ж: 'zh',
	з: 'z',
	и: 'y',
	і: 'i',
	ї: 'yi',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'kh',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'shch',
	ь: '',
	ю: 'yu',
	я: 'ya',
}

/**
 * Карта транслитерации польского языка
 */
const polishMap: Record<string, string> = {
	ą: 'a',
	ć: 'c',
	ę: 'e',
	ł: 'l',
	ń: 'n',
	ó: 'o',
	ś: 's',
	ź: 'z',
	ż: 'z',
}

/**
 * Карта транслитерации французского языка
 */
const frenchMap: Record<string, string> = {
	à: 'a',
	â: 'a',
	æ: 'ae',
	ç: 'c',
	é: 'e',
	è: 'e',
	ê: 'e',
	ë: 'e',
	î: 'i',
	ï: 'i',
	ô: 'o',
	œ: 'oe',
	ù: 'u',
	û: 'u',
	ü: 'u',
	ÿ: 'y',
}

/**
 * Карта транслитерации немецкого языка
 */
const germanMap: Record<string, string> = {
	ä: 'ae',
	ö: 'oe',
	ü: 'ue',
	ß: 'ss',
}

/**
 * Объединенная карта для всех языков
 */
const transliterationMap: Record<string, string> = {
	...ukrainianMap,
	...polishMap,
	...frenchMap,
	...germanMap,
}

/**
 * Транслитерирует текст в латиницу для создания SEO-friendly slug
 * @param text - исходный текст
 * @returns транслитерированный текст
 */
export function transliterate(text: string): string {
	if (!text) return ''

	let result = ''
	for (const char of text.toLowerCase()) {
		// Если символ есть в карте транслитерации
		if (transliterationMap[char]) {
			result += transliterationMap[char]
		}
		// Если это латинская буква, цифра или дефис - оставляем как есть
		else if (/[a-z0-9-]/.test(char)) {
			result += char
		}
		// Пробелы и подчеркивания заменяем на дефис
		else if (/[\s_]/.test(char)) {
			result += '-'
		}
		// Все остальное игнорируем
	}

	// Убираем множественные дефисы и дефисы в начале/конце
	return result
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

/**
 * Создает slug из текста с транслитерацией
 * @param text - исходный текст
 * @returns SEO-friendly slug
 */
export function createSlug(text: string): string {
	return transliterate(text)
}

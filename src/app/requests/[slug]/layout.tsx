import type { Metadata } from 'next';

/**
 * Layout для отдельных страниц заявок
 * Применяет noindex, follow согласно SEO стратегии:
 * - Заявки временные и быстро устаревают
 * - Не засоряют поисковый индекс
 * - follow позволяет ботам переходить по ссылкам
 */
export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default function RequestDetailLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

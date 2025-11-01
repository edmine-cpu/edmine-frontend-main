import type { Metadata } from 'next';
import { API_ENDPOINTS } from '@/config/api';

type Props = {
	params: Promise<{ slug: string }>;
};

/**
 * Генерация метаданных для страниц компаний
 * Компании индексируются (index, follow) для SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;

	try {
		// Получаем данные компании для мета-тегов
		const response = await fetch(`${API_ENDPOINTS.company_by_slug(slug)}`, {
			next: { revalidate: 3600 }, // Кэшируем на 1 час
		});

		if (!response.ok) {
			return {
				title: 'Company not found',
				robots: { index: false, follow: true },
			};
		}

		const company = await response.json();

		// Используем название компании для всех языков
		const title = company.name_en || company.name || 'Company Profile';
		const description =
			company.description_en ||
			company.description ||
			'Professional company profile on our freelance marketplace';

		return {
			title,
			description,
			robots: {
				index: true,
				follow: true,
			},
			openGraph: {
				title,
				description,
				type: 'website',
			},
		};
	} catch (error) {
		console.error('Error generating metadata for company:', error);
		return {
			title: 'Company Profile',
			robots: { index: true, follow: true },
		};
	}
}

export default function CompanyDetailLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

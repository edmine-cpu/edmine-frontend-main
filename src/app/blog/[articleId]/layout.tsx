import type { Metadata } from 'next';

type Props = {
	params: Promise<{ articleId: string }>;
};

/**
 * Генерация метаданных для страниц статей блога
 * Статьи блога индексируются для SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { articleId } = await params;

	try {
		// Получаем данные статьи для мета-тегов
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/blog/articles/${articleId}`, {
			next: { revalidate: 3600 }, // Кэшируем на 1 час
		});

		if (!response.ok) {
			return {
				title: 'Article not found',
				robots: { index: false, follow: true },
			};
		}

		const article = await response.json();

		return {
			title: article.title || 'Blog Article',
			description: article.description || article.content?.substring(0, 160) || 'Read our blog article',
			keywords: article.keywords,
			robots: {
				index: true,
				follow: true,
			},
			openGraph: {
				title: article.title,
				description: article.description,
				type: 'article',
				images: article.featured_image ? [article.featured_image] : [],
				publishedTime: article.created_at,
				modifiedTime: article.updated_at,
				authors: [article.author_name],
			},
		};
	} catch (error) {
		console.error('Error generating metadata for blog article:', error);
		return {
			title: 'Blog Article',
			robots: { index: true, follow: true },
		};
	}
}

export default function BlogArticleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

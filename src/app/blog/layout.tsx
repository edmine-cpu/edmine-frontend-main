import type { Metadata } from 'next';

/**
 * Layout для страниц блога
 * Блог индексируется для SEO
 */
export const metadata: Metadata = {
	title: 'Blog - Edmine',
	description: 'Read our latest articles about freelancing, business, and industry insights',
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: 'Blog - Edmine',
		description: 'Read our latest articles about freelancing, business, and industry insights',
		type: 'website',
	},
};

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

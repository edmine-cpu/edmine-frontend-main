import { Header } from "@/components/Header/Header";
import { MainPage } from "@/components/MainPage/MainPageComponent";
import { headers } from 'next/headers';
import type { Lang } from '@/app/(types)/lang';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edmine - Freelance Marketplace',
  description: 'Find the best freelancers and companies for your projects. Post requests and get professional services.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Edmine - Freelance Marketplace',
    description: 'Find the best freelancers and companies for your projects',
    type: 'website',
  },
};

export default async function Home() {
  const headersList = await headers();
  const lang = (headersList.get('x-locale') || 'en') as Lang;

  return (
    <div>
      <Header lang={lang} />
      <MainPage lang={lang} />
    </div>
  );
}

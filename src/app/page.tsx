import { Header } from "@/components/Header/Header";
import { MainPage } from "@/components/MainPage/MainPageComponent";
import { headers } from 'next/headers';
import type { Lang } from '@/app/(types)/lang';
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

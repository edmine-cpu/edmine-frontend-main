import { Header } from "@/components/Header/Header";
import { MainPage } from "@/components/indexMain/MainPageComponent";
import { headers } from 'next/headers';
import type { Lang } from '@/app/(types)/lang';

/**
 * Главная страница сайта
 * Автоматически определяет язык из URL:
 * - / -> английский (en)
 * - /uk -> украинский
 * - /de -> немецкий
 * - /pl -> польский
 * - /fr -> французский
 */
export default async function Home() {
  // Получаем язык из headers (установленных middleware)
  const headersList = await headers();
  const lang = (headersList.get('x-locale') || 'en') as Lang;

  return (
    <div>
      <Header lang={lang} />
      <MainPage lang={lang} />
    </div>
  );
}

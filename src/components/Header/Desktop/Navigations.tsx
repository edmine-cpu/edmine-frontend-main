import { Lang } from "@/app/(types)/lang";
import Link from "next/link";
import { texts } from "../translations";

type Props = {
  lang: Lang;
};

export function Navigations({ lang }: Props) {
  const t = texts[lang];

  // Построение ссылок на главные страницы
  const catalogUrl =
    lang === "en" ? "/all?zayavki=true" : `/${lang}/all?zayavki=true`;
  const companiesUrl = lang === "en" ? "/all" : `/${lang}/all`;
  const blogUrl = lang === "en" ? "/blog" : `/${lang}/blog`;

  return (
    <>
      <Link
        href={catalogUrl}
        className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        {t.catalog}
      </Link>

      <Link
        href={blogUrl}
        className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        {t.blog}
      </Link>
    </>
  );
}

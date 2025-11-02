"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  description: string;
  keywords: string;
  slug: string;
  featured_image: string | null;
  author_name: string;
  created_at: string;
  updated_at: string;
}

const texts = {
  uk: {
    backToBlog: "← Назад до блогу",
    by: "Автор:",
    date: "Дата:",
    notFound: "Статтю не знайдено",
    loading: "Завантаження...",
    error: "Помилка завантаження статті",
  },
  en: {
    backToBlog: "← Back to blog",
    by: "Author:",
    date: "Date:",
    notFound: "Article not found",
    loading: "Loading...",
    error: "Error loading article",
  },
  pl: {
    backToBlog: "← Powrót do bloga",
    by: "Autor:",
    date: "Data:",
    notFound: "Artykuł nie znaleziony",
    loading: "Ładowanie...",
    error: "Błąd ładowania artykułu",
  },
  fr: {
    backToBlog: "← Retour au blog",
    by: "Auteur:",
    date: "Date:",
    notFound: "Article non trouvé",
    loading: "Chargement...",
    error: "Erreur de chargement de l'article",
  },
  de: {
    backToBlog: "← Zurück zum Blog",
    by: "Autor:",
    date: "Datum:",
    notFound: "Artikel nicht gefunden",
    loading: "Laden...",
    error: "Fehler beim Laden des Artikels",
  },
};

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const lang = useLanguage();
  const articleId = params.articleId as string;
  const t = texts[lang as keyof typeof texts] || texts.en;

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [articleId, lang]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/blog/articles/${articleId}?lang=${lang}`
      );
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else if (response.status === 404) {
        setError(t.notFound);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header lang={lang as any} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen ">
        <Header lang={lang as any} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error || t.notFound}
            </h1>
            <Link href="/blog">
              <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
                {t.backToBlog}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Header lang={lang as any} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/blog">
            <button className="text-red-500 hover:text-red-700 mb-6 flex items-center">
              {t.backToBlog}
            </button>
          </Link>

          {/* Article */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {article.featured_image && (
              <div className="h-64 md:h-96 overflow-hidden">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
                <span className="mr-6">
                  <span className="font-medium">{t.by}</span>{" "}
                  {article.author_name}
                </span>
                <span>
                  <span className="font-medium">{t.date}</span>{" "}
                  {formatDate(article.created_at)}
                </span>
              </div>

              {article.description && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 italic">{article.description}</p>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: article.content.replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              {article.keywords && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Ключові слова:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.split(",").map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Header from '@/components/Header/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang="uk" />
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Щось пішло не так!</h2>
          <p className="text-gray-600 mb-6">Виникла помилка при завантаженні сторінки.</p>
          <button
            onClick={reset}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Спробувати ще раз
          </button>
        </div>
      </div>
    </div>
  );
}

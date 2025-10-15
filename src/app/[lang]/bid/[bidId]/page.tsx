'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { API_ENDPOINTS } from '@/config/api';

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

interface Bid {
  id: number;
  title_uk?: string;
  title_en?: string;
  title_pl?: string;
  title_fr?: string;
  title_de?: string;
  description_uk?: string;
  description_en?: string;
  description_pl?: string;
  description_fr?: string;
  description_de?: string;
  city?: string;
  country_id?: number;
  category?: string;
  under_category_id?: number;
  email?: string;
  files?: string[];
  budget?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

const T = {
  uk: { 
    title: 'Деталі заявки', 
    back: '← Назад до каталогу',
    category: 'Категорія',
    subcategory: 'Підкатегорія',
    location: 'Локація',
    contact: 'Контакти',
    budget: 'Бюджет',
    created: 'Створено',
    updated: 'Оновлено',
    files: 'Файли',
    noFiles: 'Файлів немає'
  },
  en: { 
    title: 'Bid Details', 
    back: '← Back to catalog',
    category: 'Category',
    subcategory: 'Subcategory',
    location: 'Location',
    contact: 'Contact',
    budget: 'Budget',
    created: 'Created',
    updated: 'Updated',
    files: 'Files',
    noFiles: 'No files'
  },
  pl: { 
    title: 'Szczegóły zlecenia', 
    back: '← Powrót do katalogu',
    category: 'Kategoria',
    subcategory: 'Podkategoria',
    location: 'Lokalizacja',
    contact: 'Kontakt',
    budget: 'Budżet',
    created: 'Utworzono',
    updated: 'Zaktualizowano',
    files: 'Pliki',
    noFiles: 'Brak plików'
  },
  fr: { 
    title: 'Détails de la demande', 
    back: '← Retour au catalogue',
    category: 'Catégorie',
    subcategory: 'Sous-catégorie',
    location: 'Localisation',
    contact: 'Contact',
    budget: 'Budget',
    created: 'Créé',
    updated: 'Mis à jour',
    files: 'Fichiers',
    noFiles: 'Aucun fichier'
  },
  de: { 
    title: 'Angebotsdetails', 
    back: '← Zurück zum Katalog',
    category: 'Kategorie',
    subcategory: 'Unterkategorie',
    location: 'Standort',
    contact: 'Kontakt',
    budget: 'Budget',
    created: 'Erstellt',
    updated: 'Aktualisiert',
    files: 'Dateien',
    noFiles: 'Keine Dateien'
  },
} as const;

export default function BidPage({ params }: { params: Promise<{ lang: string; bidId: string }> }) {
  const resolvedParams = React.use(params);
  const lang = "en" as Lang;
  const bidId = resolvedParams.bidId;
  const t = T[lang];

  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.bidById(parseInt(bidId)));
        if (!response.ok) {
          throw new Error('Failed to fetch bid');
        }
        const bid = await response.json();
        setBid(bid);
      } catch (err) {
        setError('Failed to load bid');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bidId) {
      fetchBid();
    }
  }, [bidId]);

  const getTitle = (bid: Bid) => {
    return bid[`title_${lang}` as keyof Bid] || bid.title_en || bid.title_uk || 'No title';
  };

  const getDescription = (bid: Bid) => {
    return bid[`description_${lang}` as keyof Bid] || bid.description_en || bid.description_uk || 'No description';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header lang={lang} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header lang={lang} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">{error || 'Bid not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href={`/categories`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          {t.back}
        </a>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{getTitle(bid)}</h1>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">{getDescription(bid)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.category}</h3>
              <p className="text-gray-700">{bid.category || '—'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.location}</h3>
              <p className="text-gray-700">{bid.city || '—'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.budget}</h3>
              <p className="text-gray-700">
                {bid.budget && bid.currency ? `${bid.budget} ${bid.currency}` : '—'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.contact}</h3>
              <p className="text-gray-700">{bid.email || '—'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.created}</h3>
              <p className="text-gray-700">
                {bid.created_at ? new Date(bid.created_at).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          {bid.files && bid.files.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.files}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bid.files.map((file, index) => {
                  const fileName = file.split('/').pop() || '';
                  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileExt);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {isImage ? (
                        <button
                          onClick={() => {
                            // Открываем изображение поверх страницы
                            const overlay = document.createElement('div');
                            overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                            overlay.onclick = () => document.body.removeChild(overlay);
                            
                            const img = document.createElement('img');
                            img.src = `${API_ENDPOINTS.static}/${file}`;
                            img.className = 'max-w-full max-h-full object-contain';
                            img.onclick = (e) => e.stopPropagation();
                            
                            const closeBtn = document.createElement('button');
                            closeBtn.innerHTML = '✕';
                            closeBtn.className = 'absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75';
                            closeBtn.onclick = () => document.body.removeChild(overlay);
                            
                            overlay.appendChild(img);
                            overlay.appendChild(closeBtn);
                            document.body.appendChild(overlay);
                          }}
                          className="text-blue-600 hover:text-blue-800 break-all w-full text-left"
                        >
                          🖼️ {fileName}
                        </button>
                      ) : (
                        <a 
                          href={`${API_ENDPOINTS.static}/${file}`} 
                          download={fileName}
                          className="text-blue-600 hover:text-blue-800 break-all"
                        >
                          📎 {fileName}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

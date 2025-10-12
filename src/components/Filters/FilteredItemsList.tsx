import { Lang } from "@/app/(types)/lang";
import { JSX } from "react";


export type Company = {
  id: number;
  owner_id: number;
  name: string | null;
  name_en: string | null;
  name_fr: string | null;
  name_pl: string | null;
  name_uk: string | null;
  name_de: string | null;
  slug_name: string;
  slug_en: string | null;
  slug_fr: string | null;
  slug_pl: string | null;
  slug_uk: string | null;
  slug_de: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_pl: string | null;
  description_uk: string | null;
  description_de: string | null;
  auto_translated_fields: any;
  country: number | null;
  city: number | null;
  created_at: string;
  updated_at: string;
};

export const testCompanies: Company[] = [
  {
    id: 1,
    owner_id: 2,
    name: "Тест компании RU",
    name_en: "Test Company EN",
    name_fr: "Entreprise Test FR",
    name_pl: "Firma Testowa PL",
    name_uk: "Тестова компанія UK",
    name_de: "Testfirma DE",
    slug_name: "test-kompanii",
    slug_en: "test-company-en",
    slug_fr: "entreprise-test-fr",
    slug_pl: "firma-testowa-pl",
    slug_uk: "testova-kompaniya-uk",
    slug_de: "testfirma-de",
    description_en: "Description EN",
    description_fr: "Description FR",
    description_pl: "Description PL",
    description_uk: "Description UK",
    description_de: "Description DE",
    auto_translated_fields: {},
    country: 1,
    city: 6,
    created_at: "2025-09-07T20:18:27.912032+00:00",
    updated_at: "2025-09-07T20:18:27.912032+00:00",
  },
  {
    id: 2,
    owner_id: 3,
    name: "Пример компании RU",
    name_en: "Example Company EN",
    name_fr: "Exemple Entreprise FR",
    name_pl: "Przykładowa Firma PL",
    name_uk: "Приклад компанії UK",
    name_de: "Beispielfirma DE",
    slug_name: "primer-kompanii",
    slug_en: "example-company-en",
    slug_fr: "exemple-entreprise-fr",
    slug_pl: "przykladowa-firma-pl",
    slug_uk: "pryklad-kompanii-uk",
    slug_de: "beispielfirma-de",
    description_en: "Example Description EN",
    description_fr: "Description Exemple FR",
    description_pl: "Przykładowy Opis PL",
    description_uk: "Приклад Опис UK",
    description_de: "Beispielbeschreibung DE",
    auto_translated_fields: {},
    country: 1,
    city: 6,
    created_at: "2025-09-08T10:00:00.000Z",
    updated_at: "2025-09-08T10:00:00.000Z",
  }
];



export function FilteredItemsList(language: Lang, country: string, city: string, category: string, undercategory: string ): JSX.Element {
    return (
        <div>123S</div>
    )
}
import { Lang } from "@/app/(types)/lang";
import { HeaderButtons } from "@/components/Header/Desktop/Buttons";
import { SearchBid } from "@/components/Header/Desktop/SearchBid";
import { TitleName } from "@/components/Header/Desktop/TitleName";
import { LanguageSwitcher } from "@/components/Header/LanguageSwitcher";
import { Navigations } from "./Desktop/Navigations";

interface HeaderProps {
  lang: Lang;
  initialAuth: boolean;
}

export function DesktopHeader({ lang, initialAuth }: HeaderProps) {
  return (
    <header className="flex items-center justify-center space-x-4 container mx-auto mt-3">
      <TitleName lang={lang} />
      <LanguageSwitcher currentLang={lang} />
      <SearchBid lang={lang} />
      <Navigations lang={lang} />
      <HeaderButtons lang={lang || "uk"} initialAuth={initialAuth} />
    </header>
  );
}

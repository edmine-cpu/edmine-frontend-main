import React from "react";

type Lang = "uk" | "en" | "pl" | "de" | "fr";

type Props = {
    lang: Lang;
    setLang: (lang: Lang) => void;
};

export function LanguageSelector({ lang, setLang }: Props) {
    return (
        <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="p-2 border rounded"
        >
            <option value="uk">Українська</option>
            <option value="pl">Polski</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
        </select>
    );
}

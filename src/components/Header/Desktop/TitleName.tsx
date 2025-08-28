import Link from "next/link";

interface TitleNameProps {
    lang?: string;
}

export function TitleName({ lang = 'en' }: TitleNameProps) {
    return (
        <Link href={`/${lang}`}>
            <span className="text-red-600 font-bold text-3xl">MAKE</span>
            <span className="text-red-600 text-3xl italic">ASAP</span>
        </Link>
    )
}
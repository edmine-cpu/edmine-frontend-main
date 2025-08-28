import Link from 'next/link';
import { Lang } from '@/app/(types)/lang';

interface Props { lang: Lang }

export function AddPlus({ lang }: Props){
    return(
        <Link href={`/${lang || 'en'}/create-request`} className="text-4xl font-bold text-red-600 leading-none">+</Link>
    )
}
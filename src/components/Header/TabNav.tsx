import Link from "next/link";
import { UrlObject } from "url";

interface TabLinkProps {
    href: string | UrlObject;
    name: string;
    mobile?: boolean;
}

export function TabLink({ href, name, mobile = false }: TabLinkProps) {

    if (mobile) {
        return (
            <Link
                href={href}
                className="block w-full px-4 py-3 rounded-md text-center font-semibold text-blue-900 hover:bg-gray-100"
            >
                {name}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className={`hidden sm:inline font-semibold text-blue-900 ${
            } mr-2`}
        >
            {name}
        </Link>
    );
}

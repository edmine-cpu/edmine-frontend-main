'use client'

interface HamburgerMenuProps {
    onClick: () => void;
}

export function HamburgerMenu({ onClick }: HamburgerMenuProps) {
    return (
        <div
            className="flex flex-col justify-between w-8 h-6 cursor-pointer"
            onClick={onClick}
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
            onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') onClick(); }}
        >
            <span className="block h-1 bg-black rounded"></span>
            <span className="block h-1 bg-black rounded"></span>
            <span className="block h-1 bg-black rounded"></span>
        </div>
    );
}

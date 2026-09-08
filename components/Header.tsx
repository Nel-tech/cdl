import Link from "next/link";

export function Header() {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-b border-line">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-ink">
                CDL
            </Link>
            <div className="flex gap-5 text-sm">
                <Link href="/" className="text-forest">
                    Explore
                </Link>
                <Link href="/login" className="text-[#8a8770]">
                    President login
                </Link>
                <Link href="/signup" className="text-[#8a8770]">
                    Register as president
                </Link>
            </div>
        </div>
    );
}
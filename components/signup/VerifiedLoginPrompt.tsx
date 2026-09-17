import Link from "next/link";

export function VerifiedLoginPrompt() {
    return (
        <div className="mb-4 border border-forest rounded-sm p-3 text-sm text-forest">
            Your account is ready.{" "}
            <Link href="/login" className="font-semibold underline underline-offset-2">
                Log in
            </Link>
        </div>
    );
}
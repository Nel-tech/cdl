"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";

function PendingContent() {
    const searchParams = useSearchParams();
    const username = searchParams.get("username");
    const supabase = createClient();

    const [verified, setVerified] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);

    async function checkStatus() {
        if (!username || checking) return;

        setChecking(true);

        const { data } = await supabase
            .from("cds_presidents")
            .select("is_verified")
            .eq("username", username)
            .single();

        setVerified(data?.is_verified ?? false);
        setChecking(false);
    }

    useEffect(() => {
        void checkStatus();
    }, [username]);

    return (
        <main className="px-4 py-12 sm:px-6 sm:py-16">
            <section className="mx-auto w-full max-w-lg">
                <div className="mb-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8770]">
                        President registration
                    </p>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        Registration received
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#5c5942]">
                        Your registration has been submitted. We'll confirm your details
                        before your account is ready to use.
                    </p>
                </div>

                <div className="rounded-sm border border-khaki bg-paper p-5 sm:p-6">
                    <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-khaki text-ink">
                            {verified === true ? "✓" : "…"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="font-display text-lg font-semibold text-ink">
                                {verified === true ? "You're verified" : "Verification pending"}
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-[#5c5942]">
                                {verified === true
                                    ? "Your account has been verified. You can now log in."
                                    : "We'll verify your account after confirming your identity directly."}
                            </p>
                        </div>
                    </div>

                    {username && (
                        <div className="mb-5 border-t border-khaki pt-4">
                            <p className="text-xs text-[#5c5942]">Your login username</p>
                            <p className="mt-1 break-all font-display text-lg font-semibold text-ink">
                                {username}
                            </p>
                        </div>
                    )}

                    {verified === true && (
                        <div className="mb-4 border border-forest rounded-sm p-3 text-sm text-forest">
                            Your account is ready.{" "}
                            <Link href="/login" className="font-semibold underline underline-offset-2">
                                Log in
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={checkStatus}
                        disabled={checking || !username}
                        className="w-full rounded-sm border border-khaki px-4 py-3 text-sm font-medium text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {checking ? "Checking status…" : "Check status again"}
                    </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#8a8770]">
                    Keep your username somewhere safe. You'll need it when you log in.
                </p>
            </section>
        </main>
    );
}

export default function SignupPendingPage() {
    return (
        <div className="min-h-screen bg-paper">
            <Header />
            <Suspense fallback={<div className="px-4 py-12 sm:px-6 sm:py-16 text-sm text-[#5c5942]">Loading...</div>}>
                <PendingContent />
            </Suspense>
        </div>
    );
}
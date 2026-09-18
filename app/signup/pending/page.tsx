"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { VerificationStatus } from "@/components/signup/VerificationStatus";
import { UsernameDisplay } from "@/components/signup/UsernameDisplay";

function PendingContent() {
    const searchParams = useSearchParams();
    const paramUsername = searchParams.get("username");
    const supabase = createClient();
    const router = useRouter();

    const [username, setUsername] = useState<string | null>(paramUsername);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);
    const [pollingActive, setPollingActive] = useState(true);
    const POLL_DURATION_MS = 5 * 60 * 1000;

    async function checkStatus() {
        setChecking(true);

        if (!username) {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setChecking(false);
                return;
            }

            const { data: president } = await supabase
                .from("cds_presidents")
                .select("username, is_verified")
                .eq("auth_user_id", user.id)
                .single();

            if (president) {
                setUsername(president.username);
                setVerified(president.is_verified);
                if (president.is_verified) {
                    router.push("/dashboard");
                    return;
                }
            }

            setChecking(false);
            return;
        }

        const { data } = await supabase
            .from("cds_presidents")
            .select("is_verified")
            .eq("username", username)
            .single();

        const isVerified = data?.is_verified ?? false;
        setVerified(isVerified);
        setChecking(false);

        if (isVerified) {
            router.push("/dashboard");
        }
    }

    useEffect(() => {
        void checkStatus();
    }, []);

    useEffect(() => {
        if (verified || !pollingActive) return;

        const interval = setInterval(() => {
            void checkStatus();
        }, 4000);

        const timeout = setTimeout(() => {
            setPollingActive(false);
            clearInterval(interval);
        }, POLL_DURATION_MS);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [verified, pollingActive]);

    if (verified === true) {
        return (
            <main className="px-4 py-12 sm:px-6 sm:py-16">
                <section className="mx-auto w-full max-w-lg">
                    <div className="rounded-sm border border-khaki bg-paper p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-block h-4 w-4 rounded-full border-2 border-khaki border-t-forest animate-spin" />
                            <p className="text-sm text-ink">Setting up your dashboard...</p>
                        </div>

                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-khaki/30 rounded-sm w-3/4" />
                            <div className="h-4 bg-khaki/30 rounded-sm w-1/2" />
                            <div className="h-4 bg-khaki/30 rounded-sm w-2/3" />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

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
                    <VerificationStatus verified={verified} />

                    {username && <UsernameDisplay username={username} />}

                    {checking && (
                        <div className="flex items-center gap-2 text-xs text-[#8a8770]">
                            <span className="inline-block h-3 w-3 rounded-full border-2 border-khaki border-t-forest animate-spin" />
                            Checking...
                        </div>
                    )}

                    {!pollingActive && (
                        <p className="text-xs text-clay">
                            This page has stopped auto-checking. Refresh the page to check again.
                        </p>
                    )}
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
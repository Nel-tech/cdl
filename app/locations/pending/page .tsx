"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";

type SubmissionStatus = "pending" | "verified" | "rejected";

type LocationRow = {
    id: number;
    name: string;
    submission_status: SubmissionStatus;
};

function StatusBadge({ status }: { status: SubmissionStatus }) {
    const styles: Record<SubmissionStatus, string> = {
        pending: "bg-khaki/30 text-ink",
        verified: "bg-forest/15 text-forest",
        rejected: "bg-clay/15 text-clay",
    };
    const labels: Record<SubmissionStatus, string> = {
        pending: "Pending review",
        verified: "Verified",
        rejected: "Not approved",
    };
    return (
        <span className={`inline-block rounded-sm px-2 py-1 text-xs font-medium ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

function LocationPendingContent() {
    const searchParams = useSearchParams();
    const locationId = searchParams.get("locationId");
    const supabase = createClient();
    const router = useRouter();

    const [location, setLocation] = useState<LocationRow | null>(null);
    const [checking, setChecking] = useState(false);
    const [pollingActive, setPollingActive] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const POLL_DURATION_MS = 5 * 60 * 1000;

    async function checkStatus() {
        if (!locationId) {
            setNotFound(true);
            return;
        }

        setChecking(true);

        const { data, error } = await supabase
            .from("locations")
            .select("id, name, submission_status")
            .eq("id", Number(locationId))
            .single();

        setChecking(false);

        if (error || !data) {
            setNotFound(true);
            return;
        }

        setLocation(data as LocationRow);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            void checkStatus();
        }, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!location || location.submission_status !== "pending" || !pollingActive) return;

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
    }, [location, pollingActive]);

    if (notFound) {
        return (
            <main className="px-4 py-12 sm:px-6 sm:py-16">
                <section className="mx-auto w-full max-w-lg">
                    <p className="text-sm text-clay">
                        We couldn&apos;t find that submission. It may have been removed.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-4 text-sm text-forest underline"
                    >
                        Back to dashboard
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="px-4 py-12 sm:px-6 sm:py-16">
            <section className="mx-auto w-full max-w-lg">
                <div className="mb-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8770]">
                        Location submission
                    </p>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {location?.submission_status === "verified"
                            ? "Location approved"
                            : location?.submission_status === "rejected"
                            ? "Location not approved"
                            : "Awaiting review"}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#5c5942]">
                        {location?.submission_status === "verified"
                            ? "This location is now live and visible in the public directory."
                            : location?.submission_status === "rejected"
                            ? "An admin reviewed this submission and didn't approve it. You can edit and resubmit from your dashboard."
                            : "An admin will review this location shortly. This page updates automatically."}
                    </p>
                </div>

                <div className="rounded-sm border border-khaki bg-paper p-5 sm:p-6 space-y-3">
                    {location && (
                        <>
                            <p className="text-sm font-medium text-ink">{location.name}</p>
                            <StatusBadge status={location.submission_status} />
                        </>
                    )}

                    {checking && (
                        <div className="flex items-center gap-2 text-xs text-[#8a8770]">
                            <span className="inline-block h-3 w-3 rounded-full border-2 border-khaki border-t-forest animate-spin" />
                            Checking...
                        </div>
                    )}

                    {!pollingActive && location?.submission_status === "pending" && (
                        <p className="text-xs text-clay">
                            This page has stopped auto-checking. Refresh the page to check again.
                        </p>
                    )}
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-4 text-sm text-forest underline"
                >
                    Back to dashboard
                </button>
            </section>
        </main>
    );
}

export default function LocationPendingPage() {
    return (
        <div className="min-h-screen bg-paper">
            <Header />
            <Suspense fallback={<div className="px-4 py-12 sm:px-6 sm:py-16 text-sm text-[#5c5942]">Loading...</div>}>
                <LocationPendingContent />
            </Suspense>
        </div>
    );
}
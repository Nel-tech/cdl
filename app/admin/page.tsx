
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/Toast";
import { ResetPresidentForm } from "@/components/ResetPresidentForm";

export default function AdminPage() {
    const supabase = createClient();

    const [pw, setPw] = useState("");
    const [authed, setAuthed] = useState(false);
    const [presidents, setPresidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    async function checkPassword(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/admin/check", {
            method: "POST",
            body: JSON.stringify({ password: pw }),
        });

        if (res.ok) {
            setAuthed(true);
            loadData();
        } else {
            alert("Wrong password");
        }
    }

    async function loadData() {
        setLoading(true);

        const { data: pres } = await supabase
            .from("cds_presidents")
            .select(
                "id, auth_user_id, username, full_name, email, is_verified, lgas(name), cds_groups(name)"
            )
            .order("created_at", { ascending: false });

        setPresidents(pres ?? []);
        setLoading(false);
    }

    async function verifyPresident(id: number, username: string) {
        await fetch("/api/admin/verify-president", {
            method: "POST",
            body: JSON.stringify({ id, password: pw }),
        });

        setToast(`${username} has been verified`);
        setTimeout(() => setToast(null), 3000);

        loadData();
    }

    const pendingPresidents = presidents.filter(
        (p) => !p.is_verified
    );

    const verifiedPresidents = presidents.filter(
        (p) => p.is_verified
    );

    if (!authed) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <div className="border border-line rounded-sm p-6 sm:p-8">
                        <div className="mb-6">
                            <p className="text-xs text-[#5c5942] uppercase tracking-widest mb-2">
                                Administration
                            </p>

                            <h1 className="font-display text-2xl text-ink">
                                Welcome back
                            </h1>

                            <p className="text-sm text-[#5c5942] mt-2">
                                Enter your password to access the admin dashboard.
                            </p>
                        </div>

                        <form
                            onSubmit={checkPassword}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-password"
                                    className="text-sm text-ink"
                                >
                                    Admin password
                                </label>

                                <input
                                    id="admin-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={pw}
                                    onChange={(e) =>
                                        setPw(e.target.value)
                                    }
                                    required
                                    className="border border-khaki rounded-sm px-3 py-3 w-full text-sm bg-transparent text-ink outline-none focus:ring-1 focus:ring-forest"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-forest text-paper rounded-sm px-4 py-3 w-full text-sm transition-opacity hover:opacity-90"
                            >
                                Enter dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

            {/* Dashboard header */}
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-xs text-[#5c5942] uppercase tracking-widest mb-2">
                        Administration
                    </p>

                    <h1 className="font-display text-2xl sm:text-3xl text-ink">
                        Admin dashboard
                    </h1>

                    <p className="text-sm text-[#5c5942] mt-2">
                        Manage and verify CDS presidents.
                    </p>
                </div>

                <button
                    onClick={loadData}
                    disabled={loading}
                    className="border border-line rounded-sm px-4 py-2 text-sm text-ink hover:bg-forest hover:text-paper transition-colors disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh data"}
                </button>
            </header>

            {/* Summary cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-sm text-[#5c5942]">
                        Total presidents
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {presidents.length}
                    </p>
                </div>

                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-sm text-[#5c5942]">
                        Pending verification
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {pendingPresidents.length}
                    </p>
                </div>

                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-sm text-[#5c5942]">
                        Verified presidents
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {verifiedPresidents.length}
                    </p>
                </div>
            </section>

            {/* Pending presidents */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="font-display text-xl text-ink">
                            Pending presidents
                        </h2>

                        <p className="text-sm text-[#5c5942] mt-1">
                            Review and verify new registrations.
                        </p>
                    </div>

                    <span className="text-xs text-[#5c5942] border border-line rounded-sm px-3 py-1.5">
                        {pendingPresidents.length} pending
                    </span>
                </div>

                <div className="border border-line rounded-sm overflow-hidden">
                    {loading && presidents.length === 0 ? (
                        <p className="text-sm text-[#5c5942] p-5">
                            Loading presidents...
                        </p>
                    ) : pendingPresidents.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <p className="font-display text-lg text-ink">
                                All caught up
                            </p>

                            <p className="text-sm text-[#5c5942] mt-2">
                                There are no pending presidents to verify.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-line">
                            {pendingPresidents.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                                >
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-medium text-ink">
                                                {p.full_name}
                                            </h3>

                                            <span className="text-xs text-[#5c5942]">
                                                @{p.username}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#5c5942]">
                                            <p>
                                                <span className="text-ink">
                                                    LGA:
                                                </span>{" "}
                                                {p.lgas?.name ?? "—"}
                                            </p>

                                            <p>
                                                <span className="text-ink">
                                                    CDS group:
                                                </span>{" "}
                                                {p.cds_groups?.name ?? "—"}
                                            </p>

                                            <p className="sm:col-span-2 break-all">
                                                {p.email}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            verifyPresident(
                                                p.id,
                                                p.username
                                            )
                                        }
                                        className="bg-forest text-paper text-xs rounded-sm px-5 py-2.5 w-full sm:w-auto shrink-0 hover:opacity-90 transition-opacity"
                                    >
                                        Verify president
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Verified presidents */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="font-display text-xl text-ink">
                            Verified presidents
                        </h2>

                        <p className="text-sm text-[#5c5942] mt-1">
                            Manage existing president accounts.
                        </p>
                    </div>

                    <span className="text-xs text-[#5c5942] border border-line rounded-sm px-3 py-1.5">
                        {verifiedPresidents.length} verified
                    </span>
                </div>

                <div className="border border-line rounded-sm overflow-hidden">
                    {verifiedPresidents.length === 0 ? (
                        <p className="text-sm text-[#5c5942] text-center py-10 px-4">
                            No verified presidents yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-line">
                            {verifiedPresidents.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                                >
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-medium text-ink">
                                                {p.full_name}
                                            </h3>

                                            <span className="text-xs text-[#5c5942]">
                                                @{p.username}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#5c5942]">
                                            <p>
                                                <span className="text-ink">
                                                    LGA:
                                                </span>{" "}
                                                {p.lgas?.name ?? "—"}
                                            </p>

                                            <p>
                                                <span className="text-ink">
                                                    CDS group:
                                                </span>{" "}
                                                {p.cds_groups?.name ?? "—"}
                                            </p>

                                            <p className="sm:col-span-2 break-all">
                                                {p.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <ResetPresidentForm
                                            id={p.id}
                                            authUserId={p.auth_user_id}
                                            currentFullName={p.full_name}
                                            adminPassword={pw}
                                            onDone={loadData}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
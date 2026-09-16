


import { useState } from "react";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/ui/TextInput";

export default function RecoverUsernamePage() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setResult(null);
        setLoading(true);

        try {
            const res = await fetch("/api/account/recover-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.error ?? "Something went wrong.");
                return;
            }

            setResult(json.username);
        } catch {
            setError("Unable to connect. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-paper">
            <Header />

            <main className="px-4 py-12 sm:px-6 sm:py-16">
                <section className="mx-auto w-full max-w-md">
                    <div className="mb-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8770]">
                            Account assistance
                        </p>

                        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                            Recover your username
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#5c5942]">
                            Enter the recovery email you used when registering. We’ll use it
                            to look up your username.
                        </p>
                    </div>

                    <div className="rounded-sm border border-khaki p-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="recovery-email"
                                    className="block text-sm font-medium text-ink"
                                >
                                    Recovery email
                                </label>

                                <TextInput
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={setEmail}
                                    required
                                />
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-sm border border-clay p-3 text-sm text-clay"
                                >
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div
                                    role="status"
                                    className="rounded-sm border border-forest p-4 text-sm text-forest"
                                >
                                    <p className="mb-1 text-xs">Your username</p>
                                    <p className="break-all font-display text-lg font-semibold">
                                        {result}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-sm bg-forest px-4 py-3 text-sm font-medium text-paper transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Looking up…" : "Find my username"}
                            </button>
                        </form>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-[#8a8770]">
                        Use the same email address you provided during registration.
                    </p>
                </section>
            </main>
        </div>
    );
}
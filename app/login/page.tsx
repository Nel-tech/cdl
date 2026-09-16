
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { internalAuthEmail } from "@/lib/username";
import { Header } from "@/components/Header";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: internalAuthEmail(username.trim().toLowerCase()),
            password,
        });

        setLoading(false);

        if (error) {
            setError("Invalid username or password.");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-paper">
            <Header />

            <main className="mx-auto max-w-sm px-6 py-10">
                <h1 className="mb-1 font-display text-xl text-ink">
                    CDS President Login
                </h1>

                <p className="mb-5 text-xs text-[#5c5942]">
                    Not registered yet?{" "}
                    <Link href="/signup" className="text-forest underline">
                        Sign up here
                    </Link>
                    .
                    <br />
                    Forgot your username?{" "}
                    <Link href="/recover-username" className="text-forest underline">
                        Recover it here
                    </Link>
                    .
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-sm border border-khaki px-3 py-2 text-sm"
                        autoComplete="username"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-sm border border-khaki px-3 py-2 text-sm"
                        autoComplete="current-password"
                        required
                    />

                    {error && (
                        <p role="alert" className="text-xs text-clay">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-sm bg-forest px-4 py-2 text-sm text-paper disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </main>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
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
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        async function checkExistingSession() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setCheckingSession(false);
                return;
            }

            const { data: president } = await supabase
                .from("cds_presidents")
                .select("is_verified")
                .eq("auth_user_id", user.id)
                .single();

            if (president?.is_verified) {
                router.push("/dashboard");
            } else if (president) {
                router.push("/signup/pending");
            } else {
                setCheckingSession(false);
            }
        }

        checkExistingSession();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
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

    if (checkingSession) {
        return (
            <div className="min-h-screen bg-paper">
                <Header />
                <div className="max-w-sm mx-auto px-6 py-10 text-sm text-[#5c5942]">
                    Checking session...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper">
            <Header />
            <div className="max-w-sm mx-auto px-6 py-10">
                <h1 className="font-display text-xl text-ink mb-1">CDS President Login</h1>
                <p className="text-xs text-[#5c5942] mb-5">
                    Not registered yet? <a href="/signup" className="underline text-forest">Sign up here</a>.
                    <br />
                    Forgot your username? <a href="/recover-username" className="underline text-forest">Recover it here</a>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                        required
                    />
                    {error && <p className="text-xs text-clay">{error}</p>}
                    <button
                        disabled={loading}
                        className="bg-forest text-paper rounded-sm px-4 py-2 w-full text-sm disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
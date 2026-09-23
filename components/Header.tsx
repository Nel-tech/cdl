"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const supabase = createClient();
  const router = useRouter();

  const [status, setStatus] = useState<"anon" | "authenticated">("anon");

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;
      setStatus(user ? "authenticated" : "anon");
    }

    void checkStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkStatus();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setStatus("anon");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-4">
      <Link
        href="/"
        className="font-display text-2xl font-bold tracking-tight text-ink"
      >
        CDL
      </Link>

      <nav className="flex items-center gap-5 text-sm">
        {status === "anon" && (
          <Link href="/signup" className="text-forest">
            Sign up
          </Link>
        )}

        {status === "authenticated" && (
          <Link href="/dashboard" className="text-forest">
            Dashboard
          </Link>
        )}

        {status === "authenticated" && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-[#8a8770]"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
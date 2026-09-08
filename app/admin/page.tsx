"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
    const supabase = createClient();
    const [pw, setPw] = useState("");
    const [authed, setAuthed] = useState(false);
    const [presidents, setPresidents] = useState<any[]>([]);
    const [pendingGroups, setPendingGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
            .select("id, username, full_name, email, is_verified, lgas(name), cds_groups(name)")
            .order("created_at", { ascending: false });
        const { data: groups } = await supabase
            .from("cds_groups")
            .select("id, name")
            .eq("is_pending", true);
        setPresidents(pres ?? []);
        setPendingGroups(groups ?? []);
        setLoading(false);
    }

    async function verifyPresident(id: number) {
        await fetch("/api/admin/verify-president", {
            method: "POST",
            body: JSON.stringify({ id, password: pw }),
        });
        loadData();
    }

    async function approveGroup(id: number) {
        await fetch("/api/admin/approve-group", {
            method: "POST",
            body: JSON.stringify({ id, password: pw }),
        });
        loadData();
    }

    if (!authed) {
        return (
            <form onSubmit={checkPassword} className="max-w-xs mx-auto mt-10 space-y-3">
                <input
                    type="password"
                    placeholder="Admin password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                />
                <button className="bg-forest text-paper rounded-sm px-4 py-2 w-full text-sm">
                    Enter
                </button>
            </form>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-xl text-ink mb-4">Admin</h1>

            {loading && <p className="text-sm text-[#5c5942]">Loading...</p>}

            <h2 className="font-display text-base text-ink mt-6 mb-2">Pending presidents</h2>
            <div className="border-t border-line">
                {presidents.filter((p) => !p.is_verified).map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-3 border-b border-line text-sm">
                        <div>
                            <div className="text-ink">{p.full_name} ({p.username})</div>
                            <div className="text-xs text-[#5c5942]">
                                {p.lgas?.name} · {p.cds_groups?.name} · {p.email}
                            </div>
                        </div>
                        <button
                            onClick={() => verifyPresident(p.id)}
                            className="bg-forest text-paper text-xs rounded-sm px-3 py-1"
                        >
                            Verify
                        </button>
                    </div>
                ))}
                {presidents.filter((p) => !p.is_verified).length === 0 && (
                    <p className="text-sm text-[#5c5942] py-3">None pending.</p>
                )}
            </div>

            <h2 className="font-display text-base text-ink mt-8 mb-2">Pending CDS groups</h2>
            <div className="border-t border-line">
                {pendingGroups.map((g) => (
                    <div key={g.id} className="flex justify-between items-center py-3 border-b border-line text-sm">
                        <div className="text-ink">{g.name}</div>
                        <button
                            onClick={() => approveGroup(g.id)}
                            className="bg-forest text-paper text-xs rounded-sm px-3 py-1"
                        >
                            Approve
                        </button>
                    </div>
                ))}
                {pendingGroups.length === 0 && (
                    <p className="text-sm text-[#5c5942] py-3">None pending.</p>
                )}
            </div>
        </div>
    );
}
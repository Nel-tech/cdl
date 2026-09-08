"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buildUsername, internalAuthEmail } from "@/lib/username";
import { TextInput } from "@/components/ui/TextInput";
import { LgaGroupFields } from "@/components/signup/LgaGroupFields";

type Option = { id: number; name: string; state?: string };

type FormState = {
    fullName: string;
    email: string;
    password: string;
    lgaId: string;
    groupId: string;
    newGroupName: string;
};

const initialForm: FormState = {
    fullName: "",
    email: "",
    password: "",
    lgaId: "",
    groupId: "",
    newGroupName: "",
};

export default function SignupPage() {
    const supabase = createClient();
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialForm);
    const [lgas, setLgas] = useState<Option[]>([]);
    const [groups, setGroups] = useState<Option[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        supabase.from("lgas").select("id, name, state").order("name").then(({ data }) => setLgas(data ?? []));
        supabase
            .from("cds_groups")
            .select("id, name")
            .eq("is_pending", false)
            .order("name")
            .then(({ data }) => setGroups(data ?? []));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.lgaId || (!form.groupId && !form.newGroupName.trim())) {
            setError("Select your LGA and CDS group.");
            return;
        }

        setLoading(true);

        let finalGroupId = form.groupId;

        if (!form.groupId && form.newGroupName.trim()) {
            const { data: newGroup, error: groupErr } = await supabase
                .from("cds_groups")
                .insert({ name: form.newGroupName.trim(), is_pending: true })
                .select("id")
                .single();

            if (groupErr || !newGroup) {
                setError("Could not submit new group. Try again.");
                setLoading(false);
                return;
            }
            finalGroupId = String(newGroup.id);
        }

        const lgaName = lgas.find((l) => String(l.id) === form.lgaId)?.name ?? "";
        const groupName =
            form.newGroupName.trim() ||
            groups.find((g) => String(g.id) === finalGroupId)?.name ||
            "";
        const username = buildUsername(lgaName, groupName);

        const { data: authData, error: authErr } = await supabase.auth.signUp({
            email: internalAuthEmail(username),
            password: form.password,
        });

        if (authErr || !authData.user) {
            setError(authErr?.message ?? "Signup failed.");
            setLoading(false);
            return;
        }

        const { error: profileErr } = await supabase.from("cds_presidents").insert({
            auth_user_id: authData.user.id,
            username,
            email: form.email,
            full_name: form.fullName,
            lga_id: Number(form.lgaId),
            cds_group_id: Number(finalGroupId),
            is_verified: false,
        });

        setLoading(false);

        if (profileErr) {
            setError(profileErr.message);
            return;
        }

        router.push("/signup/pending");
    }

    return (
        <div className="max-w-sm mx-auto">
            <h1 className="font-display text-xl text-ink mb-1">Register as CDS President</h1>
            <p className="text-xs text-[#5c5942] mb-5">
                Your account needs to be verified before you can log in.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <TextInput
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={(v) => update("fullName", v)}
                    required
                />
                <TextInput
                    type="email"
                    placeholder="Your email (for recovery)"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    required
                />

                <LgaGroupFields
                    lgas={lgas}
                    groups={groups}
                    lgaId={form.lgaId}
                    groupId={form.groupId}
                    newGroupName={form.newGroupName}
                    onLgaChange={(v) => update("lgaId", v)}
                    onGroupChange={(v) => update("groupId", v)}
                    onNewGroupNameChange={(v) => update("newGroupName", v)}
                />

                <TextInput
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(v) => update("password", v)}
                    required
                />

                {error && <p className="text-xs text-clay">{error}</p>}

                <button
                    disabled={loading}
                    className="bg-forest text-paper rounded-sm px-4 py-2 w-full text-sm disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Register"}
                </button>
            </form>
        </div>
    );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your client helper path

type Lga = {
    id: number;
    name: string;
    slug: string;
    state: string;
};

type Props = {
    onChange: (value: { state: string; lgaId: number; lgaSlug: string } | null) => void;
    initialState?: string;
    initialLgaId?: number;
    disabled?: boolean;
};

export default function StateLgaSelect({
    onChange,
    initialState,
    initialLgaId,
    disabled,
}: Props) {
    const [lgas, setLgas] = useState<Lga[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState(initialState ?? "");
    const [selectedLga, setSelectedLga] = useState(initialLgaId?.toString() ?? "");

    // Fetch the full lgas table once on mount. 774 rows is small enough
    // (well under a hundred KB) to pull in a single request and filter
    // client-side, rather than round-tripping on every state change.
    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("lgas")
            .select("id, name, slug, state")
            .order("state")
            .order("name")
            .then(({ data, error }) => {
                if (error) {
                    console.error("Failed to load LGAs:", error);
                } else {
                    setLgas(data ?? []);
                }
                setLoading(false);
            });
    }, []);

    const states = useMemo(() => {
        const seen = new Set<string>();
        for (const lga of lgas) seen.add(lga.state);
        return Array.from(seen).sort((a, b) => a.localeCompare(b));
    }, [lgas]);

    const lgasForSelectedState = useMemo(
        () => lgas.filter((l) => l.state === selectedState),
        [lgas, selectedState]
    );

    function handleStateChange(state: string) {
        setSelectedState(state);
        setSelectedLga("");
        onChange(null); // clear parent's value until an LGA is picked too
    }

    function handleLgaChange(lgaIdStr: string) {
        setSelectedLga(lgaIdStr);
        const lga = lgasForSelectedState.find((l) => l.id.toString() === lgaIdStr);
        if (lga) {
            onChange({ state: lga.state, lgaId: lga.id, lgaSlug: lga.slug });
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="state-select">
                    State
                </label>
                <select
                    id="state-select"
                    className="w-full border border-[#D8D2BC] bg-[#EFEAD9] rounded-md px-3 py-2"
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    disabled={disabled || loading}
                >
                    <option value="">{loading ? "Loading states…" : "Select a state"}</option>
                    {states.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lga-select">
                    LGA
                </label>
                <select
                    id="lga-select"
                    className="w-full border border-[#D8D2BC] bg-[#EFEAD9] rounded-md px-3 py-2 disabled:opacity-50"
                    value={selectedLga}
                    onChange={(e) => handleLgaChange(e.target.value)}
                    disabled={disabled || !selectedState}
                >
                    <option value="">
                        {selectedState ? "Select an LGA" : "Pick a state first"}
                    </option>
                    {lgasForSelectedState.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
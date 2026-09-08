"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LocationForm } from "./LocationForm";
import { PresidentLocationCard } from "./PresidentLocationCard";

type President = {
    id: number;
    lga_id: number;
    cds_group_id: number;
    full_name: string | null;
};

type Location = {
    id: number;
    name: string;
    status: string;
    last_confirmed_at: string | null;
};

export function DashboardClient({
    president,
    initialLocations,
}: {
    president: President;
    initialLocations: Location[];
}) {
    const supabase = createClient();
    const [locations, setLocations] = useState(initialLocations);

    async function refresh() {
        const { data } = await supabase
            .from("locations")
            .select("id, name, status, last_confirmed_at")
            .eq("lga_id", president.lga_id)
            .eq("cds_group_id", president.cds_group_id)
            .order("created_at", { ascending: false });
        setLocations(data ?? []);
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            <h1 className="font-display text-xl text-ink mb-1">
                Welcome{president.full_name ? `, ${president.full_name}` : ""}
            </h1>
            <p className="text-xs text-[#5c5942] mb-6">
                Manage locations for your CDS group.
            </p>

            <LocationForm
                presidentId={president.id}
                lgaId={president.lga_id}
                cdsGroupId={president.cds_group_id}
                onCreated={refresh}
            />

            <div className="text-xs text-[#5c5942] mb-2 tracking-wide">
                {locations.length} LOCATIONS
            </div>

            {locations.length === 0 ? (
                <p className="text-sm text-[#5c5942] py-4">
                    No locations yet — add your first one above.
                </p>
            ) : (
                locations.map((loc) => (
                    <PresidentLocationCard
                        key={loc.id}
                        id={loc.id}
                        name={loc.name}
                        status={loc.status}
                        lastConfirmedAt={loc.last_confirmed_at}
                        presidentId={president.id}
                        onChanged={refresh}
                    />
                ))
            )}
        </div>
    );
}

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
    address?: string | null;
    contact_person?: string | null;
    contact_phone?: string | null;
    signboard_phone?: string | null;
    capacity_notes?: string | null;
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
            .select("id, name, address, contact_person, contact_phone, signboard_phone, capacity_notes, status, last_confirmed_at")
            .eq("lga_id", president.lga_id)
            .eq("cds_group_id", president.cds_group_id)
            .order("created_at", { ascending: false });
        setLocations(data ?? []);
    }

    const activeCount = locations.filter(
        (loc) => loc.status === "active"
    ).length;

    const inactiveCount = locations.filter(
        (loc) => loc.status !== "active"
    ).length;

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

            {/* Welcome header */}
            <header className="space-y-2">
                <p className="text-xs text-[#5c5942] uppercase tracking-widest">
                    CDS management
                </p>

                <h1 className="font-display text-2xl sm:text-3xl text-ink">
                    Welcome
                    {president.full_name
                        ? `, ${president.full_name}`
                        : ""}
                </h1>

                <p className="text-sm text-[#5c5942] max-w-xl">
                    Manage the locations available to your CDS group.
                    Add new locations and keep existing information up to date.
                </p>
            </header>

            {/* Overview */}
            <section
                aria-label="Location overview"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-xs text-[#5c5942]">
                        Total locations
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {locations.length}
                    </p>
                </div>

                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-xs text-[#5c5942]">
                        Active locations
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {activeCount}
                    </p>
                </div>

                <div className="border border-line rounded-sm p-4 sm:p-5">
                    <p className="text-xs text-[#5c5942]">
                        Inactive locations
                    </p>

                    <p className="font-display text-3xl text-ink mt-3">
                        {inactiveCount}
                    </p>
                </div>
            </section>

            {/* Add location */}
            <section className="border border-line rounded-sm p-4 sm:p-6">
                <div className="mb-5">
                    <h2 className="font-display text-lg text-ink">
                        Add a location
                    </h2>

                    <p className="text-sm text-[#5c5942] mt-1">
                        Share a new location with your CDS group.
                    </p>
                </div>

                <LocationForm
                    presidentId={president.id}
                    lgaId={president.lga_id}
                    cdsGroupId={president.cds_group_id}
                    onCreated={refresh}
                />
            </section>

            {/* Location list */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <h2 className="font-display text-xl text-ink">
                            Your locations
                        </h2>

                        <p className="text-sm text-[#5c5942] mt-1">
                            Manage and confirm your registered locations.
                        </p>
                    </div>

                    <span className="text-xs text-[#5c5942] border border-line rounded-sm px-3 py-2 w-fit">
                        {locations.length}{" "}
                        {locations.length === 1 ? "location" : "locations"}
                    </span>
                </div>

                {locations.length === 0 ? (
                    <div className="border border-line rounded-sm text-center px-4 py-12">
                        <h3 className="font-display text-lg text-ink">
                            No locations yet
                        </h3>

                        <p className="text-sm text-[#5c5942] mt-2 max-w-sm mx-auto">
                            Add your first CDS location using the form above.
                            It will appear here once created.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {locations.map((loc) => (
                            <PresidentLocationCard
                                key={loc.id}
                                id={loc.id}
                                name={loc.name}
                                status={loc.status}
                                lastConfirmedAt={loc.last_confirmed_at}
                                presidentId={president.id}
                                onChanged={refresh}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
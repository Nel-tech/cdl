"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LocationFormProps = {
    presidentId: number;
    lgaId: number;
    cdsGroupId: number;
    onCreated: () => void;
};

export function LocationForm({ presidentId, lgaId, cdsGroupId, onCreated }: LocationFormProps) {
    const supabase = createClient();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [capacityNotes, setCapacityNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.from("locations").insert({
            name,
            address,
            contact_person: contactPerson,
            contact_phone: contactPhone,
            capacity_notes: capacityNotes,
            lga_id: lgaId,
            cds_group_id: cdsGroupId,
            created_by: presidentId,
            last_confirmed_at: new Date().toISOString(),
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setName("");
        setAddress("");
        setContactPerson("");
        setContactPhone("");
        setCapacityNotes("");
        onCreated();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2 border-b border-line pb-6 mb-6">
            <div className="font-display text-base text-ink mb-2">Add a location</div>
            <input
                placeholder="Location name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                required
            />
            <input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            />
            <input
                placeholder="Contact person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            />
            <input
                placeholder="Contact phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            />
            <textarea
                placeholder="Capacity notes (e.g. takes 3-5 corpers per batch)"
                value={capacityNotes}
                onChange={(e) => setCapacityNotes(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            />
            {error && <p className="text-xs text-clay">{error}</p>}
            <button
                disabled={loading}
                className="bg-forest text-paper rounded-sm px-4 py-2 text-sm disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add location"}
            </button>
        </form>
    );
}
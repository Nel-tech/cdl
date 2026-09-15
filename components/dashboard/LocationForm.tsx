
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LocationFormProps = {
    presidentId: number;
    lgaId: number;
    cdsGroupId: number;
    onCreated: () => void;
};

export function LocationForm({
    presidentId,
    lgaId,
    cdsGroupId,
    onCreated,
}: LocationFormProps) {
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
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Location details */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-ink">
                    Location details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="location-name"
                            className="text-xs text-[#5c5942]"
                        >
                            Location name *
                        </label>

                        <input
                            id="location-name"
                            placeholder="e.g. Green Valley Farm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-khaki rounded-sm px-3 py-3 w-full text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="location-address"
                            className="text-xs text-[#5c5942]"
                        >
                            Address
                        </label>

                        <input
                            id="location-address"
                            placeholder="Enter location address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border border-khaki rounded-sm px-3 py-3 w-full text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-line" />

            {/* Contact information */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-ink">
                    Contact information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="contact-person"
                            className="text-xs text-[#5c5942]"
                        >
                            Contact person
                        </label>

                        <input
                            id="contact-person"
                            placeholder="Name of contact person"
                            value={contactPerson}
                            onChange={(e) =>
                                setContactPerson(e.target.value)
                            }
                            className="border border-khaki rounded-sm px-3 py-3 w-full text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="contact-phone"
                            className="text-xs text-[#5c5942]"
                        >
                            Contact phone
                        </label>

                        <input
                            id="contact-phone"
                            type="tel"
                            placeholder="Phone number"
                            value={contactPhone}
                            onChange={(e) =>
                                setContactPhone(e.target.value)
                            }
                            className="border border-khaki rounded-sm px-3 py-3 w-full text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-line" />

            {/* Capacity notes */}
            <div className="space-y-2">
                <label
                    htmlFor="capacity-notes"
                    className="text-sm font-medium text-ink"
                >
                    Capacity notes
                </label>

                <p className="text-xs text-[#5c5942]">
                    Add useful information about the location's capacity
                    or availability.
                </p>

                <textarea
                    id="capacity-notes"
                    placeholder="e.g. Takes 3–5 corpers per batch"
                    value={capacityNotes}
                    onChange={(e) => setCapacityNotes(e.target.value)}
                    rows={3}
                    className="border border-khaki rounded-sm px-3 py-3 w-full text-sm resize-y"
                />
            </div>

            {/* Error and submit */}
            {error && (
                <p role="alert" className="text-sm text-clay">
                    {error}
                </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-1">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-forest text-paper rounded-sm px-6 py-3 text-sm w-full sm:w-auto disabled:opacity-50"
                >
                    {loading ? "Adding location..." : "Add location"}
                </button>
            </div>
        </form>
    );
}
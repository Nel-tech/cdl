"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { removeSignboard, uploadSignboard } from "@/lib/signboard";
import { SignboardPicker } from "./SignboardPicker";

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
    const [signboardFile, setSignboardFile] = useState<File | null>(null);
    const [sideNote, setSideNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        // Upload the photo first so the row is saved with its path in one insert.
        let signboardPath: string | null = null;
        if (signboardFile) {
            try {
                signboardPath = await uploadSignboard(
                    supabase,
                    lgaId,
                    cdsGroupId,
                    signboardFile
                );
            } catch (err) {
                setLoading(false);
                setError(err instanceof Error ? err.message : "Photo upload failed.");
                return;
            }
        }

        const { error } = await supabase.from("locations").insert({
            name,
            address,
            contact_person: contactPerson,
            contact_phone: contactPhone,
            signboard_image_path: signboardPath,
            capacity_notes: sideNote, // column keeps its old name; only the label changed
            lga_id: lgaId,
            cds_group_id: cdsGroupId,
            created_by: presidentId,
            last_confirmed_at: new Date().toISOString(),
        });

        if (error) {
            // Don't leave an orphaned photo behind.
            if (signboardPath) await removeSignboard(supabase, signboardPath);
            setLoading(false);
            setError(error.message);
            return;
        }

        setLoading(false);
        setName("");
        setAddress("");
        setContactPerson("");
        setContactPhone("");
        setSignboardFile(null);
        setSideNote("");

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
            <div>
                <label className="text-xs text-[#5c5942]">Contact name (e.g. manager, caretaker)</label>
                <input
                    placeholder="e.g. Mr. Effiong (Farm Manager)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="border border-khaki rounded-sm px-3 py-2 w-full text-sm mt-1"
                />
            </div>
            <div>
                <label className="text-xs text-[#5c5942]">Contact phone number</label>
                <input
                    placeholder="e.g. 080XXXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="border border-khaki rounded-sm px-3 py-2 w-full text-sm mt-1"
                />
            </div>

            <SignboardPicker file={signboardFile} onFileChange={setSignboardFile} />

            <div className="border-t border-line" />

            {/* Side note */}
            <div className="space-y-2">
                <label
                    htmlFor="side-note"
                    className="text-sm font-medium text-ink"
                >
                    Side note
                </label>

                <p className="text-xs text-[#5c5942]">
                    Anything else corpers should know about this location.
                </p>

                <textarea
                    id="side-note"
                    placeholder="e.g. Takes 3–5 corpers per batch, best to visit before 10am"
                    value={sideNote}
                    onChange={(e) => setSideNote(e.target.value)}
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
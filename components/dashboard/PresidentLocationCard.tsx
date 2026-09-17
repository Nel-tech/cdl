"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatusTag } from "@/components/StatusTag";
import { LocationEditForm } from "./LocationEditForm";
import { DeleteLocationControl } from "./DeleteLocationControl";
import { AddNoteInput } from "./AddNoteInput";

type PresidentLocationCardProps = {
    id: number;
    name: string;
    address?: string | null;
    contactPerson?: string | null;
    contactPhone?: string | null;
    signboardPhone?: string | null;
    capacityNotes?: string | null;
    status: string;
    lastConfirmedAt: string | null;
    presidentId: number;
    onChanged: () => void;
};

export function PresidentLocationCard({
    id,
    name,
    address,
    contactPerson,
    contactPhone,
    signboardPhone,
    capacityNotes,
    status,
    lastConfirmedAt,
    presidentId,
    onChanged,
}: PresidentLocationCardProps) {
    const supabase = createClient();
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState(false);

    async function toggleStatus() {
        setBusy(true);
        const newStatus = status === "active" ? "inactive" : "active";
        await supabase
            .from("locations")
            .update({ status: newStatus, last_confirmed_at: new Date().toISOString() })
            .eq("id", id);
        setBusy(false);
        onChanged();
    }

    async function confirmActive() {
        setBusy(true);
        await supabase
            .from("locations")
            .update({ last_confirmed_at: new Date().toISOString() })
            .eq("id", id);
        setBusy(false);
        onChanged();
    }

    async function addNote(note: string) {
        setBusy(true);
        await supabase.from("location_updates").insert({
            location_id: id,
            president_id: presidentId,
            note,
        });
        setBusy(false);
        onChanged();
    }

    async function saveEdit(values: {
        name: string;
        address: string;
        contactPerson: string;
        contactPhone: string;
        signboardPhone: string;
        capacityNotes: string;
    }) {
        setBusy(true);
        await supabase
            .from("locations")
            .update({
                name: values.name,
                address: values.address,
                contact_person: values.contactPerson,
                contact_phone: values.contactPhone,
                signboard_phone: values.signboardPhone,
                capacity_notes: values.capacityNotes,
            })
            .eq("id", id);
        setBusy(false);
        setEditing(false);
        onChanged();
    }

    async function deleteLocation() {
        setBusy(true);
        await supabase.from("locations").delete().eq("id", id);
        setBusy(false);
        onChanged();
    }

    if (editing) {
        return (
            <LocationEditForm
                name={name}
                initialValues={{
                    name,
                    address: address ?? "",
                    contactPerson: contactPerson ?? "",
                    contactPhone: contactPhone ?? "",
                    signboardPhone: signboardPhone ?? "",
                    capacityNotes: capacityNotes ?? "",
                }}
                loading={busy}
                onSave={saveEdit}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="py-4 border-b border-line">
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-display text-base text-ink">{name}</div>
                    {lastConfirmedAt && (
                        <div className="text-xs text-[#8a8770] mt-1">
                            Last confirmed {new Date(lastConfirmedAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
                <StatusTag status={status} />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap items-center">
                <button
                    disabled={busy}
                    onClick={confirmActive}
                    className="text-xs border border-forest text-forest rounded-sm px-3 py-1"
                >
                    Confirm still active
                </button>
                <button
                    disabled={busy}
                    onClick={toggleStatus}
                    className="text-xs border border-clay text-clay rounded-sm px-3 py-1"
                >
                    Mark {status === "active" ? "inactive" : "active"}
                </button>
                <button
                    disabled={busy}
                    onClick={() => setEditing(true)}
                    className="text-xs border border-khaki text-ink rounded-sm px-3 py-1"
                >
                    Edit
                </button>
                <DeleteLocationControl busy={busy} onDelete={deleteLocation} />
            </div>

            <AddNoteInput busy={busy} onAdd={addNote} />
        </div>
    );
}
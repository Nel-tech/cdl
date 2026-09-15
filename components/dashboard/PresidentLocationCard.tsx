

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatusTag } from "@/components/StatusTag";
import { LocationEditForm } from "./LocationEditForm";
import { LocationActions } from "./LocationActions";
import { LocationNoteForm } from "./LocationNoteForm";

type PresidentLocationCardProps = {
    id: number;
    name: string;
    address?: string | null;
    contactPerson?: string | null;
    contactPhone?: string | null;
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
    capacityNotes,
    status,
    lastConfirmedAt,
    presidentId,
    onChanged,
}: PresidentLocationCardProps) {
    const supabase = createClient();

    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const initialValues = {
        name,
        address: address ?? "",
        contactPerson: contactPerson ?? "",
        contactPhone: contactPhone ?? "",
        capacityNotes: capacityNotes ?? "",
    };

    async function toggleStatus() {
        setBusy(true);

        const newStatus =
            status === "active" ? "inactive" : "active";

        await supabase
            .from("locations")
            .update({
                status: newStatus,
                last_confirmed_at: new Date().toISOString(),
            })
            .eq("id", id);

        setBusy(false);
        onChanged();
    }

    async function confirmActive() {
        setBusy(true);

        await supabase
            .from("locations")
            .update({
                last_confirmed_at: new Date().toISOString(),
            })
            .eq("id", id);

        setBusy(false);
        onChanged();
    }

    async function addNote() {
        if (!note.trim()) return;

        setBusy(true);

        await supabase.from("location_updates").insert({
            location_id: id,
            president_id: presidentId,
            note: note.trim(),
        });

        setNote("");
        setBusy(false);
        onChanged();
    }

    async function saveEdit(values: typeof initialValues) {
        setBusy(true);

        await supabase
            .from("locations")
            .update({
                name: values.name,
                address: values.address,
                contact_person: values.contactPerson,
                contact_phone: values.contactPhone,
                capacity_notes: values.capacityNotes,
            })
            .eq("id", id);

        setBusy(false);
        setEditing(false);
        onChanged();
    }

    async function deleteLocation() {
        setBusy(true);

        await supabase
            .from("locations")
            .delete()
            .eq("id", id);

        setBusy(false);
        setConfirmingDelete(false);
        onChanged();
    }

    if (editing) {
        return (
            <LocationEditForm
                key={id}
                name={name}
                initialValues={initialValues}
                loading={busy}
                onSave={saveEdit}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <article className="border border-line rounded-sm p-4 sm:p-5 space-y-5">

            {/* Location header */}
            <header className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                    <h3 className="font-display text-lg sm:text-xl text-ink break-words">
                        {name}
                    </h3>

                    {address && (
                        <p className="text-sm text-[#5c5942] break-words">
                            {address}
                        </p>
                    )}
                </div>

                <div className="shrink-0">
                    <StatusTag status={status} />
                </div>
            </header>

            {/* Contact details */}
            {(contactPerson || contactPhone || capacityNotes) && (
                <div className="border-t border-line pt-4 space-y-3">
                    <h4 className="text-sm font-medium text-ink">
                        Location information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contactPerson && (
                            <div className="min-w-0">
                                <p className="text-xs text-[#5c5942] mb-1">
                                    Contact person
                                </p>

                                <p className="text-sm text-ink break-words">
                                    {contactPerson}
                                </p>
                            </div>
                        )}

                        {contactPhone && (
                            <div className="min-w-0">
                                <p className="text-xs text-[#5c5942] mb-1">
                                    Contact phone
                                </p>

                                <p className="text-sm text-ink break-words">
                                    {contactPhone}
                                </p>
                            </div>
                        )}

                        {capacityNotes && (
                            <div className="sm:col-span-2">
                                <p className="text-xs text-[#5c5942] mb-1">
                                    Capacity notes
                                </p>

                                <p className="text-sm text-ink whitespace-pre-wrap break-words">
                                    {capacityNotes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation date */}
            <div className="border-t border-line pt-4">
                <p className="text-xs text-[#5c5942]">
                    Last confirmed
                </p>

                <p className="text-sm text-ink mt-1">
                    {lastConfirmedAt
                        ? new Date(lastConfirmedAt).toLocaleDateString(
                              undefined,
                              {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              }
                          )
                        : "Not confirmed yet"}
                </p>
            </div>

            {/* Actions */}
            <div className="border-t border-line pt-4">
                <LocationActions
                    status={status}
                    busy={busy}
                    confirmingDelete={confirmingDelete}
                    onConfirm={confirmActive}
                    onToggleStatus={toggleStatus}
                    onEdit={() => setEditing(true)}
                    onDelete={deleteLocation}
                    onCancelDelete={() => setConfirmingDelete((v) => !v)}
                />
            </div>

            {/* Notes */}
            <LocationNoteForm
                note={note}
                busy={busy}
                onNoteChange={setNote}
                onSave={addNote}
            />
        </article>
    );
}
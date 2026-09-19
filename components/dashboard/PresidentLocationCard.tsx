"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { removeSignboard, uploadSignboard } from "@/lib/signboard";
import { StatusTag } from "@/components/StatusTag";
import {
    LocationEditForm,
    type EditFormValues,
    type EditPhotoChange,
} from "./LocationEditForm";
import { DeleteLocationControl } from "./DeleteLocationControl";
import { AddNoteInput } from "./AddNoteInput";
import { useSignboardUrl } from "./SignboardPicker";

type PresidentLocationCardProps = {
    id: number;
    name: string;
    address?: string | null;
    contactPerson?: string | null;
    contactPhone?: string | null;
    signboardImagePath?: string | null;
    sideNote?: string | null;
    status: string;
    lastConfirmedAt: string | null;
    presidentId: number;
    lgaId: number;
    cdsGroupId: number;
    onChanged: () => void;
};

export function PresidentLocationCard({
    id,
    name,
    address,
    contactPerson,
    contactPhone,
    signboardImagePath,
    sideNote,
    status,
    lastConfirmedAt,
    presidentId,
    lgaId,
    cdsGroupId,
    onChanged,
}: PresidentLocationCardProps) {
    const supabase = createClient();
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const signboardUrl = useSignboardUrl(signboardImagePath);

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

    async function saveEdit(values: EditFormValues, photo: EditPhotoChange) {
        setBusy(true);
        setError(null);

        let nextPath = signboardImagePath ?? null;
        let uploadedPath: string | null = null;

        try {
            if (photo.newFile) {
                uploadedPath = await uploadSignboard(supabase, lgaId, cdsGroupId, photo.newFile);
                nextPath = uploadedPath;
            } else if (photo.removeExisting) {
                nextPath = null;
            }
        } catch (err) {
            setBusy(false);
            setError(err instanceof Error ? err.message : "Photo upload failed.");
            return;
        }

        // signboard_phone is intentionally not sent, so old values are never overwritten.
        const { error: updateError } = await supabase
            .from("locations")
            .update({
                name: values.name,
                address: values.address,
                contact_person: values.contactPerson,
                contact_phone: values.contactPhone,
                signboard_image_path: nextPath,
                capacity_notes: values.sideNote, // column keeps its old name
            })
            .eq("id", id);

        if (updateError) {
            if (uploadedPath) await removeSignboard(supabase, uploadedPath);
            setBusy(false);
            setError(updateError.message);
            return;
        }

        // Clean up the replaced or removed photo only after the row is saved.
        if (signboardImagePath && signboardImagePath !== nextPath) {
            await removeSignboard(supabase, signboardImagePath);
        }

        setBusy(false);
        setEditing(false);
        onChanged();
    }

    async function deleteLocation() {
        setBusy(true);
        const { error: deleteError } = await supabase
            .from("locations")
            .delete()
            .eq("id", id);

        if (!deleteError && signboardImagePath) {
            await removeSignboard(supabase, signboardImagePath);
        }
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
                    sideNote: sideNote ?? "",
                }}
                signboardImagePath={signboardImagePath ?? null}
                loading={busy}
                error={error}
                onSave={saveEdit}
                onCancel={() => {
                    setError(null);
                    setEditing(false);
                }}
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

            {signboardUrl && (
                <a
                    href={signboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={signboardUrl}
                        alt={`Signboard for ${name}`}
                        className="h-24 w-auto rounded-sm border border-line"
                    />
                </a>
            )}

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
                    className="text-xs border border-clay text-clay rounded-sm px-3 py-1 hover:bg-clay hover:text-paper transition-colors disabled:opacity-50"
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
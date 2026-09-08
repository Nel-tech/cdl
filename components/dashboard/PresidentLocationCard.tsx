"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatusTag } from "@/components/StatusTag";

type PresidentLocationCardProps = {
    id: number;
    name: string;
    status: string;
    lastConfirmedAt: string | null;
    presidentId: number;
    onChanged: () => void;
};

export function PresidentLocationCard({
    id,
    name,
    status,
    lastConfirmedAt,
    presidentId,
    onChanged,
}: PresidentLocationCardProps) {
    const supabase = createClient();
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);

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

            <div className="flex gap-2 mt-3 flex-wrap">
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
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    placeholder="Add a note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border border-khaki rounded-sm px-3 py-1.5 text-xs flex-1"
                />
                <button
                    disabled={busy}
                    onClick={addNote}
                    className="text-xs bg-ink text-paper rounded-sm px-3 py-1.5"
                >
                    Save note
                </button>
            </div>
        </div>
    );
}
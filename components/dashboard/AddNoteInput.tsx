"use client";

import { useState } from "react";

type AddNoteInputProps = {
    busy: boolean;
    onAdd: (note: string) => void;
};

export function AddNoteInput({ busy, onAdd }: AddNoteInputProps) {
    const [note, setNote] = useState("");

    function submit() {
        if (!note.trim()) return;
        onAdd(note.trim());
        setNote("");
    }

    return (
        <div className="flex gap-2 mt-2">
            <input
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-1.5 text-xs flex-1"
            />
            <button disabled={busy} onClick={submit} className="text-xs bg-ink text-paper rounded-sm px-3 py-1.5">
                Save note
            </button>
        </div>
    );
}
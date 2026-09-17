"use client";

import { useState } from "react";

type DeleteLocationControlProps = {
    busy: boolean;
    onDelete: () => void;
};

export function DeleteLocationControl({ busy, onDelete }: DeleteLocationControlProps) {
    const [confirming, setConfirming] = useState(false);

    if (!confirming) {
        return (
            <button disabled={busy} onClick={() => setConfirming(true)} className="text-xs text-clay">
                Delete
            </button>
        );
    }

    return (
        <span className="text-xs flex items-center gap-2">
            Delete permanently?
            <button disabled={busy} onClick={onDelete} className="bg-clay text-paper rounded-sm px-2 py-0.5">
                Yes, delete
            </button>
            <button disabled={busy} onClick={() => setConfirming(false)} className="text-[#5c5942]">
                Cancel
            </button>
        </span>
    );
}
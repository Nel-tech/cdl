
"use client";

type LocationNoteFormProps = {
    note: string;
    busy: boolean;
    onNoteChange: (value: string) => void;
    onSave: () => void;
};

export function LocationNoteForm({
    note,
    busy,
    onNoteChange,
    onSave,
}: LocationNoteFormProps) {
    return (
        <div className="border-t border-line pt-4 space-y-3">
            <div>
                <h4 className="text-sm font-medium text-ink">
                    Location updates
                </h4>

                <p className="text-xs text-[#5c5942] mt-1">
                    Add useful information about this location.
                </p>
            </div>

            <textarea
                aria-label="Add a note"
                placeholder="Write a note..."
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                rows={2}
                className="border border-khaki rounded-sm px-3 py-3 text-sm w-full resize-y"
            />

            <div className="flex justify-end">
                <button
                    type="button"
                    disabled={busy || !note.trim()}
                    onClick={onSave}
                    className="text-xs bg-ink text-paper rounded-sm px-5 py-2.5 disabled:opacity-50"
                >
                    {busy ? "Saving..." : "Save note"}
                </button>
            </div>
        </div>
    );
}

"use client";

type LocationActionsProps = {
    status: string;
    busy: boolean;
    confirmingDelete: boolean;
    onConfirm: () => void;
    onToggleStatus: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onCancelDelete: () => void;
};

export function LocationActions({
    status,
    busy,
    confirmingDelete,
    onConfirm,
    onToggleStatus,
    onEdit,
    onDelete,
    onCancelDelete,
}: LocationActionsProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={busy}
                    onClick={onConfirm}
                    className="text-xs border border-forest text-forest rounded-sm px-3 py-2 disabled:opacity-50"
                >
                    Confirm still active
                </button>

                <button
                    type="button"
                    disabled={busy}
                    onClick={onToggleStatus}
                    className="text-xs border border-clay text-clay rounded-sm px-3 py-2 disabled:opacity-50"
                >
                    Mark {status === "active" ? "inactive" : "active"}
                </button>

                <button
                    type="button"
                    disabled={busy}
                    onClick={onEdit}
                    className="text-xs border border-khaki text-ink rounded-sm px-3 py-2 disabled:opacity-50"
                >
                    Edit location
                </button>

                {!confirmingDelete && (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onCancelDelete}
                        className="text-xs text-clay px-3 py-2 disabled:opacity-50"
                    >
                        Delete
                    </button>
                )}
            </div>

            {confirmingDelete && (
                <div className="border border-clay rounded-sm p-3 space-y-3">
                    <p className="text-sm text-ink">
                        Delete this location permanently?
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={onDelete}
                            className="bg-clay text-paper text-xs rounded-sm px-4 py-2 disabled:opacity-50"
                        >
                            {busy ? "Deleting..." : "Yes, delete"}
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={onCancelDelete}
                            className="text-xs text-[#5c5942] border border-line rounded-sm px-4 py-2 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";
import React from "react";

type EditFormValues = {
    name: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
    signboardPhone: string;
    capacityNotes: string;
};

type LocationEditFormProps = {
    name: string;
    initialValues: EditFormValues;
    loading: boolean;
    onSave: (values: EditFormValues) => void;
    onCancel: () => void;
};

export function LocationEditForm({
    name,
    initialValues,
    loading,
    onSave,
    onCancel,
}: LocationEditFormProps) {
    const [form, setForm] = React.useState(initialValues);

    function updateField(field: keyof EditFormValues, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-line rounded-sm p-4 sm:p-5 space-y-5"
        >
            <div>
                <p className="text-xs text-[#5c5942] uppercase tracking-widest mb-1">
                    Location management
                </p>

                <h3 className="font-display text-lg text-ink">Edit location</h3>

                <p className="text-sm text-[#5c5942] mt-1 break-words">
                    Update the information for {name}.
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-ink">Location details</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="edit-location-name" className="text-xs text-[#5c5942]">
                            Location name
                        </label>

                        <input
                            id="edit-location-name"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="border border-khaki rounded-sm px-3 py-3 text-sm w-full"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="edit-location-address" className="text-xs text-[#5c5942]">
                            Address
                        </label>

                        <input
                            id="edit-location-address"
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Location address"
                            className="border border-khaki rounded-sm px-3 py-3 text-sm w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-line" />

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-ink">Contact information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="edit-contact-person" className="text-xs text-[#5c5942]">
                            Contact person
                        </label>

                        <input
                            id="edit-contact-person"
                            value={form.contactPerson}
                            onChange={(e) => updateField("contactPerson", e.target.value)}
                            placeholder="Contact person's name"
                            className="border border-khaki rounded-sm px-3 py-3 text-sm w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="edit-contact-phone" className="text-xs text-[#5c5942]">
                            Contact phone
                        </label>

                        <input
                            id="edit-contact-phone"
                            type="tel"
                            value={form.contactPhone}
                            onChange={(e) => updateField("contactPhone", e.target.value)}
                            placeholder="Phone number"
                            className="border border-khaki rounded-sm px-3 py-3 text-sm w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="edit-signboard-phone" className="text-xs text-[#5c5942]">
                        Signboard number(s) — if personal contact doesn't work
                    </label>

                    <input
                        id="edit-signboard-phone"
                        type="tel"
                        value={form.signboardPhone}
                        onChange={(e) => updateField("signboardPhone", e.target.value)}
                        placeholder="e.g. 080XXXXXXXX, 070XXXXXXXX"
                        className="border border-khaki rounded-sm px-3 py-3 text-sm w-full"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="edit-capacity-notes" className="text-sm font-medium text-ink">
                    Capacity notes
                </label>

                <textarea
                    id="edit-capacity-notes"
                    value={form.capacityNotes}
                    onChange={(e) => updateField("capacityNotes", e.target.value)}
                    placeholder="e.g. Takes 3–5 corpers per batch"
                    rows={3}
                    className="border border-khaki rounded-sm px-3 py-3 text-sm w-full resize-y"
                />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                    type="button"
                    disabled={loading}
                    onClick={onCancel}
                    className="text-sm text-[#5c5942] border border-line rounded-sm px-5 py-3 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-forest text-paper text-sm rounded-sm px-5 py-3 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save changes"}
                </button>
            </div>
        </form>
    );
}
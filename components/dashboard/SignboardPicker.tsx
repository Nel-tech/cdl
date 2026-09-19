"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MAX_SIGNBOARD_MB, SIGNBOARD_BUCKET } from "@/lib/signboard";

/** Returns a short-lived signed URL for a private signboard photo. */
export function useSignboardUrl(path?: string | null) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (!path) {
            setUrl(null);
            return;
        }

        const supabase = createClient();
        supabase.storage
            .from(SIGNBOARD_BUCKET)
            .createSignedUrl(path, 3600)
            .then(({ data }) => {
                if (!cancelled) setUrl(data?.signedUrl ?? null);
            });

        return () => {
            cancelled = true;
        };
    }, [path]);

    return url;
}

type SignboardPickerProps = {
    file: File | null;
    onFileChange: (file: File | null) => void;
    /** Signed URL of the photo already saved on the location (edit form only). */
    existingUrl?: string | null;
    removeExisting?: boolean;
    onRemoveExistingChange?: (remove: boolean) => void;
};

export function SignboardPicker({
    file,
    onFileChange,
    existingUrl,
    removeExisting = false,
    onRemoveExistingChange,
}: SignboardPickerProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const shownUrl = preview ?? (removeExisting ? null : existingUrl ?? null);

    function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
        const picked = e.target.files?.[0] ?? null;
        e.target.value = "";
        if (!picked) return;

        if (!picked.type.startsWith("image/")) {
            setError("Choose an image file.");
            return;
        }
        if (picked.size > MAX_SIGNBOARD_MB * 1024 * 1024) {
            setError(`Photo is too large. Keep it under ${MAX_SIGNBOARD_MB} MB.`);
            return;
        }

        setError(null);
        onFileChange(picked);
        onRemoveExistingChange?.(false);
    }

    function handleRemove() {
        onFileChange(null);
        if (existingUrl) onRemoveExistingChange?.(true);
    }

    return (
        <div className="space-y-2">
            <label className="text-xs text-[#5c5942]">
                Signboard photo, so corpers can spot the place and its contact numbers
            </label>

            {shownUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={shownUrl}
                    alt="Signboard"
                    className="max-h-48 w-auto rounded-sm border border-line"
                />
            )}

            <div className="flex flex-wrap gap-2">
                <label className="text-xs border border-khaki text-ink rounded-sm px-3 py-2 cursor-pointer hover:bg-khaki/20 transition-colors">
                    {shownUrl ? "Replace photo" : "Choose photo"}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePick}
                        className="sr-only"
                    />
                </label>

                {shownUrl && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-xs border border-clay text-clay rounded-sm px-3 py-2 hover:bg-clay hover:text-paper transition-colors"
                    >
                        Remove photo
                    </button>
                )}
            </div>

            <p className="text-xs text-[#8a8770]">
                Only verified presidents of this LGA and group can see this photo.
            </p>

            {error && (
                <p role="alert" className="text-xs text-clay">
                    {error}
                </p>
            )}
        </div>
    );
}
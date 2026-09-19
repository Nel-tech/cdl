import type { createClient } from "@/lib/supabase/client";

type Supabase = ReturnType<typeof createClient>;

export const SIGNBOARD_BUCKET = "signboards";
export const MAX_SIGNBOARD_MB = 15;

// Phone photos are often 3-8 MB. Shrink before upload to save the president's data.
async function compressImage(file: File, maxSize = 1280, quality = 0.8): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) =>
                blob
                    ? resolve(blob)
                    : reject(new Error("Could not process this photo. Try a JPG or PNG.")),
            "image/jpeg",
            quality
        );
    });
}

/** Uploads to {lgaId}/{cdsGroupId}/{uuid}.jpg and returns the storage path. */
export async function uploadSignboard(
    supabase: Supabase,
    lgaId: number,
    cdsGroupId: number,
    file: File
): Promise<string> {
    const blob = await compressImage(file);
    const path = `${lgaId}/${cdsGroupId}/${crypto.randomUUID()}.jpg`;

    const { error } = await supabase.storage
        .from(SIGNBOARD_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });

    if (error) throw new Error(error.message);
    return path;
}

export async function removeSignboard(supabase: Supabase, path: string) {
    await supabase.storage.from(SIGNBOARD_BUCKET).remove([path]);
}
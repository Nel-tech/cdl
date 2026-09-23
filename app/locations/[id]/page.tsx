
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { LocationPublic, LocationPrivate } from "@/lib/types/location ";
import { LocationHeader } from "@/components/location/Locationheader";
import { LocationInfoSection } from "@/components/location/Locationinfosection";
import { LocationNotesSection } from "@/components/location/Locationnotessection ";
import { ContactSection } from "@/components/location/Contactsection";
import { SignboardSection } from "@/components/location/Signboardsection";

const PUBLIC_COLUMNS =
    "id, name, address, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)";

const PRIVATE_COLUMNS =
    "id, name, address, contact_person, contact_phone, signboard_phone, signboard_image_path, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)";

export default async function LocationDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isLoggedIn = !!user;

    // The storage policy remains the real access gate for the signboard
    // image itself; this branch only decides which COLUMNS we ask for.
    let publicLocation: LocationPublic | null = null;
    let privateLocation: LocationPrivate | null = null;

    if (isLoggedIn) {
        const { data } = await supabase
            .from("locations")
            .select(PRIVATE_COLUMNS)
            .eq("id", id)
            .single()
            .returns<LocationPrivate>();
        privateLocation = data;
    } else {
        const { data } = await supabase
            .from("locations")
            .select(PUBLIC_COLUMNS)
            .eq("id", id)
            .single()
            .returns<LocationPublic>();
        publicLocation = data;
    }

    const location = privateLocation ?? publicLocation;
    if (!location) notFound();

    let signboardUrl: string | null = null;

    if (privateLocation?.signboard_image_path) {
        const { data } = await supabase.storage
            .from("signboards")
            .createSignedUrl(privateLocation.signboard_image_path, 3600);

        signboardUrl = data?.signedUrl ?? null;
    }

    return (
        <div className="min-h-screen bg-paper">
            <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
                <Link href="/" className="inline-flex items-center text-sm text-forest">
                    ← Back to locations
                </Link>

                <LocationHeader location={location} />

                <div className="mt-6 space-y-5">
                    <LocationInfoSection location={location} />
                    <LocationNotesSection notes={location.capacity_notes} />
                    <ContactSection isLoggedIn={isLoggedIn} location={privateLocation} />
                    {isLoggedIn && (
                        <SignboardSection locationName={location.name} signboardUrl={signboardUrl} />
                    )}
                </div>
            </main>
        </div>
    );
}
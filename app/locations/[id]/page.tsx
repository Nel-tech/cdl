
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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

    // signboard_image_path is only selectable by logged-in users
    const columns = isLoggedIn
        ? "id, name, address, contact_person, contact_phone, signboard_phone, signboard_image_path, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)"
        : "id, name, address, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)";

    const { data: location } = await supabase
        .from("locations")
        .select(columns)
        .eq("id", id)
        .single();

    if (!location) notFound();

    const loc = location as any;

    // The storage policy remains the real access gate.
    let signboardUrl: string | null = null;

    if (isLoggedIn && loc.signboard_image_path) {
        const { data } = await supabase.storage
            .from("signboards")
            .createSignedUrl(loc.signboard_image_path, 3600);

        signboardUrl = data?.signedUrl ?? null;
    }

    return (
        <div className="min-h-screen bg-paper">
            <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
                {/* Back navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-forest"
                >
                    ← Back to locations
                </Link>

                {/* Location header */}
                <header className="mt-6 border-b border-line pb-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-[#8a8770]">
                        <span>{loc.lgas?.name}</span>
                        <span>·</span>
                        <span>{loc.cds_groups?.name}</span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                {loc.name}
                            </h1>

                            {loc.address && (
                                <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c5942]">
                                    {loc.address}
                                </p>
                            )}
                        </div>

                        {loc.status && (
                            <div className="shrink-0">
                                <span className="inline-flex rounded-sm border border-khaki px-3 py-1.5 text-xs text-ink">
                                    {loc.status}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="mt-6 space-y-5">
                    {/* Basic information */}
                    <section className="rounded-sm border border-line p-5 sm:p-6">
                        <div className="mb-5">
                            <h2 className="font-display text-lg font-semibold text-ink">
                                Location information
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                                Basic information about this CDS location.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="mb-1 text-xs text-[#5c5942]">
                                    Location
                                </p>
                                <p className="text-sm text-ink">
                                    {loc.name}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-xs text-[#5c5942]">
                                    CDS group
                                </p>
                                <p className="text-sm text-ink">
                                    {loc.cds_groups?.name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-xs text-[#5c5942]">
                                    LGA
                                </p>
                                <p className="text-sm text-ink">
                                    {loc.lgas?.name || "—"}
                                </p>
                            </div>

                            {loc.address && (
                                <div className="sm:col-span-2">
                                    <p className="mb-1 text-xs text-[#5c5942]">
                                        Address
                                    </p>
                                    <p className="text-sm leading-6 text-ink">
                                        {loc.address}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Notes */}
                    {loc.capacity_notes && (
                        <section className="rounded-sm border border-line p-5 sm:p-6">
                            <div className="mb-3">
                                <h2 className="font-display text-lg font-semibold text-ink">
                                    Additional notes
                                </h2>
                            </div>

                            <p className="text-sm leading-6 text-[#5c5942]">
                                {loc.capacity_notes}
                            </p>
                        </section>
                    )}

                    {/* President-only information */}
                    <section className="rounded-sm border border-line p-5 sm:p-6">
                        <div className="mb-5">
                            <h2 className="font-display text-lg font-semibold text-ink">
                                Contact information
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                                Contact details are available to CDS presidents.
                            </p>
                        </div>

                        {isLoggedIn ? (
                            <div className="space-y-5">
                                {loc.contact_person || loc.contact_phone ? (
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {loc.contact_person && (
                                            <div>
                                                <p className="mb-1 text-xs text-[#5c5942]">
                                                    Contact person
                                                </p>
                                                <p className="text-sm text-ink">
                                                    {loc.contact_person}
                                                </p>
                                            </div>
                                        )}

                                        {loc.contact_phone && (
                                            <div>
                                                <p className="mb-1 text-xs text-[#5c5942]">
                                                    Contact phone
                                                </p>
                                                <p className="text-sm text-ink">
                                                    {loc.contact_phone}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#5c5942]">
                                        No contact information has been added
                                        for this location yet.
                                    </p>
                                )}

                                {loc.signboard_phone && (
                                    <div className="border-t border-line pt-4">
                                        <p className="mb-1 text-xs text-[#5c5942]">
                                            Signboard number
                                        </p>

                                        <p className="text-sm leading-6 text-ink">
                                            {loc.signboard_phone}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                                            If the main contact number does not
                                            go through, you can try the number
                                            shown on the signboard.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="border-t border-line pt-4">
                                <p className="text-sm leading-6 text-clay">
                                    Contact details are only visible to CDS
                                    presidents.{" "}
                                    <Link
                                        href="/login"
                                        className="underline underline-offset-2"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Signboard */}
                    {isLoggedIn && (
                        <section className="rounded-sm border border-line p-5 sm:p-6">
                            <div className="mb-5">
                                <h2 className="font-display text-lg font-semibold text-ink">
                                    Signboard
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                                    Reference image for identifying the location.
                                </p>
                            </div>

                            {signboardUrl ? (
                                <a
                                    href={signboardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={signboardUrl}
                                        alt={`Signboard for ${ loc.name }`}
                                        className="max-h-[28rem] w-full rounded-sm border border-line object-contain"
                                    />
                                </a>
                            ) : (
                                <div className="border border-line p-6 text-center">
                                    <p className="text-sm text-[#5c5942]">
                                        No signboard image is available for this
                                        location.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}


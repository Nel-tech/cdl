import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function LocationDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    const columns = isLoggedIn
        ? "id, name, address, contact_person, contact_phone, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)"
        : "id, name, address, capacity_notes, status, last_confirmed_at, lgas(name), cds_groups(name)";

    const { data: location } = await supabase
        .from("locations")
        .select(columns)
        .eq("id", id)
        .single();

    if (!location) notFound();

    const loc = location as any;

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            <a href="/" className="text-sm text-forest">← Back</a>
            <h1 className="font-display text-xl text-ink mt-2">{loc.name}</h1>
            <div className="text-sm text-[#5c5942] mb-4">
                {loc.lgas?.name} · {loc.cds_groups?.name}
            </div>

            <div className="bg-white/40 border border-line rounded-sm p-4 space-y-2 text-sm">
                {loc.address && (
                    <div><span className="text-[#5c5942]">Address: </span>{loc.address}</div>
                )}
                {loc.capacity_notes && (
                    <div><span className="text-[#5c5942]">Capacity: </span>{loc.capacity_notes}</div>
                )}

                {isLoggedIn ? (
                    loc.contact_person && (
                        <div>
                            <span className="text-[#5c5942]">Contact: </span>
                            {loc.contact_person} {loc.contact_phone && `— ${loc.contact_phone}`}
                        </div>
                    )
                ) : (
                    <div className="text-xs text-clay pt-2 border-t border-line mt-2">
                        Contact details are only visible to CDS presidents.{" "}
                        <a href="/login" className="underline">Log in</a>
                    </div>
                )}
            </div>
        </div>
    );
}
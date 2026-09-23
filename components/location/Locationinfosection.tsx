import type { LocationPublic } from "@/lib/types/location ";

type LocationInfoSectionProps = {
    location: LocationPublic;
};

export function LocationInfoSection({ location }: LocationInfoSectionProps) {
    return (
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
                    <p className="mb-1 text-xs text-[#5c5942]">Location</p>
                    <p className="text-sm text-ink">{location.name}</p>
                </div>

                <div>
                    <p className="mb-1 text-xs text-[#5c5942]">CDS group</p>
                    <p className="text-sm text-ink">{location.cds_groups?.name || "—"}</p>
                </div>

                <div>
                    <p className="mb-1 text-xs text-[#5c5942]">LGA</p>
                    <p className="text-sm text-ink">{location.lgas?.name || "—"}</p>
                </div>

                {location.address && (
                    <div className="sm:col-span-2">
                        <p className="mb-1 text-xs text-[#5c5942]">Address</p>
                        <p className="text-sm leading-6 text-ink">{location.address}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
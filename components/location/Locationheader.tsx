import type { LocationPublic } from "@/lib/types/location ";

type LocationHeaderProps = {
    location: LocationPublic;
};

export function LocationHeader({ location }: LocationHeaderProps) {
    return (
        <header className="mt-6 border-b border-line pb-6">
            <div className="mb-3 flex items-center gap-2 text-xs text-[#8a8770]">
                <span>{location.lgas?.name}</span>
                <span>·</span>
                <span>{location.cds_groups?.name}</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {location.name}
                    </h1>

                    {location.address && (
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c5942]">
                            {location.address}
                        </p>
                    )}
                </div>

                {location.status && (
                    <div className="shrink-0">
                        <span className="inline-flex rounded-sm border border-khaki px-3 py-1.5 text-xs text-ink">
                            {location.status}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}
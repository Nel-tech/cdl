
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { LocationRow } from "@/components/LocationRow";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ lga?: string; group?: string }>;
}) {
    const { lga, group } = await searchParams;
    const supabase = await createClient();

    const [{ data: lgas }, { data: groups }] = await Promise.all([
        supabase.from("lgas").select("id, name").order("name"),
        supabase.from("cds_groups").select("id, name").order("name"),
    ]);

    let query = supabase
        .from("locations")
        .select(
            "id, name, status, last_confirmed_at, lgas(name), cds_groups(name)"
        )
        .eq("status", "active")
        .order("last_confirmed_at", { ascending: false });

    if (lga) query = query.eq("lga_id", lga);
    if (group) query = query.eq("cds_group_id", group);

    const { data: locations } = await query;

    const results = locations ?? [];

    return (
        <div className="min-h-screen bg-paper">
            <Header />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Introduction */}
                    <section className="space-y-3">
                        <p className="text-xs text-[#5c5942] uppercase tracking-widest">
                            CDS location directory
                        </p>

                        <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
                            Find a CDS location
                            <br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>
                            in your LGA
                        </h1>

                        <p className="text-sm sm:text-base text-[#5c5942] max-w-xl leading-relaxed">
                            Discover active CDS locations for your group.
                            Filter by your Local Government Area and CDS
                            group to find a suitable location.
                        </p>
                    </section>

                    {/* Filters */}
                    <FilterBar
                        lgas={lgas ?? []}
                        groups={groups ?? []}
                        selectedLga={lga}
                        selectedGroup={group}
                    />

                    {/* Results */}
                    <section className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div>
                                <h2 className="font-display text-xl text-ink">
                                    Available locations
                                </h2>

                                <p className="text-xs text-[#5c5942] mt-1">
                                    Browse active locations for your CDS group.
                                </p>
                            </div>

                            <span className="text-xs text-[#5c5942] border border-line rounded-sm px-3 py-2 w-fit">
                                {results.length}{" "}
                                {results.length === 1
                                    ? "location"
                                    : "locations"}{" "}
                                found
                            </span>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {results.map((loc: any) => (
                                    <LocationRow
                                        key={loc.id}
                                        id={loc.id}
                                        name={loc.name}
                                        lgaName={loc.lgas?.name}
                                        groupName={loc.cds_groups?.name}
                                        status={loc.status}
                                        lastConfirmedAt={
                                            loc.last_confirmed_at
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-line rounded-sm text-center px-4 py-12">
                                <h3 className="font-display text-lg text-ink">
                                    No locations found
                                </h3>

                                <p className="text-sm text-[#5c5942] mt-2 max-w-sm mx-auto">
                                    No active locations match your selected
                                    filters. Try another LGA or CDS group.
                                </p>

                                {(lga || group) && (
                                    <a
                                        href="/"
                                        className="inline-block mt-5 text-sm bg-forest text-paper rounded-sm px-5 py-3"
                                    >
                                        Clear filters
                                    </a>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
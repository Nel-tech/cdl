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
    .select("id, name, status, last_confirmed_at, lgas(name), cds_groups(name)")
    .eq("status", "active")
    .order("last_confirmed_at", { ascending: false });

  if (lga) query = query.eq("lga_id", lga);
  if (group) query = query.eq("cds_group_id", group);

  const { data: locations } = await query;

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl text-ink mb-5 leading-tight">
          Find a CDS location
          <br />
          in your LGA
        </h1>

        <FilterBar
          lgas={lgas ?? []}
          groups={groups ?? []}
          selectedLga={lga}
          selectedGroup={group}
        />

        <div className="mt-8">
          <div className="text-xs text-[#5c5942] mb-2 tracking-wide">
            {locations?.length ?? 0} LOCATIONS
          </div>

          <div className="border-t border-line">
            {locations && locations.length > 0 ? (
              locations.map((loc: any) => (
                <LocationRow
                  key={loc.id}
                  id={loc.id}
                  name={loc.name}
                  lgaName={loc.lgas?.name}
                  groupName={loc.cds_groups?.name}
                  status={loc.status}
                  lastConfirmedAt={loc.last_confirmed_at}
                />
              ))
            ) : (
              <p className="text-sm text-[#5c5942] py-6">
                No locations yet — check back once a CDS president adds one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

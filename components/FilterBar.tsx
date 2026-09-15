
type Option = {
    id: number | string;
    name: string;
};

type FilterBarProps = {
    lgas: Option[];
    groups: Option[];
    selectedLga?: string;
    selectedGroup?: string;
};

export function FilterBar({
    lgas,
    groups,
    selectedLga,
    selectedGroup,
}: FilterBarProps) {
    return (
        <form
            method="GET"
            className="border border-line rounded-sm p-4 sm:p-5 space-y-4"
        >
            <div>
                <h2 className="font-display text-base text-ink">
                    Find your CDS location
                </h2>

                <p className="text-xs text-[#5c5942] mt-1">
                    Select your LGA and CDS group to narrow down the results.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor="filter-lga"
                        className="text-xs text-[#5c5942]"
                    >
                        Local Government Area
                    </label>

                    <select
                        id="filter-lga"
                        name="lga"
                        defaultValue={selectedLga ?? ""}
                        className="bg-transparent border border-khaki rounded-sm px-3 py-3 text-sm text-ink w-full"
                    >
                        <option value="">All LGAs</option>

                        {lgas.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="filter-group"
                        className="text-xs text-[#5c5942]"
                    >
                        CDS Group
                    </label>

                    <select
                        id="filter-group"
                        name="group"
                        defaultValue={selectedGroup ?? ""}
                        className="bg-transparent border border-khaki rounded-sm px-3 py-3 text-sm text-ink w-full"
                    >
                        <option value="">All CDS Groups</option>

                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <a
                    href="/"
                    className="text-sm text-ink border border-line rounded-sm px-4 py-3 text-center"
                >
                    Clear filters
                </a>

                <button
                    type="submit"
                    className="text-sm rounded-sm px-6 py-3 bg-forest text-paper"
                >
                    Find locations
                </button>
            </div>
        </form>
    );
}
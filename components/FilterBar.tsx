type Option = { id: number | string; name: string };

type FilterBarProps = {
    lgas: Option[];
    groups: Option[];
    selectedLga?: string;
    selectedGroup?: string;
};

export function FilterBar({ lgas, groups, selectedLga, selectedGroup }: FilterBarProps) {
    return (
        <form className="flex gap-2 flex-wrap" method="GET">
            <select
                name="lga"
                defaultValue={selectedLga ?? ""}
                className="bg-transparent border border-khaki rounded-sm px-3 py-2 text-sm text-ink"
            >
                <option value="">All LGAs</option>
                {lgas.map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
            </select>

            <select
                name="group"
                defaultValue={selectedGroup ?? ""}
                className="bg-transparent border border-khaki rounded-sm px-3 py-2 text-sm text-ink"
            >
                <option value="">All CDS Groups</option>
                {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                        {g.name}
                    </option>
                ))}
            </select>

            <button className="text-sm rounded-sm px-4 py-2 bg-forest text-paper">
                Filter
            </button>
        </form>
    );
}
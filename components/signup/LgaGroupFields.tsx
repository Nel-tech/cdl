type Option = { id: number; name: string; state?: string };

type LgaGroupFieldsProps = {
    lgas: Option[];
    groups: Option[];
    lgaId: string;
    groupId: string;
    newGroupName: string;
    onLgaChange: (id: string) => void;
    onGroupChange: (id: string) => void;
    onNewGroupNameChange: (name: string) => void;
};

export function LgaGroupFields({
    lgas,
    groups,
    lgaId,
    groupId,
    newGroupName,
    onLgaChange,
    onGroupChange,
    onNewGroupNameChange,
}: LgaGroupFieldsProps) {
    const selectedLga = lgas.find((l) => String(l.id) === lgaId);

    return (
        <>
            <select
                value={lgaId}
                onChange={(e) => onLgaChange(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                required
            >
                <option value="">Select your LGA</option>
                {lgas.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>

            {selectedLga?.state && (
                <p className="text-xs text-[#5c5942] -mt-1">State: {selectedLga.state}</p>
            )}

            <select
                value={groupId}
                onChange={(e) => { onGroupChange(e.target.value); onNewGroupNameChange(""); }}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            >
                <option value="">Select your CDS group</option>
                {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
                <option value="">-- My group isn't listed --</option>
            </select>

            {!groupId && (
                <input
                    type="text"
                    placeholder="Type your CDS group name"
                    value={newGroupName}
                    onChange={(e) => onNewGroupNameChange(e.target.value)}
                    className="border border-clay rounded-sm px-3 py-2 w-full text-sm"
                />
            )}
        </>
    );
}
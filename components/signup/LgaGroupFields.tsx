import { useMemo, useState } from "react";

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
    const [selectedState, setSelectedState] = useState("");

    const states = useMemo(() => {
        const seen = new Set<string>();
        for (const l of lgas) if (l.state) seen.add(l.state);
        return Array.from(seen).sort((a, b) => a.localeCompare(b));
    }, [lgas]);

    const lgasForState = useMemo(
        () => lgas.filter((l) => l.state === selectedState),
        [lgas, selectedState]
    );

    function handleStateChange(state: string) {
        setSelectedState(state);
        onLgaChange(""); // reset LGA choice when state changes
    }

    return (
        <>
            <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
                required
            >
                <option value="">Select your state</option>
                {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select
                value={lgaId}
                onChange={(e) => onLgaChange(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm disabled:opacity-50"
                required
                disabled={!selectedState}
            >
                <option value="">{selectedState ? "Select your LGA" : "Pick a state first"}</option>
                {lgasForState.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>

            <select
                value={groupId}
                onChange={(e) => { onGroupChange(e.target.value); onNewGroupNameChange(""); }}
                className="border border-khaki rounded-sm px-3 py-2 w-full text-sm"
            >
                <option value="">Select your CDS group</option>
                {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
                <option value="__new__">-- My group isn&apos;t listed --</option>
            </select>

            {groupId === "__new__" && (
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
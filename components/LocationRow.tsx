import Link from "next/link";
import { StatusTag } from "./StatusTag";

type LocationRowProps = {
    id: number | string;
    name: string;
    lgaName?: string;
    groupName?: string;
    status: string;
    lastConfirmedAt?: string | null;
};

export function LocationRow({
    id,
    name,
    lgaName,
    groupName,
    status,
    lastConfirmedAt,
}: LocationRowProps) {
    return (
        <Link
            href={`/locations/${id}`}
            className="flex justify-between items-center py-4 border-b border-line"
        >
            <div>
                <div className="font-display text-base text-ink">{name}</div>
                <div className="text-xs mt-1 text-[#5c5942]">
                    {lgaName} {groupName && `· ${groupName}`}
                </div>
                {lastConfirmedAt && (
                    <div className="text-xs mt-0.5 text-[#8a8770]">
                        Last confirmed {new Date(lastConfirmedAt).toLocaleDateString()}
                    </div>
                )}
            </div>
            <StatusTag status={status} />
        </Link>
    );
}
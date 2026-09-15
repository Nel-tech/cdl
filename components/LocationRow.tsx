
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
            className="group flex items-start justify-between gap-4 border border-line rounded-sm p-4 sm:p-5 transition-colors hover:border-forest"
        >
            <div className="min-w-0 flex-1 space-y-3">
                <div>
                    <h3 className="font-display text-lg text-ink break-words group-hover:underline">
                        {name}
                    </h3>

                    <p className="text-xs text-[#5c5942] mt-1">
                        {lgaName ?? "LGA not specified"}
                        {groupName && ` · ${groupName}`}
                    </p>
                </div>

                {lastConfirmedAt && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#8a8770]">
                        <span>Last confirmed</span>

                        <span>
                            {new Date(lastConfirmedAt).toLocaleDateString(
                                undefined,
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end gap-4 shrink-0">
                <StatusTag status={status} />

                <span
                    aria-hidden="true"
                    className="text-ink text-lg transition-transform group-hover:translate-x-1"
                >
                    →
                </span>
            </div>
        </Link>
    );
}
import Link from "next/link";
import type { LocationPrivate } from "@/lib/types/location ";

type ContactSectionProps = {
    isLoggedIn: boolean;
    location: LocationPrivate | null; // null when not logged in — fields weren't fetched
};

export function ContactSection({ isLoggedIn, location }: ContactSectionProps) {
    return (
        <section className="rounded-sm border border-line p-5 sm:p-6">
            <div className="mb-5">
                <h2 className="font-display text-lg font-semibold text-ink">
                    Contact information
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                    Contact details are available to CDS presidents.
                </p>
            </div>

            {isLoggedIn && location ? (
                <div className="space-y-5">
                    {location.contact_person || location.contact_phone ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {location.contact_person && (
                                <div>
                                    <p className="mb-1 text-xs text-[#5c5942]">Contact person</p>
                                    <p className="text-sm text-ink">{location.contact_person}</p>
                                </div>
                            )}

                            {location.contact_phone && (
                                <div>
                                    <p className="mb-1 text-xs text-[#5c5942]">Contact phone</p>
                                    <p className="text-sm text-ink">{location.contact_phone}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-[#5c5942]">
                            No contact information has been added for this location yet.
                        </p>
                    )}

                    {location.signboard_phone && (
                        <div className="border-t border-line pt-4">
                            <p className="mb-1 text-xs text-[#5c5942]">Signboard number</p>

                            <p className="text-sm leading-6 text-ink">{location.signboard_phone}</p>

                            <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                                If the main contact number does not go through, you can try the
                                number shown on the signboard.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border-t border-line pt-4">
                    <p className="text-sm leading-6 text-clay">
                        Contact details are only visible to CDS presidents.{" "}
                        <Link href="/login" className="underline underline-offset-2">
                            Log in
                        </Link>
                    </p>
                </div>
            )}
        </section>
    );
}
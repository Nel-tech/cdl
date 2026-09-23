type LocationNotesSectionProps = {
    notes: string | null;
};

export function LocationNotesSection({ notes }: LocationNotesSectionProps) {
    if (!notes) return null;

    return (
        <section className="rounded-sm border border-line p-5 sm:p-6">
            <div className="mb-3">
                <h2 className="font-display text-lg font-semibold text-ink">
                    Additional notes
                </h2>
            </div>

            <p className="text-sm leading-6 text-[#5c5942]">{notes}</p>
        </section>
    );
}
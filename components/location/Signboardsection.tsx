type SignboardSectionProps = {
    locationName: string;
    signboardUrl: string | null;
};

export function SignboardSection({ locationName, signboardUrl }: SignboardSectionProps) {
    return (
        <section className="rounded-sm border border-line p-5 sm:p-6">
            <div className="mb-5">
                <h2 className="font-display text-lg font-semibold text-ink">Signboard</h2>

                <p className="mt-1 text-xs leading-5 text-[#8a8770]">
                    Reference image for identifying the location.
                </p>
            </div>

            {signboardUrl ? (
                <a href={signboardUrl} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={signboardUrl}
                        alt={`Signboard for ${locationName}`}
                        className="max-h-[28rem] w-full rounded-sm border border-line object-contain"
                    />
                </a>
            ) : (
                <div className="border border-line p-6 text-center">
                    <p className="text-sm text-[#5c5942]">
                        No signboard image is available for this location.
                    </p>
                </div>
            )}
        </section>
    );
}
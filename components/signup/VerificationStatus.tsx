type VerificationStatusProps = {
    verified: boolean | null;
};

export function VerificationStatus({ verified }: VerificationStatusProps) {
    return (
        <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-khaki text-ink">
                {verified === true ? "✓" : "…"}
            </div>

            <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold text-ink">
                    {verified === true ? "You're verified" : "Verification pending"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#5c5942]">
                    {verified === true
                        ? "Your account has been verified. You can now log in."
                        : "We'll verify your account after confirming your identity directly."}
                </p>
            </div>
        </div>
    );
}
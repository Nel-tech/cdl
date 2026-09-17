type UsernameDisplayProps = {
    username: string;
};

export function UsernameDisplay({ username }: UsernameDisplayProps) {
    return (
        <div className="mb-5 border-t border-khaki pt-4">
            <p className="text-xs text-[#5c5942]">Your login username</p>
            <p className="mt-1 break-all font-display text-lg font-semibold text-ink">
                {username}
            </p>
        </div>
    );
}
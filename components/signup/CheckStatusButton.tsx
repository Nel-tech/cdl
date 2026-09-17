type CheckStatusButtonProps = {
    onCheck: () => void;
    checking: boolean;
    disabled: boolean;
};

export function CheckStatusButton({ onCheck, checking, disabled }: CheckStatusButtonProps) {
    return (
        <button
            type="button"
            onClick={onCheck}
            disabled={disabled || checking}
            className="w-full rounded-sm border border-khaki px-4 py-3 text-sm font-medium text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
            {checking ? "Checking status…" : "Check status again"}
        </button>
    );
}
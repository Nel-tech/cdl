"use client";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="fixed bottom-4 right-4 bg-ink text-paper text-sm px-4 py-2 rounded-sm shadow-lg">
            {message}
            <button onClick={onClose} className="ml-3 text-khaki">×</button>
        </div>
    );
}
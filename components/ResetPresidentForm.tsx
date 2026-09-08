"use client";

import { useState } from "react";

type ResetPresidentFormProps = {
    id: number;
    authUserId: string;
    currentFullName: string | null;
    adminPassword: string;
    onDone: () => void;
};

export function ResetPresidentForm({
    id,
    authUserId,
    currentFullName,
    adminPassword,
    onDone,
}: ResetPresidentFormProps) {
    const [open, setOpen] = useState(false);
    const [newFullName, setNewFullName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleReset() {
        setBusy(true);
        await fetch("/api/admin/reset-president", {
            method: "POST",
            body: JSON.stringify({
                id,
                auth_user_id: authUserId,
                newFullName,
                newEmail,
                newPassword,
                password: adminPassword,
            }),
        });
        setBusy(false);
        setOpen(false);
        onDone();
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="text-xs border border-clay text-clay rounded-sm px-3 py-1"
            >
                Reset for new president
            </button>
        );
    }

    return (
        <div className="space-y-2 mt-2 border border-line rounded-sm p-3">
            <p className="text-xs text-[#5c5942]">
                Replacing {currentFullName ?? "current president"} — same login
                username, new person and password.
            </p>
            <input
                placeholder="New president's full name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-1.5 text-xs w-full"
            />
            <input
                placeholder="New recovery email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-1.5 text-xs w-full"
            />
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-khaki rounded-sm px-3 py-1.5 text-xs w-full"
            />
            <div className="flex gap-2">
                <button
                    disabled={busy}
                    onClick={handleReset}
                    className="bg-clay text-paper text-xs rounded-sm px-3 py-1"
                >
                    {busy ? "Resetting..." : "Confirm reset"}
                </button>
                <button
                    disabled={busy}
                    onClick={() => setOpen(false)}
                    className="text-xs text-[#5c5942]"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
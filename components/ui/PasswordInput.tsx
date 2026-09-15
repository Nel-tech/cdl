"use client";

import { useState } from "react";

type PasswordInputProps = {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    autoComplete?: "new-password" | "current-password";
};

export function PasswordInput({
    placeholder,
    value,
    onChange,
    required,
    autoComplete = "new-password",
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                type={visible ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                autoComplete={autoComplete}
                className="border border-khaki rounded-sm px-3 py-2 pr-14 w-full text-sm"
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-forest"
            >
                {visible ? "Hide" : "Show"}
            </button>
        </div>
    );
}
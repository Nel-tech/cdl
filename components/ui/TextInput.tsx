type TextInputProps = {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    borderColor?: "khaki" | "clay";
};

export function TextInput({
    type = "text",
    placeholder,
    value,
    onChange,
    required,
    borderColor = "khaki",
}: TextInputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`border border-${borderColor} rounded-sm px-3 py-2 w-full text-sm`}
        />
    );
}
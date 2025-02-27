// src/components/FormInput.tsx
"use client";

interface FormInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    error?: string;
    required?: boolean;
}

export default function FormInput({
                                      type,
                                      placeholder,
                                      value,
                                      onChange,
                                      onBlur,
                                      error,
                                      required = false,
                                  }: FormInputProps) {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full px-4 py-2 rounded ${
                    error ? "border-2 border-red-500" : ""
                } bg-[#3d3d3d] text-white focus:outline-none focus:ring-2 focus:ring-white`}
                required={required}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
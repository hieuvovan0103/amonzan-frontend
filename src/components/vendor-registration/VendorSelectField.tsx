type VendorSelectFieldProps = {
    label: string;
    required?: boolean;
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function VendorSelectField({
    label,
    required = false,
    options,
    value,
    onChange,
}: VendorSelectFieldProps) {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[14px] font-bold text-[#222222]">
                {label} {required && <span className="text-[#C62828]">*</span>}
            </label>

            <select
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-[#D5D9D9] rounded-[12px] px-3 py-2.5 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 focus:border-[#FF9900] text-[14px] text-[#222222] shadow-sm bg-white"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
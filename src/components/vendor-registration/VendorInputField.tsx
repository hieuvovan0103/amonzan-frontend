type VendorInputFieldProps = {
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function VendorInputField({
    label,
    placeholder,
    type = "text",
    required = false,
    value,
    onChange,
}: VendorInputFieldProps) {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[14px] font-bold text-[#222222]">
                {label} {required && <span className="text-[#C62828]">*</span>}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-[#D5D9D9] rounded-[12px] px-3 py-2.5 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 focus:border-[#FF9900] transition-all text-[14px] text-[#222222] shadow-sm bg-white"
            />
        </div>
    );
}
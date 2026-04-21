type InputFieldProps = {
  label: string;
  id: string;
  type?: string;
};

export default function InputField({
  label,
  id,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={id} className="text-[14px] font-medium text-[#222222]">
        {label}
      </label>

      <input
        type={type}
        id={id}
        name={id}
        className="w-full border border-[#D5D9D9] rounded-[12px] px-3 py-2 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 focus:border-[#FF9900] transition-all text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)]"
      />
    </div>
  );
}
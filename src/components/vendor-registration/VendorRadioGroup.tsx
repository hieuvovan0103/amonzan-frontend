import { VendorPartnerType } from "@/types/vendor-registration";

type VendorRadioGroupProps = {
    value: VendorPartnerType;
    onChange: (value: VendorPartnerType) => void;
};

export default function VendorRadioGroup({
    value,
    onChange,
}: VendorRadioGroupProps) {
    return (
        <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-[14px] font-bold text-[#222222]">
                Loại đối tác <span className="text-[#C62828]">*</span>
            </label>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="vendorType"
                        checked={value === "individual"}
                        onChange={() => onChange("individual")}
                        className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900] accent-[#FF9900]"
                    />
                    <span className="text-[14px] text-[#222222]">
                        Cá nhân (Cung cấp CCCD)
                    </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="vendorType"
                        checked={value === "business"}
                        onChange={() => onChange("business")}
                        className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900] accent-[#FF9900]"
                    />
                    <span className="text-[14px] text-[#222222]">
                        Hộ kinh doanh / Doanh nghiệp
                    </span>
                </label>
            </div>
        </div>
    );
}
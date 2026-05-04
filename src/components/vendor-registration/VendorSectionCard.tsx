import { LucideIcon } from "lucide-react";

type VendorSectionCardProps = {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
};

export default function VendorSectionCard({
    icon: Icon,
    title,
    children,
}: VendorSectionCardProps) {
    return (
        <div className="bg-white border border-[#E6E6E6] rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E6E6E6]">
                <Icon className="w-5 h-5 text-[#FF9900]" />
                <h2 className="text-[18px] font-bold text-[#222222]">{title}</h2>
            </div>

            {children}
        </div>
    );
}
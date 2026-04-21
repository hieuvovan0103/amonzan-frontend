import { LucideIcon } from "lucide-react";

type AdminNavItemProps = {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
    collapsed?: boolean;
    badge?: string;
};

export default function AdminNavItem({
    icon: Icon,
    label,
    active,
    onClick,
    collapsed,
    badge,
}: AdminNavItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${active
                    ? "bg-[#232F3E] text-white shadow-lg"
                    : "text-[#565959] hover:bg-[#F7F7F7] hover:text-[#222222]"
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${active
                            ? "text-[#FF9900]"
                            : "text-[#6B7280] group-hover:text-[#222222]"
                        }`}
                />
                {!collapsed && (
                    <span className="text-[14px] font-semibold whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-1 duration-300">
                        {label}
                    </span>
                )}
            </div>

            {!collapsed && badge && (
                <span className="bg-[#C62828] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    {badge}
                </span>
            )}

            {collapsed && (
                <div className="absolute left-[70px] bg-[#232F3E] text-white text-[12px] py-1 px-3 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-gray-700">
                    {label}
                </div>
            )}
        </button>
    );
}
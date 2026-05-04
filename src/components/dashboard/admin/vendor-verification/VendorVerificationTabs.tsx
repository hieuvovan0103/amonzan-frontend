import type {
    VendorVerificationStatus,
    VendorVerificationTab,
} from "@/types/admin-vendor";

type VendorVerificationTabsProps = {
    activeTab: VendorVerificationTab;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    onTabChange: (tab: VendorVerificationTab) => void;
};

const tabs: {
    id: VendorVerificationStatus;
    label: string;
}[] = [
    { id: "PENDING", label: "Cho duyet" },
    { id: "VERIFIED", label: "Da duyet" },
    { id: "REJECTED", label: "Tu choi" },
];

export default function VendorVerificationTabs({
    activeTab,
    pendingCount,
    approvedCount,
    rejectedCount,
    onTabChange,
}: VendorVerificationTabsProps) {
    const countMap = {
        PENDING: pendingCount,
        VERIFIED: approvedCount,
        REJECTED: rejectedCount,
    };

    return (
        <div className="border-b border-gray-200 px-4 sm:px-6">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                isActive
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}

                            <span
                                className={`ml-2 rounded-full px-2.5 py-0.5 text-xs ${
                                    isActive
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {countMap[tab.id]}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

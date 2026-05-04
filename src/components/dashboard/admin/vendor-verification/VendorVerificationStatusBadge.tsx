import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { VendorVerificationStatus } from "@/types/admin-vendor";

type VendorVerificationStatusBadgeProps = {
    status: VendorVerificationStatus;
};

const statusConfig = {
    PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "Cho duyet",
    },
    VERIFIED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
        label: "Da duyet",
    },
    REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Tu choi",
    },
} satisfies Record<
    VendorVerificationStatus,
    {
        color: string;
        icon: typeof Clock;
        label: string;
    }
>;

export default function VendorVerificationStatusBadge({
    status,
}: VendorVerificationStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
        >
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
        </span>
    );
}

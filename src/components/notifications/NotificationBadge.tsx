type NotificationBadgeProps = {
    count: number;
};

export default function NotificationBadge({ count }: NotificationBadgeProps) {
    if (count <= 0) return null;

    return (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C62828] px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
        </span>
    );
}

import type { AdminDisputeDetail } from "@/types/dispute";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

const eventLabels: Record<string, string> = {
    REQUEST_EVIDENCE: "Yêu cầu bổ sung bằng chứng",
    RESOLVE: "Admin xử lý tranh chấp",
};

export default function DisputeTimeline({ dispute }: { dispute: AdminDisputeDetail }) {
    const initialEvents = [
        {
            eventId: "opened",
            actorName: dispute.complaint?.complainantName ?? dispute.renter.fullName,
            eventType: "OPENED",
            message: dispute.complaint?.title ?? dispute.reason ?? "Tạo tranh chấp",
            createdAt: dispute.openedAt,
        },
    ];
    const events = [...initialEvents, ...dispute.timeline];

    return (
        <div className="rounded-[10px] border border-[#E6E6E6] p-3">
            <div className="font-bold text-[#222222]">Lịch sử xử lý</div>
            <div className="mt-3 space-y-3">
                {events.map((event) => (
                    <div key={event.eventId} className="border-l-2 border-[#D5D9D9] pl-3">
                        <div className="text-[12px] font-bold text-[#222222]">
                            {eventLabels[event.eventType] ?? event.eventType}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[#565959]">
                            {event.actorName} · {formatDate(event.createdAt)}
                        </div>
                        {event.message ? (
                            <div className="mt-1 whitespace-pre-line text-[13px] text-[#222222]">
                                {event.message}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

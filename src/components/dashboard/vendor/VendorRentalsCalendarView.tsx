import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { VendorCalendarEvent } from "@/types/vendor";

type VendorRentalsCalendarViewProps = {
    events: VendorCalendarEvent[];
};

export default function VendorRentalsCalendarView({
    events,
}: VendorRentalsCalendarViewProps) {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="flex-1 min-w-0 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-1">
                        Lịch cho thuê
                    </h1>
                    <p className="text-[14px] text-[#565959]">
                        Theo dõi những ngày sản phẩm đang được thuê.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="bg-white border border-[#D5D9D9] px-3 py-2 rounded-[8px]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        className="bg-white border border-[#D5D9D9] px-3 py-2 rounded-[8px]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        className="bg-white border border-[#D5D9D9] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Lọc
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[220px_repeat(30,minmax(40px,1fr))] border border-[#E6E6E6] rounded-[12px] overflow-hidden">
                        <div className="bg-[#F7F7F7] p-3 text-[13px] font-bold border-r border-b border-[#E6E6E6]">
                            Sản phẩm
                        </div>

                        {days.map((day) => (
                            <div
                                key={day}
                                className="bg-[#F7F7F7] p-3 text-center text-[12px] font-bold border-r border-b border-[#E6E6E6]"
                            >
                                {day}
                            </div>
                        ))}

                        {events.map((event) => (
                            <div key={event.id} className="contents">
                                <div
                                    className="p-3 text-[13px] font-medium border-r border-b border-[#E6E6E6]"
                                >
                                    {event.title}
                                </div>

                                {days.map((day) => {
                                    const active = day >= event.start && day <= event.end;

                                    return (
                                        <div
                                            key={`${event.id}-${day}`}
                                            className={`h-[52px] border-r border-b border-[#E6E6E6] ${active ? event.color : "bg-white"
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

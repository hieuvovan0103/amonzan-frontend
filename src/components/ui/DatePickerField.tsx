'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type DatePickerFieldProps = {
    label?: string;
    value?: string;
    placeholder?: string;
    minYear?: number;
    maxYear?: number;
    onChange: (value: string) => void;
};

const MONTHS = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
];

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function formatDateToInputValue(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDateToDisplay(value?: string) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default function DatePickerField({
    label,
    value,
    placeholder = 'Chọn ngày',
    minYear = 1950,
    maxYear = new Date().getFullYear(),
    onChange,
}: DatePickerFieldProps) {
    const selectedDate = value ? new Date(value) : null;
    const initialDate = selectedDate || new Date();

    const [isOpen, setIsOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());

    const years = useMemo(() => {
        const result: number[] = [];

        for (let year = maxYear; year >= minYear; year -= 1) {
            result.push(year);
        }

        return result;
    }, [minYear, maxYear]);

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

        const firstWeekday = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
        const totalDays = lastDayOfMonth.getDate();

        const days: Array<number | null> = [];

        for (let i = 0; i < firstWeekday; i += 1) {
            days.push(null);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            days.push(day);
        }

        return days;
    }, [viewMonth, viewYear]);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((prev) => Math.max(minYear, prev - 1));
            return;
        }

        setViewMonth((prev) => prev - 1);
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((prev) => Math.min(maxYear, prev + 1));
            return;
        }

        setViewMonth((prev) => prev + 1);
    };

    const handleSelectDate = (day: number) => {
        const date = new Date(viewYear, viewMonth, day);
        onChange(formatDateToInputValue(date));
        setIsOpen(false);
    };

    const isSelectedDay = (day: number) => {
        if (!selectedDate) return false;

        return (
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === viewMonth &&
            selectedDate.getDate() === day
        );
    };

    return (
        <div className="relative w-full">
            {label && (
                <label className="block text-[14px] font-medium text-[#565959] mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all shadow-sm bg-white flex items-center justify-between"
            >
                <span className={value ? 'text-[#222222]' : 'text-[#6B7280]'}>
                    {formatDateToDisplay(value) || placeholder}
                </span>

                <CalendarDays className="w-4 h-4 text-[#6B7280]" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[320px] rounded-[16px] border border-[#E6E6E6] bg-white shadow-[0_12px_32px_rgba(15,17,17,0.16)] p-4">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-9 h-9 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            <select
                                value={viewMonth}
                                onChange={(event) => setViewMonth(Number(event.target.value))}
                                className="border border-[#D5D9D9] rounded-[8px] px-2 py-1.5 text-[13px] font-semibold outline-none focus:border-[#FF9900]"
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={viewYear}
                                onChange={(event) => setViewYear(Number(event.target.value))}
                                className="border border-[#D5D9D9] rounded-[8px] px-2 py-1.5 text-[13px] font-semibold outline-none focus:border-[#FF9900]"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-9 h-9 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEK_DAYS.map((day) => (
                            <div
                                key={day}
                                className="h-8 flex items-center justify-center text-[12px] font-bold text-[#6B7280]"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return <div key={`empty-${index}`} className="h-9" />;
                            }

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleSelectDate(day)}
                                    className={`h-9 rounded-full text-[13px] font-semibold transition-colors ${isSelectedDay(day)
                                            ? 'bg-[#FF9900] text-[#111111]'
                                            : 'text-[#222222] hover:bg-[#FFF8E1]'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E6E6E6]">
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className="text-[13px] font-semibold text-[#565959] hover:text-[#222222]"
                        >
                            Xóa ngày
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#007185] hover:text-[#E47911]"
                        >
                            Đóng
                            <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
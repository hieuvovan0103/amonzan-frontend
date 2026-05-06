"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock3, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import DatePickerField from "@/components/ui/DatePickerField";
import {
    estimateEarlyReturnRefund,
    requestEarlyReturn,
} from "@/lib/api/orders";
import {
    uploadReturnConditionImages,
    validateReturnConditionFiles,
} from "@/lib/api/returnConditionImages";
import { useEarlyReturnModalStore } from "@/stores/useEarlyReturnModalStore";

type EarlyReturnRequestModalProps = {
    onSubmitted: () => Promise<void> | void;
};

function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN");
}

function toDateInputValue(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDefaultReturnTime() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);

    const minutes = date.getMinutes();
    const roundedMinutes = minutes <= 15 ? 15 : minutes <= 30 ? 30 : minutes <= 45 ? 45 : 0;

    if (roundedMinutes === 0) {
        date.setHours(date.getHours() + 1);
    }

    return `${String(date.getHours()).padStart(2, "0")}:${String(roundedMinutes).padStart(2, "0")}`;
}

function buildLocalDateTime(dateValue: string, timeValue: string) {
    if (!dateValue || !timeValue) return null;

    const date = new Date(`${dateValue}T${timeValue}:00`);

    if (Number.isNaN(date.getTime())) return null;

    return date;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const MINUTE_OPTIONS = ["00", "15", "30", "45"];

export default function EarlyReturnRequestModal({ onSubmitted }: EarlyReturnRequestModalProps) {
    const { isOpen, order, close } = useEarlyReturnModalStore();
    const [requestedReturnDate, setRequestedReturnDate] = useState("");
    const [requestedReturnTime, setRequestedReturnTime] = useState(getDefaultReturnTime);
    const [reason, setReason] = useState("");
    const [estimatedRefund, setEstimatedRefund] = useState<number | null>(null);
    const [estimateMessage, setEstimateMessage] = useState("");
    const [conditionFiles, setConditionFiles] = useState<File[]>([]);
    const [isEstimating, setIsEstimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const minDate = useMemo(() => toDateInputValue(new Date()), []);
    const maxDate = order ? toDateInputValue(new Date(order.rentalEnd)) : "";
    const hasValidReturnWindow = !maxDate || minDate < maxDate;
    const minYear = new Date().getFullYear();
    const maxYear = order ? new Date(order.rentalEnd).getFullYear() : minYear;
    const requestedReturnAt = useMemo(
        () => buildLocalDateTime(requestedReturnDate, requestedReturnTime),
        [requestedReturnDate, requestedReturnTime],
    );
    const conditionPreviews = useMemo(
        () => conditionFiles.map((file) => URL.createObjectURL(file)),
        [conditionFiles],
    );

    useEffect(() => {
        return () => {
            conditionPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [conditionPreviews]);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        setEstimatedRefund(null);
        setEstimateMessage("");
        setError("");

        if (!requestedReturnAt || !order) return;

        let isCancelled = false;
        setIsEstimating(true);

        estimateEarlyReturnRefund({
            orderId: order.orderId,
            requestedReturnAt: requestedReturnAt.toISOString(),
        })
            .then((result) => {
                if (isCancelled) return;
                setEstimatedRefund(result.estimatedRefundAmount);
                setEstimateMessage(result.message);
            })
            .catch((err: any) => {
                if (isCancelled) return;
                setError(err.message || "Không thể ước tính hoàn tiền.");
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsEstimating(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [order, requestedReturnAt]);

    if (!isOpen || !order) {
        return null;
    }

    const handleClose = () => {
        close();
        setError("");
    };

    const handleConditionFilesChange = (files: FileList | null) => {
        if (!files) return;

        const nextFiles = [...conditionFiles, ...Array.from(files)].slice(0, 6);

        try {
            validateReturnConditionFiles(nextFiles);
            setConditionFiles(nextFiles);
            setError("");
        } catch (err: any) {
            setError(err.message || "Không thể chọn ảnh hiện trạng.");
        }
    };

    const removeConditionFile = (index: number) => {
        setConditionFiles((files) => files.filter((_, fileIndex) => fileIndex !== index));
    };

    const updateHour = (hour: string) => {
        setRequestedReturnTime(`${hour}:${requestedReturnTime.slice(3, 5)}`);
    };

    const updateMinute = (minute: string) => {
        setRequestedReturnTime(`${requestedReturnTime.slice(0, 2)}:${minute}`);
    };

    const resetForm = () => {
        setRequestedReturnDate("");
        setRequestedReturnTime(getDefaultReturnTime());
        setReason("");
        setConditionFiles([]);
        setEstimatedRefund(null);
        setEstimateMessage("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!requestedReturnAt) {
            setError("Vui lòng chọn ngày giờ muốn trả hàng.");
            return;
        }

        setIsSubmitting(true);
        try {
            const conditionImageUrls = await uploadReturnConditionImages(
                order.orderId,
                conditionFiles,
            );

            await requestEarlyReturn({
                orderId: order.orderId,
                requestedReturnAt: requestedReturnAt.toISOString(),
                reason,
                conditionImageUrls,
            });
            await onSubmitted();
            close();
            resetForm();
        } catch (err: any) {
            setError(err.message || "Không thể gửi yêu cầu trả hàng sớm.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/55 p-3 pt-8 sm:p-5 sm:pt-10"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="mb-8 flex w-full max-w-[560px] flex-col rounded-[12px] bg-white shadow-2xl"
            >
                <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[20px] font-bold leading-tight text-[#222222]">
                            Yêu cầu trả hàng sớm
                        </h2>
                        <p className="mt-1 text-[13px] text-[#565959]">
                            Đơn #{order.orderId.slice(0, 8)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-2 text-[#565959] hover:bg-[#F7F7F7]"
                        aria-label="Đóng"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <div className="rounded-[8px] border border-[#D5D9D9] bg-[#FAFAFA] px-4 py-3 text-[13px] leading-5 text-[#565959]">
                        Trả hàng sớm không đảm bảo được hoàn tiền, tùy theo chính sách của shop. Số tiền hiển thị chỉ là ước tính để shop/admin xử lý thủ công.
                    </div>

                    {!hasValidReturnWindow ? (
                        <div className="flex gap-2 rounded-[8px] border border-[#F5C2C7] bg-[#FFF5F5] px-3 py-2 text-[13px] text-[#842029]">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>
                                Đơn này đã qua ngày kết thúc thuê nên không còn ngày hợp lệ để yêu cầu trả hàng sớm.
                            </span>
                        </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-[1fr_160px]">
                        <DatePickerField
                            label="Ngày muốn trả hàng"
                            value={requestedReturnDate}
                            placeholder="Chọn ngày trả"
                            minDate={minDate}
                            maxDate={maxDate}
                            minYear={minYear}
                            maxYear={maxYear}
                            onChange={hasValidReturnWindow ? setRequestedReturnDate : () => {}}
                        />

                        <div>
                            <label className="mb-2 block text-[14px] font-medium text-[#565959]">
                                Giờ trả hàng
                            </label>
                            <div className="flex h-[42px] items-center rounded-[8px] border border-[#D5D9D9] bg-white shadow-sm focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900]">
                                <Clock3 className="ml-3 h-4 w-4 flex-shrink-0 text-[#007185]" />
                                <select
                                    value={requestedReturnTime.slice(0, 2)}
                                    onChange={(event) => updateHour(event.target.value)}
                                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[14px] font-semibold text-[#222222] outline-none"
                                    aria-label="Giờ"
                                >
                                    {HOUR_OPTIONS.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-[#565959]">:</span>
                                <select
                                    value={requestedReturnTime.slice(3, 5)}
                                    onChange={(event) => updateMinute(event.target.value)}
                                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[14px] font-semibold text-[#222222] outline-none"
                                    aria-label="Phút"
                                >
                                    {MINUTE_OPTIONS.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-[#222222]">
                            Ghi chú
                        </label>
                        <textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            rows={3}
                            maxLength={1000}
                            placeholder="Ví dụ: Tôi muốn trả sớm vì không còn nhu cầu sử dụng."
                            className="w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none transition-all focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label className="block text-[14px] font-semibold text-[#222222]">
                                Ảnh hiện trạng đồ
                            </label>
                            <span className="text-[12px] font-medium text-[#565959]">
                                {conditionFiles.length}/6 ảnh
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <label className="flex h-[92px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#FAFAFA] px-2 py-3 text-center text-[13px] font-semibold text-[#007185] hover:bg-[#F7F7F7]">
                                <ImagePlus className="mb-1.5 h-5 w-5" />
                                Tải ảnh
                                <span className="mt-1 text-[10px] font-normal leading-4 text-[#565959]">
                                    JPG/PNG/WebP
                                </span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={(event) => {
                                        handleConditionFilesChange(event.target.files);
                                        event.target.value = "";
                                    }}
                                />
                            </label>

                            {conditionFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    className="relative h-[92px] w-[92px] overflow-hidden rounded-[8px] border border-[#D5D9D9] bg-[#F7F7F7]"
                                >
                                    <img
                                        src={conditionPreviews[index]}
                                        alt={`Ảnh hiện trạng ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeConditionFile(index)}
                                        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-[#842029] shadow-sm hover:bg-red-50"
                                        aria-label={`Xóa ảnh hiện trạng ${index + 1}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="mt-2 text-[12px] text-[#565959]">
                            Tối đa 6 ảnh, mỗi ảnh không quá 5MB.
                        </p>
                    </div>

                    <div className="rounded-[8px] border border-[#E6E6E6] bg-white px-4 py-3 text-[13px]">
                        {isEstimating ? (
                            <div className="flex items-center gap-2 text-[#565959]">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang ước tính hoàn tiền...
                            </div>
                        ) : estimatedRefund !== null ? (
                            <>
                                <div className="font-bold text-[#222222]">
                                    Hoàn tiền dự kiến: {formatCurrency(estimatedRefund)} đ
                                </div>
                                <p className="mt-1 text-[#565959]">{estimateMessage}</p>
                            </>
                        ) : (
                            <span className="text-[#565959]">
                                Chọn ngày và giờ trả hàng để xem số tiền hoàn dự kiến.
                            </span>
                        )}
                    </div>

                    {error ? (
                        <div className="flex gap-2 rounded-[8px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] text-[#C62828]">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-shrink-0 justify-end gap-3 border-t border-[#E6E6E6] bg-white px-5 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-[8px] border border-[#D5D9D9] px-5 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={!hasValidReturnWindow || isSubmitting || isEstimating}
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#FFD814] px-5 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Gửi yêu cầu
                    </button>
                </div>
            </form>
        </div>
    );
}

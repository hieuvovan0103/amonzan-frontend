import type { CartItem } from "@/types/cart";

export function getRentalDays(item: CartItem) {
    if (item.rentalDays && item.rentalDays > 0) return item.rentalDays;

    if (item.rentalStart && item.rentalEnd) {
        const start = new Date(item.rentalStart);
        const end = new Date(item.rentalEnd);
        const diff = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);

        if (Number.isFinite(diff)) return Math.max(1, diff);
    }

    const dates = item.rentDates.match(/\d{2}\/\d{2}\/\d{4}/g);
    if (!dates || dates.length < 2) return 1;

    const [startDay, startMonth, startYear] = dates[0].split("/").map(Number);
    const [endDay, endMonth, endYear] = dates[1].split("/").map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);

    return Math.max(1, diff);
}

export function getItemRentTotal(item: CartItem) {
    return item.price * getRentalDays(item) * item.quantity;
}

export function getItemDepositTotal(item: CartItem) {
    return (item.depositRequirement ?? 0) * item.quantity;
}

export function calculateRentalDays(start: string, end: string) {
    if (!start || !end || end <= start) return 0;

    const startDate = new Date(`${start}T00:00:00.000Z`);
    const endDate = new Date(`${end}T00:00:00.000Z`);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000);

    return Number.isFinite(diff) ? Math.max(0, diff) : 0;
}

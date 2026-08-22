export const getRemainingCount = (endAt: number, intervalMs: number, now = Date.now()) => {
    return Math.max(0, Math.ceil((endAt - now) / intervalMs));
};

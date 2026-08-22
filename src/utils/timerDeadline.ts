export const getRemainingCount = (endAt: number, intervalMs: number, now = Date.now()) => {
    return Math.ceil((endAt - now) / intervalMs);
};

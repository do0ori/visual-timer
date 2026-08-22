import { getRemainingCount } from './timerDeadline';

describe('timer deadline', () => {
    it('derives the remaining count from an absolute end time', () => {
        expect(getRemainingCount(10_000, 1_000, 4_200)).toBe(6);
    });

    it('reports elapsed time as a negative count after expiry', () => {
        expect(getRemainingCount(10_000, 1_000, 10_000)).toBe(0);
        expect(getRemainingCount(10_000, 1_000, 11_200)).toBe(-1);
    });
});

import { getRemainingCount } from './timerDeadline';

describe('timer deadline', () => {
    it('derives the remaining count from an absolute end time', () => {
        expect(getRemainingCount(10_000, 1_000, 4_200)).toBe(6);
    });

    it('clamps expired timers to zero', () => {
        expect(getRemainingCount(10_000, 1_000, 10_000)).toBe(0);
    });
});

import { applyColorMode } from './colorMode';

describe('applyColorMode', () => {
    afterEach(() => {
        document.documentElement.classList.remove('dark');
    });

    test('uses the selected app theme instead of the browser preference', () => {
        applyColorMode('white');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        applyColorMode('black');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});

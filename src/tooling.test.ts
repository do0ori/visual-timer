import packageJson from '../package.json';

describe('commit tooling', () => {
    test('formats staged source files before commit', () => {
        expect(packageJson['lint-staged']).toEqual({
            '*.{ts,tsx,js,cjs,json,css,md}': 'prettier --write',
        });
    });
});

import packageMetadata from '../package.json';

describe('release metadata', () => {
    test('reports the current minor release version', () => {
        expect(packageMetadata.version).toBe('0.5.0');
    });
});

import packageMetadata from '../package.json';

describe('release metadata', () => {
    test('reports the current patch release version', () => {
        expect(packageMetadata.version).toBe('0.4.1');
    });
});
